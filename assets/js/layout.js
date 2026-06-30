(function () {
  const cfg = window.ALPE_CONFIG || {
    brand: 'Alpë Workwear',
    legalName: 'Alpë Workwear',
  };

  const page = window.location.pathname.split('/').pop() || 'index.html';

  const navItems = [
    { href: 'index.html', label: 'Accueil', file: 'index.html' },
    { href: 'catalogue.html', label: 'Catalogue', file: 'catalogue.html' },
    { href: 'confection.html', label: 'Confection', file: 'confection.html' },
    { href: 'faq.html', label: 'FAQ', file: 'faq.html' },
    { href: 'contact.html', label: 'Demander un devis', file: 'contact.html', cta: true },
  ];

  function brandLogo(light) {
    const src = light
      ? cfg.logoFooter || 'assets/images/logo-blanc-acier.png'
      : cfg.logoHeader || 'assets/images/logo-bleu-acier.png';
    const cls = light ? 'brand-logo brand-logo--light' : 'brand-logo';
    return `<img src="${src}" alt="${cfg.brand}" class="${cls}" width="120" height="120" decoding="async">`;
  }

  function instagramBandHtml() {
    const url = cfg.instagram || 'https://www.instagram.com/alpeworkwear/';
    const handle = cfg.instagramHandle || '@alpeworkwear';
    return `
      <section class="instagram-band" aria-labelledby="instagram-follow-title">
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
          <a href="${url}" class="btn btn-primary instagram-band__cta"
            target="_blank" rel="noopener noreferrer">
            S’abonner · ${handle}
          </a>
        </div>
      </section>`;
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
          ${brandLogo(false)}
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
  const legalPages = ['confidentialite.html', 'mentions-legales.html'];
  if (footer && !legalPages.includes(page) && !document.querySelector('.instagram-band')) {
    footer.insertAdjacentHTML('beforebegin', instagramBandHtml());
  }

  if (footer) {
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="container site-footer__grid">
        <div>
          <a href="index.html" class="site-footer__brand" aria-label="${cfg.brand} — accueil">
            ${brandLogo(true)}
          </a>
          <p class="site-footer__tagline">Workwear B2B · Broderie · Sérigraphie · Livraison Suisse</p>
          <ul class="site-footer__links">
            <li><a href="catalogue.html">Catalogue</a></li>
            <li><a href="confection.html">Confection</a></li>
            <li><a href="faq.html">FAQ</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="${cfg.instagram || 'https://www.instagram.com/alpeworkwear/'}" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="confidentialite.html">Confidentialité</a></li>
            <li><a href="mentions-legales.html">Mentions légales</a></li>
          </ul>
        </div>
        <div class="site-footer__copy">
          © ${new Date().getFullYear()} ${cfg.legalName}<br>
          <span style="opacity:0.7;">Design Suisse · Atelier Kosovo · Coordination CH</span>
        </div>
      </div>`;
  }

  if (cfg.gtmId && !document.getElementById('gtm-noscript')) {
  }
})();
