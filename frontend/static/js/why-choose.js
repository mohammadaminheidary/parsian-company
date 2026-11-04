export function initializeWhyChoose(section) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const revealTargets = [...section.querySelectorAll('[data-why-reveal]')];

  // Only hide content when an observer is available; no-JS content stays visible.
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const reveal = () => {
      revealTargets.forEach((target) => { delete target.dataset.reveal; });
      observer.disconnect();
      reducedMotion.removeEventListener('change', onMotionChange);
    };
    const onMotionChange = () => { if (reducedMotion.matches) reveal(); };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) reveal();
    }, { threshold: 0.15 });
    revealTargets.forEach((target, index) => {
      target.style.setProperty('--reveal-delay', `${index * 85}ms`);
      target.dataset.reveal = 'pending';
    });
    reducedMotion.addEventListener('change', onMotionChange);
    observer.observe(section);
  }

  let activeItem;
  function setOpen(item, open) {
    if (open && activeItem && activeItem !== item) setOpen(activeItem, false);
    item.dataset.popup = open ? 'open' : 'closed';
    item.querySelector('[data-reason-trigger]').setAttribute('aria-expanded', String(open));
    item.querySelector('[data-reason-popup]').setAttribute('aria-hidden', String(!open));
    if (open) activeItem = item;
    else if (activeItem === item) activeItem = undefined;
  }

  section.querySelectorAll('[data-reason]').forEach((item) => {
    const trigger = item.querySelector('[data-reason-trigger]');
    item.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') setOpen(item, true);
    });
    item.addEventListener('pointerleave', (event) => {
      if (event.pointerType === 'mouse') setOpen(item, false);
    });
    trigger.addEventListener('focus', () => {
      if (trigger.matches(':focus-visible')) setOpen(item, true);
    });
    item.addEventListener('focusout', (event) => {
      if (!item.contains(event.relatedTarget)) setOpen(item, false);
    });
    trigger.addEventListener('click', () => setOpen(item, item.dataset.popup !== 'open'));
  });

  document.addEventListener('pointerdown', (event) => {
    if (activeItem && !activeItem.contains(event.target)) setOpen(activeItem, false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeItem) {
      setOpen(activeItem, false);
      event.preventDefault();
    }
  });
}
