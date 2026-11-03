export function initializeHeader(header) {
  if (!header) return;
  const toggle = header.querySelector('[data-menu-toggle]');
  const navigation = header.querySelector('#primary-navigation');
  if (!toggle || !navigation) return;

  const container = header.querySelector('[data-nav-container]');
  const brand = header.querySelector('[data-nav-brand]');
  if (!container || !brand) return;

  let expanded = false;
  let scrollLock;
  const main = document.querySelector('main');

  navigation.querySelectorAll('a').forEach((link, index) => {
    link.style.setProperty('--menu-delay', `${60 + index * 70}ms`);
    link.classList.add(
      'group-data-[nav-layout=collapsed]/navbar:translate-y-4',
      'group-data-[nav-layout=collapsed]/navbar:opacity-0',
      'group-data-[nav-layout=collapsed]/navbar:transition-[opacity,translate,background-color]',
      'group-data-[nav-layout=collapsed]/navbar:duration-150',
      'group-data-[nav-layout=collapsed]/navbar:ease-[cubic-bezier(0.22,1,0.36,1)]',
      'group-data-[menu-open=true]/navbar:group-data-[nav-layout=collapsed]/navbar:translate-y-0',
      'group-data-[menu-open=true]/navbar:group-data-[nav-layout=collapsed]/navbar:opacity-100',
      'group-data-[menu-open=true]/navbar:group-data-[nav-layout=collapsed]/navbar:duration-500',
      'group-data-[menu-open=true]/navbar:group-data-[nav-layout=collapsed]/navbar:delay-(--menu-delay)',
      'motion-reduce:transition-none!',
    );
  });

  function lockScroll(lock) {
    if (lock && !scrollLock) {
      scrollLock = { y: window.scrollY, style: document.body.getAttribute('style'), inert: main?.inert };
      // Fixed positioning also prevents background touch scrolling on iOS Safari.
      Object.assign(document.body.style, { position: 'fixed', top: `-${scrollLock.y}px`, width: '100%', overflow: 'hidden' });
      if (main) main.inert = true;
    } else if (!lock && scrollLock) {
      const previous = scrollLock;
      scrollLock = null;
      if (previous.style === null) document.body.removeAttribute('style');
      else document.body.setAttribute('style', previous.style);
      if (main) main.inert = previous.inert;
      window.scrollTo({ top: previous.y, behavior: 'instant' });
    }
  }

  function updateMenuBounds() {
    navigation.style.setProperty('--nav-bottom', `${Math.max(0, container.parentElement.getBoundingClientRect().bottom)}px`);
  }

  function setMenuOpen(open) {
    open = !expanded && open;
    if (open && container.dataset.menuOpen !== 'true') {
      navigation.scrollTop = 0;
      updateMenuBounds();
    }
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'بستن منوی اصلی' : 'باز کردن منوی اصلی');
    if (!open && !expanded && navigation.contains(document.activeElement)) toggle.focus();
    navigation.inert = !expanded && !open;
    if (!expanded && !open) navigation.setAttribute('aria-hidden', 'true');
    else navigation.removeAttribute('aria-hidden');
    container.dataset.menuOpen = String(open);
    lockScroll(open);
  }

  function updateLayout() {
    const wasExpanded = expanded;
    const wasOpen = toggle.getAttribute('aria-expanded') === 'true';
    const focused = document.activeElement;

    // Measure the full row at its current responsive spacing before collapsing.
    container.dataset.navLayout = 'expanded';
    toggle.hidden = true;
    navigation.hidden = false;
    const style = getComputedStyle(container);
    const available = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const required = brand.getBoundingClientRect().width + navigation.getBoundingClientRect().width + parseFloat(style.columnGap);
    expanded = required <= available + 0.5;

    container.dataset.navLayout = expanded ? 'expanded' : 'collapsed';
    updateMenuBounds();
    toggle.hidden = expanded;
    setMenuOpen(!expanded && !wasExpanded && wasOpen);

    if (wasExpanded && !expanded && navigation.contains(focused)) toggle.focus();
    if (focused === toggle) {
      if (expanded) navigation.querySelector('a[href]')?.focus();
      else toggle.focus();
    }
  }

  updateLayout();
  let previousWidth;
  const resizeObserver = new ResizeObserver(([entry]) => {
    if (entry.contentRect.width === previousWidth) return;
    previousWidth = entry.contentRect.width;
    updateLayout();
  });
  resizeObserver.observe(container);
  document.fonts.ready.then(updateLayout);
  window.addEventListener('resize', updateLayout);

  toggle.addEventListener('click', () => {
    setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  header.addEventListener('keydown', (event) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setMenuOpen(false);
      toggle.focus();
    } else if (event.key === 'Tab') {
      const focusable = [brand, toggle, ...navigation.querySelectorAll('a[href]')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  navigation.addEventListener('click', (event) => {
    if (!expanded && event.target.closest('a[href]')) {
      setMenuOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setMenuOpen(false);
  });

  window.addEventListener('hashchange', () => setMenuOpen(false));
  window.addEventListener('popstate', () => setMenuOpen(false));
  window.addEventListener('pagehide', () => setMenuOpen(false));
}
