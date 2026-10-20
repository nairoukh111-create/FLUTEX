#!/usr/bin/env python3
"""Audit sitemap pages without treating a word count or similarity score as a Google verdict.
Requires lxml. Outputs a per-page Markdown audit and machine-readable JSON in audits/.
"""
from pathlib import Path
from collections import defaultdict, deque
from urllib.parse import urlparse
from lxml import html
import json, re, itertools, xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
BASE='https://flutexindustrial.com'
def txt(e):return ' '.join(' '.join(e.itertext()).split())
def local(path):return ROOT/(path.lstrip('/')+'index.html' if path.endswith('/') else path.lstrip('/')+'.html')
def main():
 urls=[n.text for n in ET.parse(ROOT/'sitemap.xml').iter() if n.tag.endswith('loc')]
 rows=[]; trees={};shingles={};links={};title_groups=defaultdict(list);desc_groups=defaultdict(list)
 for url in urls:
  path=urlparse(url).path;f=local(path);d=html.fromstring(f.read_text());trees[path]=d
  main=d.xpath('//main'); text=txt(main[0]) if main else ''; words=re.findall(r'\w+',text.lower());shingles[path]={tuple(words[i:i+5]) for i in range(max(0,len(words)-4))}
  title=d.xpath('string(//title)');desc=d.xpath('//meta[@name="description"]/@content');title_groups[title].append(path);desc_groups[tuple(desc)].append(path)
  errors=[]
  if len(d.xpath('//h1'))!=1:errors.append('H1 count')
  if not title.strip() or len(desc)!=1 or not desc[0].strip():errors.append('Missing metadata')
  if d.xpath('//link[@rel="canonical"]/@href')!=[url]:errors.append('Canonical mismatch')
  if not main:errors.append('No main content')
  for block in d.xpath('//script[@type="application/ld+json"]/text()'):
   try:data=json.loads(block)
   except ValueError:errors.append('Invalid JSON-LD');continue
   if isinstance(data,dict) and data.get('@type')=='FAQPage':
    for q in data.get('mainEntity',[]):
     if q.get('name','') not in text or q.get('acceptedAnswer',{}).get('text','') not in text:errors.append('FAQ differs from visible text');break
  hrefs=[]
  for a in d.xpath('//a[@href]/@href'):
   u=urlparse(a)
   if not u.netloc and not a.startswith('/') or u.netloc and u.netloc!='flutexindustrial.com':continue
   target=u.path
   if target and target not in [urlparse(x).path for x in urls] and not (ROOT/target.lstrip('/')).exists():errors.append('Broken link '+target)
   hrefs.append(target)
  links[path]=set(hrefs)
  for lang,u in [(e.get('hreflang'),e.get('href')) for e in d.xpath('//link[@hreflang]')]:
   if u.startswith(BASE) and not local(urlparse(u).path).exists():errors.append('Missing hreflang destination')
  findings=[]
  if path.startswith('/plasma/') or path.startswith('/ar/plasma/'):findings.append('Supplier/OEM evidence needed for system-to-reference compatibility; template overlap reviewed')
  if path.startswith('/tools/'):findings.append('Family specification and application checklist reviewed; exact SKU catalog evidence still required')
  if path in ['/cutting-fluid','/ar/cutting-fluid']:findings.append('Exact product TDS/SDS needed to substantiate published numerical and safety data')
  if path in ['/about','/ar/about','/terms','/privacy']:findings.append('Company/policy page structure checked; legal claims not re-verified')
  if not findings:findings.append('Automated structure/navigation checks passed; page purpose reviewed by category; no blanket rewrite')
  rows.append(dict(url=url,path=path,title=title,main_words=len(words),errors=sorted(set(errors)),review=findings))
 seen={'/':0};q=deque(['/'])
 while q:
  p=q.popleft()
  for n in links.get(p,set()):
   if n in links and n not in seen:seen[n]=seen[p]+1;q.append(n)
 for row in rows:
  row['depth']=seen.get(row['path'])
  if row['depth'] is None:row['errors'].append('Orphan page')
  row['nearest']=None;best=0
  for other,ss in shingles.items():
   if other==row['path'] or other.startswith('/ar/')!=row['path'].startswith('/ar/'):continue
   own=shingles[row['path']];score=len(own&ss)/max(1,len(own|ss))
   if score>best:best=score;row['nearest']={'path':other,'five_word_jaccard':round(score,3)}
 # Duplicate reference lists are a review signal, not proof of false compatibility.
 from seo_enrich import load_systems
 grouped=defaultdict(list)
 for it in load_systems():grouped[(it['brand'],tuple(sorted(set(it['references']))))].append(' / '.join(it['systems']))
 overlaps=[{'brand':k[0],'reference_count':len(k[1]),'systems':v} for k,v in grouped.items() if len(v)>1]
 result={'date':'2026-10-20','scope':len(rows),'pages':rows,'identical_reference_lists':overlaps,'duplicate_titles':[v for v in title_groups.values() if len(v)>1],'duplicate_descriptions':[v for v in desc_groups.values() if len(v)>1]}
 out=ROOT/'audits';out.mkdir(exist_ok=True);(out/'content-audit-2026-10-20.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 lines=['# FLUTEX content audit — 20 October 2026','','Scope: all '+str(len(rows))+' sitemap pages. This is a repository content audit, not an indexing certificate. Word count and five-word Jaccard similarity are diagnostic measurements, not Google thresholds.','','## Completed changes','','- Added application-specific enquiry checklists to 30 tool-detail pages.','- Expanded welding, special-tool and MQL pages in English and Arabic with product identification requirements.','- Linked all 30 existing English tool-detail pages from the Arabic cutting-tools category, clearly labelled as English.','- Removed universal FineCut and hand-torch ordering language from English plasma templates; retained all reference numbers and technical specifications.','- Preserved canonical, robots and hreflang settings.','','## Evidence still needed','','- Exact supplier catalogs for system-to-part mappings, particularly identical lists below. Shared lists do not prove compatibility or incompatibility. Do not invent replacements or merge pages based on similarity alone.','- Current TDS/SDS for the named lubricant; existing figures and safety claims have not been independently validated.','- Exact tool SKU catalogs to validate family specification options and technical tolerances.','- Legal and company-registration assertions are outside this SEO content verification.','','## Identical reference lists across different system entries','']
 for item in overlaps:lines.append('- '+item['brand']+' ('+str(item['reference_count'])+' references): '+'; '.join(item['systems']))
 lines+=['','## Page-by-page review','','| Page | Main words | Click depth | Automated checks | Review disposition |','|---|---:|---:|---|---|']
 for r in rows:lines.append('| '+r['path']+' | '+str(r['main_words'])+' | '+str(r['depth'])+' | '+('; '.join(r['errors']) or 'Pass')+' | '+'; '.join(r['review'])+' |')
 lines+=['','## Official guidance','','- https://developers.google.com/search/docs/fundamentals/creating-helpful-content','- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl','','No claim is made that these changes will cause Google to index all pages.']
 (out/'content-audit-2026-10-20.md').write_text('\n'.join(lines)+'\n')
 print(json.dumps({'pages':len(rows),'errors':[(r['path'],r['errors']) for r in rows if r['errors']],'duplicate_titles':result['duplicate_titles'],'duplicate_descriptions':result['duplicate_descriptions'],'identical_reference_groups':overlaps},ensure_ascii=False,indent=2))
if __name__=='__main__':main()
