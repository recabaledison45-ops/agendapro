/* ============================================
   AGENDAPRO — MAIN JAVASCRIPT
   ============================================ */

// ─── NAVBAR SCROLL ───
const navbar = document.querySelector('.navbar');
const mobileToggle = document.querySelector('.nav-mobile-toggle');
const mobileNav = document.querySelector('.mobile-nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
});

// ─── MOBILE NAV TOGGLE ───
mobileToggle?.addEventListener('click', () => {
  mobileNav?.classList.toggle('open');
  const spans = mobileToggle.querySelectorAll('span');
  mobileNav?.classList.contains('open')
    ? (spans[0].style.transform = 'rotate(45deg) translate(5px,5px)',
       spans[1].style.opacity = '0',
       spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)')
    : (spans[0].style.transform = '',
       spans[1].style.opacity = '',
       spans[2].style.transform = '');
});

// Close mobile nav on link click
document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav?.classList.remove('open');
  });
});

// ─── ACTIVE NAV LINK ───
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage) link.classList.add('active');
});

// ─── SCROLL REVEAL ANIMATION ───
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card, .metric-item').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
  observer.observe(el);
});

// ─── COUNTER ANIMATION ───
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const isDecimal = target % 1 !== 0;
  const startVal = 0;

  const update = (timestamp) => {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = startVal + (target - startVal) * eased;

    el.textContent = isDecimal
      ? current.toFixed(1)
      : Math.floor(current).toLocaleString('es-CL');

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isDecimal
      ? target.toFixed(1)
      : target.toLocaleString('es-CL');
  };

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ─── SMOOTH SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── FORM VALIDATION ───
function initFormValidation(formSelector) {
  const form = document.querySelector(formSelector);
  if (!form) return;

  const inputs = form.querySelectorAll('input[required], textarea[required]');

  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    inputs.forEach(input => {
      if (!validateField(input)) valid = false;
    });

    if (valid) {
      const btn = form.querySelector('button[type="submit"], .btn-primary');
      if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = '<span>✓</span> Enviado exitosamente';
        btn.style.background = 'linear-gradient(135deg, #00D4B8, #00A896)';
        setTimeout(() => {
          btn.innerHTML = original;
          btn.style.background = '';
          form.reset();
        }, 3000);
      }
    }
  });
}

function validateField(input) {
  const value = input.value.trim();
  let valid = true;
  let message = '';

  if (!value) {
    valid = false;
    message = 'Este campo es requerido';
  } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    valid = false;
    message = 'Ingresa un email válido';
  } else if (input.type === 'tel' && value.length < 8) {
    valid = false;
    message = 'Ingresa un teléfono válido';
  }

  const errorEl = input.parentElement.querySelector('.field-error') ||
    (input.closest('.form-group')?.querySelector('.field-error'));

  if (!valid) {
    input.classList.add('error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  } else {
    input.classList.remove('error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  }

  return valid;
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  initFormValidation('#contact-form');
  initFormValidation('#login-form');

  // Trigger scroll check
  if (window.scrollY > 20) navbar?.classList.add('scrolled');
});