#!/usr/bin/env python3
"""Notify changed canonical URLs after deployment. Receipt is not indexing."""
import argparse
import json
import re
import subprocess
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--urls', type=Path, required=True, help='JSON array of changed production URLs')
parser.add_argument('--dry-run', action='store_true')
args = parser.parse_args()
files = [p for p in ROOT.glob('*.txt') if re.fullmatch(r'[a-f0-9]{32}\.txt', p.name)]
assert len(files) == 1, 'Expected one public verification key file'
key = files[0].read_text().strip()
urls = list(dict.fromkeys(json.loads(args.urls.read_text())))
assert 0 < len(urls) <= 10000
assert all(urlsplit(u).scheme == 'https' and urlsplit(u).netloc == 'flutexindustrial.com' for u in urls)
payload = {'host':'flutexindustrial.com','key':key,'keyLocation':'https://flutexindustrial.com/'+files[0].name,'urlList':urls}
if args.dry_run:
    print(json.dumps(payload, ensure_ascii=False, indent=2))
else:
    # Verify the exact public key before notifying any search engine.
    check = subprocess.run(['curl','--max-time','30','-fsS',payload['keyLocation']],capture_output=True,text=True,check=True)
    assert check.stdout.strip() == key, 'Production key is not deployed'
    result = subprocess.run(['curl','--max-time','45','-sS','-X','POST','-H','Content-Type: application/json',
                             '--data-binary','@-','-w','\nHTTP_STATUS:%{http_code}',
                             'https://api.indexnow.org/indexnow'],input=json.dumps(payload),capture_output=True,text=True)
    print(result.stdout)
    if result.returncode:
        raise SystemExit(result.stderr)
    status = result.stdout.rsplit('HTTP_STATUS:',1)[-1].strip()
    print(f'Notification for {len(urls)} URLs: HTTP {status}. This is receipt, not proof of indexing.')
    raise SystemExit(0 if status in ['200','202'] else 1)
