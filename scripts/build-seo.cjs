#!/usr/bin/env node
/**
 * Pré-rendu SEO : nav, footer, catalogue, OG tags, JSON-LD statiques.
 * Usage : node scripts/build-seo.js
 */
const fs = require('fs');
const path = require('path');
const {
  LEGAL_PAGES,
  NO_STICKY_CTA,
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
} = require('./seo-snippets.cjs');

const ROOT = path.resolve(__dirname, '..');
const HOME_PAGES = new Set(['index.html']);

const HTML_PAGES = [
  'index.html',
  'catalogue.html',
  'confection.html',
  'faq.html',
  'contact.html',
  'confidentialite.html',
  'mentions-legales.html',
  'merci.html',
];

function replaceBlock(html, pattern, replacement) {
  if (!pattern.test(html)) return { html, changed: false };
  return { html: html.replace(pattern, replacement), changed: true };
}

function removeBlock(html, pattern) {
  return html.replace(pattern, '');
}

function injectBeforeCloseHead(html, block, markerId) {
  const marker = `id="${markerId}"`;
  if (html.includes(marker)) {
    return html.replace(
      new RegExp(`<script type="application/ld\\+json" id="${markerId}"[^>]*>[\\s\\S]*?<\\/script>\\s*`, 'i'),
      block + '\n'
    );
  }
  return html.replace('</head>', `${block}\n</head>`);
}

function processPage(filename) {
  const filePath = path.join(ROOT, filename);
  let html = fs.readFileSync(filePath, 'utf8');
  const meta = parsePageMeta(html);
  const crumbs = parseBreadcrumbs(html);

  if (!HOME_PAGES.has(filename)) {
    html = replaceBlock(
      html,
      /<header id="site-header"[\s\S]*?<\/header>/i,
      renderHeader(filename)
    ).html;

    if (!LEGAL_PAGES.has(filename) && !html.includes('class="instagram-band"')) {
      html = html.replace(/<footer id="site-footer"/i, `${renderInstagramBand()}\n\n  <footer id="site-footer"`);
    }

    html = replaceBlock(
      html,
      /<footer id="site-footer"[\s\S]*?<\/footer>/i,
      renderFooter()
    ).html;
  }

  if (!NO_STICKY_CTA.has(filename)) {
    html = removeBlock(html, /\s*<aside class="sticky-cta"[\s\S]*?<\/aside>\s*/i);
    html = html.replace('</body>', `  ${renderStickyCta()}\n</body>`);
  }

  html = removeBlock(html, /\s*<link rel="icon"[\s\S]*?<meta name="twitter:image"[^>]*>\s*/i);
  html = html.replace(
    /<meta name="robots" content="[^"]*">/i,
    (match) => `${match}\n${renderOgTags(meta)}`
  );

  html = removeBlock(html, /\s*<script type="application\/ld\+json" id="alpe-schema-org">[\s\S]*?<\/script>\s*/i);
  html = removeBlock(
    html,
    /\s*<script type="application\/ld\+json" id="alpe-schema-breadcrumb">[\s\S]*?<\/script>\s*/i
  );
  html = removeBlock(html, /\s*<script type="application\/ld\+json" id="alpe-schema-faq">[\s\S]*?<\/script>\s*/i);
  html = removeBlock(
    html,
    /\s*<script type="application\/ld\+json" id="alpe-schema-itemlist">[\s\S]*?<\/script>\s*/i
  );

  let schemaBlock = renderOrgSchema();
  const breadcrumb = renderBreadcrumbSchema(crumbs);
  if (breadcrumb) schemaBlock += '\n' + breadcrumb;
  if (filename === 'faq.html') schemaBlock += '\n' + extractFaqSchema(html);

  html = injectBeforeCloseHead(html, schemaBlock, 'alpe-schema-org');

  if (filename === 'catalogue.html') {
    const { categories, products } = loadProducts(ROOT);
    const gridHtml = products.map((p) => renderProductCard(p, categories)).join('\n');
    html = html.replace(
      /<div class="catalogue-grid" id="catalogue-grid">[\s\S]*?<\/div>(\s*<p class="catalogue-note")/i,
      `<div class="catalogue-grid" id="catalogue-grid">\n${gridHtml}\n        </div>$1`
    );
    html = html.replace(
      /<div class="catalogue-toolbar" id="catalogue-filters"[^>]*>[\s\S]*?<\/div>/i,
      `<div class="catalogue-toolbar" id="catalogue-filters" role="toolbar" aria-label="Filtrer par gamme">\n${renderCatalogueFilters(categories)}\n        </div>`
    );
    const itemList = renderItemListSchema(products, categories);
    html = injectBeforeCloseHead(html, itemList, 'alpe-schema-itemlist');
  }

  if (filename === 'confidentialite.html' && !html.includes('Retour à l’accueil')) {
    html = html.replace(
      /(<h2>Hébergement<\/h2>\s*<p>[\s\S]*?<\/p>)\s*(<\/div>\s*<\/section>)/i,
      `$1\n        <p style="margin-top:2rem;"><a href="/" class="text-link">Retour à l’accueil</a> · <a href="/contact.html" class="text-link">Contact</a></p>\n      $2`
    );
  }

  if (filename === 'mentions-legales.html' && !html.includes('class="text-link">Accueil</a>')) {
    html = html.replace(
      /(<p style="margin-top:2rem;"><a href="\/confidentialite.html")/,
      `<p style="margin-top:2rem;"><a href="/" class="text-link">Accueil</a> · <a href="/contact.html" class="text-link">Contact</a> · <a href="/confidentialite.html"`
    );
  }

  html = html.replace(/href="index\.html"/g, 'href="/"');
  html = html.replace(/href="catalogue\.html/g, 'href="/catalogue.html');
  html = html.replace(/href="confection\.html/g, 'href="/confection.html');
  html = html.replace(/href="faq\.html/g, 'href="/faq.html');
  html = html.replace(/href="contact\.html/g, 'href="/contact.html');
  html = html.replace(/href="confidentialite\.html/g, 'href="/confidentialite.html');
  html = html.replace(/href="mentions-legales\.html/g, 'href="/mentions-legales.html');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✓ ${filename}`);
}

function main() {
  console.log('Build SEO — pré-rendu statique…');
  HTML_PAGES.forEach(processPage);
  console.log(`Terminé (${HTML_PAGES.length} pages).`);
}

main();
