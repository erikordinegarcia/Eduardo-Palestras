const navLinks = document.querySelectorAll('.nav-links a');
const anchorLinks = document.querySelectorAll('a[href^="#"]');

const header = document.querySelector('.topbar');
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// MENU
const setMenuOpen = (isOpen) => {
  if (!header || !navToggle) return;

  header.classList.toggle('menu-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
};

if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = header.classList.contains('menu-open');
    setMenuOpen(!isOpen);
  });

  document.addEventListener('click', (event) => {
    if (!header.classList.contains('menu-open')) return;
    if (header.contains(event.target)) return;
    setMenuOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setMenuOpen(false);
  });
}

// SCROLL LINKS
const setActiveLink = (hash) => {
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === hash);
  });
};

const smoothScrollTo = (target) => {
  if (!target) return;

  const headerOffset = header ? header.offsetHeight + 12 : 0;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

  window.scrollTo({
    top: targetTop,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });
};

anchorLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    smoothScrollTo(target);
    window.history.replaceState(null, '', hash);

    if (link.matches('.nav-links a')) {
      setActiveLink(hash);
      setMenuOpen(false);
    }
  });
});

// ATIVO NO SCROLL
const sections = [...document.querySelectorAll('main section[id], footer[id]')];

if (sections.length) {
  const updateActiveByScroll = () => {
    const headerOffset = header ? header.offsetHeight + 24 : 24;
    let currentSection = sections[0];

    sections.forEach((section) => {
      if (window.scrollY + headerOffset >= section.offsetTop) {
        currentSection = section;
      }
    });

    setActiveLink(`#${currentSection.id}`);
  };

  window.addEventListener('scroll', updateActiveByScroll, { passive: true });
  updateActiveByScroll();
}

// CARROSSEL
const carousel = document.getElementById('talksCarousel');
const prevTalk = document.getElementById('prevTalk');
const nextTalk = document.getElementById('nextTalk');

if (carousel) {
  const updateCarouselButtons = () => {
    if (!prevTalk || !nextTalk) return;

    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    const isAtStart = carousel.scrollLeft <= 4;
    const isAtEnd = carousel.scrollLeft >= maxScrollLeft - 4;

    prevTalk.disabled = isAtStart;
    nextTalk.disabled = isAtEnd;
  };

  const getStep = () => {
    const card = carousel.querySelector('.talk-slide');
    if (!card) return 0;

    const gap = parseFloat(getComputedStyle(carousel).gap || 0);
    return card.offsetWidth + gap;
  };

  prevTalk?.addEventListener('click', () => {
    carousel.scrollBy({ left: -getStep(), behavior: 'smooth' });
  });

  nextTalk?.addEventListener('click', () => {
    carousel.scrollBy({ left: getStep(), behavior: 'smooth' });
  });

  carousel.addEventListener('scroll', updateCarouselButtons);
  window.addEventListener('resize', updateCarouselButtons);
  updateCarouselButtons();
}

// FORM
function enviarEmail(e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const mensagem = document.getElementById('mensagem').value;

  const assunto = 'Contato pelo site';
  const corpo = `Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}`;

  window.location.href =
    'mailto:contato@eduardopigozzi.com.br?subject=' +
    encodeURIComponent(assunto) +
    '&body=' +
    encodeURIComponent(corpo);
}

// GALERIA AUTO SLIDE
const slides = document.querySelectorAll('.slide');

if (slides.length) {
  let current = 0;

  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 2500);
}

// HEADER SCROLL
let lastScroll = 0;
const siteHeader = document.getElementById('header');

if (siteHeader) {
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    siteHeader.classList.toggle('hide', currentScroll > lastScroll && currentScroll > 50);
    lastScroll = currentScroll;
  });
}

// CONTADOR
const counters = document.querySelectorAll('.contador');

const formatNumber = (num) => '+' + num.toLocaleString('pt-BR');

const startCounter = (counter) => {
  const target = +counter.dataset.target;
  let current = 0;
  const increment = target / 200;

  const update = () => {
    current += increment;

    if (current < target) {
      counter.innerText = formatNumber(Math.floor(current));
      requestAnimationFrame(update);
    } else {
      counter.innerText = formatNumber(target);
    }
  };

  update();
};

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach((counter) => {
  counter.innerText = '+0';
  observer.observe(counter);
});

// REVEAL
const revealElements = document.querySelectorAll('.reveal, .reveal-delay, .title-line');

const revealOnScroll = () => {
  const trigger = window.innerHeight * 0.85;

  revealElements.forEach((el) => {
    if (el.getBoundingClientRect().top < trigger) {
      el.classList.add('active');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// ✅ TYPE EFFECT CORRIGIDO
const typeElements = document.querySelectorAll('.type-effect');

typeElements.forEach((el) => {
  const nodes = [...el.childNodes];
  el.innerHTML = '';

  nodes.forEach((node) => {
    if (node.nodeName === 'BR') {
      el.appendChild(document.createElement('br'));
    } else {
      const text = node.textContent;

      text.split('').forEach((letter, i) => {
        const span = document.createElement('span');

        span.textContent = letter; // ✅ mantém espaços corretamente

        span.style.transition = '0.3s';
        span.style.transitionDelay = `${i * 0.02}s`;

        el.appendChild(span);
      });
    }
  });
});

const typeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('span').forEach((span) => {
        span.style.opacity = 1;
        span.style.transform = 'translateY(0)';
      });
    }
  });
});

typeElements.forEach((el) => typeObserver.observe(el));
