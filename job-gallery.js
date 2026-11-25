'use strict';

const gallery = document.querySelector('#job-gallery');
const galleryTitle = gallery.querySelector('h2');
const photos = gallery.querySelector('.job-gallery-images');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

for (const cover of document.querySelectorAll('[data-slides]')) {
  const slides = cover.dataset.slides.split('|');
  const coverImage = cover.querySelector('img');
  const title = cover.closest('.job-card').querySelector('h3').textContent;
  let current = 0;
  let timer;

  function stop() {
    clearInterval(timer);
  }

  cover.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse' || reducedMotion.matches || slides.length < 2) return;
    stop();
    timer = setInterval(() => {
      current = (current + 1) % slides.length;
      coverImage.src = slides[current];
    }, 1250);
  });
  cover.addEventListener('pointerleave', stop);
  cover.addEventListener('click', () => {
    stop();
    galleryTitle.textContent = title;
    photos.replaceChildren(...slides.map((src, index) => {
      const image = document.createElement('img');
      image.src = src;
      image.alt = `${title} workshop photo ${index + 1}`;
      image.loading = index === current ? 'eager' : 'lazy';
      return image;
    }));
    gallery.showModal();
    gallery.scrollTop = 0;
    if (current > 0) photos.children[current].scrollIntoView({ block: 'start' });
  });
}
