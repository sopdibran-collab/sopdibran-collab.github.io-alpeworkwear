#!/usr/bin/env node
/**
 * Synchronise header / footer / sticky CTA / scripts chrome
 * sur le schéma de la page d'accueil (réf. unification sopjanitech.ch).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pages = [
  'catalogue.html',
  'contact.html',
  'confection.html',
  'faq.html',
  'merci.html',
  'confidentialite.html',
  'mentions-legales.html',
];

const header = `  <header id="site-header" class="site-header" aria-label="Navigation principale">
    <div class="container site-header__inner">
      <a href="/" class="site-logo" aria-label="Alpë Workwear — accueil">
        <span class="brand-mark">
          <span class="brand-mark__name">ALP<span class="brand-mark__e">Ë</span></span>
          <span class="brand-mark__sub">Workwear</span>
          <span class="site-header__tagline" data-i18n="header.tagline">Suisse B2B Personnalisation</span>
        </span>
      </a>
      <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="site-nav"
        data-i18n-aria-label="nav.menu" aria-label="Ouvrir le menu">Menu</button>
    </div>
    <ul class="site-nav" id="site-nav">
      <li><a href="/catalogue.html" data-i18n="nav.collections">Collections</a></li>
      <li><a href="/confection.html" data-i18n="nav.confection">Confection</a></li>
      <li><a href="/faq.html" data-i18n="nav.expertises">Expertises</a></li>
      <li><a href="/contact.html" class="nav-cta" data-i18n="nav.contact">Contact</a></li>
      <li class="lang-switch" role="group" data-i18n-aria-label="lang.label" aria-label="Langue">
        <button type="button" class="lang-switch__item" data-lang="de" lang="de" aria-pressed="false">DE</button>
        <button type="button" class="lang-switch__item lang-switch__item--active" data-lang="fr" lang="fr" aria-pressed="true" aria-current="true">FR</button>
        <button type="button" class="lang-switch__item" data-lang="it" lang="it" aria-pressed="false">IT</button>
        <button type="button" class="lang-switch__item" data-lang="en" lang="en" aria-pressed="false">EN</button>
      </li>
    </ul>
  </header>`;

const footer = `  <footer id="site-footer" class="site-footer">
    <div class="container site-footer__grid">
      <div>
        <a href="/" class="site-footer__brand" aria-label="Alpë Workwear — accueil">
          <span class="brand-mark brand-mark--light">
            <span class="brand-mark__name">ALP<span class="brand-mark__e">Ë</span></span>
            <span class="brand-mark__sub">Workwear</span>
          </span>
        </a>
        <p class="site-footer__tagline">Workwear B2B · Broderie · Sérigraphie · Livraison Suisse</p>
        <ul class="site-footer__links">
          <li><a href="/catalogue.html">Collections</a></li>
          <li><a href="/confection.html">Confection</a></li>
          <li><a href="/faq.html">Expertises</a></li>
          <li><a href="/contact.html">Contact</a></li>
          <li><a href="/confidentialite.html">Confidentialité</a></li>
          <li><a href="/mentions-legales.html">Mentions légales</a></li>
        </ul>
      </div>
      <div class="site-footer__aside">
        <p class="site-footer__contact-line"><a href="mailto:info@alpeworkwear.ch">info@alpeworkwear.ch</a></p>
        <p class="site-footer__contact-line"><a href="tel:+41797792151">+41 79 779 21 51</a></p>
        <p class="site-footer__contact-line"><a href="https://www.instagram.com/alpeworkwear/" target="_blank" rel="noopener noreferrer">Instagram · @alpeworkwear</a></p>
      </div>
      <div class="site-footer__copy">
        © 2026 Alpë Workwear<br>
        <span class="site-footer__copy-sub">Coordination suisse · Craft certifié</span>
      </div>
    </div>
  </footer>`;

const stickyCta = `  <aside class="sticky-cta" aria-label="Demande de devis">
  <a href="/contact.html" class="sticky-cta__btn">Demander un devis gratuit</a>
</aside>`;

const headerRe = /<header id="site-header"[\s\S]*?<\/header>/;
const footerRe = /<footer id="site-footer"[\s\S]*?<\/footer>/;
const stickyRe = /<aside class="sticky-cta"[\s\S]*?<\/aside>/;

function ensureScript(html, src) {
  if (html.includes(`src="${src}"`) || html.includes(`src='${src}'`)) return html;
  if (html.includes('</body>')) {
    return html.replace('</body>', `  <script src="${src}"></script>\n</body>`);
  }
  return html;
}

function ensureSticky(html, file) {
  const noSticky = new Set([
    'contact.html',
    'merci.html',
    'confidentialite.html',
    'mentions-legales.html',
  ]);
  if (noSticky.has(file)) {
    return html.replace(stickyRe, '');
  }
  if (stickyRe.test(html)) {
    return html.replace(stickyRe, stickyCta);
  }
  return html.replace('</body>', `${stickyCta}\n</body>`);
}

for (const file of pages) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');
  if (!headerRe.test(html) || !footerRe.test(html)) {
    console.error('Skip (pattern):', file);
    continue;
  }
  html = html.replace(headerRe, header).replace(footerRe, footer);
  html = ensureSticky(html, file);
  html = ensureScript(html, 'assets/js/lang-switch.js');
  fs.writeFileSync(filePath, html);
  console.log('Updated', file);
}
