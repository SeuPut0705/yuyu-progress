(() => {
  const input = document.querySelector('[data-f="q"]');
  const items = [...document.querySelectorAll('[data-item]')];
  const groups = [...document.querySelectorAll('[data-group]')];
  const count = document.querySelector('[data-count]');
  const empty = document.querySelector('[data-empty]');
  if (!input) return;

  const apply = () => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    for (const el of items) {
      const ok = !q || el.dataset.text.toLowerCase().includes(q);
      el.hidden = !ok;
      if (ok) shown++;
    }
    for (const g of groups) g.hidden = !g.querySelector('[data-item]:not([hidden])');
    count.textContent = q ? `${shown} / ${items.length}개 표시` : '';
    empty.hidden = shown !== 0;
    const url = new URL(location.href);
    if (q) url.searchParams.set('q', input.value.trim()); else url.searchParams.delete('q');
    history.replaceState(null, '', url);
  };

  input.value = new URLSearchParams(location.search).get('q') ?? '';
  input.addEventListener('input', apply);
  apply();
})();
