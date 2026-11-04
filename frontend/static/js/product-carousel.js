export function initializeProductCarousel(section) {
  const track = section.querySelector('[data-product-track]');
  const items = [...section.querySelectorAll('[data-product-item]')];
  if (!track || items.length < 2) return;

  const mobile = matchMedia('(max-width: 767px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let pointerDown = false;
  let touching = false;
  let scrolling = false;
  let automaticScroll = false;
  let lastInteraction = 0;
  let direction = 1;
  let timer;
  let settleTimer;
  let revealed = false;

  function canPlay() {
    return mobile.matches && !reducedMotion.matches && visible && !document.hidden
      && !pointerDown && !touching && !scrolling && !section.closest('[inert]');
  }

  function schedule() {
    clearTimeout(timer);
    if (!canPlay()) return;
    // Normal cadence is 3 seconds; manual input gets a full 4-second quiet period.
    const delay = Math.max(3000, lastInteraction + 4000 - Date.now());
    timer = setTimeout(advance, delay);
  }

  function interact() {
    if (automaticScroll) {
      automaticScroll = false;
      // Stop only an in-flight autoplay animation; native gestures keep control.
      track.scrollTo({ left: track.scrollLeft, behavior: 'instant' });
    }
    lastInteraction = Date.now();
    schedule();
  }

  function waitForScrollEnd() {
    clearTimeout(settleTimer);
    // A short debounce also supports browsers without the scrollend event.
    settleTimer = setTimeout(() => {
      scrolling = false;
      automaticScroll = false;
      schedule();
    }, 160);
  }

  // Geometry avoids the incompatible positive/negative RTL scrollLeft models.
  function positions() {
    const bounds = track.getBoundingClientRect();
    const rtl = getComputedStyle(track).direction === 'rtl';
    const distances = items.map((item) => {
      const rect = item.getBoundingClientRect();
      return rtl ? bounds.right - rect.right : rect.left - bounds.left;
    });
    const current = distances.reduce((nearest, value, index) => Math.abs(value) < Math.abs(distances[nearest]) ? index : nearest, 0);
    return { distances, current, rtl };
  }

  function goTo(index, behavior = reducedMotion.matches ? 'instant' : 'smooth') {
    const { distances, rtl } = positions();
    track.scrollBy({ left: distances[index] * (rtl ? -1 : 1), behavior });
  }

  function advance() {
    // Recheck at execution time, including activity outside the carousel.
    if (!canPlay() || Date.now() - lastInteraction < 4000) {
      schedule();
      return;
    }
    const { current } = positions();
    // The final item cannot snap to the start when 1.5 items are visible.
    // Treat a completely visible final item as the end and gently reverse.
    const bounds = track.getBoundingClientRect();
    const last = items.at(-1).getBoundingClientRect();
    const atEnd = last.left >= bounds.left - 1 && last.right <= bounds.right + 1;
    if (atEnd) direction = -1;
    else if (current === 0) direction = 1;
    const next = atEnd ? Math.min(current, items.length - 2) : current + direction;
    automaticScroll = true;
    scrolling = true;
    goTo(Math.max(0, Math.min(items.length - 1, next)));
    waitForScrollEnd();
  }

  function reveal() {
    if (revealed) return;
    revealed = true;
    items.forEach((item) => { delete item.dataset.reveal; });
  }

  if ('IntersectionObserver' in window) {
    if (!reducedMotion.matches) {
      items.forEach((item, index) => {
        item.style.setProperty('--reveal-delay', `${index * 85}ms`);
        item.dataset.reveal = 'pending';
      });
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) reveal();
      schedule();
    }, { threshold: 0.15 });
    observer.observe(track);
  } else {
    // Keep content visible and leave autoplay off without visibility detection.
    reveal();
  }

  // Page gestures and their momentum must also suspend horizontal autoplay.
  // Touch state survives pointercancel, which browsers fire when native panning starts.
  document.addEventListener('touchstart', (event) => { touching = event.touches.length > 0; interact(); }, { passive: true });
  document.addEventListener('touchmove', interact, { passive: true });
  function releaseTouch(event) {
    touching = event.touches.length > 0;
    interact();
  }
  document.addEventListener('touchend', releaseTouch, { passive: true });
  document.addEventListener('touchcancel', releaseTouch, { passive: true });
  document.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch') pointerDown = true;
    interact();
  }, { passive: true });
  document.addEventListener('pointermove', () => { if (pointerDown) interact(); }, { passive: true });
  function releasePointer() {
    if (!pointerDown) return;
    pointerDown = false;
    interact();
  }
  window.addEventListener('pointerup', releasePointer, { passive: true });
  window.addEventListener('pointercancel', releasePointer, { passive: true });
  document.addEventListener('scroll', interact, { passive: true });
  document.addEventListener('wheel', interact, { passive: true });
  document.addEventListener('click', interact);
  document.addEventListener('keydown', interact);
  track.addEventListener('scroll', () => {
    scrolling = true;
    clearTimeout(timer);
    if (!automaticScroll) lastInteraction = Date.now();
    waitForScrollEnd();
  }, { passive: true });
  track.addEventListener('focusin', interact);
  track.addEventListener('keydown', (event) => {
    if (!mobile.matches) return;
    interact();
    const { current, rtl } = positions();
    let next;
    if (event.key === 'ArrowLeft') next = current + (rtl ? 1 : -1);
    if (event.key === 'ArrowRight') next = current + (rtl ? -1 : 1);
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = items.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    // Home/End settle immediately so the next arrow key starts at that endpoint.
    goTo(Math.max(0, Math.min(items.length - 1, next)), ['Home', 'End'].includes(event.key) ? 'instant' : undefined);
  });

  function updatePreferences() {
    track.tabIndex = mobile.matches ? 0 : -1;
    if (reducedMotion.matches) reveal();
    if (!mobile.matches) {
      // Clear a mobile scroll offset when switching to the desktop grid.
      if (track.scrollLeft !== 0) track.scrollTo({ left: 0, behavior: 'instant' });
      direction = 1;
    }
    schedule();
  }

  mobile.addEventListener('change', updatePreferences);
  reducedMotion.addEventListener('change', updatePreferences);
  function resetScrollState() {
    clearTimeout(settleTimer);
    pointerDown = false;
    touching = false;
    scrolling = false;
    automaticScroll = false;
  }
  document.addEventListener('visibilitychange', () => { resetScrollState(); schedule(); });
  window.addEventListener('pagehide', () => { clearTimeout(timer); resetScrollState(); });
  window.addEventListener('pageshow', schedule);
  updatePreferences();
}
