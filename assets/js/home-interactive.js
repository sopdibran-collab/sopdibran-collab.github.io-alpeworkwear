/**
 * Accueil v3 — carousels, timeline co-création, panneau détail
 */
(function () {
  const page = document.body;
  if (!page.classList.contains('page-home')) return;

  const panelSrc = document.getElementById('home-detail-panel');
  const panelMobile = document.getElementById('home-detail-panel-mobile');
  if (panelSrc && panelMobile && !panelMobile.children.length) {
    const clone = panelSrc.cloneNode(true);
    clone.removeAttribute('id');
    panelMobile.appendChild(clone);
  }

  function initCarousel(root) {
    const track = root.querySelector('.home-carousel__track');
    const slides = [...root.querySelectorAll('.home-carousel__slide')];
    const dots = [...root.querySelectorAll('.home-carousel__dot')];
    const prev = root.querySelector('.home-carousel__arrow--prev');
    const next = root.querySelector('.home-carousel__arrow--next');
    if (!track || !slides.length) return;

    let index = 0;

    function goTo(i) {
      index = Math.max(0, Math.min(i, slides.length - 1));
      const slide = slides[index];
      track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
      dots.forEach((dot, di) => dot.setAttribute('aria-current', di === index ? 'true' : 'false'));
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === slides.length - 1;
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goTo(i));
    });

    prev?.addEventListener('click', () => goTo(index - 1));
    next?.addEventListener('click', () => goTo(index + 1));

    let scrollTimer;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        const closest = slides.reduce((best, slide, i) => {
          const slideCenter = slide.offsetLeft - track.offsetLeft + slide.offsetWidth / 2;
          return Math.abs(slideCenter - center) < Math.abs(best.dist - center)
            ? { i, dist: slideCenter }
            : best;
        }, { i: 0, dist: Infinity });
        if (closest.i !== index) {
          index = closest.i;
          dots.forEach((dot, di) => dot.setAttribute('aria-current', di === index ? 'true' : 'false'));
          if (prev) prev.disabled = index === 0;
          if (next) next.disabled = index === slides.length - 1;
        }
      }, 80);
    });

    goTo(0);
  }

  function initTimeline(root) {
    const steps = [...root.querySelectorAll('.home-timeline__step')];
    const visuals = [...root.querySelectorAll('.home-timeline__visual img')];
    if (!steps.length || !visuals.length) return;

    function activate(i) {
      steps.forEach((step, si) => step.setAttribute('aria-selected', si === i ? 'true' : 'false'));
      visuals.forEach((img, vi) => img.classList.toggle('is-active', vi === i));
    }

    steps.forEach((step, i) => {
      step.addEventListener('click', () => activate(i));
    });

    activate(0);
  }

  function initPanel(root) {
    const tabs = [...root.querySelectorAll('.home-panel__tab')];
    const panes = [...root.querySelectorAll('.home-panel__pane')];
    if (!tabs.length) return;

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t, ti) => t.setAttribute('aria-selected', ti === i ? 'true' : 'false'));
        panes.forEach((p, pi) => p.classList.toggle('is-active', pi === i));
      });
    });

    const thumbGroups = root.querySelectorAll('[data-panel-gallery]');
    thumbGroups.forEach((group) => {
      const main = group.querySelector('.home-panel__hero-img img');
      const thumbs = [...group.querySelectorAll('.home-panel__thumb')];
      thumbs.forEach((thumb) => {
        thumb.addEventListener('click', () => {
          const src = thumb.querySelector('img')?.getAttribute('src');
          const alt = thumb.querySelector('img')?.getAttribute('alt');
          if (main && src) {
            main.src = src;
            if (alt) main.alt = alt;
          }
          thumbs.forEach((t) => t.setAttribute('aria-current', t === thumb ? 'true' : 'false'));
        });
      });
    });

    root.querySelectorAll('[data-craft-slider]').forEach((slider) => {
      const images = [...slider.querySelectorAll('img')];
      const prev = slider.parentElement?.querySelector('.home-carousel__arrow--prev');
      const next = slider.parentElement?.querySelector('.home-carousel__arrow--next');
      let ci = 0;

      function show(i) {
        ci = (i + images.length) % images.length;
        images.forEach((img, ii) => img.classList.toggle('is-active', ii === ci));
      }

      prev?.addEventListener('click', () => show(ci - 1));
      next?.addEventListener('click', () => show(ci + 1));
      show(0);
    });
  }

  document.querySelectorAll('[data-carousel]').forEach(initCarousel);
  document.querySelectorAll('[data-timeline]').forEach(initTimeline);
  document.querySelectorAll('.home-panel').forEach(initPanel);

  document.querySelectorAll('.home-carousel__slide').forEach((slide) => {
    slide.addEventListener('mouseenter', () => {
      const panel = document.getElementById('home-detail-panel');
      const tab = panel?.querySelector('.home-panel__tab[data-tab="produit"]');
      tab?.click();
    });
  });
})();
