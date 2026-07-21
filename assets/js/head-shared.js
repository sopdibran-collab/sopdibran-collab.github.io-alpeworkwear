/**
 * Balises communes : favicon, Open Graph, Twitter Card (fallback si absent du HTML statique).
 */
(function () {
  if (document.querySelector('meta[property="og:title"]')) return;

  const cfg = window.ALPE_CONFIG || {};
  const meta = window.ALPE_PAGE_META || {};
  const siteUrl = (cfg.siteUrl || 'https://www.alpeworkwear.ch').replace(/\/$/, '');
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const pageUrl = meta.url || siteUrl + (path === '/' ? '/' : path);
  const title = meta.title || document.title;
  const description =
    meta.description ||
    document.querySelector('meta[name="description"]')?.getAttribute('content') ||
    '';
  const image = meta.image || siteUrl + '/assets/brand/og-default.jpg';

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

  setLink('icon', siteUrl + '/assets/brand/logo-favicon-32.png', { type: 'image/png', sizes: '32x32' });
  setLink('apple-touch-icon', siteUrl + '/assets/brand/logo-apple-touch-180.png', { sizes: '180x180' });

  setMeta('property', 'og:type', meta.type || 'website');
  setMeta('property', 'og:site_name', cfg.brand || 'Alpë Workwear');
  setMeta('property', 'og:locale', 'fr_CH');
  setMeta('property', 'og:url', pageUrl);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:image', image);
  setMeta('property', 'og:image:width', '1200');
  setMeta('property', 'og:image:height', '630');
  setMeta('property', 'og:image:type', 'image/jpeg');
  setMeta(
    'property',
    'og:image:alt',
    meta.imageAlt ||
      'Alpë Workwear — vêtements de travail personnalisés B2B, broderie et livraison Suisse'
  );

  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', image);
})();
