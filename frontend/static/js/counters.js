export function initializeCounters(group) {
  if (group.dataset.countersInitialized) return;
  group.dataset.countersInitialized = 'true';

  const counters = [...group.querySelectorAll('[data-counter-target]')].map((element) => ({
    element,
    target: Number(element.dataset.counterTarget),
  })).filter(({ target }) => Number.isFinite(target) && target >= 0);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  // The HTML contains the final values for no-JS, reduced-motion and older browsers.
  if (!counters.length || reducedMotion.matches || !('IntersectionObserver' in window)) return;

  const format = new Intl.NumberFormat('en-US');
  let frame;
  function render(progress) {
    counters.forEach(({ element, target }) => {
      element.textContent = format.format(Math.round(target * progress));
    });
  }
  function finish() {
    cancelAnimationFrame(frame);
    render(1);
    observer.disconnect();
    reducedMotion.removeEventListener('change', onMotionChange);
  }
  function onMotionChange() {
    if (reducedMotion.matches) finish();
  }

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    // Disconnect before scheduling: scrolling away and back cannot restart it.
    observer.disconnect();
    let started;
    function tick(timestamp) {
      started ??= timestamp;
      const progress = Math.min((timestamp - started) / 1800, 1);
      render(1 - (1 - progress) ** 3);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else finish();
    }
    frame = requestAnimationFrame(tick);
  }, { threshold: 0.35 });

  render(0);
  reducedMotion.addEventListener('change', onMotionChange);
  observer.observe(group);
}
