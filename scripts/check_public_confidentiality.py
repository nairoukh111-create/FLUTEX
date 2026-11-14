#!/usr/bin/env python3
"""Bounded public-file guard. Real private identifiers must stay outside Git."""
import argparse
import html
import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path
from urllib.parse import unquote

TEXT = {'.html', '.css', '.js', '.cjs', '.mjs', '.json', '.jsonc', '.toml', '.jsonld', '.xml', '.svg',
        '.txt', '.md', '.py', '.yml', '.yaml', '.webmanifest', '.map', ''}
IMAGES = {'.png', '.jpg', '.jpeg', '.webp', '.avif', '.tif', '.tiff'}
CUSTOMER_TEXT = {'.html', '.css', '.js', '.json', '.jsonld', '.xml', '.svg'}
RULES = [
    ('upstream-attribution', re.compile(
        r'sourced\s+from\s+our|manufactured\s+by\s+our\s+supplier|'
        r'third[- ]party\s+supplier\s+catalog|our\s+sourcing\s+partners|'
        r'we\s+purchase\s+from\s+other\s+factories|supplier\s+specifications|'
        r'supplier\s+documentation|review\s+sourcing|specification-led\s+sourcing|'
        r'sourced\s+(?:on\s+request|to\s+order)|source\s+geometry\s+specifies|'
        r'موردنا\s+الصيني|مواصفات\s+المورد|شركاؤنا\s+في\s+التوريد', re.I)),
    ('manufacturing-claim-review', re.compile(
        r'FLUTEX\s+(?:is\s+(?:an?\s+|the\s+)?(?:original\s+)?)'
        r'(?:manufacturer|factory)|manufactured\s+by\s+FLUTEX', re.I)),
]


def normalize(value):
    value = unicodedata.normalize('NFKC', str(value))
    for _ in range(3):
        previous = value
        value = html.unescape(unquote(value))
        value = re.sub(r'\\u([0-9a-fA-F]{4})|\\x([0-9a-fA-F]{2})',
                       lambda m: chr(int(m.group(1) or m.group(2), 16)), value)
        if value == previous:
            break
    return value.casefold()


def identifiers_at(path, root):
    if path is None:
        return []
    path = Path(path).resolve()
    if path == root or root in path.parents:
        raise ValueError('Private identifier file must be outside the repository')
    values = json.loads(path.read_text(encoding='utf-8'))
    if not isinstance(values, list) or not values or any(
            not isinstance(v, str) or not v.strip() for v in values):
        raise ValueError('Private identifiers must be a nonempty JSON string array')
    return [re.compile(r'(?<![\w])' + re.escape(normalize(v.strip())) + r'(?![\w])')
            for v in values]


def extracted(path):
    """Extract text and identifying metadata; never search compressed pixels."""
    suffix = path.suffix.lower()
    if suffix in TEXT:
        return path.read_text(encoding='utf-8')
    if suffix in IMAGES:
        from PIL import Image
        with Image.open(path) as image:
            # ICC data is a color profile, not free-text sourcing metadata.
            info = {k: v for k, v in image.info.items() if k != 'icc_profile'}
            return repr(info) + repr(dict(image.getexif()))
    if suffix == '.pdf':
        from pypdf import PdfReader
        pdf = PdfReader(path)
        if pdf.is_encrypted:
            raise ValueError('Encrypted public PDF requires private review')
        parts = [str(pdf.metadata or {})]
        for page in pdf.pages:
            parts.append(page.extract_text() or '')
            parts.append(str(page.get('/Annots', [])))
            for ref in page.get('/Annots', []):
                parts.append(str(ref.get_object()))
        if pdf.attachments:
            raise ValueError('Embedded PDF attachments require private review')
        return '\n'.join(parts)
    # Media/unsupported binary formats require human inspection, not binary grep.
    return ''


def inspect(root, identities):
    names = subprocess.check_output(
        ['git', 'ls-files', '--cached', '--others', '--exclude-standard', '-z'],
        cwd=root).decode('utf-8').split('\0')
    issues = []
    count = 0
    for name in sorted(set(n for n in names if n)):
        path = root / name
        if not path.is_file():
            continue
        count += 1
        safe_name = '<redacted filename>' if any(p.search(normalize(name)) for p in identities) else name
        if path.is_symlink():
            issues.append((safe_name, 'symlink-requires-review'))
            continue
        try:
            content = normalize(extracted(path))
        except Exception:
            # No exception text, document contents or matched private values in logs.
            issues.append((safe_name, 'content-or-metadata-unreadable'))
            continue
        if any(p.search(normalize(name) + '\n' + content) for p in identities):
            issues.append((safe_name, 'private-identifier'))
        if path.suffix.lower() in CUSTOMER_TEXT:
            for rule, pattern in RULES:
                if pattern.search(content):
                    issues.append((safe_name, rule))
    return count, issues


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--private-identifiers', type=Path)
    args = parser.parse_args()
    root = args.root.resolve()
    try:
        identities = identifiers_at(args.private_identifiers, root)
        count, issues = inspect(root, identities)
    except Exception:
        print('Confidentiality scan could not run; check private input and dependencies.', file=sys.stderr)
        return 2
    for name, rule in issues:
        print(f'{name}: {rule}')
    print(f'Checked {count} current public files; {len(issues)} blocking findings.')
    print('Private identifier matching: ' + ('enabled' if identities else 'NOT supplied; generic checks only'))
    print('Manual review still required for visual marks, unknown identities, media and public history.')
    return 1 if issues else 0


if __name__ == '__main__':
    raise SystemExit(main())
