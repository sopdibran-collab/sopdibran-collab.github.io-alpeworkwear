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

  const header = document.getElementById('site-header');
  if (header && header.querySelector('.site-nav')) {
    bindMobileNav(header);
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
      const hero = main.querySelector('.home-hero, .page-hero, .cta-band');
      if (hero) observer.observe(hero);
      else stickyCta.classList.add('is-visible');
    }
  }
})();
