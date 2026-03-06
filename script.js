const navLinks = document.querySelectorAll('.nav-links a');
const anchorLinks = document.querySelectorAll('a[href^="#"]');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const smoothScrollTo = (target) => {
  if (!target) return;

  const header = document.querySelector('.topbar');
  const headerOffset = header ? header.offsetHeight + 12 : 0;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

  if (prefersReducedMotion) {
    window.scrollTo(0, targetTop);
    return;
  }

  const startTop = window.scrollY;
  const distance = targetTop - startTop;
  const duration = 900;
  let startTime = null;

  const easeInOutCubic = (time) => {
    if (time < 0.5) {
      return 4 * time * time * time;
    }
    return 1 - Math.pow(-2 * time + 2, 3) / 2;
  };

  const animate = (currentTime) => {
    if (!startTime) startTime = currentTime;

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);

    window.scrollTo(0, startTop + distance * eased);

    if (progress < 1) {
      window.requestAnimationFrame(animate);
    }
  };

  window.requestAnimationFrame(animate);
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

    navLinks.forEach((item) => item.classList.remove('active'));
    if (link.matches('.nav-links a')) {
      link.classList.add('active');
    }
  });
});

const carousel = document.getElementById('talksCarousel');
const prevTalk = document.getElementById('prevTalk');
const nextTalk = document.getElementById('nextTalk');

if (carousel && prevTalk && nextTalk) {
  const slide = carousel.querySelector('.talk-slide');

  const getStep = () => {
    if (!slide) return 0;

    const style = window.getComputedStyle(carousel);
    const gap = Number.parseFloat(style.columnGap || style.gap || '0');
    return slide.getBoundingClientRect().width + gap;
  };

  prevTalk.addEventListener('click', () => {
    carousel.scrollBy({ left: -getStep(), behavior: 'smooth' });
  });

  nextTalk.addEventListener('click', () => {
    carousel.scrollBy({ left: getStep(), behavior: 'smooth' });
  });
}
