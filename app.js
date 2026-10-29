const $ = selector => document.querySelector(selector);
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let cards = [], visible = [], index = 0, side = 'front', opener = null;
const viewer = $('#viewer');
function filter() {
  const query = $('#search').value.trim().toLowerCase(), category = $('#category').value;
  visible = cards.filter(c => (!category || c.category === category) && (!query || c.label.toLowerCase().includes(query)));
  $('#count').textContent = `${visible.length} / ${cards.length} cards`;
  $('#gallery').innerHTML = visible.length ? visible.map((c, i) => `<button class="tile" data-index="${i}" aria-label="Open ${escape(c.label)}"><img src="${c.thumbnail}" alt="${escape(c.label)} — front" width="260" height="361" loading="lazy" decoding="async"><span>${escape(c.label)}</span></button>`).join('') : '<p class="empty">No matching cards.</p>';
  document.querySelectorAll('.tile').forEach(button => button.addEventListener('click', () => {
    opener = button; index = Number(button.dataset.index); side = 'front'; show(); viewer.showModal();
  }));
}
function show() {
  const card = visible[index];
  $('#card-title').textContent = card.label;
  $('#full-card').src = card[side];
  $('#full-card').alt = `${card.label} — ${side}. Original PLOT4ai card; use the source JSON for machine-readable text.`;
  $('#position').textContent = `${index + 1} / ${visible.length} · ${side === 'front' ? 'Front' : 'Back'}`;
  $('#flip').textContent = side === 'front' ? 'Show back' : 'Show front';
  $('#previous').disabled = index === 0; $('#next').disabled = index === visible.length - 1;
  $('#image-error').hidden = true;
  $('#full-card').classList.remove('zoomed'); $('#zoom').textContent = 'Zoom +';
  viewer.scrollTop = 0;
}
function flip() { side = side === 'front' ? 'back' : 'front'; show(); }
function move(delta) { if (index + delta < 0 || index + delta >= visible.length) return; index += delta; side = 'front'; show(); }
$('#close').onclick = () => viewer.close();
$('#zoom').onclick = () => { const expanded = $('#full-card').classList.toggle('zoomed'); $('#zoom').textContent = expanded ? 'Zoom −' : 'Zoom +'; };
$('#flip').onclick = flip; $('#full-card').onclick = flip;
$('#previous').onclick = () => move(-1); $('#next').onclick = () => move(1);
$('#full-card').onerror = () => { $('#image-error').hidden = false; };
viewer.addEventListener('close', () => opener?.focus());
viewer.addEventListener('click', event => { if (event.target === viewer) { const r=viewer.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) viewer.close(); } });
viewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
  if (event.key.toLowerCase() === 'f') { event.preventDefault(); flip(); }
});
$('#search').addEventListener('input', filter); $('#category').addEventListener('change', filter);
try {
  const response = await fetch('cards.json'); if (!response.ok) throw Error('Manifest unavailable');
  cards = (await response.json()).cards;
  $('#category').insertAdjacentHTML('beforeend', [...new Set(cards.map(c => c.category))].map(c => `<option value="${escape(c)}">${escape(c)}</option>`).join(''));
  filter();
} catch { $('#error').hidden = false; $('#count').textContent = 'Unable to load'; }
