(function () {
  const cfg = window.ALPE_CONFIG || {
    brand: 'Alpë Workwear',
    legalName: 'Alpë Workwear',
  };

  const page = window.location.pathname.split('/').pop() || 'index.html';

  function setNavOpen(nav, toggle, open) {
    const isOpen = Boolean(open);
    nav.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.classList.toggle('is-nav-open', isOpen);
  }

  function bindMobileNav(header) {
    const toggle = header.querySelector('.nav-toggle');
    const nav = header.querySelector('.site-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      setNavOpen(nav, toggle, !nav.classList.contains('is-open'));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setNavOpen(nav, toggle, false));
    });

    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('is-open')) return;
      if (header.contains(e.target)) return;
      setNavOpen(nav, toggle, false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setNavOpen(nav, toggle, false);
        toggle.focus();
      }
    });
  }

  function setActiveNav(nav) {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    const file = path.split('/').pop() || 'index.html';
    const routeMap = {
      'index.html': null,
      '': null,
      'catalogue.html': '/catalogue.html',
      'confection.html': '/confection.html',
      'faq.html': '/faq.html',
      'contact.html': '/contact.html',
      'confidentialite.html': '/confidentialite.html',
      'mentions-legales.html': '/mentions-legales.html',
      'merci.html': '/contact.html',
    };
    const current = routeMap[file] ?? null;
    nav.querySelectorAll('a').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto')) return;
      const isCurrent = current && href === current;
      if (isCurrent) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  const header = document.getElementById('site-header');
  if (header) {
    const nav = header.querySelector('.site-nav');
    if (nav) {
      setActiveNav(nav);
      bindMobileNav(header);
    }
  }

  const stickyCta = document.querySelector('.sticky-cta');
  if (stickyCta && page !== 'contact.html' && page !== 'merci.html') {
    const main = document.getElementById('main');
    if (main) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          stickyCta.classList.toggle('is-visible', !entry.isIntersecting);
        },
        { rootMargin: '0px 0px -40% 0px', threshold: 0 }
      );
      const hero = main.querySelector('.home-hero, .home-hero-v3, .page-hero, .cta-band');
      if (hero) observer.observe(hero);
      else stickyCta.classList.add('is-visible');
    }
  }
})();
