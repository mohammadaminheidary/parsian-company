export function initializeAccordion(section, { name = 'faq', mediaQuery } = {}) {
  const items = [...section.querySelectorAll(`[data-${name}-item]`)];
  const media = mediaQuery ? window.matchMedia(mediaQuery) : null;
  let activeItem;

  function render() {
    const collapsible = !media || media.matches;
    items.forEach((item) => {
      const open = !collapsible || item === activeItem;
      item.dataset.open = String(open);
      item.querySelector(`[data-${name}-trigger]`).setAttribute('aria-expanded', String(open));
      const panel = item.querySelector(`[data-${name}-panel]`);
      panel.setAttribute('aria-hidden', String(!open));
      panel.inert = !open;
    });
  }

  items.forEach((item) => {
    const trigger = item.querySelector(`[data-${name}-trigger]`);
    trigger.disabled = false;
    trigger.addEventListener('click', () => {
      activeItem = item === activeItem ? undefined : item;
      render();
    });
  });

  media?.addEventListener('change', render);
  render();
  // Content remains readable without JavaScript.
  section.setAttribute(`data-${name}-ready`, '');
}
