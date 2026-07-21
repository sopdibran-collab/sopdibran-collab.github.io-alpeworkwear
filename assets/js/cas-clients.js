/**
 * Page réalisations — charge data/cas-clients.json
 */
(function () {
  const root = document.getElementById('cas-clients');
  if (!root) return;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderCase(item) {
    const pieces = (item.pieces || []).map(escapeHtml).join(' · ');
    const images = (item.images || [])
      .map(
        (img) =>
          `<figure class="case-card__shot">
            <img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt)}" width="540" height="540" loading="lazy" decoding="async">
          </figure>`
      )
      .join('');

    return `<article class="case-card" id="cas-${escapeHtml(item.id)}">
      <header class="case-card__head">
        <img class="case-card__logo" src="${escapeHtml(item.logo)}" alt="" width="140" height="42" loading="lazy">
        <div>
          <h3 class="case-card__title">${escapeHtml(item.client)}</h3>
          <p class="case-card__meta">${escapeHtml(item.secteur)} · ${pieces}</p>
          <p class="case-card__mark">${escapeHtml(item.marquage)}</p>
        </div>
      </header>
      <p class="case-card__resume">${escapeHtml(item.resume)}</p>
      <div class="case-card__gallery">${images}</div>
      <p class="case-card__cta">
        <a href="/contact.html?produit=${encodeURIComponent(item.pieces?.[0] || 'workwear')}" class="btn btn-secondary">Devis similaire</a>
      </p>
    </article>`;
  }

  fetch('data/cas-clients.json')
    .then((res) => {
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    })
    .then((items) => {
      if (!Array.isArray(items) || !items.length) {
        root.innerHTML = '<p>Aucune réalisation à afficher pour le moment.</p>';
        return;
      }
      root.innerHTML = items.map(renderCase).join('');
    })
    .catch(() => {
      root.innerHTML =
        '<p>Impossible de charger les réalisations. <a href="/contact.html">Contactez-nous</a> pour des exemples de projets.</p>';
    });
})();
