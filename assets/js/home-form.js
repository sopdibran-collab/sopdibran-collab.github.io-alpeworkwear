/**
 * Formulaire accueil — question + e-mail
 */
(function () {
  const form = document.getElementById('home-equip-form');
  const statusEl = document.getElementById('home-form-status');
  if (!form || !statusEl) return;

  const cfg = window.ALPE_CONFIG || {};
  const email = (cfg.email || 'info@alpeworkwear.ch').trim();
  const endpoint =
    (typeof cfg.formEndpoint === 'string' && cfg.formEndpoint.trim()) ||
    `https://formsubmit.co/ajax/${encodeURIComponent(email)}`;

  const submitBtn = form.querySelector('[type="submit"]');
  const logoInput = form.querySelector('input[type="file"][name="attachment"]');
  const LOGO_EXTENSIONS = ['png', 'jpg', 'jpeg', 'svg', 'pdf'];
  const LOGO_MAX_BYTES = Number(logoInput?.dataset.maxBytes) || 10 * 1024 * 1024;
  const LOGO_COPY = {
    fr: {
      type: 'Format non accepté. Utilisez un PNG, JPG, SVG ou PDF.',
      size: 'Ce fichier dépasse la limite de 10 Mo.',
    },
    en: {
      type: 'This file type is not accepted. Use a PNG, JPG, SVG or PDF.',
      size: 'This file exceeds the 10 MB limit.',
    },
    de: {
      type: 'Format nicht akzeptiert. Verwenden Sie PNG, JPG, SVG oder PDF.',
      size: 'Diese Datei überschreitet das Limit von 10 MB.',
    },
    it: {
      type: 'Formato non accettato. Usate PNG, JPG, SVG o PDF.',
      size: 'Questo file supera il limite di 10 MB.',
    },
  };

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = 'home-form-status' + (type ? ` home-form-status--${type}` : '');
  }

  function logoCopy() {
    const lang = (document.documentElement.lang || 'fr').toLowerCase().slice(0, 2);
    return LOGO_COPY[lang] || LOGO_COPY.fr;
  }

  function syncLogoValidity() {
    if (!logoInput) return '';
    const file = logoInput.files && logoInput.files[0];
    if (!file) {
      logoInput.setCustomValidity('');
      logoInput.classList.remove('form-field--error');
      return '';
    }
    const ext = (file.name || '').split('.').pop().toLowerCase();
    const copy = logoCopy();
    let message = '';
    if (!LOGO_EXTENSIONS.includes(ext)) message = copy.type;
    else if (file.size > LOGO_MAX_BYTES) message = copy.size;
    logoInput.setCustomValidity(message);
    logoInput.classList.toggle('form-field--error', Boolean(message));
    return message;
  }

  if (logoInput) {
    logoInput.addEventListener('change', () => {
      const message = syncLogoValidity();
      setStatus(message, message ? 'error' : '');
    });
  }

  form.addEventListener('submit', async (e) => {
    setStatus('', '');

    const honey = form.querySelector('[name="_honey"]');
    if (honey?.value) {
      e.preventDefault();
      return;
    }

    const logoMessage = syncLogoValidity();
    if (!form.checkValidity()) {
      e.preventDefault();
      form.reportValidity();
      if (logoMessage && form.querySelector(':invalid') === logoInput) setStatus(logoMessage, 'error');
      return;
    }

    const fd = new FormData(form);
    const question = (fd.get('question') || '').trim();
    const userEmail = (fd.get('email') || '').trim();
    const ville = (fd.get('ville') || '').trim();
    const message = ville ? `${question}\n\nVille de livraison : ${ville}` : question;
    const file = logoInput && logoInput.files && logoInput.files[0];

    // FormSubmit n’attache pas les fichiers au JSON AJAX : envoi multipart natif.
    if (file) {
      const subject = form.querySelector('input[name="_subject"]');
      if (subject) subject.value = `Demande accueil — ${userEmail}`;
      const mirrors = {
        entreprise: 'Demande via accueil',
        nom: '—',
        telephone: '—',
        produit: '—',
        quantites: '—',
        marquage: '—',
        delai: '—',
        message,
      };
      Object.entries(mirrors).forEach(([name, value]) => {
        let input = form.querySelector(`input[data-logo-mirror="${name}"]`);
        if (!input) {
          input = document.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.dataset.logoMirror = name;
          form.appendChild(input);
        }
        input.value = value;
      });
      if (submitBtn) submitBtn.setAttribute('aria-busy', 'true');
      return;
    }

    e.preventDefault();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          entreprise: 'Demande via accueil',
          nom: '—',
          email: userEmail,
          telephone: '—',
          produit: '—',
          quantites: '—',
          marquage: '—',
          ville: ville || '—',
          delai: '—',
          message,
          _subject: `Demande accueil — ${userEmail}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      window.location.assign('merci.html');
    } catch {
      const subject = 'Demande accueil — Alpë Workwear';
      const body = `E-mail : ${userEmail}\n${ville ? `Ville : ${ville}\n` : ''}\nMessage :\n${question}`;
      window.location.assign(
        `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.removeAttribute('aria-busy');
      }
    }
  });
})();
