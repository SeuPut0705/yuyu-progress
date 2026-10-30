(() => {
  const chips = [...document.querySelectorAll('[data-wave-filter]')];
  const rows = [...document.querySelectorAll('[data-item]')];
  const steps = [...document.querySelectorAll('[data-step]')];
  const empty = document.querySelector('[data-empty]');
  const params = new URLSearchParams(location.search);
  let wave = chips.some((c) => c.dataset.waveFilter === params.get('wave')) ? params.get('wave') : '';

  const apply = () => {
    let shown = 0;
    for (const r of rows) {
      r.hidden = Boolean(wave) && r.dataset.wave !== wave;
      if (!r.hidden) shown++;
    }
    for (const s of steps) s.hidden = !s.querySelector('[data-item]:not([hidden])');
    for (const c of chips) c.setAttribute('aria-pressed', String(c.dataset.waveFilter === wave));
    empty.hidden = shown !== 0;
    const url = new URL(location.href);
    if (wave) url.searchParams.set('wave', wave); else url.searchParams.delete('wave');
    history.replaceState(null, '', url);
  };
  for (const c of chips) c.addEventListener('click', () => { wave = c.dataset.waveFilter; apply(); });
  apply();

  // 막힌 것·일정·범위 밖·기록은 탭 한 벌로 보인다. 주소가 그 패널이면 그 탭을 연다.
  const root = document.querySelector('.tabs');
  const panels = [...root.querySelectorAll(':scope > .panel')];
  document.documentElement.classList.add('js');
  const bar = Object.assign(document.createElement('div'), { className: 'tabbar', role: 'tablist' });
  const tabs = panels.map((p) => {
    const t = Object.assign(document.createElement('button'), { type: 'button', role: 'tab', textContent: p.dataset.panel });
    if (p.dataset.count) t.insertAdjacentHTML('beforeend', ` <span class="n">${p.dataset.count}</span>`);
    t.addEventListener('click', () => show(p));
    bar.append(t);
    return t;
  });
  const show = (panel) => {
    panels.forEach((p, i) => { p.hidden = p !== panel; tabs[i].setAttribute('aria-selected', String(p === panel)); });
  };
  root.prepend(bar);
  const fromHash = () => {
    const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    const panel = panels.find((p) => p === el || p.contains(el));
    if (panel) { show(panel); if (panel === el) root.scrollIntoView(); }
  };
  show(panels[0]);
  addEventListener('hashchange', fromHash);
  fromHash();

  // 주소의 #item-ID로 들어오거나 막힌 것의 ID 칩을 누르면 그 항목을 펼친다.
  const openFromHash = () => {
    const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (el?.matches('details.req')) { el.hidden = false; el.open = true; }
  };
  addEventListener('hashchange', openFromHash);
  openFromHash();

  // 좁은 화면(900px 미만): 막힌 것 묶음을 접고, 일정은 주요 일정만 보이고 세부 일정은 단추로 연다.
  if (matchMedia('(max-width: 899px)').matches) {
    for (const g of document.querySelectorAll('.bgroup')) g.open = false;
    const tl = document.querySelector('[data-tl]');
    const minor = tl.querySelectorAll('.minor').length;
    tl.dataset.compact = '';
    const btn = Object.assign(document.createElement('button'), { type: 'button', className: 'tl-toggle', textContent: `세부 일정 ${minor}건 보기` });
    btn.addEventListener('click', () => {
      const compact = tl.toggleAttribute('data-compact');
      btn.textContent = compact ? `세부 일정 ${minor}건 보기` : '세부 일정 접기';
    });
    tl.after(btn);
  }
})();
