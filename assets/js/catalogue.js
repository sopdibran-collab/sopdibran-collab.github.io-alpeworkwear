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
      .replace(/"/g, '&quot;');
  }

  function renderProduct(product, categories) {
    const cat = categories.find((c) => c.id === product.category);
    let descText = product.description;
    if (!descText && cat) descText = cat.description;
    const descClass = descText ? 'product-card__desc' : 'product-card__desc product-card__desc--empty';
    const descContent = descText ? escapeHtml(descText) : 'Description à compléter.';
    const tag = product.tag ? `<p class="product-card__tag">${escapeHtml(product.tag)}</p>` : '';
    const ref = product.reference
      ? `<dl class="product-card__meta"><dt>Réf. </dt><dd>${escapeHtml(product.reference)}</dd></dl>`
      : '';

    const media = product.image
      ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.imageAlt || product.name)}" loading="lazy" width="400" height="400">`
      : `<div class="product-card__placeholder" role="img" aria-label="Photo à venir">Photo à venir</div>`;

    return `
      <article class="product-card" data-category="${escapeHtml(product.category)}" id="produit-${escapeHtml(product.id)}">
        <div class="product-card__media">${media}</div>
        <div class="product-card__body">
          ${tag}
          <h2 class="product-card__title">${escapeHtml(product.name)}</h2>
          <p class="${descClass}">${descContent}</p>
          ${ref}
          <a href="contact.html?produit=${encodeURIComponent(product.id)}" class="btn btn-primary">Demander un devis</a>
        </div>
      </article>`;
  }

  function bindFilters(categories, products) {
    if (!filters) return;
    const buttons = filters.querySelectorAll('[data-filter]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        buttons.forEach((b) => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
        const cards = grid.querySelectorAll('.product-card');
        cards.forEach((card) => {
          const show = filter === 'all' || card.getAttribute('data-category') === filter;
          card.hidden = !show;
        });
        if (categoryDescEl && filter !== 'all') {
          const cat = categories.find((c) => c.id === filter);
          categoryDescEl.textContent = cat ? cat.description : '';
          categoryDescEl.hidden = !cat;
        } else if (categoryDescEl) {
          categoryDescEl.hidden = true;
        }
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
      bindFilters(categories, products);

      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('categorie');
      if (catParam && filters) {
        const btn = filters.querySelector(`[data-filter="${catParam}"]`);
        btn?.click();
      }
    })
    .catch((err) => {
      grid.innerHTML = `<p class="catalogue-note">Le catalogue n’a pas pu être chargé. Vérifiez que <code>data/products.json</code> est accessible.</p>`;
      console.error(err);
    });
})();
