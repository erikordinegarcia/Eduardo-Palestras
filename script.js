const navLinks = document.querySelectorAll('.nav-links a');
const anchorLinks = document.querySelectorAll('a[href^="#"]');

const header = document.querySelector('.topbar');
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    if (event.key === 'Escape') {
      setMenuOpen(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      setMenuOpen(false);
    }
  });
}

const setActiveLink = (hash) => {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === hash;
    link.classList.toggle('active', isActive);
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

    prevTalk.style.opacity = isAtStart ? '0.45' : '1';
    nextTalk.style.opacity = isAtEnd ? '0.45' : '1';
  };

  const getStep = () => {
    const card = carousel.querySelector('.talk-slide');
    if (!card) return 0;

    const style = window.getComputedStyle(carousel);
    const gap = parseFloat(style.gap || 0);

    return card.offsetWidth + gap;
  };

  if (prevTalk && nextTalk) {
    prevTalk.addEventListener('click', () => {
      carousel.scrollBy({ left: -getStep(), behavior: 'smooth' });
    });

    nextTalk.addEventListener('click', () => {
      carousel.scrollBy({ left: getStep(), behavior: 'smooth' });
    });
  }

  carousel.addEventListener('scroll', updateCarouselButtons, { passive: true });
  window.addEventListener('resize', updateCarouselButtons);
  updateCarouselButtons();
}

// FORMULARIO
function enviarEmail(e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const mensagem = document.getElementById('mensagem').value;

  const assunto = 'Contato pelo site';
  const corpo = `Nome: ${nome}
Email: ${email}

Mensagem:
${mensagem}`;

  window.location.href =
    'mailto:contato@eduardopigozzi.com.br?subject=' +
    encodeURIComponent(assunto) +
    '&body=' +
    encodeURIComponent(corpo);
}

const slides = document.querySelectorAll('.slide');

if (slides.length) {
  let current = 0;

  function trocarSlide() {
    slides[current].classList.remove('active');

    current++;

    if (current >= slides.length) {
      current = 0;
    }

    slides[current].classList.add('active');
  }

  setInterval(trocarSlide, 1500); // Troca o slide a cada 1.5 segundos
}

let lastScroll = 0;
const siteHeader = document.getElementById('header');

if (siteHeader) {
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > 50) {
      siteHeader.classList.add('hide');
    } else {
      siteHeader.classList.remove('hide');
    }

    lastScroll = currentScroll;
  });
}

const carousel2 = document.getElementById('feedbackCarousel');
const nextBtn = document.getElementById('nextFeedback');
const prevBtn = document.getElementById('prevFeedback');

let index = 0;

function getVisibleCards() {
  const width = window.innerWidth;
  if (width >= 1024) return 3; // desktop
  if (width >= 768) return 2; // tablet
  return 1; // mobile
}

function updateCarousel() {
  const card = carousel2.querySelector('.feedback-card');
  if (!card) return;

  const gap = 25;
  const cardWidth = card.offsetWidth + gap;

  carousel2.style.transform = `translateX(-${index * cardWidth}px)`;
}

nextBtn.addEventListener('click', () => {
  const visible = getVisibleCards();
  const max = carousel2.children.length - visible;

  index = index >= max ? 0 : index + visible;
  updateCarousel();
});

prevBtn.addEventListener('click', () => {
  const visible = getVisibleCards();
  const max = carousel2.children.length - visible;

  index = index <= 0 ? max : index - visible;
  updateCarousel();
});

// DEPOIMENTOS
const feedbackCarousel = document.getElementById('feedbackCarousel');
const prevFeedback = document.getElementById('prevFeedback');
const nextFeedback = document.getElementById('nextFeedback');

if (feedbackCarousel) {
  const feedbackCards = [...feedbackCarousel.querySelectorAll('.feedback-card')];
  let feedbackPageStarts = [0];
  let feedbackPageIndex = 0;

  const updateFeedbackPosition = () => {
    const activeCard = feedbackCards[feedbackPageStarts[feedbackPageIndex]];
    const targetLeft = activeCard ? activeCard.offsetLeft : 0;

    feedbackCarousel.style.transform = `translateX(-${targetLeft}px)`;

    if (prevFeedback) prevFeedback.disabled = feedbackPageIndex === 0;
    if (nextFeedback) nextFeedback.disabled = feedbackPageIndex >= feedbackPageStarts.length - 1;
  };

  const calculateFeedbackPages = () => {
    if (!feedbackCards.length) return;

    feedbackCarousel.style.transform = 'translateX(0px)';

    const wrapper = feedbackCarousel.parentElement;
    const wrapperWidth = wrapper ? wrapper.clientWidth : feedbackCarousel.clientWidth;
    const pageStarts = [];
    let index = 0;

    while (index < feedbackCards.length) {
      pageStarts.push(index);

      const startLeft = feedbackCards[index].offsetLeft;
      let endIndex = index;

      while (endIndex + 1 < feedbackCards.length) {
        const nextCard = feedbackCards[endIndex + 1];
        const nextRight = nextCard.offsetLeft + nextCard.offsetWidth;

        if (nextRight - startLeft > wrapperWidth) break;
        endIndex += 1;
      }

      if (endIndex === feedbackCards.length - 1) break;

      const visibleCount = Math.max(1, endIndex - index + 1);
      const remainingCards = feedbackCards.length - (endIndex + 1);

      if (remainingCards > 0 && remainingCards < visibleCount) {
        index = Math.max(index + 1, feedbackCards.length - visibleCount);
      } else {
        index = endIndex + 1;
      }
    }

    feedbackPageStarts = [...new Set(pageStarts)];
    feedbackPageIndex = Math.min(feedbackPageIndex, feedbackPageStarts.length - 1);
    updateFeedbackPosition();
  };

  prevFeedback?.addEventListener('click', () => {
    if (feedbackPageIndex === 0) return;
    feedbackPageIndex -= 1;
    updateFeedbackPosition();
  });

  nextFeedback?.addEventListener('click', () => {
    if (feedbackPageIndex >= feedbackPageStarts.length - 1) return;
    feedbackPageIndex += 1;
    updateFeedbackPosition();
  });

  window.addEventListener('resize', calculateFeedbackPages);
  calculateFeedbackPages();
}

// CONTADOR
setInterval(() => {
  const visible = getVisibleCards();
  const max = carousel2.children.length - visible;

  index = index >= max ? 0 : index + visible;
  updateCarousel();
}, 10000);

const counters = document.querySelectorAll('.contador');

const formatNumber = (num) => {
  return '+' + num.toLocaleString('pt-BR');
};

const startCounter = (counter) => {
  const target = +counter.getAttribute('data-target');
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

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      startCounter(counter);
      obs.unobserve(counter);
    }
  });
}, {
  threshold: 0.5
});

counters.forEach((counter) => {
  counter.innerText = '+0';
  observer.observe(counter);
});

// =========================
// SCROLL REVEAL
// =========================
const revealElements = document.querySelectorAll(
  '.reveal, .reveal-delay, .title-line'
);

const revealOnScroll = () => {
  const trigger = window.innerHeight * 0.85;

  revealElements.forEach((el) => {
    const top = el.getBoundingClientRect().top;

    if (top < trigger) {
      el.classList.add('active');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// ===== TYPE EFFECT CORRIGIDO (mantém <br>) =====
const typeElements = document.querySelectorAll('.type-effect');

typeElements.forEach((el) => {
  const nodes = [...el.childNodes];
  el.innerHTML = '';

  nodes.forEach((node) => {
    if (node.nodeName === "BR") {
      el.appendChild(document.createElement("br"));
    } else {
      const text = node.textContent;

      text.split('').forEach((letter, i) => {
        const span = document.createElement('span');
        const text = node.textContent;
        span.textContent = letter; // 🔥 corrigido aqui

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
      const spans = entry.target.querySelectorAll('span');
      spans.forEach((span) => {
        span.style.opacity = 1;
        span.style.transform = 'translateY(0)';
      });
    }
  });
});

typeElements.forEach((el) => typeObserver.observe(el));
