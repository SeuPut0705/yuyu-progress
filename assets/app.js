(() => {
  const root = document.querySelector('[data-filterable]');
  if (!root) return;
  const controls = [...root.querySelectorAll('[data-f]')];
  const items = [...root.querySelectorAll('[data-item]')];
  const groups = [...root.querySelectorAll('[data-group]')];
  const count = root.querySelector('[data-count]');
  const empty = root.querySelector('[data-empty]');
  const params = new URLSearchParams(location.search);

  for (const c of controls) {
    const v = params.get(c.dataset.f);
    if (v !== null) c.value = v;
  }

  const apply = () => {
    const want = Object.fromEntries(controls.map((c) => [c.dataset.f, c.value.trim().toLowerCase()]));
    let shown = 0;
    for (const el of items) {
      const ok =
        (!want.status || el.dataset.status === want.status) &&
        (!want.track || el.dataset.track === want.track) &&
        (!want.stage || el.dataset.stage === want.stage) &&
        (!want.area || el.dataset.area === want.area) &&
        (!want.q || el.dataset.text.toLowerCase().includes(want.q));
      el.hidden = !ok;
      if (ok) shown++;
    }
    for (const g of groups) g.hidden = !g.querySelector('[data-item]:not([hidden])');
    if (count) count.textContent = `${shown} / ${items.length}개 표시`;
    if (empty) empty.hidden = shown !== 0;
    const next = new URLSearchParams();
    for (const c of controls) if (c.value) next.set(c.dataset.f, c.value);
    const qs = next.toString();
    history.replaceState(null, '', `${location.pathname}${qs ? `?${qs}` : ''}${location.hash}`);
  };

  for (const c of controls) c.addEventListener(c.tagName === 'INPUT' ? 'input' : 'change', apply);
  apply();
})();
