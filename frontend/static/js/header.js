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
  let lastScrollY = Math.max(0, window.scrollY);
  let scrollDistance = 0;
  let scrollFrame = 0;

  function showHeader() {
    header.dataset.navHidden = 'false';
    scrollDistance = 0;
  }

  function updateScrollVisibility() {
    scrollFrame = 0;
    if (scrollLock) return;

    // Clamp overscroll so mobile rubber-banding cannot reverse the direction.
    const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const y = Math.min(maximum, Math.max(0, window.scrollY));
    const delta = y - lastScrollY;
    lastScrollY = y;

    // Restore the full row before the contact strip re-enters the viewport.
    const compactThreshold = header.offsetHeight
      - (header.dataset.navCompact === 'true' ? 16 : 0);
    const compact = String(y > compactThreshold);
    if (header.dataset.navCompact !== compact) {
      header.dataset.navCompact = compact;
      updateHeaderOffset();
    }

    const keyboardFocus = header.contains(document.activeElement)
      && document.activeElement.matches(':focus-visible');
    if (y <= header.offsetHeight || keyboardFocus) {
      showHeader();
      return;
    }
    if (!delta) return;

    scrollDistance = Math.sign(delta) === Math.sign(scrollDistance)
      ? scrollDistance + delta : delta;
    if (scrollDistance >= 32) {
      header.dataset.navHidden = 'true';
      scrollDistance = 0;
    } else if (scrollDistance <= -20) {
      showHeader();
    }
  }

  function updateHeaderOffset() {
    // Keep the contact strip in normal flow; only the navbar stays at the top.
    const offset = header.getBoundingClientRect().height - container.parentElement.getBoundingClientRect().height;
    header.style.setProperty('--header-offset', `${-offset}px`);
    if (toggle.getAttribute('aria-expanded') === 'true') updateMenuBounds();
  }

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
      lastScrollY = previous.y;
      scrollDistance = 0;
    }
  }

  function updateMenuBounds() {
    navigation.style.setProperty('--nav-bottom', `${Math.max(0, container.parentElement.getBoundingClientRect().bottom)}px`);
  }

  function setMenuOpen(open) {
    open = !expanded && open;
    if (open && container.dataset.menuOpen !== 'true') {
      showHeader();
      navigation.scrollTop = 0;
      updateMenuBounds();
    }
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'بستن منوی اصلی' : 'باز کردن منوی اصلی');
    if (!open && !expanded && navigation.contains(document.activeElement)) toggle.focus({ preventScroll: true });
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
    const wasCompact = header.dataset.navCompact === 'true';
    // Measure final sizes without starting a resize animation.
    header.dataset.navMeasuring = 'true';
    header.dataset.navCompact = 'false';

    // Measure the full row at its current responsive spacing before collapsing.
    container.dataset.navLayout = 'expanded';
    toggle.hidden = true;
    navigation.hidden = false;
    const style = getComputedStyle(container);
    const available = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const required = brand.getBoundingClientRect().width + navigation.getBoundingClientRect().width + parseFloat(style.columnGap);
    expanded = required <= available + 0.5;

    container.dataset.navLayout = expanded ? 'expanded' : 'collapsed';
    // Reserve the original header space so shrinking never moves page content.
    const fullHeight = header.firstElementChild.offsetHeight + container.parentElement.offsetHeight;
    header.style.setProperty('--header-height', `${fullHeight}px`);
    header.dataset.navCompact = String(wasCompact);
    updateHeaderOffset();
    updateMenuBounds();
    toggle.hidden = expanded;
    setMenuOpen(!expanded && !wasExpanded && wasOpen);
    delete header.dataset.navMeasuring;

    if (wasExpanded && !expanded && navigation.contains(focused)) toggle.focus({ preventScroll: true });
    if (focused === toggle) {
      if (expanded) navigation.querySelector('a[href]')?.focus({ preventScroll: true });
      else toggle.focus({ preventScroll: true });
    }
  }

  updateLayout();
  updateHeaderOffset();
  header.dataset.scrollHeader = 'ready';
  header.dataset.navHidden = 'false';
  const headerObserver = new ResizeObserver(updateHeaderOffset);
  headerObserver.observe(header);
  headerObserver.observe(container.parentElement);
  updateScrollVisibility();
  header.addEventListener('focusin', showHeader);
  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollVisibility);
  }, { passive: true });
  let previousWidth;
  const resizeObserver = new ResizeObserver(([entry]) => {
    if (entry.contentRect.width === previousWidth) return;
    previousWidth = entry.contentRect.width;
    updateLayout();
  });
  resizeObserver.observe(container);
  document.fonts.ready.then(updateLayout);
  // Mobile browser chrome changes viewport height while scrolling. Only width
  // changes (observed above) require the expanded/collapsed layout measurement.
  window.addEventListener('resize', () => {
    if (toggle.getAttribute('aria-expanded') === 'true') updateMenuBounds();
  });

  toggle.addEventListener('click', () => {
    setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  header.addEventListener('keydown', (event) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setMenuOpen(false);
      toggle.focus({ preventScroll: true });
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
      toggle.focus({ preventScroll: true });
    }
  });

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setMenuOpen(false);
  });

  window.addEventListener('hashchange', () => setMenuOpen(false));
  window.addEventListener('popstate', () => setMenuOpen(false));
  window.addEventListener('pagehide', () => setMenuOpen(false));
}
