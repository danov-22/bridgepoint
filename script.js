/* ============================================================
   BRIDGEPOINT AGENCY — script.js
   Navigation, FAQ accordion, portfolio filters, contact form,
   Dark/light mode toggle, language switching
   ============================================================ */

/* ============================================================
   0. THEME — apply saved preference immediately (no flash)
      Note: initial application happens via inline <head> script.
      This block handles the toggle button interaction.
   ============================================================ */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('bp-theme', theme);
}

/* ============================================================
   1. PAGE NAVIGATION (single-page hash routing)
   ============================================================ */
function navigateTo(pageId) {
  var pages = document.querySelectorAll('.page');
  pages.forEach(function(page) {
    page.classList.remove('active');
  });

  var target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
  }

  var navLinks = document.querySelectorAll('.nav-link[data-page]');
  navLinks.forEach(function(link) {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === pageId) {
      link.classList.add('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  var navLinksMenu = document.getElementById('nav-links');
  var hamburger = document.getElementById('hamburger');
  navLinksMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

function getPageFromHash() {
  var hash = window.location.hash.replace('#', '');
  var validPages = ['home', 'services', 'portfolio', 'faq', 'about', 'contact'];
  return validPages.indexOf(hash) !== -1 ? hash : 'home';
}

document.addEventListener('DOMContentLoaded', function() {
  var initialPage = getPageFromHash();
  navigateTo(initialPage);
});

document.addEventListener('click', function(e) {
  var link = e.target.closest('[data-page]');
  if (!link) return;
  e.preventDefault();
  var pageId = link.getAttribute('data-page');
  if (pageId) {
    history.pushState(null, '', '#' + pageId);
    navigateTo(pageId);
  }
});

window.addEventListener('popstate', function() {
  var pageId = getPageFromHash();
  navigateTo(pageId);
});

/* ============================================================
   2. HAMBURGER MENU
   ============================================================ */
var hamburger = document.getElementById('hamburger');
var navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', function() {
  var isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

/* ============================================================
   3. STICKY HEADER SHADOW
   ============================================================ */
var header = document.getElementById('site-header');

window.addEventListener('scroll', function() {
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

/* ============================================================
   3b. THEME TOGGLE
   ============================================================ */
var themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', function() {
    var current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* ============================================================
   4. FAQ ACCORDION
   ============================================================ */
document.addEventListener('click', function(e) {
  var btn = e.target.closest('.faq-question');
  if (!btn) return;

  var isOpen = btn.getAttribute('aria-expanded') === 'true';
  var answer = btn.nextElementSibling;

  if (!answer || !answer.classList.contains('faq-answer')) return;

  if (isOpen) {
    btn.setAttribute('aria-expanded', 'false');
    answer.style.maxHeight = null;
  } else {
    btn.setAttribute('aria-expanded', 'true');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }
});

/* ============================================================
   5. PORTFOLIO FILTERS
   ============================================================ */
var filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    var filter = this.getAttribute('data-filter');

    filterBtns.forEach(function(b) { b.classList.remove('active'); });
    this.classList.add('active');

    var items = document.querySelectorAll('.portfolio-item');
    items.forEach(function(item) {
      if (filter === 'all' || item.getAttribute('data-category') === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* ============================================================
   6. CONTACT FORM VALIDATION
   ============================================================ */
var contactForm = document.getElementById('contact-form');
var formSuccess = document.getElementById('form-success');
var formSubmit = document.getElementById('form-submit');

function showError(fieldId, msg) {
  var field = document.getElementById(fieldId);
  var error = document.getElementById(fieldId + '-error');
  if (field) field.classList.add('error');
  if (error) error.textContent = msg;
}

function clearError(fieldId) {
  var field = document.getElementById(fieldId);
  var error = document.getElementById(fieldId + '-error');
  if (field) field.classList.remove('error');
  if (error) error.textContent = '';
}

function clearAllErrors() {
  var fields = ['name', 'business', 'contact-input', 'message'];
  fields.forEach(clearError);
}

function validateForm() {
  var valid = true;
  clearAllErrors();

  var name = document.getElementById('name').value.trim();
  if (!name) {
    showError('name', 'Please enter your name.');
    valid = false;
  }

  var business = document.getElementById('business').value.trim();
  if (!business) {
    showError('business', 'Please enter your business name.');
    valid = false;
  }

  var contact = document.getElementById('contact-input').value.trim();
  if (!contact) {
    showError('contact-input', 'Please enter your email or WhatsApp number.');
    valid = false;
  }

  var message = document.getElementById('message').value.trim();
  if (!message) {
    showError('message', 'Please enter a message.');
    valid = false;
  } else if (message.length < 10) {
    showError('message', 'Message is too short. Please tell us a bit more.');
    valid = false;
  }

  return valid;
}

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateForm()) return;

    formSubmit.disabled = true;
    formSubmit.textContent = 'Sending...';

    setTimeout(function() {
      contactForm.reset();
      clearAllErrors();
      formSubmit.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'flex';
    }, 1200);
  });

  var formInputs = contactForm.querySelectorAll('input, textarea');
  formInputs.forEach(function(input) {
    input.addEventListener('input', function() {
      var id = this.id;
      clearError(id);
    });
  });
}

/* ============================================================
   7. SCROLL REVEAL ANIMATION (subtle entrance)
   ============================================================ */
if ('IntersectionObserver' in window) {
  var revealStyle = document.createElement('style');
  revealStyle.textContent = [
    '.reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s ease; }',
    '.reveal.visible { opacity: 1; transform: translateY(0); }'
  ].join('');
  document.head.appendChild(revealStyle);

  var revealElements = document.querySelectorAll(
    '.service-card, .why-item, .project-card, .portfolio-item, .service-detail-card, .approach-step, .industry-item, .faq-group'
  );

  revealElements.forEach(function(el) {
    el.classList.add('reveal');
  });

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(function(el) {
    observer.observe(el);
  });
}
