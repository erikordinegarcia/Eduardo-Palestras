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
