/**
 * Lecteur vidéo inline — chargement différé au premier clic.
 */
(function () {
  document.querySelectorAll('.inline-video-card').forEach(function (card) {
    const video = card.querySelector('.inline-video-card__video');
    const playBtn = card.querySelector('.inline-video-card__play');
    if (!video || !playBtn) return;

    const src = video.getAttribute('data-src');
    if (!src) return;

    function startPlayback() {
      if (!video.getAttribute('src')) {
        video.setAttribute('src', src);
        video.load();
      }
      card.classList.add('is-playing');
      playBtn.setAttribute('hidden', '');
      video.setAttribute('controls', '');
      video.play().catch(function () {
        card.classList.remove('is-playing');
        playBtn.removeAttribute('hidden');
        video.removeAttribute('controls');
      });
    }

    function resetToPoster() {
      card.classList.remove('is-playing');
      playBtn.removeAttribute('hidden');
      video.removeAttribute('controls');
      video.pause();
      video.currentTime = 0;
    }

    playBtn.addEventListener('click', startPlayback);

    video.addEventListener('ended', resetToPoster);
  });
})();
