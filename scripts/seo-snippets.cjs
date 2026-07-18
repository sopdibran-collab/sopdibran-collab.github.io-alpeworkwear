/**
 * Fragments HTML statiques pour le build SEO (nav, footer, catalogue, JSON-LD, OG).
 */
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://www.alpeworkwear.ch';
const BRAND = 'Alpë Workwear';
const INSTAGRAM_URL = 'https://www.instagram.com/alpeworkwear/';
const INSTAGRAM_HANDLE = '@alpeworkwear';

const NAV_ITEMS = [
  { href: '/', label: 'Accueil', file: 'index.html' },
  { href: '/catalogue.html', label: 'Catalogue', file: 'catalogue.html' },
  { href: '/confection.html', label: 'Confection', file: 'confection.html' },
  { href: '/faq.html', label: 'FAQ', file: 'faq.html' },
  { href: '/contact.html', label: 'Demander un devis', file: 'contact.html', cta: true },
];

const LEGAL_PAGES = new Set(['confidentialite.html', 'mentions-legales.html']);
const NO_STICKY_CTA = new Set(['contact.html', 'merci.html', 'confidentialite.html', 'mentions-legales.html']);

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

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function brandMark(light) {
  const cls = light ? ' brand-mark--light' : '';
  return `<span class="brand-mark${cls}"><span class="brand-mark__name">ALPË</span><span class="brand-mark__sub">Workwear</span></span>`;
}

function renderHeader(currentFile) {
  const navHtml = NAV_ITEMS.map((item) => {
    const current =
      currentFile === item.file || (currentFile === 'index.html' && item.file === 'index.html');
    const cls = item.cta ? 'nav-cta' : '';
    const aria = current ? ' aria-current="page"' : '';
    return `<li><a href="${item.href}" class="${cls}"${aria}>${item.label}</a></li>`;
  }).join('\n          ');

  return `<header id="site-header" class="site-header" aria-label="Navigation principale">
    <div class="container site-header__inner">
      <a href="/" class="site-logo" aria-label="${BRAND} — accueil">
        ${brandMark(false)}
      </a>
      <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Ouvrir le menu">Menu</button>
    </div>
    <ul class="site-nav" id="site-nav">
          ${navHtml}
    </ul>
  </header>`;
}

function renderInstagramBand() {
  return `<section class="instagram-band" aria-labelledby="instagram-follow-title">
  <div class="container instagram-band__inner">
    <div class="instagram-band__icon" aria-hidden="true">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="4.25" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
      </svg>
    </div>
    <div class="instagram-band__content">
      <p class="eyebrow">Instagram</p>
      <h2 id="instagram-follow-title">Suivez notre atelier sur Instagram</h2>
      <p class="instagram-band__lead">
        Broderies, sérigraphies et réalisations en coulisses — abonnez-vous pour découvrir nos projets workwear.
      </p>
    </div>
    <a href="${INSTAGRAM_URL}" class="btn btn-secondary instagram-band__cta"
      target="_blank" rel="noopener noreferrer">
      S’abonner · ${INSTAGRAM_HANDLE}
    </a>
  </div>
</section>`;
}

function renderFooter() {
  const year = new Date().getFullYear();
  return `<footer id="site-footer" class="site-footer">
  <div class="container site-footer__grid">
    <div>
      <a href="/" class="site-footer__brand" aria-label="${BRAND} — accueil">
        ${brandMark(true)}
      </a>
      <p class="site-footer__tagline">Workwear B2B · Broderie · Sérigraphie · Livraison Suisse</p>
      <ul class="site-footer__links">
        <li><a href="/catalogue.html">Catalogue</a></li>
        <li><a href="/confection.html">Confection</a></li>
        <li><a href="/faq.html">FAQ</a></li>
        <li><a href="/contact.html">Contact</a></li>
        <li><a href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer">Instagram</a></li>
        <li><a href="/confidentialite.html">Confidentialité</a></li>
        <li><a href="/mentions-legales.html">Mentions légales</a></li>
      </ul>
    </div>
    <div class="site-footer__copy">
      © ${year} ${BRAND}<br>
      <span style="opacity:0.7;">Design Suisse · Atelier Kosovo · Coordination CH</span>
    </div>
  </div>
</footer>`;
}

function renderStickyCta() {
  return `<aside class="sticky-cta" aria-label="Demande de devis">
  <a href="/contact.html" class="sticky-cta__btn">Demander un devis gratuit</a>
</aside>`;
}

function renderProductCard(product, categories) {
  const cat = categories.find((c) => c.id === product.category);
  const descText = product.description || (cat ? cat.description : '');
  const tag = product.tag ? `<p class="product-card__tag">${escapeHtml(product.tag)}</p>` : '';
  const ref = product.reference
    ? `<dl class="product-card__meta"><dt>Réf. </dt><dd>${escapeHtml(product.reference)}</dd></dl>`
    : '';
  const descBlock = descText ? `<p class="product-card__desc">${escapeHtml(descText)}</p>` : '';
  const categoryLabel = cat ? `<p class="product-card__category">${escapeHtml(cat.name)}</p>` : '';
  const media = product.image
    ? `<img src="${escapeAttr(product.image)}" alt="${escapeAttr(product.imageAlt || product.name)}" loading="lazy" width="400" height="400">`
    : `<div class="product-card__placeholder" role="img" aria-label="Photo à venir">Photo à venir</div>`;

  return `          <article class="product-card" data-category="${escapeAttr(product.category)}" id="produit-${escapeAttr(product.id)}">
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

function renderCatalogueFilters(categories, activeFilter) {
  const allPressed = !activeFilter || activeFilter === 'all' ? 'true' : 'false';
  const allCurrent = allPressed === 'true' ? ' aria-current="true"' : '';
  let html = `          <a href="/catalogue.html" class="filter-btn" data-filter="all" aria-pressed="${allPressed}"${allCurrent}>Toutes les gammes</a>\n`;
  categories.forEach((cat) => {
    const pressed = activeFilter === cat.id ? 'true' : 'false';
    const current = pressed === 'true' ? ' aria-current="true"' : '';
    html += `          <a href="/catalogue.html?categorie=${escapeAttr(cat.id)}" class="filter-btn" data-filter="${escapeAttr(cat.id)}" aria-pressed="${pressed}"${current}>${escapeHtml(cat.name)}</a>\n`;
  });
  return html.trimEnd();
}

function parsePageMeta(html) {
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  const urlMatch = html.match(/url:\s*'([^']*)'/);
  const imageAltMatch = html.match(/imageAlt:\s*'([^']*)'/);
  return {
    title: titleMatch ? titleMatch[1].replace(/&amp;/g, '&') : BRAND,
    description: descMatch ? descMatch[1] : '',
    url: urlMatch ? urlMatch[1] : SITE_URL,
    imageAlt: imageAltMatch ? imageAltMatch[1] : BRAND,
  };
}

function parseBreadcrumbs(html) {
  const match = html.match(/window\.ALPE_BREADCRUMBS\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) return null;
  try {
    return JSON.parse(match[1].replace(/'/g, '"'));
  } catch {
    return null;
  }
}

function renderOgTags(meta) {
  const image = `${SITE_URL}/assets/logo.png`;
  return `  <link rel="icon" href="${SITE_URL}/assets/logo.png" type="image/png">
  <link rel="apple-touch-icon" href="${SITE_URL}/assets/logo.png">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${BRAND}">
  <meta property="og:locale" content="fr_CH">
  <meta property="og:url" content="${escapeAttr(meta.url)}">
  <meta property="og:title" content="${escapeAttr(meta.title)}">
  <meta property="og:description" content="${escapeAttr(meta.description)}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:alt" content="${escapeAttr(meta.imageAlt)}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeAttr(meta.title)}">
  <meta name="twitter:description" content="${escapeAttr(meta.description)}">
  <meta name="twitter:image" content="${image}">`;
}

function renderOrgSchema() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'LocalBusiness'],
        '@id': `${SITE_URL}/#organization`,
        name: BRAND,
        legalName: BRAND,
        url: SITE_URL,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/logo.png` },
        image: `${SITE_URL}/assets/logo.png`,
        email: 'info@alpeworkwear.ch',
        telephone: '+41797792151',
        description:
          'Fournisseur B2B de vêtements de travail personnalisés pour entreprises en Suisse : broderie, sérigraphie, catalogue professionnel et livraison nationale.',
        priceRange: '$$',
        areaServed: [
          { '@type': 'Country', name: 'Suisse' },
          { '@type': 'City', name: 'Genève', containedInPlace: { '@type': 'Country', name: 'Suisse' } },
          { '@type': 'City', name: 'Lausanne', containedInPlace: { '@type': 'Country', name: 'Suisse' } },
          { '@type': 'City', name: 'Zurich', containedInPlace: { '@type': 'Country', name: 'Suisse' } },
        ],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Prishtina',
          addressCountry: 'XK',
        },
        sameAs: [INSTAGRAM_URL],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: BRAND,
        url: SITE_URL,
        inLanguage: 'fr-CH',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  };
  return `  <script type="application/ld+json" id="alpe-schema-org">\n${JSON.stringify(graph, null, 2).split('\n').join('\n')}\n  </script>`;
}

function renderBreadcrumbSchema(crumbs) {
  if (!crumbs || !crumbs.length) return '';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return `  <script type="application/ld+json" id="alpe-schema-breadcrumb">\n${JSON.stringify(data, null, 2)}\n  </script>`;
}

function extractFaqSchema(html) {
  const mainEntity = [];
  const re =
    /<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p[^>]*class="faq-answer"[^>]*>([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    mainEntity.push({
      '@type': 'Question',
      name: stripHtml(m[1]),
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripHtml(m[2]),
      },
    });
  }
  if (!mainEntity.length) return '';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };
  return `  <script type="application/ld+json" id="alpe-schema-faq">\n${JSON.stringify(data, null, 2)}\n  </script>`;
}

function renderItemListSchema(products, categories) {
  const itemListElement = products.map((p, i) => {
    const cat = categories.find((c) => c.id === p.category);
    return {
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        description: p.description || (cat ? cat.description : undefined),
        image: p.image ? `${SITE_URL}/${p.image.replace(/^\//, '')}` : undefined,
        category: cat ? cat.name : undefined,
        brand: { '@type': 'Brand', name: BRAND },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'CHF',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/contact.html`,
          description: 'Devis sur demande',
        },
      },
    };
  });
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Catalogue vêtements de travail Alpë Workwear',
    itemListElement,
  };
  return `  <script type="application/ld+json" id="alpe-schema-itemlist">\n${JSON.stringify(data, null, 2)}\n  </script>`;
}

function loadProducts(root) {
  const raw = fs.readFileSync(path.join(root, 'data/products.json'), 'utf8');
  const data = JSON.parse(raw);
  return {
    categories: data.categories || [],
    products: (data.products || []).filter((p) => p.published !== false),
  };
}

module.exports = {
  SITE_URL,
  BRAND,
  NAV_ITEMS,
  LEGAL_PAGES,
  NO_STICKY_CTA,
  escapeHtml,
  renderHeader,
  renderInstagramBand,
  renderFooter,
  renderStickyCta,
  renderProductCard,
  renderCatalogueFilters,
  parsePageMeta,
  parseBreadcrumbs,
  renderOgTags,
  renderOrgSchema,
  renderBreadcrumbSchema,
  extractFaqSchema,
  renderItemListSchema,
  loadProducts,
};
