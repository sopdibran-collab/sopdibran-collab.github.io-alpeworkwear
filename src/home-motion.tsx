import { createRoot } from 'react-dom/client';
import { animate, inView, type AnimationPlaybackControls } from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';

const SWISS_EASE = [0.16, 1, 0.3, 1] as const;

const LUCIDE_MAP: Record<string, LucideIcon> = {
  'arrow-right': ArrowRight,
  'chevron-down': ChevronDown,
};

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function mountLucideIcons() {
  document.querySelectorAll<HTMLElement>('[data-lucide]').forEach((host) => {
    const name = host.dataset.lucide;
    if (!name) return;

    const Icon = LUCIDE_MAP[name];
    if (!Icon) return;

    const size = Number(host.dataset.lucideSize ?? 16);
    const strokeWidth = Number(host.dataset.lucideStroke ?? 1.5);

    createRoot(host).render(<Icon size={size} strokeWidth={strokeWidth} aria-hidden />);
  });
}

function revealElement(
  element: HTMLElement,
  options: {
    delay?: number;
    y?: number;
    duration?: number;
    blur?: number;
    immediate?: boolean;
  } = {},
) {
  if (prefersReducedMotion()) {
    element.style.opacity = '1';
    element.style.transform = 'none';
    element.style.filter = 'none';
    element.classList.add('is-revealed');
    return;
  }

  const {
    delay = 0,
    y = 44,
    duration = 1.15,
    blur = 5,
    immediate = false,
  } = options;

  element.style.opacity = '0';
  element.style.transform = `translate3d(0, ${y}px, 0)`;
  element.style.filter = blur > 0 ? `blur(${blur}px)` : 'none';
  element.style.willChange = 'opacity, transform, filter';

  const play = () => {
    const controls: AnimationPlaybackControls = animate(
      element,
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
      },
      {
        duration,
        delay,
        ease: SWISS_EASE,
      },
    );

    controls.finished.then(() => {
      element.style.willChange = 'auto';
      element.style.filter = 'none';
      element.classList.add('is-revealed');
    });
  };

  if (immediate) {
    play();
    return;
  }

  inView(
    element,
    () => {
      play();
    },
    {
      once: true,
      amount: 0.18,
      margin: '0px 0px -10% 0px',
    },
  );
}

function initSectionReveals() {
  const hero = document.querySelector<HTMLElement>('.home-hero');
  if (hero) {
    revealElement(hero, { immediate: true, y: 28, duration: 1.35, blur: 4, delay: 0.08 });

    const heroContent = hero.querySelector<HTMLElement>('.home-hero__content');
    if (heroContent) {
      revealElement(heroContent, { immediate: true, y: 20, duration: 1.2, blur: 3, delay: 0.22 });
    }
  }

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((section, index) => {
    if (section.classList.contains('home-hero')) return;

    const hasStaggeredChildren = section.querySelector('[data-reveal-child]');
    if (hasStaggeredChildren) {
      const header = section.querySelector<HTMLElement>(
        '.home-alliance__title, .home-section__header, .visually-hidden',
      );
      if (header) {
        revealElement(header, { delay: index * 0.03, y: 32, duration: 1.05, blur: 3 });
      }
      return;
    }

    revealElement(section, { delay: index * 0.04, y: 48, duration: 1.2, blur: 4 });
  });

  document.querySelectorAll<HTMLElement>('[data-reveal-child]').forEach((child, index) => {
    revealElement(child, { delay: (index % 6) * 0.09, y: 36, duration: 1.05, blur: 3 });
  });
}

function initParallaxHints() {
  if (prefersReducedMotion()) return;

  const heroEmblem = document.querySelector<HTMLElement>('.home-hero__bg-emblem');
  if (!heroEmblem) return;

  let frame = 0;
  const onScroll = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      const offset = Math.min(window.scrollY * 0.12, 72);
      heroEmblem.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function boot() {
  if (!document.body.classList.contains('page-home')) return;

  mountLucideIcons();
  initSectionReveals();
  initParallaxHints();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
