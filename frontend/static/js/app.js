import { initializeHeader } from './header.js?v=20261105-smooth-navbar';
import { revealProducts } from './products.js?v=20261106-row-reveal';
import { initializeCarousel } from './carousel.js?v=20261105-brands';
import { initializeWhyChoose } from './why-choose.js';
import { initializePortfolio } from './portfolio.js?v=20261105-portfolio-scale';
import { initializeCounters } from './counters.js';
import { initializeFaq } from './faq.js';
import { initializeFooter } from './footer.js';

initializeHeader(document.querySelector('[data-site-header]'));
document.querySelectorAll('[data-product-section]').forEach(revealProducts);
document.querySelectorAll('[data-brands-section]').forEach((section) => initializeCarousel(section));
document.querySelectorAll('[data-why-choose]').forEach(initializeWhyChoose);
document.querySelectorAll('[data-portfolio]').forEach(initializePortfolio);
document.querySelectorAll('[data-about-stats]').forEach(initializeCounters);
document.querySelectorAll('[data-faq]').forEach(initializeFaq);
initializeFooter(document.querySelector('[data-site-footer]'));
