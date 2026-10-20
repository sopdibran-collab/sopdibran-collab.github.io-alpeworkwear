/**
 * Accueil — carousel collections, timeline co-création
 */
(function () {
  if (!document.body.classList.contains('page-home')) return;

  const SLIDE_LABEL = {
    fr: 'Diapositive {n} sur {N}',
    de: 'Folie {n} von {N}',
    it: 'Diapositiva {n} di {N}',
    en: 'Slide {n} of {N}',
  };

  function slideLabel(n, total) {
    const lang = (document.documentElement.lang || 'fr').slice(0, 2).toLowerCase();
    return (SLIDE_LABEL[lang] || SLIDE_LABEL.fr).replace('{n}', n).replace('{N}', total);
  }

  function labelDots(dots) {
    dots.forEach((dot, i) => dot.setAttribute('aria-label', slideLabel(i + 1, dots.length)));
  }

  function setCurrentDot(dots, index) {
    dots.forEach((dot, di) => {
      if (di === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

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
      setCurrentDot(dots, index);
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === slides.length - 1;
    }

    labelDots(dots);
    new MutationObserver(() => labelDots(dots)).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    });
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
        setCurrentDot(dots, index);
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
      thumbs.forEach((thumb, ti) => thumb.setAttribute('aria-pressed', ti === i ? 'true' : 'false'));
    }

    steps.forEach((step, i) => step.addEventListener('click', () => activate(i)));
    thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => activate(i)));
    activate(0);
  }

  async function initRealisationsCarousel() {
    const root = document.querySelector('.home-realisations__carousel[data-carousel]');
    if (!root) return;

    const track = root.querySelector('.home-realisations__track');
    const dotsWrap = root.querySelector('.home-carousel__dots');
    if (!track || !dotsWrap) return;

    try {
      const res = await fetch('data/realisations.json');
      if (!res.ok) return;
      const items = await res.json();
      if (!Array.isArray(items) || !items.length) return;

      track.innerHTML = items
        .map(
          (item) => `<figure class="home-carousel__slide home-realisations__slide" role="listitem">
        <img src="${item.src}" alt="${item.alt}" width="${item.width}" height="${item.height}" loading="lazy">
      </figure>`,
        )
        .join('');

      dotsWrap.innerHTML = items
        .map(
          (_, i) =>
            `<button type="button" class="home-carousel__dot" aria-label="${slideLabel(i + 1, items.length)}"${i === 0 ? ' aria-current="true"' : ''}></button>`,
        )
        .join('');
    } catch {
      return;
    }

    initCarousel(root);
  }

  document.querySelectorAll('[data-carousel]').forEach((root) => {
    if (root.classList.contains('home-realisations__carousel')) return;
    initCarousel(root);
  });
  void initRealisationsCarousel();
  document.querySelectorAll('[data-timeline]').forEach(initTimeline);
})();
