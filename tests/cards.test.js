import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const manifest = JSON.parse(fs.readFileSync(new URL('cards.json', root)));
const deck = JSON.parse(fs.readFileSync(new URL('deck.json', root)));
test('HTML is standalone with a matching inline catalog and relative image paths', () => {
  const html = fs.readFileSync(new URL('index.html', root), 'utf8');
  assert.ok(fs.existsSync(new URL('.nojekyll', root)));
  assert.doesNotMatch(html, /<script[^>]+src=|<link[^>]+stylesheet|fetch\(|type="module"/);
  const data = html.match(/<script type="application\/json" id="card-data">(.*?)<\/script>/s);
  assert.deepEqual(JSON.parse(data[1]), manifest);
  const script = html.match(/<script>\s*(.*?)<\/script>/s)[1];
  assert.doesNotThrow(() => new vm.Script(script));
  for (const card of manifest.cards) for (const key of ['front','back','thumbnail']) {
    assert.match(card[key], /^assets\//);
  }
});
test('all 138 cards match the original deck and all 276 PDF faces', () => {
  assert.equal(manifest.release, 'pdf-release-43');
  assert.match(manifest.pdfSha256, /^[a-f0-9]{64}$/);
  assert.equal(manifest.cards.length, 138);
  assert.equal(new Set(manifest.cards.map(c => c.id)).size, 138);
  const expected = deck.flatMap(g => g.cards.map(c => ({label: c.label, category:g.category})));
  manifest.cards.forEach((card, i) => {
    assert.equal(card.label, expected[i].label);
    assert.equal(card.category, expected[i].category);
    assert.deepEqual(card.pages, [7+i*2,8+i*2]);
    for (const key of ['front', 'back', 'thumbnail']) {
      const bytes = fs.readFileSync(new URL(card[key], root));
      assert.ok(bytes.length > 500, card[key]);
      assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
      assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
    }
  });
});
