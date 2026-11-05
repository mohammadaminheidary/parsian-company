export function revealProducts(section) {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const items = section.querySelectorAll('[data-product-reveal]');
  const mobile = matchMedia('(width < 48rem)').matches;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;

      if (target === section) {
        items.forEach((item) => { delete item.dataset.reveal; });
      } else {
        delete target.dataset.reveal;
      }
      observer.unobserve(target);
    });
  }, { threshold: 0.15 });

  items.forEach((item, index) => {
    if (!mobile) item.style.setProperty('--reveal-delay', `${index * 85}ms`);
    item.dataset.reveal = 'pending';
    if (mobile) observer.observe(item);
  });
  if (!mobile) observer.observe(section);
}
