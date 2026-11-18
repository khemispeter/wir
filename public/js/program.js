const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
$('#yr').textContent = new Date().getFullYear();
$('#menu').onclick = () => $('#links').classList.toggle('open');
document.querySelectorAll('#links a').forEach(a => a.onclick = () => $('#links').classList.remove('open'));

// Programme content comes from data/programs.json; pictures live in images/programs/
fetch('data/programs.json').then(r => r.json()).then(list => {
  const chips = l => l.map(x => `<a href="program.html?p=${x.slug}">${esc(x.title)}</a>`).join('');
  const p = list.find(x => x.slug === new URLSearchParams(location.search).get('p'));
  if (!p) {
    $('#pbody').innerHTML = `<div class="wrap" style="padding:90px 0"><h1>Programme not found</h1>
      <p style="margin:12px 0 24px">Please choose one of our programmes.</p><div class="chips">${chips(list)}</div></div>`;
    return;
  }
  document.title = p.title + ' | Women Rise Initiatives';
  $('#pbody').innerHTML = `
  <section class="phero"><div class="wrap">
    <div><p class="crumb"><a href="index.html">Home</a> / <a href="index.html#programs">What we do</a> / ${esc(p.title)}</p>
      <h1>${esc(p.title)}</h1><p class="tag">${esc(p.headline)}</p></div>
    <div class="cover"><img src="${esc(p.cover)}" alt="${esc(p.coverAlt)}" style="object-fit:${esc(p.fit || 'cover')};object-position:${esc(p.pos || 'center')}"></div>
  </div></section>
  <section><div class="wrap narrow"><p class="intro">${esc(p.intro)}</p><p class="closing">${esc(p.closing)}</p></div></section>
  <section class="alt"><div class="wrap"><h2>Our activities</h2><div class="acts">
    ${p.activities.map((a, i) => `<article class="arow"><div class="ph"><img src="${esc(a.image)}" alt="${esc(a.title)}" loading="lazy" onerror="this.remove()"></div>
      <div class="txt"><b class="n">${i + 1}</b><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></div></article>`).join('')}
  </div></div></section>
  <section><div class="wrap"><h2>Our other programmes</h2><div class="chips">${chips(list.filter(x => x !== p))}</div></div></section>`;
}).catch(() => { $('#pbody').innerHTML = '<div class="wrap" style="padding:90px 0"><p>This page could not be loaded.</p></div>'; });
