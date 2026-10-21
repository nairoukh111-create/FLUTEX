#!/usr/bin/env python3
"""Render the same localized supply section before every site's footer.

Run after regenerating pages. The operation is idempotent; --check makes no edits.
The three paths end at three distinct markers, independent of the raster basemap.
"""
from pathlib import Path
import argparse
import re

ROOT = Path(__file__).resolve().parents[1]
START = '<!--flutex-supply-coverage-->'
END = '<!--/flutex-supply-coverage-->'
CSS = '<link rel="stylesheet" href="/assets/css/supply-coverage.v1.css"/>'


def render(document, language):
    document = re.sub(re.escape(START) + r'.*?' + re.escape(END), '', document, flags=re.S)
    section = (ROOT / 'components' / f'supply-coverage.{language}.html').read_text().strip()
    if '/assets/css/supply-coverage.v1.css' not in document:
        document = document.replace('</head>', CSS + '</head>', 1)
    match = re.search(r'<footer\b[^>]*class=["\'][^"\']*site-footer', document)
    if not match:
        raise ValueError('No site footer found')
    return document[:match.start()] + START + section + END + document[match.start():]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    changed = []
    pages = sorted(ROOT.rglob('*.html'))
    pages = [p for p in pages if 'components' not in p.parts]
    for path in pages:
        old = path.read_text()
        language = 'ar' if path.relative_to(ROOT).parts[0] == 'ar' else 'en'
        new = render(old, language)
        if new != old:
            changed.append(str(path.relative_to(ROOT)))
            if not args.check:
                path.write_text(new)
    print(f'{len(pages)} pages checked; {len(changed)} ' + ('need updating' if args.check else 'updated'))
    if args.check and changed:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
