/**
 * Ordre DOM : sticky CTA avant layout.js (defer) pour que layout.js initialise la barre.
 */
const NO_STICKY = new Set([
  'merci.html',
  'confidentialite.html',
  'mentions-legales.html',
  'en/thank-you.html',
]);

const stickyCta = `  <aside class="sticky-cta" aria-label="Appeler ou demander un devis">
  <a href="tel:+41797792159" class="sticky-cta__btn sticky-cta__btn--call track-phone" aria-label="Appeler">Appeler</a>
  <a href="/contact.html" class="sticky-cta__btn sticky-cta__btn--devis track-devis" aria-label="Demander un devis">Demander un devis</a>
</aside>`;

const stickyCtaContact = `  <aside class="sticky-cta sticky-cta--call-only" aria-label="Appeler">
  <a href="tel:+41797792159" class="sticky-cta__btn sticky-cta__btn--call track-phone" aria-label="Appeler">Appeler</a>
</aside>`;

const stickyCtaCutSew = `  <aside class="sticky-cta" aria-label="Appeler ou demander un devis">
  <a href="tel:+41797792159" class="sticky-cta__btn sticky-cta__btn--call track-phone" aria-label="Appeler">Appeler</a>
  <a href="#cotation" class="sticky-cta__btn sticky-cta__btn--devis track-devis" aria-label="Demander un devis">Demander un devis</a>
</aside>`;

function layoutSrc(file) {
  return file === 'confection-sur-mesure.html' || file.startsWith('en/') ? '/assets/js/layout.js' : 'assets/js/layout.js';
}

function stickyBlockFor(file) {
  if (NO_STICKY.has(file)) return '';
  if (file === 'contact.html') return `${stickyCtaContact}\n`;
  if (file === 'confection-sur-mesure.html') return `${stickyCtaCutSew}\n`;
  if (file.startsWith('en/')) return '';
  return `${stickyCta}\n`;
}

function normalizeStickyAndLayout(html, file) {
  const stickyBlock = stickyBlockFor(file);
  const layoutTag = `  <script src="${layoutSrc(file)}" defer></script>\n`;

  const stickyAsideRe = /<aside\b[^>]*\bclass="[^"]*\bsticky-cta\b[^"]*"[\s\S]*?<\/aside>\s*/gi;
  html = html.replace(stickyAsideRe, '');
  html = html.replace(/<script src="(?:\/)?assets\/js\/layout\.js"[^>]*>\s*<\/script>\s*/gi, '');

  const footerIdx = html.lastIndexOf('</footer>');
  const insertAt = footerIdx !== -1 ? footerIdx + '</footer>'.length : html.lastIndexOf('</body>');
  if (insertAt < 0) return html;

  const injection = `\n\n${stickyBlock}${layoutTag}`;
  return html.slice(0, insertAt) + injection + html.slice(insertAt);
}

module.exports = {
  NO_STICKY,
  normalizeStickyAndLayout,
};
