export function initializeFaq(section) {
  const items = [...section.querySelectorAll('[data-faq-item]')];
  let activeItem;

  function setOpen(item, open) {
    item.dataset.open = String(open);
    item.querySelector('[data-faq-trigger]').setAttribute('aria-expanded', String(open));
    const panel = item.querySelector('[data-faq-panel]');
    panel.setAttribute('aria-hidden', String(!open));
    panel.inert = !open;
    activeItem = open ? item : undefined;
  }

  items.forEach((item) => {
    const trigger = item.querySelector('[data-faq-trigger]');
    setOpen(item, false);
    trigger.disabled = false;
    trigger.addEventListener('click', () => {
      const open = item !== activeItem;
      if (activeItem) setOpen(activeItem, false);
      if (open) setOpen(item, true);
    });
  });

  // Answers remain readable without JavaScript; only enhanced accordions collapse.
  section.setAttribute('data-faq-ready', '');
}
