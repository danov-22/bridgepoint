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
  updateBrandMark(theme);
}

function updateBrandMark(theme) {
  var mark = 'images/bridgepoint-b-' + (theme === 'dark' ? 'white' : 'green') + '.svg';
  document.querySelectorAll('.nav-logo-image img, #logoModalImg').forEach(function(img) {
    img.src = mark;
  });
  var favicon = document.querySelector('link[rel="icon"]');
  if (favicon) favicon.href = mark;
}
updateBrandMark(document.documentElement.getAttribute('data-theme'));

/* ============================================================
   1. PAGE NAVIGATION (single-page hash routing)
   ============================================================ */
function navigateTo(pageId) {
  var target = document.getElementById('page-' + pageId);
  if (!target) return;
  var disclosure = target.closest('details');
  if (disclosure) disclosure.open = true;
  document.querySelectorAll('.nav-link[data-page]').forEach(function(link) {
    link.classList.toggle('active', link.getAttribute('data-page') === pageId);
  });
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  var menu = document.getElementById('nav-links');
  var toggle = document.getElementById('hamburger');
  menu.classList.remove('open');
  toggle.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}
function getPageFromHash() {
  var hash = window.location.hash.slice(1);
  return ['home', 'services', 'portfolio', 'pricing', 'faq', 'about', 'contact'].indexOf(hash) !== -1 ? hash : 'home';
}
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.hash) navigateTo(getPageFromHash());
});
document.addEventListener('click', function(e) {
  var link = e.target.closest('[data-page]');
  if (!link) return;
  e.preventDefault();
  var pageId = link.getAttribute('data-page');
  history.pushState(null, '', '#' + pageId);
  navigateTo(pageId);
});
window.addEventListener('popstate', function() { navigateTo(getPageFromHash()); });

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
   3c. LOGO MODAL & ZOOM
   ============================================================ */
var logoTriggers = document.querySelectorAll('.logo-trigger');
var logoModal = document.getElementById('logoModal');
var logoClose = document.querySelector('.logo-close');
var logoModalImg = document.getElementById('logoModalImg');

function openLogoModal(trigger) {
  if (logoModal) {
    logoModal.classList.add('active');
  }

  if (logoModalImg && trigger) {
    var triggerImg = trigger.querySelector('img');
    if (triggerImg) {
      logoModalImg.src = triggerImg.currentSrc || triggerImg.src;
    }
  }
}

function closeLogoModal() {
  if (logoModal) {
    logoModal.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

if (logoTriggers.length && logoModal) {
  logoTriggers.forEach(function(trigger) {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      openLogoModal(trigger);
    });
  });

  if (logoClose) {
    logoClose.addEventListener('click', closeLogoModal);
  }

  if (logoModal) {
    logoModal.addEventListener('click', function(e) {
      if (e.target === logoModal) {
        closeLogoModal();
      }
    });
  }

  if (logoModalImg) {
    logoModalImg.addEventListener('click', closeLogoModal);
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && logoModal.classList.contains('active')) {
      closeLogoModal();
    }
  });
}

/* Logo text - scroll to top */
var logoText = document.querySelector('.nav-logo-text');
if (logoText) {
  logoText.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigateTo('home');
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

document.addEventListener("DOMContentLoaded", function () {

  const contactForm = document.getElementById("contact-form");

  if (!contactForm) {
    console.log("Contact form not found on this page");
    return;
  }

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById("form-submit");

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    const data = {
      name: document.getElementById("name")?.value || "",
      business: document.getElementById("business")?.value || "",
      email: document.getElementById("contact-input")?.value || "",
      message: document.getElementById("message")?.value || ""
    };

    try {
      await fetch("YOUR_SCRIPT_URL", {
        method: "POST",
        body: JSON.stringify(data),
        mode: "no-cors"
      });

      const success = document.getElementById("form-success");
      if (success) success.style.display = "flex";

      contactForm.reset();

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });

});

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

/* On-site question guide: answers come directly from the published FAQ. */
(function() {
  var panel = document.getElementById('help-panel');
  if (!panel) return;
  var toggle = document.querySelector('.help-toggle');
  var messages = panel.querySelector('.help-messages');
  var suggestions = panel.querySelector('.help-suggestions');
  var input = document.getElementById('help-input');
  var isIndonesian = document.documentElement.lang === 'id';
  var entries = Array.from(document.querySelectorAll('#page-faq .faq-item')).map(function(item) {
    return { question: item.querySelector('.faq-question').textContent.trim(), answer: item.querySelector('.faq-answer').textContent.trim() };
  }).filter(function(entry) { return entry.question && entry.answer; });
  function answer(entry) {
    suggestions.hidden = true;
    messages.replaceChildren();
    var question = document.createElement('strong'); question.textContent = entry.question;
    var response = document.createElement('p'); response.textContent = entry.answer;
    messages.append(question, response);
  }
  entries.slice(0, 4).forEach(function(entry) {
    var button = document.createElement('button'); button.type = 'button'; button.textContent = entry.question;
    button.addEventListener('click', function() { answer(entry); }); suggestions.appendChild(button);
  });
  function setOpen(open) { panel.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); if (open) input.focus(); }
  toggle.addEventListener('click', function() { setOpen(panel.hidden); });
  panel.querySelector('.help-close').addEventListener('click', function() { setOpen(false); toggle.focus(); });
  document.addEventListener('click', function(e) {
    if (!panel.hidden && !e.target.closest('.help-widget')) setOpen(false);
  });
  input.addEventListener('input', function() {
    suggestions.hidden = input.value.trim().length > 0 || messages.childElementCount > 0;
  });
  panel.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    suggestions.hidden = true;
    var query = input.value.toLowerCase().trim();
    var words = query.match(/[a-zA-Z?-?0-9]{4,}/g) || [];
    var ranked = entries.map(function(entry) {
      var question = entry.question.toLowerCase();
      return { entry: entry, score: words.filter(function(word) { return question.includes(word); }).length };
    }).sort(function(a, b) { return b.score - a.score; });
    var match = entries.find(function(entry) { return entry.question.toLowerCase() === query; });
    if (!match && ranked.length && ranked[0].score >= 2 && (!ranked[1] || ranked[0].score > ranked[1].score)) match = ranked[0].entry;
    messages.replaceChildren();
    if (match) { answer(match); return; }
    var notice = document.createElement('p');
    notice.textContent = isIndonesian ? 'Kami belum menemukan jawaban yang pasti. Silakan lihat semua pertanyaan atau hubungi kami melalui WhatsApp.' : 'I could not find a certain answer. Browse all questions or contact us on WhatsApp for a personal reply.';
    var link = document.createElement('a'); link.href = '#faq'; link.dataset.page = 'faq'; link.textContent = isIndonesian ? 'Lihat semua pertanyaan' : 'Browse all questions';
    link.addEventListener('click', function() { setOpen(false); });
    messages.append(notice, link);
  });
})();
