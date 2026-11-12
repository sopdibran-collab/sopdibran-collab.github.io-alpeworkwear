(function () {
  const cfg = window.ALPE_CONFIG || {
    brand: 'Alpë Workwear',
    legalName: 'Alpë Workwear',
    phoneDisplay: '+41 79 779 21 59',
    phoneTel: '+41797792159',
  };

  const page = window.location.pathname.split('/').pop() || 'index.html';
  const isEn = document.documentElement.lang === 'en' || document.documentElement.lang.startsWith('en');
  const menuOpenLabel = isEn ? 'Open menu' : 'Ouvrir le menu';
  const menuCloseLabel = isEn ? 'Close menu' : 'Fermer le menu';
  const menuOpenText = isEn ? 'Menu' : 'Menu';
  const menuCloseText = isEn ? 'Close' : 'Fermer';
  const callLabel = isEn ? 'Call' : 'Appeler';
  const quoteLabel = isEn ? 'Request a quote' : 'Demander un devis';

  function setNavOpen(nav, toggle, open) {
    const isOpen = Boolean(open);
    nav.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggle.setAttribute('aria-label', isOpen ? menuCloseLabel : menuOpenLabel);
    toggle.textContent = isOpen ? menuCloseText : menuOpenText;
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
      'confection-sur-mesure.html': '/confection-sur-mesure.html',
      'cut-and-sew-manufacturing.html': '/en/cut-and-sew-manufacturing.html',
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
      '" class="nav-phone track-phone" aria-label="' +
      callLabel +
      ' ' +
      phoneDisplay +
      '">' +
      phoneDisplay +
      '</a>';
    const contactLi = nav.querySelector('.nav-cta')?.closest('li');
    if (contactLi) nav.insertBefore(li, contactLi);
    else nav.appendChild(li);
  }

  function enhanceLangSwitch() {
    const enPages = {
      'confection-sur-mesure.html': '/en/cut-and-sew-manufacturing.html',
    };
    const enHref = enPages[page];
    document.querySelectorAll('.lang-switch').forEach((group) => {
      group.querySelectorAll('[data-lang="de"], [data-lang="it"]').forEach((el) => {
        el.remove();
      });
      const enBtn = group.querySelector('[data-lang="en"]');
      if (!enHref) {
        if (enBtn) enBtn.remove();
        return;
      }
      if (enBtn && enBtn.tagName === 'BUTTON') {
        const link = document.createElement('a');
        link.href = enHref;
        link.className = 'lang-switch__item';
        link.setAttribute('hreflang', 'en');
        link.lang = 'en';
        link.textContent = 'EN';
        enBtn.replaceWith(link);
      }
    });
  }

  function enhanceStickyCta() {
    const sticky = document.querySelector('.sticky-cta');
    if (!sticky) return;

    const noSticky = new Set(['merci.html', 'thank-you.html', 'confidentialite.html', 'mentions-legales.html']);
    if (noSticky.has(page)) {
      sticky.remove();
      return;
    }

    if (sticky.dataset.enhanced === '1') return;

    const phoneTel = cfg.phoneTel || '+41797792159';
    const isCallOnly = sticky.classList.contains('sticky-cta--call-only') || page === 'contact.html';

    let quoteHref = '/contact.html';
    if (page === 'confection-sur-mesure.html') quoteHref = '#cotation';
    if (page === 'cut-and-sew-manufacturing.html') quoteHref = '#quote';

    sticky.setAttribute('aria-label', isCallOnly ? callLabel : quoteLabel + ' — ' + callLabel);

    if (isCallOnly) {
      sticky.classList.add('sticky-cta--call-only');
      sticky.innerHTML =
        '<div class="sticky-cta__row sticky-cta__row--single">' +
        '<a href="tel:' +
        phoneTel +
        '" class="sticky-cta__btn sticky-cta__btn--call track-phone" aria-label="' +
        callLabel +
        '">' +
        callLabel +
        '</a></div>';
    } else {
      sticky.innerHTML =
        '<div class="sticky-cta__row">' +
        '<a href="tel:' +
        phoneTel +
        '" class="sticky-cta__btn sticky-cta__btn--call track-phone" aria-label="' +
        callLabel +
        '">' +
        callLabel +
        '</a>' +
        '<a href="' +
        quoteHref +
        '" class="sticky-cta__btn sticky-cta__btn--devis track-devis" aria-label="' +
        quoteLabel +
        '">' +
        quoteLabel +
        '</a>' +
        '</div>';
    }
    sticky.dataset.enhanced = '1';
  }

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

    if (!isEn) {
      setNamedMeta('geo.region', 'CH');
      setNamedMeta('geo.placename', 'Suisse');
    }

    const robots = document.querySelector('meta[name="robots"]');
    if (robots) {
      const current = robots.getAttribute('content') || '';
      if (/noindex/i.test(current)) return;
      if (!current.includes('max-snippet')) {
        robots.setAttribute(
          'content',
          'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        );
      }
    }
  }

  enhanceSeoMeta();
  enhanceLangSwitch();
  enhanceStickyCta();

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
  if (stickyCta && !['merci.html', 'thank-you.html', 'confidentialite.html', 'mentions-legales.html'].includes(page)) {
    document.body.classList.add('has-sticky-cta');
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
    } else {
      stickyCta.classList.add('is-visible');
    }
  }
})();
