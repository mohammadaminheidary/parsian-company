import { initializeHeader } from './header.js';
import { initializeProductCarousel } from './product-carousel.js';

initializeHeader(document.querySelector('[data-site-header]'));
document.querySelectorAll('[data-product-section]').forEach(initializeProductCarousel);
