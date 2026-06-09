/**
 * Bandeau cookies — charge GTM uniquement après consentement (LPD / nLPD CH).
 */
(function () {
  const cfg = window.ALPE_CONFIG || {};
  const STORAGE_KEY = 'alpe_cookie_consent';
  const gtmId = cfg.gtmId;

  function loadGtm() {
    if (!gtmId || window.dataLayer) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + gtmId;
    document.head.appendChild(s);
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    if (value === 'accepted') loadGtm();
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.hidden = true;
  }

  const saved = (function () {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  })();

  if (saved === 'accepted') {
    loadGtm();
    return;
  }
  if (saved === 'declined') return;

  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Préférences cookies');
  banner.innerHTML = `
    <div class="cookie-banner__inner container">
      <p class="cookie-banner__text">
        Ce site utilise des cookies analytiques pour mesurer l’audience.
        <a href="confidentialite.html" class="text-link">En savoir plus</a>
      </p>
      <div class="cookie-banner__actions">
        <button type="button" class="btn btn-outline cookie-banner__btn" data-cookie="declined">Refuser</button>
        <button type="button" class="btn btn-primary cookie-banner__btn" data-cookie="accepted">Accepter</button>
      </div>
    </div>`;

  document.body.appendChild(banner);
  banner.querySelectorAll('[data-cookie]').forEach((btn) => {
    btn.addEventListener('click', () => setConsent(btn.getAttribute('data-cookie')));
  });
})();
