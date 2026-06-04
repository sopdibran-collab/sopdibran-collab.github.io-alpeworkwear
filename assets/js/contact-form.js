(function () {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  const cfg = window.ALPE_CONFIG;
  const params = new URLSearchParams(window.location.search);
  const produit = params.get('produit');
  const produitField = form.querySelector('[name="produit"]');
  if (produit && produitField) produitField.value = produit;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    if (cfg.formEndpoint) {
      try {
        const res = await fetch(cfg.formEndpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: data,
        });
        if (res.ok) {
          status.textContent = 'Votre message a été envoyé. Nous vous recontacterons.';
          form.reset();
        } else {
          status.textContent = 'Envoi impossible. Contactez-nous directement par email ou téléphone.';
        }
      } catch {
        status.textContent = 'Erreur réseau. Utilisez email ou téléphone ci-dessous.';
      }
      return;
    }

    const subject = encodeURIComponent(`Devis Alpë Workwear — ${payload.entreprise || 'Demande'}`);
    const body = encodeURIComponent(
      [
        `Entreprise: ${payload.entreprise || ''}`,
        `Contact: ${payload.nom || ''}`,
        `Email: ${payload.email || ''}`,
        `Téléphone: ${payload.telephone || ''}`,
        `Produit / gamme: ${payload.produit || ''}`,
        `Quantités: ${payload.quantites || ''}`,
        '',
        payload.message || '',
      ].join('\n')
    );
    window.location.href = `mailto:${cfg.email}?subject=${subject}&body=${body}`;
    status.textContent = 'Votre client mail va s’ouvrir avec le message prérempli.';
  });
})();
