/**
 * Rendu modulaire du catalogue depuis data/products.json
 * Pour ajouter un article : éditer data/products.json (voir docs/CATALOGUE.md)
 */
(function () {
  const grid = document.getElementById('catalogue-grid');
  const filters = document.getElementById('catalogue-filters');
  if (!grid) return;

  const categoryDescEl = document.getElementById('category-description');

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(str) {
    return escapeHtml(str);
  }

  function renderProduct(product, categories) {
    const cat = categories.find((c) => c.id === product.category);
    const descText = product.description || (cat ? cat.description : '');
    const tag = product.tag ? `<p class="product-card__tag">${escapeHtml(product.tag)}</p>` : '';
    const ref = product.reference
      ? `<dl class="product-card__meta"><dt>Réf. </dt><dd>${escapeHtml(product.reference)}</dd></dl>`
      : '';
    const descBlock = descText
      ? `<p class="product-card__desc">${escapeHtml(descText)}</p>`
      : '';
    const categoryLabel = cat
      ? `<p class="product-card__category">${escapeHtml(cat.name)}</p>`
      : '';

    const media = product.image
      ? `<img src="${escapeAttr(product.image)}" alt="${escapeAttr(product.imageAlt || product.name)}" loading="lazy" width="400" height="400">`
      : `<div class="product-card__placeholder" role="img" aria-label="Photo à venir">Photo à venir</div>`;

    return `
      <article class="product-card" data-category="${escapeAttr(product.category)}" id="produit-${escapeAttr(product.id)}">
        <div class="product-card__media">${media}</div>
        <div class="product-card__body">
          ${tag}
          ${categoryLabel}
          <h2 class="product-card__title">${escapeHtml(product.name)}</h2>
          ${descBlock}
          ${ref}
        </div>
      </article>`;
  }

  function cssEscape(value) {
    if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
      return CSS.escape(value);
    }
    return String(value).replace(/["\\]/g, '\\$&');
  }

  function applyFilter(filter, categories) {
    const activeFilter = String(filter || 'all').trim();
    grid.querySelectorAll(':scope > .product-card').forEach((card) => {
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
    if (categoryDescEl) {
      if (activeFilter !== 'all') {
        const cat = categories.find((c) => c.id === activeFilter);
        categoryDescEl.textContent = cat ? cat.description : '';
        categoryDescEl.hidden = !cat;
      } else {
        categoryDescEl.hidden = true;
      }
    }
  }

  function bindFilters(categories) {
    if (!filters) return;
    const buttons = filters.querySelectorAll('[data-filter]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = (btn.getAttribute('data-filter') || 'all').trim();
        buttons.forEach((b) => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
        applyFilter(filter, categories);
      });
    });
  }

  fetch('data/products.json')
    .then((r) => {
      if (!r.ok) throw new Error('Impossible de charger le catalogue');
      return r.json();
    })
    .then((data) => {
      const categories = data.categories || [];
      const products = (data.products || []).filter((p) => p.published !== false);

      if (filters) {
        const allBtn = filters.querySelector('[data-filter="all"]');
        categories.forEach((cat) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'filter-btn';
          btn.setAttribute('data-filter', cat.id);
          btn.setAttribute('aria-pressed', 'false');
          btn.textContent = cat.name;
          filters.appendChild(btn);
        });
        if (allBtn) allBtn.setAttribute('aria-pressed', 'true');
      }

      grid.innerHTML = products.map((p) => renderProduct(p, categories)).join('');
      bindFilters(categories);
      applyFilter('all', categories);

      const catParam = new URLSearchParams(window.location.search).get('categorie');
      if (catParam && filters) {
        const safeId = cssEscape(catParam.trim());
        const btn = filters.querySelector(`[data-filter="${safeId}"]`);
        if (btn) {
          btn.click();
        }
      }
    })
    .catch((err) => {
      grid.innerHTML =
        '<p class="catalogue-note">Le catalogue n’a pas pu être chargé. Vérifiez que le fichier <code>data/products.json</code> est accessible.</p>';
      console.error(err);
    });
})();
