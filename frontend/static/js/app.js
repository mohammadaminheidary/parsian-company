import { initializeHeader } from './header.js?v=20261105-smooth-navbar';
import { initializeProductCarousel } from './product-carousel.js?v=20261105-brands';
import { initializeCarousel } from './carousel.js?v=20261105-brands';
import { initializeWhyChoose } from './why-choose.js';
import { initializePortfolio } from './portfolio.js';
import { initializeCounters } from './counters.js';
import { initializeFaq } from './faq.js';
import { initializeFooter } from './footer.js';

initializeHeader(document.querySelector('[data-site-header]'));
document.querySelectorAll('[data-product-section]').forEach(initializeProductCarousel);
document.querySelectorAll('[data-brands-section]').forEach((section) => initializeCarousel(section));
document.querySelectorAll('[data-why-choose]').forEach(initializeWhyChoose);
document.querySelectorAll('[data-portfolio]').forEach(initializePortfolio);
document.querySelectorAll('[data-about-stats]').forEach(initializeCounters);
document.querySelectorAll('[data-faq]').forEach(initializeFaq);
initializeFooter(document.querySelector('[data-site-footer]'));
