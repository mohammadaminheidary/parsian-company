import { initializeAccordion } from './accordion.js';

export function initializeFooter(footer) {
  if (!footer) return;
  initializeAccordion(footer, { name: 'footer', mediaQuery: '(width < 48rem)' });

  footer.querySelector('a[href="#footer-contact"]').addEventListener('click', () => {
    const trigger = footer.querySelector('#footer-trigger-contact');
    if (trigger.getAttribute('aria-expanded') === 'false') trigger.click();
  });

  const backToTop = footer.querySelector('[data-back-to-top]');
  backToTop.hidden = false;
  backToTop.addEventListener('click', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
    document.querySelector('[data-nav-brand]')?.focus({ preventScroll: true });
  });
}
