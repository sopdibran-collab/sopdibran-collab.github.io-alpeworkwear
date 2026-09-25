/**
 * Contrôle local de la taille des fichiers (limite FormSubmit : 10 Mo au total).
 * L'envoi reste un POST classique multipart, sans AJAX.
 */
(function () {
  const MAX_BYTES = 10 * 1024 * 1024;

  document.querySelectorAll('form[data-cut-sew-form]').forEach((form) => {
    const fileInput = form.querySelector('input[type="file"][name="attachment"]');
    const linkInput = form.querySelector('[data-tech-pack-link]');
    const status = form.querySelector('[data-file-status]');
    if (!fileInput) return;

    const isEn = document.documentElement.lang === 'en';
    const overMessage = isEn
      ? 'This file exceeds the 10 MB limit. Remove it and paste a share link instead.'
      : 'Ce fichier dépasse la limite de 10 Mo. Retirez-le et indiquez un lien de partage.';

    function totalSize() {
      let total = 0;
      if (!fileInput.files) return 0;
      for (let i = 0; i < fileInput.files.length; i += 1) {
        total += fileInput.files[i].size || 0;
      }
      return total;
    }

    function showOver() {
      if (!status) return;
      status.textContent = overMessage;
      status.className = 'form-status form-status--error';
    }

    function clearStatus() {
      if (!status) return;
      status.textContent = '';
      status.className = 'form-status';
    }

    fileInput.addEventListener('change', () => {
      if (totalSize() > MAX_BYTES) {
        showOver();
        if (linkInput) linkInput.focus();
      } else {
        clearStatus();
      }
    });

    form.addEventListener('submit', (event) => {
      if (totalSize() <= MAX_BYTES) return;
      event.preventDefault();
      showOver();
      if (linkInput) linkInput.focus();
    });
  });
})();
