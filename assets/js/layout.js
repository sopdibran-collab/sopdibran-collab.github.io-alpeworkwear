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
        <a href="index.html" class="site-logo">
          <img src="assets/logo.png" alt="${cfg.brand} — vêtements de travail personnalisés pour entreprises" width="150" height="32">
        </a>
        <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
        <ul class="site-nav" id="site-nav">${navHtml}</ul>
      </div>`;

    const toggle = header.querySelector('.nav-toggle');
    const nav = header.querySelector('.site-nav');

    function setNavOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
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
          <div class="site-footer__brand">ALP<span>Ë</span> WORKWEAR</div>
          <p style="font-size:0.85rem;margin-top:0.5rem;color:rgba(255,255,255,0.5);">Sommets de qualité · Prix d'atelier · Prishtina & Suisse</p>
          <ul class="site-footer__links">
            <li><a href="catalogue.html">Catalogue</a></li>
            <li><a href="confection.html">Confection</a></li>
            <li><a href="faq.html">FAQ</a></li>
            <li><a href="contact.html">Contact</a></li>
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
