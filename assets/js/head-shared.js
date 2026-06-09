/**
 * Balises communes : favicon, Open Graph, Twitter Card
 * Définir window.ALPE_PAGE_META avant ce script sur chaque page.
 */
(function () {
  const cfg = window.ALPE_CONFIG || {};
  const meta = window.ALPE_PAGE_META || {};
  const siteUrl = (cfg.siteUrl || 'https://www.alpeworkwear.com').replace(/\/$/, '');
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const pageUrl = meta.url || siteUrl + (path === '/' ? '/' : path);
  const title = meta.title || document.title;
  const description =
    meta.description ||
    document.querySelector('meta[name="description"]')?.getAttribute('content') ||
    '';
  const image = meta.image || siteUrl + '/assets/logo.png';

  function setMeta(attr, key, value) {
    if (!value) return;
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  }

  function setLink(rel, href, extra) {
    if (!href) return;
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
    if (extra) Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v));
  }

  setLink('icon', siteUrl + '/assets/logo.png', { type: 'image/png' });
  setLink('apple-touch-icon', siteUrl + '/assets/logo.png');

  setMeta('property', 'og:type', meta.type || 'website');
  setMeta('property', 'og:site_name', cfg.brand || 'Alpë Workwear');
  setMeta('property', 'og:locale', 'fr_CH');
  setMeta('property', 'og:url', pageUrl);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:image', image);

  setMeta('name', 'twitter:card', 'summary');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', image);
})();
