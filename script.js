const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  });
});

const carousel = document.getElementById('talksCarousel');
const prevTalk = document.getElementById('prevTalk');
const nextTalk = document.getElementById('nextTalk');

if (carousel && prevTalk && nextTalk) {
  const slide = carousel.querySelector('.talk-slide');

  const getStep = () => {
    if (!slide) {
      return 0;
    }

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
