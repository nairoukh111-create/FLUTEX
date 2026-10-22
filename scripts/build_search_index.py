#!/usr/bin/env python3
"""Index actual canonical pages; retain existing catalog reference terms."""
import argparse
import json
import xml.etree.ElementTree as ET
from pathlib import Path
from lxml import html

ROOT = Path(__file__).resolve().parents[1]


def build():
    source = (ROOT / 'assets/js/search-index.v17.js').read_text()
    previous = json.loads(source[source.index('['):source.rindex(']') + 1])
    old = {x['url']: x for x in previous}
    urls = [n.text for n in ET.parse(ROOT / 'sitemap.xml').iter() if n.tag.endswith('loc')]
    items = []
    for url in urls:
        path = url.removeprefix('https://flutexindustrial.com')
        file = ROOT / (path.lstrip('/') + 'index.html' if path.endswith('/') else path.lstrip('/') + '.html')
        doc = html.fromstring(file.read_text())
        ar = path.startswith('/ar/')
        base = '/' + path[4:] if ar else path
        prior = old.get(path, old.get(base, {}))
        title = doc.xpath('string(//h1)') or doc.xpath('string(//title)')
        description = doc.xpath('string(//meta[@name="description"]/@content)')
        item = {'title': title.strip(), 'type': ('صفحة FLUTEX' if ar else 'FLUTEX page'),
                'description': description, 'url': path, 'lang': 'ar' if ar else 'en',
                'terms': prior.get('terms', ''), 'refs': prior.get('refs', [])}
        if '/plasma/' in path:
            item['type'] = 'توافق البلازما' if ar else 'Plasma compatibility'
        elif '/tools/' in path:
            item['type'] = 'Tool family'
        if 'parameters' in path:
            item['terms'] = 'rpm feed rate cutting speed chip load feed per tooth aluminum 6063 حساب دوران تغذية سرعة قطع ألمنيوم معادلات'
        items.append(item)
    return 'window.FLUTEX_SEARCH_INDEX=' + json.dumps(items, ensure_ascii=False, separators=(',', ':')) + ';\n'


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    target = ROOT / 'assets/js/search-index.v18.js'
    result = build()
    if args.check:
        assert target.read_text() == result, 'Run build_search_index.py'
    else:
        target.write_text(result)
    print('Search index includes every sitemap page.')
