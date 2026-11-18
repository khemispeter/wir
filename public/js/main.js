const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
$('#yr').textContent = new Date().getFullYear();
$('#menu').onclick = () => $('#links').classList.toggle('open');
document.querySelectorAll('#links a').forEach(a => a.onclick = () => $('#links').classList.remove('open'));

// Contact + newsletter forms
document.querySelectorAll('form[data-api]').forEach(f => f.addEventListener('submit', async e => {
  e.preventDefault();
  const msg = f.querySelector('.msg'), btn = f.querySelector('button');
  btn.disabled = true; msg.className = 'msg'; msg.textContent = 'Sending...';
  try {
    const r = await fetch(f.dataset.api, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(f))) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'Something went wrong. Please try again.');
    f.reset(); msg.classList.add('ok'); msg.textContent = f.dataset.ok;
  } catch (err) { msg.classList.add('err'); msg.textContent = err.message; }
  btn.disabled = false;
}));

// Activities and partners come from data/content.json (edit that file, no code changes needed)
fetch('data/content.json').then(r => r.json()).then(({ activities, partners }) => {
  const grid = $('#act-grid'), tabs = document.querySelectorAll('.tab');
  const show = s => {
    tabs.forEach(t => t.classList.toggle('on', t.dataset.s === s));
    grid.innerHTML = activities.filter(a => a.status === s).map(a => `
      <article class="act"><div class="ph">
        <img src="${esc(a.image)}" alt="${esc(a.title)}" loading="lazy" onerror="this.remove()">
        <span class="loc">${esc(a.location)}</span></div>
        <div class="body"><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></div></article>`).join('')
      || '<p>Nothing to show here yet.</p>';
  };
  tabs.forEach(t => t.onclick = () => show(t.dataset.s));
  show('ongoing');
  ['partner', 'donor'].forEach(type => {
    $('#' + type + '-list').innerHTML = partners.filter(p => p.type === type).map(p => {
      const inner = `<img src="${esc(p.logo)}" alt="${esc(p.name)} logo" loading="lazy" onerror="this.remove()"><span>${esc(p.name)}</span>`;
      return /^https?:\/\//.test(p.url || '')
        ? `<a class="pcard" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(p.name)} (opens in a new tab)">${inner}</a>`
        : `<div class="pcard">${inner}</div>`;
    }).join('');
  });
}).catch(() => { $('#act-grid').innerHTML = '<p>Activities could not be loaded.</p>'; });
