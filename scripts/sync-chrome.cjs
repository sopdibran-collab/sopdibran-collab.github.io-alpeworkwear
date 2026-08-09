#!/usr/bin/env node
/**
 * Synchronise header / footer / sticky CTA / scripts chrome
 * sur le schéma de la page d'accueil (réf. unification sopjanitech.ch).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pages = [
  'index.html',
  'catalogue.html',
  'contact.html',
  'confection.html',
  'faq.html',
  'realisations.html',
  'merci.html',
  'confidentialite.html',
  'mentions-legales.html',
  'workwear-geneve.html',
  'workwear-lausanne.html',
  'workwear-zurich.html',
  'workwear-berne.html',
  'workwear-bale.html',
];

const header = `  <header id="site-header" class="site-header" aria-label="Navigation principale">
    <div class="container site-header__inner">
      <a href="/" class="site-logo" aria-label="Alpë Workwear — accueil">
        <img class="site-logo__img" src="/assets/brand/logo-responsive.svg" width="168" height="50" alt="" decoding="async">
        <span class="visually-hidden">Alpë Workwear</span>
      </a>
      <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="site-nav"
        data-i18n-aria-label="nav.menu" aria-label="Ouvrir le menu">Menu</button>
    </div>
    <ul class="site-nav" id="site-nav">
      <li><a href="/catalogue.html" data-i18n="nav.collections">Collections</a></li>
      <li><a href="/confection.html" data-i18n="nav.confection">Confection</a></li>
      <li><a href="/realisations.html" data-i18n="nav.realisations">Réalisations</a></li>
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

const footer = `  <footer id="site-footer" class="site-footer" role="contentinfo">
    <div class="container site-footer__inner">
      <div class="site-footer__top">
        <a href="/" class="site-footer__brand" aria-label="Alpë Workwear — accueil">
          <img class="site-logo__img site-logo__img--on-dark" src="/assets/brand/logo-responsive.svg" width="120" height="36" alt="" decoding="async">
          <span class="visually-hidden">Alpë Workwear</span>
        </a>
        <p class="site-footer__tagline">Workwear B2B · Broderie · Sérigraphie · Livraison Suisse</p>
      </div>
      <div class="site-footer__rows">
        <div class="site-footer__row">
          <p class="site-footer__label">Navigation</p>
          <ul class="site-footer__chips">
            <li><a href="/catalogue.html">Collections</a></li>
            <li><a href="/confection.html">Confection</a></li>
            <li><a href="/realisations.html">Réalisations</a></li>
            <li><a href="/faq.html">Expertises</a></li>
            <li><a href="/contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="site-footer__row">
          <p class="site-footer__label">Régions</p>
          <ul class="site-footer__chips">
            <li><a href="/workwear-geneve.html">Genève</a></li>
            <li><a href="/workwear-lausanne.html">Lausanne</a></li>
            <li><a href="/workwear-zurich.html">Zurich</a></li>
          </ul>
        </div>
        <div class="site-footer__row site-footer__row--contact">
          <p class="site-footer__label">Contact</p>
          <ul class="site-footer__contact">
            <li><a href="mailto:info@alpeworkwear.ch">info@alpeworkwear.ch</a></li>
            <li><a href="tel:+41797792159">+41 79 779 21 59</a></li>
            <li><a href="https://www.instagram.com/alpeworkwear/" target="_blank" rel="noopener noreferrer">@alpeworkwear</a></li>
          </ul>
        </div>
      </div>
      <div class="site-footer__bottom">
        <p class="site-footer__copy">© 2026 Alpë Workwear <span class="site-footer__copy-sub">· Coordination suisse · Craft certifié</span></p>
        <nav class="site-footer__legal" aria-label="Informations légales">
          <a href="/confidentialite.html">Confidentialité</a>
          <a href="/mentions-legales.html">Mentions légales</a>
        </nav>
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
