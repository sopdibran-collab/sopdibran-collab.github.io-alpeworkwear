/**
 * Formulaire de contact — FormSubmit.co (AJAX) ou fallback mailto
 */
(function () {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  if (!form || !statusEl) return;

  const cfg = window.ALPE_CONFIG || {};
  const email = (cfg.email || 'info@alpeworkwear.com').trim();
  const endpoint =
    (typeof cfg.formEndpoint === 'string' && cfg.formEndpoint.trim()) ||
    `https://formsubmit.co/ajax/${encodeURIComponent(email)}`;

  const params = new URLSearchParams(window.location.search);
  const produitField = form.querySelector('[name="produit"]');
  const produitParam = params.get('produit');
  if (produitParam && produitField && !produitField.value) {
    produitField.value = produitParam;
  }

  const submitBtn = form.querySelector('[type="submit"]');

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = 'form-status' + (type ? ` form-status--${type}` : '');
  }

  function clearFieldErrors() {
    form.querySelectorAll('.form-field--error').forEach((el) => el.classList.remove('form-field--error'));
  }

  function markInvalidFields() {
    let firstInvalid = null;
    form.querySelectorAll('input, textarea, select').forEach((field) => {
      if (field.name === '_honey') return;
      if (!field.checkValidity()) {
        field.classList.add('form-field--error');
        if (!firstInvalid) firstInvalid = field;
      } else {
        field.classList.remove('form-field--error');
      }
    });
    return firstInvalid;
  }

  function getPayload(formData) {
    return {
      entreprise: (formData.get('entreprise') || '').trim(),
      nom: (formData.get('nom') || '').trim(),
      email: (formData.get('email') || '').trim(),
      telephone: (formData.get('telephone') || '').trim(),
      produit: (formData.get('produit') || '').trim(),
      quantites: (formData.get('quantites') || '').trim(),
      message: (formData.get('message') || '').trim(),
    };
  }

  function buildMailtoUrl(payload) {
    const subject = `Demande Alpë Workwear — ${payload.entreprise}`;
    const lines = [
      `Entreprise : ${payload.entreprise}`,
      `Contact : ${payload.nom}`,
      `Email : ${payload.email}`,
    ];
    if (payload.telephone) lines.push(`Téléphone : ${payload.telephone}`);
    if (payload.produit) lines.push(`Produit / gamme : ${payload.produit}`);
    if (payload.quantites) lines.push(`Quantités estimées : ${payload.quantites}`);
    lines.push('', payload.message);
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  }

  function openMailto(url) {
    const link = document.createElement('a');
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function sendViaFormSubmit(payload) {
    const body = {
      entreprise: payload.entreprise,
      nom: payload.nom,
      email: payload.email,
      telephone: payload.telephone || '—',
      produit: payload.produit || '—',
      quantites: payload.quantites || '—',
      message: payload.message,
      _subject: `Demande Alpë Workwear — ${payload.entreprise}`,
      _template: 'table',
      _captcha: 'false',
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      /* non-JSON */
    }

    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || `Erreur ${res.status}`;
      throw new Error(msg);
    }
    return data;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFieldErrors();
    setStatus('', '');

    const honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) return;

    if (!form.checkValidity()) {
      const first = markInvalidFields();
      form.reportValidity();
      setStatus('Veuillez corriger les champs indiqués.', 'error');
      first?.focus();
      return;
    }

    const formData = new FormData(form);
    const payload = getPayload(formData);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
    }

    try {
      await sendViaFormSubmit(payload);
      window.location.assign('merci.html');
      return;
    } catch (err) {
      console.error('FormSubmit:', err);
      try {
        openMailto(buildMailtoUrl(payload));
        setStatus(
          'Envoi direct indisponible. Votre messagerie s’ouvre avec le message prérempli — envoyez le courriel pour finaliser.',
          'success'
        );
      } catch {
        setStatus(
          `L’envoi n’a pas abouti. Écrivez-nous à ${email} ou appelez le ${cfg.phoneDisplay || '+41 79 779 21 51'}.`,
          'error'
        );
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.removeAttribute('aria-busy');
      }
    }
  });

  form.addEventListener('input', (e) => {
    const field = e.target;
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      if (field.checkValidity()) field.classList.remove('form-field--error');
    }
  });
})();
