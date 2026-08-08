(function () {
  const cfg = window.ALPE_CONFIG || {
    brand: 'Alpë Workwear',
    legalName: 'Alpë Workwear',
    phoneDisplay: '+41 79 779 21 59',
    phoneTel: '+41797792159',
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
      if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel:')) return;
      const isCurrent = current && href === current;
      if (isCurrent) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  /** Phone in header — pattern Gzimmo / Sopjani Tech */
  function injectHeaderPhone(header) {
    const nav = header.querySelector('.site-nav');
    if (!nav || nav.querySelector('.nav-phone')) return;
    const phoneTel = cfg.phoneTel || '+41797792159';
    const phoneDisplay = cfg.phoneDisplay || '+41 79 779 21 59';
    const li = document.createElement('li');
    li.className = 'nav-phone-item';
    li.innerHTML =
      '<a href="tel:' +
      phoneTel +
      '" class="nav-phone track-phone" aria-label="Appeler ' +
      phoneDisplay +
      '">' +
      phoneDisplay +
      '</a>';
    const contactLi = nav.querySelector('.nav-cta')?.closest('li');
    if (contactLi) nav.insertBefore(li, contactLi);
    else nav.appendChild(li);
  }

  /** Dual sticky mobile CTA: Appeler + Devis */
  function enhanceStickyCta() {
    const sticky = document.querySelector('.sticky-cta');
    if (!sticky || sticky.dataset.enhanced === '1') return;
    if (page === 'contact.html' || page === 'merci.html') {
      sticky.remove();
      return;
    }
    const phoneTel = cfg.phoneTel || '+41797792159';
    sticky.setAttribute('aria-label', 'Actions rapides');
    sticky.innerHTML =
      '<div class="sticky-cta__row">' +
      '<a href="tel:' +
      phoneTel +
      '" class="sticky-cta__btn sticky-cta__btn--call track-phone">Appeler</a>' +
      '<a href="/contact.html" class="sticky-cta__btn sticky-cta__btn--devis track-devis">Devis gratuit</a>' +
      '</div>';
    sticky.dataset.enhanced = '1';
  }

  /** Geo + robots preview directives (sitewide) */
  function enhanceSeoMeta() {
    function setNamedMeta(name, content) {
      let el = document.querySelector('meta[name="' + name + '"]');
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    }

    setNamedMeta('geo.region', 'CH');
    setNamedMeta('geo.placename', 'Suisse');

    const robots = document.querySelector('meta[name="robots"]');
    if (robots) {
      const current = robots.getAttribute('content') || '';
      if (!current.includes('max-snippet')) {
        robots.setAttribute(
          'content',
          'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        );
      }
    }
  }

  /** Complete footer city link equity */
  function enhanceFooterCities() {
    const footer = document.getElementById('site-footer');
    if (!footer) return;
    const links = footer.querySelector('.site-footer__links');
    if (!links) return;
    const cities = [
      { href: '/workwear-berne.html', label: 'Berne' },
      { href: '/workwear-bale.html', label: 'Bâle' },
      { href: '/workwear-valais.html', label: 'Valais' },
    ];
    const missing = cities.filter(function (city) {
      return !links.querySelector('a[href="' + city.href + '"]');
    });
    if (!missing.length) return;

    let anchor = links.querySelector('a[href="/workwear-zurich.html"]');
    if (!anchor) anchor = links.querySelector('a[href="/workwear-lausanne.html"]');
    let insertAfter = anchor ? anchor.parentElement : null;
    const conf = links.querySelector('a[href="/confidentialite.html"]');

    missing.forEach(function (city) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = city.href;
      a.textContent = city.label;
      li.appendChild(a);
      if (insertAfter) {
        insertAfter.after(li);
        insertAfter = li;
      } else if (conf && conf.parentElement) {
        conf.parentElement.before(li);
      } else {
        links.appendChild(li);
      }
    });
  }

  enhanceSeoMeta();
  enhanceStickyCta();
  enhanceFooterCities();

  const header = document.getElementById('site-header');
  if (header) {
    injectHeaderPhone(header);
    const nav = header.querySelector('.site-nav');
    if (nav) {
      setActiveNav(nav);
      bindMobileNav(header);
    }

    if (header.classList.contains('site-header--hero')) {
      const onScroll = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 48);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
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
