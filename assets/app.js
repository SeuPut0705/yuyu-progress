(() => {
  const input = document.querySelector('[data-f="q"]');
  const chips = [...document.querySelectorAll('.fchip')];
  const items = [...document.querySelectorAll('[data-item]')];
  const groups = [...document.querySelectorAll('[data-group]')];
  const count = document.querySelector('[data-count]');
  const empty = document.querySelector('[data-empty]');
  const params = new URLSearchParams(location.search);
  let status = chips.some((c) => c.dataset.status === params.get('status')) ? params.get('status') : '';

  const apply = () => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    for (const el of items) {
      const ok = (!status || el.dataset.status === status) && (!q || el.dataset.text.toLowerCase().includes(q));
      el.hidden = !ok;
      if (ok) shown++;
    }
    for (const g of groups) g.hidden = !g.querySelector('[data-item]:not([hidden])');
    for (const c of chips) c.setAttribute('aria-pressed', String(c.dataset.status === status));
    const filtered = status || q;
    count.textContent = filtered ? `${shown} / ${items.length}개 표시` : '';
    empty.hidden = shown !== 0;
    empty.textContent = !q && status === '완료' ? '아직 완료된 항목이 없다.' : '조건에 맞는 항목이 없다.';
    const url = new URL(location.href);
    for (const [k, v] of [['status', status], ['q', input.value.trim()]]) if (v) url.searchParams.set(k, v); else url.searchParams.delete(k);
    history.replaceState(null, '', url);
  };

  input.value = params.get('q') ?? '';
  input.addEventListener('input', apply);
  for (const c of chips) c.addEventListener('click', () => { status = c.dataset.status; apply(); });
  apply();

  const links = [...document.querySelectorAll('[data-nav]')];
  const sections = ['overview', 'built', ...groups.map((g) => g.id), 'commits-all'].map((id) => document.getElementById(id)).filter(Boolean);
  let queued = false;
  const mark = () => {
    queued = false;
    let current = sections[0].id;
    for (const s of sections) if (!s.hidden && s.getBoundingClientRect().top <= 140) current = s.id;
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) current = sections[sections.length - 1].id;
    for (const a of links) a.toggleAttribute('aria-current', a.dataset.nav === current);
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(mark); } }, { passive: true });
  mark();

  const menu = document.querySelector('.menu');
  menu?.addEventListener('click', (e) => { if (e.target.closest('a')) menu.open = false; });
})();
