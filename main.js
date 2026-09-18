'use strict';
// Shared, dependency-free behaviour for all four pages.
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#site-nav');
function closeMenu() {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  nav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    closeMenu(); toggle.focus();
  }
});
window.matchMedia('(min-width: 851px)').addEventListener('change', closeMenu);
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

const grid = document.querySelector('[data-filter-grid]');
if (grid) {
  const cards = Array.from(grid.children);
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      let visible = 0;
      cards.forEach(card => {
        const show = category === 'all' || card.dataset.category === category;
        card.hidden = !show;
        if (show) visible++;
      });
      document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      const noun = grid.classList.contains('supplier-grid') ? 'supplier' : 'job';
      document.querySelector('.result-count').textContent = `${visible} ${noun}${visible === 1 ? '' : 's'}`;
    });
  });
}

const dialog = document.querySelector('#photo-dialog');
if (dialog) {
  document.querySelectorAll('[data-image]').forEach(button => {
    button.addEventListener('click', () => {
      const image = dialog.querySelector('img');
      image.src = button.dataset.image;
      image.alt = button.querySelector('img').alt;
      dialog.querySelector('#photo-caption').textContent = button.dataset.caption;
      dialog.showModal();
    });
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
}

const form = document.querySelector('#quote-form');
if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const message = `Hi Kracht 4x4! I'd like to enquire about a fitment.\n\nName: ${String(data.get('name')).trim()}\nVehicle: ${String(data.get('vehicle')).trim()}\nInterested in: ${data.get('service')}\n\n${String(data.get('message')).trim()}`;
    const url = `https://wa.me/27788016268?text=${encodeURIComponent(message)}`;
    // No message is sent by the website. The visitor reviews and sends in WhatsApp.
    const status = document.querySelector('#form-status');
    status.replaceChildren(document.createTextNode('Your message is prepared. '));
    const fallback = document.createElement('a');
    fallback.href = url; fallback.target = '_blank'; fallback.rel = 'noopener';
    fallback.textContent = 'Open WhatsApp to review and send it.';
    status.appendChild(fallback);
    window.open(url, '_blank', 'noopener');
  });
}

// Auto-rotation pauses for interaction, hidden tabs and reduced-motion preferences.
const supplierGallery = document.querySelector('.supplier-gallery');
if (supplierGallery) {
  const track = supplierGallery.querySelector('.supplier-track');
  const pause = supplierGallery.querySelector('[data-supplier-pause]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motion.matches;
  let hovering = false;
  supplierGallery.querySelector('.supplier-controls').hidden = false;
  const label = () => { pause.textContent = paused ? 'Start rotation' : 'Pause rotation'; };
  const advance = direction => {
    const limit = track.scrollWidth - track.clientWidth;
    let next = track.scrollLeft + direction * (track.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap));
    if (direction > 0 && track.scrollLeft >= limit - 2) next = 0;
    if (direction < 0 && track.scrollLeft <= 2) next = limit;
    track.scrollTo({left: Math.max(0, Math.min(limit, next)), behavior: motion.matches ? 'instant' : 'smooth'});
  };
  pause.addEventListener('click', () => { paused = !paused; label(); });
  supplierGallery.querySelector('[data-supplier-prev]').addEventListener('click', () => advance(-1));
  supplierGallery.querySelector('[data-supplier-next]').addEventListener('click', () => advance(1));
  supplierGallery.addEventListener('mouseenter', () => { hovering = true; });
  supplierGallery.addEventListener('mouseleave', () => { hovering = false; });
  track.addEventListener('touchstart', () => { paused = true; label(); }, {passive:true});
  motion.addEventListener('change', () => { paused = motion.matches; label(); });
  setInterval(() => {
    if (!paused && !hovering && !document.hidden && !supplierGallery.contains(document.activeElement)) advance(1);
  }, 3500);
  label();
}
