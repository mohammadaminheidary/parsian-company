import { initializeHeader } from './header.js?v=20261104-scroll';
import { initializeProductCarousel } from './product-carousel.js?v=20261104-scroll';
import { initializeWhyChoose } from './why-choose.js';
import { initializePortfolio } from './portfolio.js';
import { initializeCounters } from './counters.js';

initializeHeader(document.querySelector('[data-site-header]'));
document.querySelectorAll('[data-product-section]').forEach(initializeProductCarousel);
document.querySelectorAll('[data-why-choose]').forEach(initializeWhyChoose);
document.querySelectorAll('[data-portfolio]').forEach(initializePortfolio);
document.querySelectorAll('[data-about-stats]').forEach(initializeCounters);
