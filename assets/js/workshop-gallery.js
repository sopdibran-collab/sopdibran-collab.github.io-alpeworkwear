/**
 * Galerie atelier — lecture vidéo en modal, chargement différé.
 */
(function () {
  const modal = document.getElementById('workshop-modal');
  if (!modal) return;

  const video = modal.querySelector('video');
  const closeBtn = modal.querySelector('.workshop-modal__close');
  const backdrop = modal.querySelector('.workshop-modal__backdrop');
  const triggers = document.querySelectorAll('.workshop-gallery__trigger');
  let lastFocus = null;

  function openModal(src, label) {
    lastFocus = document.activeElement;
    modal.hidden = false;
    modal.setAttribute('aria-label', label);
    document.body.classList.add('is-modal-open');
    video.src = src;
    video.load();
    video.play().catch(function () {});
    closeBtn.focus();
  }

  function closeModal() {
    video.pause();
    video.removeAttribute('src');
    video.load();
    modal.hidden = true;
    document.body.classList.remove('is-modal-open');
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  }

  triggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const src = btn.getAttribute('data-video-src');
      const label = btn.getAttribute('data-video-label');
      if (src) openModal(src, label || 'Lecture vidéo');
    });
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();
