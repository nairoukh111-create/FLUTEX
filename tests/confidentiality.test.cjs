const {test} = require('node:test');
const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const script = path.resolve(__dirname, '../scripts/check_public_confidentiality.py');
const python = process.env.FLUTEX_AUDIT_PYTHON || 'python3';

// Fictional fixtures only. Never put real upstream names or codes in this file.
function fixture(run) {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'flutex-confidentiality-'));
  const root = path.join(temporary, 'public');
  fs.mkdirSync(root);
  spawnSync('git', ['init', '-q', root]);
  const secret = path.join(temporary, 'identifiers.json');
  fs.writeFileSync(secret, JSON.stringify(['Fictional-Private-Example']));
  const scan = () => spawnSync(python, [script, '--root', root, '--private-identifiers', secret], {encoding:'utf8'});
  try {run({root, secret, scan});} finally {fs.rmSync(temporary, {recursive:true, force:true});}
}

test('Confidentiality guard catches encoded hidden identifiers without echoing them', () => fixture(({root, scan}) => {
  fs.writeFileSync(path.join(root, 'page.html'), '<!-- Fictional%2DPrivate%2DExample -->');
  const result = scan();
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stdout, /private-identifier/);
  assert.doesNotMatch(result.stdout, /Fictional-Private-Example/);
}));

test('Confidentiality guard includes Worker modules and deployment configuration', () => fixture(({root, scan}) => {
  for (const name of ['service.mjs', 'wrangler.jsonc', 'worker.toml']) {
    fs.writeFileSync(path.join(root, name), 'Fictional-Private-Example');
  }
  const result = scan();
  assert.equal(result.status, 1);
  for (const name of ['service.mjs', 'wrangler.jsonc', 'worker.toml']) assert.ok(result.stdout.includes(name + ': private-identifier'));
  assert.doesNotMatch(result.stdout, /Fictional-Private-Example/);
}));

test('Confidentiality guard checks filenames, retains OEM references and rejects a public denylist', () => fixture(({root, secret, scan}) => {
  fs.writeFileSync(path.join(root, 'page.html'), 'FLUTEX compatible nozzle, OEM reference 420252, M35, DLC.');
  assert.equal(scan().status, 0);
  const confidentialFile = path.join(root, 'Fictional-Private-Example.txt');
  fs.writeFileSync(confidentialFile, 'Technical information');
  const result = scan();
  assert.equal(result.status, 1);
  assert.match(result.stdout, /redacted filename/);
  assert.doesNotMatch(result.stdout, /Fictional-Private-Example/);
  fs.unlinkSync(confidentialFile);
  const publicList = path.join(root, 'list.json');
  fs.copyFileSync(secret, publicList);
  assert.equal(spawnSync(python, [script, '--root', root, '--private-identifiers', publicList]).status, 2);
}));

test('Confidentiality guard extracts image and PDF metadata instead of scanning compressed pixels', () => fixture(({root, scan}) => {
  const build = spawnSync(python, ['-c', `
import sys
from pathlib import Path
from PIL import Image, PngImagePlugin
from pypdf import PdfWriter
root=Path(sys.argv[1])
info=PngImagePlugin.PngInfo()
info.add_text('Comment','Fictional-Private-Example')
Image.new('RGB',(2,2)).save(root/'image.png',pnginfo=info)
writer=PdfWriter()
writer.add_blank_page(width=100,height=100)
writer.add_metadata({'/Subject':'Fictional-Private-Example'})
writer.write(root/'technical.pdf')
`, root], {encoding:'utf8'});
  assert.equal(build.status, 0, build.stderr);
  const result = scan();
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stdout, /image.png: private-identifier/);
  assert.match(result.stdout, /technical.pdf: private-identifier/);
  assert.doesNotMatch(result.stdout, /Fictional-Private-Example/);
}));

test('Confidentiality guard blocks upstream commercial phrasing and manufacturer claims', () => fixture(({root, scan}) => {
  fs.writeFileSync(path.join(root, 'page.html'), 'Supplied by FLUTEX.');
  assert.equal(scan().status, 0);
  fs.writeFileSync(path.join(root, 'page.html'), ['Supplier', 'specifications. FLUTEX is a manufacturer.'].join(' '));
  const result = scan();
  assert.equal(result.status, 1);
  assert.match(result.stdout, /upstream-attribution/);
  assert.match(result.stdout, /manufacturing-claim-review/);
}));
