/**
 * Formulaire accueil — question + e-mail
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

    const fd = new FormData(form);
    const question = (fd.get('question') || '').trim();
    const userEmail = (fd.get('email') || '').trim();

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
          message: question,
          _subject: `Demande accueil — ${userEmail}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      window.location.assign('merci.html');
    } catch {
      const subject = 'Demande accueil — Alpë Workwear';
      const body = `E-mail : ${userEmail}\n\nMessage :\n${question}`;
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
