/**
* DSSO - Dalit Samaj Sewa Sangh (Siraha, Nepal)
* Core Application & 5-Variant Theme Engine
* Production-grade compact UI & Event Handlers
*/

(function() {
  "use strict";

  /**
   * 5-Variant Theme Engine (Permanent Dark Mode with 5 Atmospheric Palettes)
   */
  const themeVariants = ['emerald', 'sapphire', 'crimson', 'amber', 'violet'];
  const variantOptionBtns = document.querySelectorAll('[data-set-variant]');

  function getStoredVariant() {
    const saved = localStorage.getItem('dsso-variant');
    return themeVariants.includes(saved) ? saved : 'emerald';
  }

  function applyTheme(variant) {
    const selectedVariant = themeVariants.includes(variant) ? variant : 'emerald';
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.setAttribute('data-variant', selectedVariant);
    localStorage.setItem('dsso-theme', 'dark');
    localStorage.setItem('dsso-variant', selectedVariant);

    // Update active variant indicators
    document.querySelectorAll('[data-set-variant]').forEach(btn => {
      if (btn.getAttribute('data-set-variant') === selectedVariant) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update active variant label if present
    const variantLabel = document.querySelector('.current-variant-label');
    if (variantLabel) {
      const activeBtn = document.querySelector(`[data-set-variant="${selectedVariant}"]`);
      if (activeBtn) {
        variantLabel.textContent = activeBtn.getAttribute('data-variant-name') || selectedVariant;
      }
    }
  }

  // Initialize theme on load (Permanent dark theme default)
  const currentVariant = getStoredVariant();
  applyTheme(currentVariant);

  // Toggle color variant dropdown on click / touch
  const variantDropdowns = document.querySelectorAll('.variant-dropdown');
  variantDropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.variant-btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
      });
    }
  });

  // Close variant dropdown when clicking outside
  document.addEventListener('click', (e) => {
    variantDropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  });

  // Select color variant (5 options)
  variantOptionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const selectedVariant = btn.getAttribute('data-set-variant');
      if (themeVariants.includes(selectedVariant)) {
        applyTheme(selectedVariant);
        // Close dropdown
        variantDropdowns.forEach(d => d.classList.remove('active'));
      }
    });
  });

  /**
   * Apply .scrolled class to body on scroll
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader) return;
    window.scrollY > 40 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToggle() {
    if (!mobileNavToggleBtn) return;
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToggle);
  }

  /**
   * Hide mobile nav on click
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToggle();
      }
    });
  });

  // Close mobile drawer when tapping outside
  document.addEventListener('click', (e) => {
    if (document.querySelector('.mobile-nav-active')) {
      const navmenu = document.querySelector('#navmenu');
      if (navmenu && !navmenu.contains(e.target) && !mobileNavToggleBtn.contains(e.target)) {
        mobileNavToggle();
      }
    }
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.classList.add('loaded');
      setTimeout(() => preloader.remove(), 300);
    });
  }

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 200 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }

  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll (AOS)
   */
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 550,
        easing: 'ease-out',
        once: true,
        mirror: false
      });
    }
  }
  window.addEventListener('load', aosInit);

  /**
   * Carousel indicators & Auto-play Engine
   */
  document.querySelectorAll('.carousel-indicators').forEach((carouselIndicator) => {
    const carousel = carouselIndicator.closest('.carousel');
    if (!carousel) return;
    carousel.querySelectorAll('.carousel-item').forEach((carouselItem, index) => {
      const activeClass = index === 0 ? 'class="active"' : '';
      carouselIndicator.innerHTML += `<li data-bs-target="#${carousel.id}" data-bs-slide-to="${index}" ${activeClass}></li>`;
    });
  });

  // Ensure hero carousel auto-cycles smoothly and supports touch swipe without arrow buttons
  window.addEventListener('load', () => {
    const heroCarouselEl = document.querySelector('#hero-carousel');
    if (heroCarouselEl && typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
      const heroCarousel = bootstrap.Carousel.getOrCreateInstance(heroCarouselEl, {
        interval: 5000,
        ride: 'carousel',
        wrap: true,
        touch: true
      });
      heroCarousel.cycle();
    }
  });

  /**
   * PureCounter init
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  /**
   * Smooth hash scrolling
   */
  window.addEventListener('load', function() {
    if (window.location.hash) {
      const section = document.querySelector(window.location.hash);
      if (section) {
        setTimeout(() => {
          const header = document.querySelector('#header');
          const headerOffset = header ? header.offsetHeight : 60;
          const elementPosition = section.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - headerOffset,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  const navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      const section = document.querySelector(navmenulink.hash);
      if (!section) return;
      const position = window.scrollY + 100;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Contact Form Client-side Handling
   */
  document.querySelectorAll('form.php-email-form').forEach(form => {
    form.addEventListener('submit', function(e) {
      const loading = form.querySelector('.loading');
      const errorMsg = form.querySelector('.error-message');
      const sentMsg = form.querySelector('.sent-message');

      const action = form.getAttribute('action');
      if (!action || window.location.protocol === 'file:') {
        e.preventDefault();
        if (loading) loading.classList.add('d-block');
        setTimeout(() => {
          if (loading) loading.classList.remove('d-block');
          if (errorMsg) errorMsg.classList.remove('d-block');
          if (sentMsg) {
            sentMsg.classList.add('d-block');
            sentMsg.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Thank you! Your message has been received. Our team will contact you shortly.';
          }
          form.reset();
        }, 600);
      }
    });
  });

})();