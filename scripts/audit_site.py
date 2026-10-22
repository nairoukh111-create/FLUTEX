#!/usr/bin/env python3
"""Read-only sitemap/HTML checks. Requires lxml; never certifies indexing."""
import argparse
import collections
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlsplit

from lxml import html

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://flutexindustrial.com'


def local(url):
    path = urlsplit(url).path
    if path.endswith('/'):
        return ROOT / path.lstrip('/') / 'index.html'
    direct = ROOT / path.lstrip('/')
    return direct if direct.is_file() else ROOT / (path.lstrip('/') + '.html')


def audit():
    urls = [n.text for n in ET.parse(ROOT / 'sitemap.xml').iter() if n.tag.endswith('loc')]
    rows = []
    trees = {}
    titles = collections.defaultdict(list)
    descriptions = collections.defaultdict(list)
    for url in urls:
        file = local(url)
        row = {'url': url, 'errors': [], 'observations': []}
        rows.append(row)
        if not file.exists():
            row['errors'].append('Missing sitemap file')
            continue
        doc = html.fromstring(file.read_text())
        trees[urlsplit(url).path] = doc
        row['title'] = doc.xpath('string(//title)')
        titles[row['title']].append(url)
        desc = doc.xpath('//meta[@name="description"]/@content')
        descriptions[tuple(desc)].append(url)
        if len(doc.xpath('//h1')) != 1:
            row['errors'].append('H1 count')
        if not row['title'] or len(desc) != 1 or not desc[0]:
            row['errors'].append('Missing title/description')
        if doc.xpath('//link[@rel="canonical"]/@href') != [url]:
            row['errors'].append('Canonical mismatch')
        if any('noindex' in value.lower() for value in doc.xpath('//meta[@name="robots"]/@content')):
            row['errors'].append('Noindex in sitemap')
        ids = doc.xpath('//*[@id]/@id')
        duplicates = [i for i, c in collections.Counter(ids).items() if c > 1]
        if duplicates:
            row['errors'].append('Duplicate IDs: ' + ', '.join(duplicates))
        main = doc.xpath('//main')
        text = ' '.join(' '.join(main[0].itertext()).split()) if main else ''
        row['main_words'] = len(re.findall(r'\w+', text))
        for raw in doc.xpath('//script[@type="application/ld+json"]/text()'):
            try:
                data = json.loads(raw)
            except ValueError:
                row['errors'].append('Invalid JSON-LD')
                continue
            if data.get('@type') == 'FAQPage':
                for q in data.get('mainEntity', []):
                    if q.get('name', '') not in text or q.get('acceptedAnswer', {}).get('text', '') not in text:
                        row['errors'].append('FAQ differs from visible text')
                        break
            if data.get('@type') == 'ItemList':
                absent = [i['name'] for i in data.get('itemListElement', []) if i.get('name') and i['name'] not in text]
                if absent:
                    row['errors'].append('ItemList values absent from visible text')
        for node in doc.xpath('//link[@hreflang]'):
            if not local(node.get('href')).exists():
                row['errors'].append('Missing hreflang destination')
        for src in doc.xpath('//img/@src | //script[@src]/@src | //link[@rel="stylesheet"]/@href'):
            if src.startswith('/') and not local(src).exists():
                row['errors'].append('Missing asset: ' + src)
        if doc.xpath('//img[not(@alt)]'):
            row['errors'].append('Missing image alt')
    graph = {}
    for row in rows:
        path = urlsplit(row['url']).path
        doc = trees.get(path)
        graph[path] = set()
        if doc is None:
            continue
        for href in doc.xpath('//a[@href]/@href'):
            u = urlsplit(href)
            if u.scheme and u.scheme not in ['http', 'https']:
                continue
            if u.netloc and u.netloc != 'flutexindustrial.com':
                continue
            if not u.netloc and not href.startswith('/') and not href.startswith('#'):
                continue
            target = u.path or path
            dest = local(target)
            if not dest.exists():
                row['errors'].append('Broken link: ' + href)
                continue
            graph[path].add(target)
            if u.fragment and dest.suffix == '.html':
                target_doc = trees.get(target)
                if target_doc is None:
                    target_doc = html.fromstring(dest.read_text())
                if not target_doc.xpath('//*[@id=$fragment]', fragment=u.fragment):
                    row['errors'].append('Missing fragment: ' + href)
    depth = {'/': 0}
    queue = collections.deque(['/'])
    while queue:
        p = queue.popleft()
        for target in graph.get(p, set()):
            if target in graph and target not in depth:
                depth[target] = depth[p] + 1
                queue.append(target)
    for row in rows:
        row['click_depth'] = depth.get(urlsplit(row['url']).path)
        if row['click_depth'] is None:
            row['errors'].append('Orphan page')
        row['errors'] = sorted(set(row['errors']))
    return {'scope': len(urls), 'unique_urls': len(set(urls)), 'pages': rows,
            'duplicate_titles': [v for v in titles.values() if len(v) > 1],
            'duplicate_descriptions': [v for v in descriptions.values() if len(v) > 1],
            'error_pages': sum(bool(r['errors']) for r in rows)}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    result = audit()
    if args.output:
        args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({k: v for k, v in result.items() if k != 'pages'}, ensure_ascii=False))
    print(json.dumps([{'url': r['url'], 'errors': r['errors']} for r in result['pages'] if r['errors']], ensure_ascii=False))
    raise SystemExit(bool(result['error_pages'] or result['duplicate_titles'] or result['duplicate_descriptions']))
