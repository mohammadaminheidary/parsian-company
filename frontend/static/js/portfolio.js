export function initializePortfolio(section) {
  const track = section.querySelector('[data-portfolio-track]');
  const items = [...section.querySelectorAll('[data-portfolio-item]')];
  const filters = [...section.querySelectorAll('[data-portfolio-filter]')];
  const viewAll = section.querySelector('[data-portfolio-all]');
  const status = section.querySelector('[data-portfolio-status]');
  if (!track || !items.length || !filters.length || !viewAll || !status) return;

  const mobile = matchMedia('(max-width: 767px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  function filterProjects(category) {
    items.forEach((item) => {
      item.hidden = category !== 'all' && item.dataset.category !== category;
    });
    filters.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.portfolioFilter === category));
    });
    // Reset to the first project after filtering, including negative RTL offsets.
    track.scrollTo({ left: 0, behavior: 'instant' });
    const count = items.filter((item) => !item.hidden).length.toLocaleString('fa-IR');
    const label = filters.find((button) => button.dataset.portfolioFilter === category).textContent.trim();
    status.textContent = `${count} پروژه در دسته «${label}» نمایش داده می‌شود.`;
  }

  filters.forEach((button) => {
    button.disabled = false;
    button.addEventListener('click', () => filterProjects(button.dataset.portfolioFilter));
  });
  viewAll.disabled = false;
  viewAll.addEventListener('click', () => filterProjects('all'));

  function positions() {
    const visibleItems = items.filter((item) => !item.hidden);
    const bounds = track.getBoundingClientRect();
    const distances = visibleItems.map((item) => {
      const rect = item.getBoundingClientRect();
      return (rect.left + rect.right - bounds.left - bounds.right) / 2;
    });
    const current = distances.reduce((nearest, distance, index) => Math.abs(distance) < Math.abs(distances[nearest]) ? index : nearest, 0);
    return { visibleItems, distances, current };
  }

  // Correct browser rounding only after native momentum and pointer input stop.
  let settleTimer;
  let dragging = false;
  let touching = false;
  function settle() {
    clearTimeout(settleTimer);
    if (!mobile.matches || dragging || touching) return;
    settleTimer = setTimeout(() => {
      if (!mobile.matches || dragging || touching) return;
      const { distances, current } = positions();
      if (Math.abs(distances[current]) > 0.1) {
        track.scrollBy({ left: distances[current], behavior: 'instant' });
      }
    }, 180);
  }
  track.addEventListener('scroll', settle, { passive: true });
  track.addEventListener('pointerdown', () => { dragging = true; clearTimeout(settleTimer); }, { passive: true });
  function releasePointer() {
    if (!dragging) return;
    dragging = false;
    settle();
  }
  window.addEventListener('pointerup', releasePointer, { passive: true });
  window.addEventListener('pointercancel', releasePointer, { passive: true });
  track.addEventListener('touchstart', () => { touching = true; clearTimeout(settleTimer); }, { passive: true });
  function releaseTouch(event) {
    touching = event.touches.length > 0;
    settle();
  }
  track.addEventListener('touchend', releaseTouch, { passive: true });
  track.addEventListener('touchcancel', releaseTouch, { passive: true });

  track.addEventListener('keydown', (event) => {
    if (!mobile.matches || event.target !== track) return;
    const { visibleItems, distances, current } = positions();
    let next;
    if (event.key === 'ArrowLeft') next = current + 1;
    if (event.key === 'ArrowRight') next = current - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = visibleItems.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    next = Math.max(0, Math.min(visibleItems.length - 1, next));
    const behavior = reducedMotion.matches || ['Home', 'End'].includes(event.key) ? 'instant' : 'smooth';
    track.scrollBy({ left: distances[next], behavior });
  });

  function updateLayout() {
    track.tabIndex = mobile.matches ? 0 : -1;
    if (mobile.matches) track.setAttribute('aria-describedby', 'portfolio-scroll-hint');
    else {
      track.removeAttribute('aria-describedby');
      track.scrollTo({ left: 0, behavior: 'instant' });
    }
  }
  mobile.addEventListener('change', updateLayout);
  updateLayout();

  // Progressive enhancement: content stays visible without JS or visibility support.
  if (!('IntersectionObserver' in window) || reducedMotion.matches) return;
  const targets = [...section.querySelectorAll('[data-portfolio-reveal]')];
  function reveal() {
    targets.forEach((target) => { delete target.dataset.reveal; });
    observer.disconnect();
    reducedMotion.removeEventListener('change', onMotionChange);
  }
  function onMotionChange() {
    if (reducedMotion.matches) reveal();
  }
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) reveal();
  }, { threshold: 0.12 });
  targets.forEach((target, index) => {
    target.style.setProperty('--reveal-delay', `${index * 70}ms`);
    target.dataset.reveal = 'pending';
  });
  reducedMotion.addEventListener('change', onMotionChange);
  observer.observe(section);
}
