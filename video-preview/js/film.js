// 'One Text' film: muted autoplay while mostly in view, pause when scrolled away,
// "Tap for sound" unmutes (and restarts from 0 the first time), native controls stay available.
(() => {
  const fig = document.querySelector('[data-film]'); if (!fig) return;
  const v = fig.querySelector('video'), b = fig.querySelector('.film-sound');
  v.muted = true; v.playsInline = true;
  let heard = false, userPaused = false;
  const sync = () => { b.hidden = !v.muted; b.setAttribute('aria-pressed', String(!v.muted)); };
  const others = () => ((window.__vidPreview || {}).vids || []);
  b.addEventListener('click', e => {
    e.stopPropagation();
    others().forEach(o => { if (!o.muted) { o.muted = true; const ob = o.closest('figure').querySelector('.vsound'); if (ob) { ob.setAttribute('aria-pressed', 'false'); ob.querySelector('.t').textContent = 'Tap for sound'; } } });
    v.muted = false; if (!heard) { heard = true; try { v.currentTime = 0; } catch (err) {} }
    userPaused = false; v.play().catch(() => {}); sync();
  });
  v.addEventListener('volumechange', () => { sync(); if (!v.muted) others().forEach(o => { if (!o.muted) o.muted = true; }); });
  v.addEventListener('pause', () => { if (fig.dataset.auto !== '1') userPaused = true; fig.dataset.auto = ''; });
  v.addEventListener('play', () => { userPaused = false; });
  // another clip's sound button takes the sound from the film
  document.querySelectorAll('figure.vid .vsound').forEach(o => o.addEventListener('click', () => { if (!v.muted) v.muted = true; }));
  new IntersectionObserver(es => es.forEach(e => {
    if (document.body.classList.contains('tour-open')) return;
    if (e.intersectionRatio >= 0.5) { if (v.paused && !userPaused && !v.ended) v.play().catch(() => {}); }
    else if (!v.paused) { fig.dataset.auto = '1'; v.pause(); }
  }), { threshold: [0, 0.25, 0.5, 0.75, 1] }).observe(v);
  document.querySelectorAll('[data-tour]').forEach(t => t.addEventListener('click', () => { if (!v.paused) { fig.dataset.auto = '1'; v.pause(); } }));
  sync();
  window.__film = v;
})();
