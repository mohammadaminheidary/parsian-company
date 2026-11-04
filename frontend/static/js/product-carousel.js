import { initializeCarousel } from './carousel.js?v=20261105-brands';

export function initializeProductCarousel(section) {
  initializeCarousel(section, {
    trackSelector: '[data-product-track]',
    itemSelector: '[data-product-item]',
    interval: 3000,
    revealItems: true,
  });
}
