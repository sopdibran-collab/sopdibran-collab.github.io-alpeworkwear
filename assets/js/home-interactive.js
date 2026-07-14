/**
 * Accueil — carousel collections, timeline co-création
 */
(function () {
  if (!document.body.classList.contains('page-home')) return;

  function initCarousel(root) {
    const track = root.querySelector('.home-carousel__track');
    const slides = [...root.querySelectorAll('.home-carousel__slide')];
    const nav = root.querySelector('.home-carousel__nav');
    const dots = [...root.querySelectorAll('.home-carousel__dot')];
    const prev = root.querySelector('.home-carousel__arrow--prev');
    const next = root.querySelector('.home-carousel__arrow--next');
    if (!track || !slides.length) return;

    let index = 0;

    function needsNav() {
      return track.scrollWidth > track.clientWidth + 8;
    }

    function updateNavVisibility() {
      if (!nav) return;
      nav.classList.toggle('home-carousel__nav--hidden', !needsNav());
    }

    function goTo(i) {
      index = Math.max(0, Math.min(i, slides.length - 1));
      const slide = slides[index];
      track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
      dots.forEach((dot, di) => dot.setAttribute('aria-current', di === index ? 'true' : 'false'));
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === slides.length - 1;
    }

    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
    prev?.addEventListener('click', () => goTo(index - 1));
    next?.addEventListener('click', () => goTo(index + 1));

    let scrollTimer;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        slides.forEach((slide, i) => {
          const slideCenter = slide.offsetLeft - track.offsetLeft + slide.offsetWidth / 2;
          if (Math.abs(slideCenter - center) < slide.offsetWidth / 2) index = i;
        });
        dots.forEach((dot, di) => dot.setAttribute('aria-current', di === index ? 'true' : 'false'));
        if (prev) prev.disabled = index === 0;
        if (next) next.disabled = index === slides.length - 1;
      }, 80);
    });

    window.addEventListener('resize', updateNavVisibility);
    updateNavVisibility();
    goTo(0);
  }

  function initTimeline(root) {
    const steps = [...root.querySelectorAll('.home-timeline__step')];
    const visuals = [...root.querySelectorAll('.home-timeline__visual img')];
    const thumbs = [...root.querySelectorAll('.home-timeline__thumb')];
    if (!steps.length || !visuals.length) return;

    function activate(i) {
      steps.forEach((step, si) => step.setAttribute('aria-selected', si === i ? 'true' : 'false'));
      visuals.forEach((img, vi) => img.classList.toggle('is-active', vi === i));
      thumbs.forEach((thumb, ti) => thumb.setAttribute('aria-selected', ti === i ? 'true' : 'false'));
    }

    steps.forEach((step, i) => step.addEventListener('click', () => activate(i)));
    thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => activate(i)));
    activate(0);
  }

  document.querySelectorAll('[data-carousel]').forEach(initCarousel);
  document.querySelectorAll('[data-timeline]').forEach(initTimeline);
})();
