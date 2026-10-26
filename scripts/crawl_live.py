#!/usr/bin/env python3
"""Fetch every known sitemap URL and inspect delivered HTML and status."""
import argparse
import concurrent.futures
import json
import subprocess
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path
from lxml import html
from audit_site import analytics_errors

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output', type=Path, required=True)
parser.add_argument('--workers', type=int, default=6)
args = parser.parse_args()
urls = [n.text for n in ET.parse(ROOT/'sitemap.xml').iter() if n.tag.endswith('loc')]

def fetch(url):
    row = {'url':url,'errors':[]}
    with tempfile.TemporaryDirectory() as work:
        body = Path(work)/'body';headers=Path(work)/'headers'
        result = subprocess.run(['curl','--max-time','25','-sS','-L','--max-redirs','5','-D',str(headers),
            '-o',str(body),'-w','%{json}',url],capture_output=True,text=True)
        if result.returncode:
            row['errors'].append(result.stderr.strip());return row
        metrics=json.loads(result.stdout)
        row.update(status=metrics['http_code'],final_url=metrics['url_effective'],seconds=metrics['time_total'],bytes=metrics['size_download'])
        if row['status']!=200:row['errors'].append('Non-200')
        if row['final_url']!=url:row['errors'].append('Unexpected canonical URL redirect')
        raw=body.read_text(errors='replace')
        try:
            doc=html.fromstring(raw)
            row['errors'].extend(analytics_errors(doc))
            row['analytics_wrapper']=doc.xpath('//script[contains(@src,"/assets/js/analytics.")]/@src')
            row['title']=doc.xpath('string(//title)')
            row['canonical']=doc.xpath('//link[@rel="canonical"]/@href')
            if row['canonical']!=[url]:row['errors'].append('Delivered canonical mismatch')
            if not doc.xpath('//main'):row['errors'].append('No delivered main')
            if any('noindex' in x.lower() for x in doc.xpath('//meta[@name="robots"]/@content')):row['errors'].append('Noindex meta')
            row['analytics_beacon']='static.cloudflareinsights.com/beacon.min.js' in raw
            for script in doc.xpath('//script[@type="application/ld+json"]/text()'):json.loads(script)
        except Exception as error:row['errors'].append(str(error))
        row['x_robots_tag']=[line for line in headers.read_text().splitlines() if line.lower().startswith('x-robots-tag:')]
        if any('noindex' in x.lower() for x in row['x_robots_tag']):row['errors'].append('Noindex response header')
    return row

rows=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=min(args.workers,8)) as pool:
    for row in pool.map(fetch,urls):
        rows.append(row)
        if len(rows)%20==0:print(f'Checked {len(rows)}/{len(urls)}',flush=True)
result={'pages':rows,'count':len(rows),'error_pages':sum(bool(r['errors']) for r in rows)}
args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'count':result['count'],'error_pages':result['error_pages'],'errors':[r for r in rows if r['errors']]},ensure_ascii=False))
raise SystemExit(bool(result['error_pages']))
