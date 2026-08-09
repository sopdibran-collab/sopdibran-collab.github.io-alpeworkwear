/**
 * Page réalisations — cas clients éditorial
 */
(function () {
  const root = document.getElementById('cas-clients');
  if (!root) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function padIndex(n) {
    return String(n).padStart(2, '0');
  }

  function initCases(items) {
    let caseIndex = 0;
    let shotIndex = 0;

    root.innerHTML = `<div class="cases__layout">
      <figure class="cases__media">
        <img src="" alt="Réalisation workwear personnalisé Alpë Workwear" width="1080" height="1080" decoding="async">
      </figure>
      <div class="cases__copy">
        <p class="cases__index"></p>
        <h3 class="cases__client"></h3>
        <p class="cases__secteur"></p>
        <p class="cases__resume"></p>
        <p class="cases__tags"></p>
        <a class="cases__link" href="/contact.html">Demander un devis similaire</a>
        <div class="cases__thumbs" role="group" aria-label="Vues du projet"></div>
        <div class="cases__nav">
          <button type="button" class="cases__nav-btn cases__nav-btn--prev" aria-label="Cas précédent">‹</button>
          <button type="button" class="cases__nav-btn cases__nav-btn--next" aria-label="Cas suivant">›</button>
        </div>
      </div>
    </div>`;

    const mediaImg = root.querySelector('.cases__media img');
    const indexEl = root.querySelector('.cases__index');
    const clientEl = root.querySelector('.cases__client');
    const secteurEl = root.querySelector('.cases__secteur');
    const resumeEl = root.querySelector('.cases__resume');
    const tagsEl = root.querySelector('.cases__tags');
    const linkEl = root.querySelector('.cases__link');
    const thumbsEl = root.querySelector('.cases__thumbs');
    const prevBtn = root.querySelector('.cases__nav-btn--prev');
    const nextBtn = root.querySelector('.cases__nav-btn--next');

    function activeCase() {
      return items[caseIndex];
    }

    function renderThumbs() {
      const item = activeCase();
      const images = item.images || [];
      thumbsEl.innerHTML = images
        .map(
          (img, i) => `<button type="button" class="cases__thumb${i === shotIndex ? ' is-active' : ''}" data-shot="${i}" aria-label="${escapeHtml(img.alt || `Vue ${i + 1}`)}" aria-current="${i === shotIndex ? 'true' : 'false'}">
            <img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt || item.client || 'Réalisation Alpë Workwear')}" width="180" height="180" loading="lazy" decoding="async">
          </button>`,
        )
        .join('');

      thumbsEl.querySelectorAll('.cases__thumb').forEach((btn) => {
        btn.addEventListener('click', () => {
          shotIndex = Number(btn.getAttribute('data-shot')) || 0;
          render();
        });
      });
    }

    function render() {
      const item = activeCase();
      const images = item.images || [];
      if (!images.length) return;

      shotIndex = Math.max(0, Math.min(shotIndex, images.length - 1));
      const shot = images[shotIndex];

      if (!reduceMotion) mediaImg.style.opacity = '0.35';
      const apply = () => {
        mediaImg.src = shot.src;
        mediaImg.alt = shot.alt || item.client || 'Réalisation workwear personnalisé Alpë Workwear';
        if (!reduceMotion) mediaImg.style.opacity = '1';
      };
      if (reduceMotion) apply();
      else window.setTimeout(apply, 120);

      indexEl.textContent = `${padIndex(caseIndex + 1)} / ${padIndex(items.length)}`;
      clientEl.textContent = item.client;
      secteurEl.textContent = item.secteur || '';
      resumeEl.textContent = item.resume || '';
      tagsEl.textContent = [(item.pieces || []).join(' · '), item.marquage].filter(Boolean).join(' · ');
      linkEl.href = `/contact.html?produit=${encodeURIComponent(item.pieces?.[0] || 'workwear')}`;

      prevBtn.disabled = caseIndex === 0;
      nextBtn.disabled = caseIndex === items.length - 1;

      renderThumbs();
    }

    function goCase(i) {
      caseIndex = Math.max(0, Math.min(i, items.length - 1));
      shotIndex = 0;
      render();
    }

    prevBtn.addEventListener('click', () => goCase(caseIndex - 1));
    nextBtn.addEventListener('click', () => goCase(caseIndex + 1));

    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (shotIndex > 0) {
          shotIndex -= 1;
          render();
        } else if (caseIndex > 0) goCase(caseIndex - 1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const maxShot = (activeCase().images || []).length - 1;
        if (shotIndex < maxShot) {
          shotIndex += 1;
          render();
        } else if (caseIndex < items.length - 1) goCase(caseIndex + 1);
      }
    });

    render();
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
      initCases(items);
    })
    .catch(() => {
      root.innerHTML =
        '<p>Impossible de charger les réalisations. <a href="/contact.html">Contactez-nous</a> pour des exemples de projets.</p>';
    });
})();
