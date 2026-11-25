'use strict';

const gallery = document.querySelector('#job-gallery');
const galleryTitle = gallery.querySelector('h2');
const image = gallery.querySelector('.job-gallery-image');
const nextImage = gallery.querySelector('.job-gallery-next-image');
const counter = gallery.querySelector('.job-gallery-counter');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeSlides = [];
let position = 0;

function showSlide(offset) {
  position = (position + offset + activeSlides.length) % activeSlides.length;
  image.src = activeSlides[position];
  image.alt = `${galleryTitle.textContent} workshop photo ${position + 1}`;
  counter.textContent = `${position + 1} of ${activeSlides.length}`;
}

gallery.querySelector('[data-previous]').addEventListener('click', () => showSlide(-1));
gallery.querySelector('[data-next]').addEventListener('click', () => showSlide(1));
nextImage.addEventListener('click', () => showSlide(1));
gallery.addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  showSlide(event.key === 'ArrowLeft' ? -1 : 1);
});
gallery.addEventListener('click', event => {
  if (event.target !== gallery) return;
  const bounds = gallery.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) gallery.close();
});

for (const cover of document.querySelectorAll('[data-slides]')) {
  const slides = cover.dataset.slides.split('|');
  const coverImage = cover.querySelector('img');
  const title = cover.closest('.job-card').querySelector('h3').textContent;
  let current = 0;
  let timer;
  const stop = () => clearInterval(timer);

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
    activeSlides = slides;
    position = current;
    galleryTitle.textContent = title;
    showSlide(0);
    gallery.showModal();
  });
}
