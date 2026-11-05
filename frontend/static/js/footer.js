import { initializeAccordion } from './accordion.js';

export function initializeFooter(footer) {
  if (!footer) return;
  initializeAccordion(footer, { name: 'footer', mediaQuery: '(width < 48rem)' });

  footer.querySelector('a[href="#footer-contact"]').addEventListener('click', () => {
    const trigger = footer.querySelector('#footer-trigger-contact');
    if (trigger.getAttribute('aria-expanded') === 'false') trigger.click();
  });

  const backToTop = footer.querySelector('[data-back-to-top]');
  function updateBackToTop() {
    const visible = window.scrollY > 160;
    if (backToTop.inert === !visible) return;
    backToTop.inert = !visible;
    backToTop.dataset.visible = String(visible);
  }

  window.addEventListener('scroll', updateBackToTop, { passive: true });
  window.addEventListener('pageshow', updateBackToTop);
  updateBackToTop();
  backToTop.addEventListener('click', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
    document.querySelector('[data-nav-brand]')?.focus({ preventScroll: true });
  });
}
