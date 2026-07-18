#!/usr/bin/env node
/**
 * Synchronise header / footer sur les pages statiques.
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
          <span class="site-header__tagline">Suisse B2B Personnalisation</span>
        </span>
      </a>
      <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Ouvrir le menu">Menu</button>
    </div>
    <ul class="site-nav" id="site-nav">
      <li><a href="/catalogue.html">Collections</a></li>
      <li><a href="/confection.html">Confection</a></li>
      <li><a href="/faq.html">Expertises</a></li>
      <li><a href="/contact.html" class="nav-cta">Contact</a></li>
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

const headerRe = /<header id="site-header"[\s\S]*?<\/header>/;
const footerRe = /<footer id="site-footer"[\s\S]*?<\/footer>/;

for (const file of pages) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');
  if (!headerRe.test(html) || !footerRe.test(html)) {
    console.error('Skip (pattern):', file);
    continue;
  }
  html = html.replace(headerRe, header).replace(footerRe, footer);
  fs.writeFileSync(filePath, html);
  console.log('Updated', file);
}
