/**
 * Formulaire accueil — question + email
 */
(function () {
  const form = document.getElementById('home-equip-form');
  const statusEl = document.getElementById('home-form-status');
  if (!form || !statusEl) return;

  const cfg = window.ALPE_CONFIG || {};
  const email = (cfg.email || 'info@alpeworkwear.com').trim();
  const endpoint =
    (typeof cfg.formEndpoint === 'string' && cfg.formEndpoint.trim()) ||
    `https://formsubmit.co/ajax/${encodeURIComponent(email)}`;

  const submitBtn = form.querySelector('[type="submit"]');

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = 'home-form-status' + (type ? ` home-form-status--${type}` : '');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('', '');

    const honey = form.querySelector('[name="_honey"]');
    if (honey?.value) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const question = (new FormData(form).get('question') || '').trim();
    const userEmail = (new FormData(form).get('email') || '').trim();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          entreprise: '—',
          nom: '—',
          email: userEmail,
          telephone: '—',
          produit: '—',
          quantites: '—',
          message: question,
          _subject: 'Demande rapide — Alpë Workwear (accueil)',
          _template: 'table',
          _captcha: 'false',
        }),
      });

      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      window.location.assign('merci.html');
    } catch {
      const subject = 'Demande rapide — Alpë Workwear';
      const body = `Email : ${userEmail}\n\nQuestion :\n${question}`;
      const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.assign(mailto);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.removeAttribute('aria-busy');
      }
    }
  });
})();
