import { initializeHeader } from './header.js?v=20261104-scroll';
import { initializeProductCarousel } from './product-carousel.js?v=20261104-scroll';
import { initializeWhyChoose } from './why-choose.js';

initializeHeader(document.querySelector('[data-site-header]'));
document.querySelectorAll('[data-product-section]').forEach(initializeProductCarousel);
document.querySelectorAll('[data-why-choose]').forEach(initializeWhyChoose);
