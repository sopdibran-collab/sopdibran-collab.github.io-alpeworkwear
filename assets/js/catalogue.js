/**
 * Filtres catalogue — enhancement sur HTML pré-rendu (build-seo.js).
 */
(function () {
  const grid = document.getElementById('catalogue-grid');
  const filters = document.getElementById('catalogue-filters');
  if (!grid || !filters) return;

  const categoryDescEl = document.getElementById('category-description');
  const cards = Array.from(grid.querySelectorAll('.product-card'));

  function cssEscape(value) {
    if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
      return CSS.escape(value);
    }
    return String(value).replace(/["\\]/g, '\\$&');
  }

  function getCategoryDescriptions() {
    const map = {};
    filters.querySelectorAll('[data-filter]').forEach((el) => {
      const id = el.getAttribute('data-filter');
      if (id && id !== 'all') map[id] = el.textContent.trim();
    });
    return map;
  }

  function applyFilter(filter) {
    const activeFilter = String(filter || 'all').trim();
    cards.forEach((card) => {
      const categoryId = (card.dataset.category || '').trim();
      const show = activeFilter === 'all' || categoryId === activeFilter;
      card.classList.toggle('is-filtered-out', !show);
      if (show) {
        card.removeAttribute('hidden');
      } else {
        card.setAttribute('hidden', '');
      }
      card.setAttribute('aria-hidden', show ? 'false' : 'true');
    });

    filters.querySelectorAll('[data-filter]').forEach((el) => {
      const id = (el.getAttribute('data-filter') || 'all').trim();
      const active = id === activeFilter;
      el.setAttribute('aria-pressed', active ? 'true' : 'false');
      if (active) {
        el.setAttribute('aria-current', 'true');
      } else {
        el.removeAttribute('aria-current');
      }
    });

    if (categoryDescEl) {
      if (activeFilter !== 'all') {
        const descriptions = getCategoryDescriptions();
        categoryDescEl.textContent = descriptions[activeFilter] || '';
        categoryDescEl.hidden = !descriptions[activeFilter];
      } else {
        categoryDescEl.hidden = true;
      }
    }
  }

  filters.querySelectorAll('a[data-filter]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = (link.getAttribute('data-filter') || 'all').trim();
      applyFilter(filter);
      const url =
        filter === 'all'
          ? '/catalogue.html'
          : `/catalogue.html?categorie=${encodeURIComponent(filter)}`;
      history.replaceState(null, '', url);
    });
  });

  const catParam = new URLSearchParams(window.location.search).get('categorie');
  if (catParam) {
    const safeId = cssEscape(catParam.trim());
    const btn = filters.querySelector(`[data-filter="${safeId}"]`);
    if (btn) {
      applyFilter(catParam.trim());
    } else {
      applyFilter('all');
    }
  } else {
    applyFilter('all');
  }
})();
