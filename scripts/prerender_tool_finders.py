#!/usr/bin/env python3
"""Expose existing tool families in served HTML without changing catalog data."""
import argparse
import html
import json
import re
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
E = lambda x: html.escape(str(x), quote=True)


def render():
    file = ROOT / 'cutting-tools.html'
    source = file.read_text()
    raw = (ROOT / 'assets/js/search-index.v17.js').read_text()
    index = json.loads(raw[raw.index('['):raw.rindex(']') + 1])
    count = 0
    groups = [('carbide', 'data-carbide-results', 'data-carbide-result-count'),
              ('modular-drill', 'data-modular-results', 'data-modular-result-count'),
              ('hss', 'data-finder-results', 'data-result-count')]
    for name, results_attr, count_attr in groups:
        js = (ROOT / f'assets/js/{name}-finder.v15.js').read_text()
        offset = js.index('const families = ') + len('const families = ')
        families = json.JSONDecoder().raw_decode(js[offset:])[0]
        cards = []
        for item in families:
            matches = [x for x in index if x['url'].startswith('/tools/') and
                       item['id'] in x.get('terms', '').split()]
            if len(matches) != 1:
                raise ValueError(f'No unambiguous existing page for {item["id"]}')
            url = matches[0]['url']
            width, height = Image.open(ROOT / item['image'].lstrip('/')).size
            cards.append(f'''<article class="finder-card"><div class="finder-card-media"><img src="{E(item['image'])}" alt="{E(item['name'])}" width="{width}" height="{height}" loading="lazy" decoding="async"/></div><div class="finder-card-body"><h5>{E(item['name'])}</h5><p>{E(item['summary'])}</p><div class="finder-card-actions"><a class="text-link finder-spec-btn" href="{E(url)}">View family details →</a><a class="finder-rfq" href="/contact?product={E(item['id'])}">RFQ</a></div></div></article>''')
        marker = f'<!--static-{name}-families-->'
        body = marker + ''.join(cards) + f'<!--/static-{name}-families-->'
        if marker in source:
            source = re.sub(re.escape(marker) + r'.*?' + re.escape(f'<!--/static-{name}-families-->'), lambda _: body, source, flags=re.S)
        else:
            pattern = r'(<div[^>]*\b' + re.escape(results_attr) + r'=""[^>]*>)(</div>)'
            source, n = re.subn(pattern, lambda m: m[1] + body + m[2], source, count=1)
            assert n == 1, name
        source, n = re.subn(r'(<span[^>]*\b' + re.escape(count_attr) + r'=""[^>]*>)\d+(</span>)', lambda m: m[1] + str(len(families)) + m[2], source, count=1)
        assert n == 1, count_attr
        count += len(families)
    if '<!--tool-finder-nojs-->' not in source:
        fallback = '<!--tool-finder-nojs--><noscript><style>[data-finder-panel][hidden]{display:block!important}.finder-mode-tabs,.finder-sidebar{display:none!important}</style></noscript>'
        source = source.replace('</main>', fallback + '</main>', 1)
    return source, count


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    source, count = render()
    file = ROOT / 'cutting-tools.html'
    if args.check:
        assert file.read_text() == source, 'Run prerender_tool_finders.py'
    else:
        file.write_text(source)
    print(f'{count} existing families have static HTML and direct detail-page links.')
