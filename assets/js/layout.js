(function () {
  const cfg = window.ALPE_CONFIG || {
    brand: 'Alpë Workwear',
    legalName: 'Alpë Workwear Sàrl',
  };

  const page = window.location.pathname.split('/').pop() || 'index.html';

  const navItems = [
    { href: 'index.html', label: 'Accueil', file: 'index.html' },
    { href: 'catalogue.html', label: 'Catalogue', file: 'catalogue.html' },
    { href: 'confection.html', label: 'Confection', file: 'confection.html' },
    { href: 'faq.html', label: 'FAQ', file: 'faq.html' },
    { href: 'contact.html', label: 'Demander un devis', file: 'contact.html', cta: true },
  ];

  function brandMark(light) {
    const cls = light ? ' brand-mark--light' : '';
    return `<span class="brand-mark${cls}"><span class="brand-mark__name">ALPË</span><span class="brand-mark__sub">Workwear</span></span>`;
  }

  const navHtml = navItems
    .map((item) => {
      const current = page === item.file || (page === '' && item.file === 'index.html');
      const cls = item.cta ? 'nav-cta' : '';
      return `<li><a href="${item.href}" class="${cls}" ${current ? 'aria-current="page"' : ''}>${item.label}</a></li>`;
    })
    .join('');

  const header = document.getElementById('site-header');
  if (header) {
    header.className = 'site-header';
    header.innerHTML = `
      <div class="container site-header__inner">
        <a href="index.html" class="site-logo" aria-label="${cfg.brand} — accueil">
          ${brandMark(false)}
        </a>
        <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Ouvrir le menu">Menu</button>
      </div>
      <ul class="site-nav" id="site-nav">${navHtml}</ul>`;

    const toggle = header.querySelector('.nav-toggle');
    const nav = header.querySelector('.site-nav');

    function setNavOpen(open) {
      const isOpen = Boolean(open);
      nav.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
      document.body.classList.toggle('is-nav-open', isOpen);
    }

    toggle?.addEventListener('click', () => {
      setNavOpen(!nav.classList.contains('is-open'));
    });

    nav?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setNavOpen(false));
    });

    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('is-open')) return;
      if (header.contains(e.target)) return;
      setNavOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setNavOpen(false);
        toggle?.focus();
      }
    });
  }

  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="container site-footer__grid">
        <div>
          <a href="index.html" class="site-footer__brand" aria-label="${cfg.brand} — accueil">
            ${brandMark(true)}
          </a>
          <p class="site-footer__tagline">Personnalisation · Broderie · Marquage professionnel · Livraison Suisse</p>
          <ul class="site-footer__links">
            <li><a href="catalogue.html">Catalogue</a></li>
            <li><a href="confection.html">Confection</a></li>
            <li><a href="faq.html">FAQ</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="confidentialite.html">Confidentialité</a></li>
            <li><a href="mentions-legales.html">Mentions légales</a></li>
          </ul>
        </div>
        <div class="site-footer__copy">
          © ${new Date().getFullYear()} ${cfg.legalName}<br>
          <span style="opacity:0.7;">Design Suisse · Production européenne</span>
        </div>
      </div>`;
  }

  if (cfg.gtmId && !document.getElementById('gtm-noscript')) {
  }
})();
