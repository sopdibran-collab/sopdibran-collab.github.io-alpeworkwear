/**
 * Sélecteur de langue — accueil (FR, DE, IT, EN)
 */
(function () {
  const STORAGE_KEY = 'alpe-lang';
  const SUPPORTED = ['fr', 'de', 'it', 'en'];
  const HTML_LANG = { fr: 'fr-CH', de: 'de-CH', it: 'it-CH', en: 'en' };

  let dictionary = null;

  function getStoredLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED.includes(stored) ? stored : 'fr';
  }

  function setActiveButton(lang) {
    document.querySelectorAll('.lang-switch__item[data-lang]').forEach((btn) => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('lang-switch__item--active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      if (isActive) btn.setAttribute('aria-current', 'true');
      else btn.removeAttribute('aria-current');
    });
  }

  function applyTranslations(lang) {
    const strings = dictionary?.[lang];
    if (!strings) return;

    document.documentElement.lang = HTML_LANG[lang] || lang;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      const value = strings[key];
      if (value == null) return;
      if (el.dataset.i18nHtml === 'true') el.innerHTML = value;
      else el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const value = strings[el.dataset.i18nPlaceholder];
      if (value != null) el.setAttribute('placeholder', value);
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
      const value = strings[el.dataset.i18nAriaLabel];
      if (value != null) el.setAttribute('aria-label', value);
    });

    if (strings['meta.title']) document.title = strings['meta.title'];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && strings['meta.description']) metaDesc.setAttribute('content', strings['meta.description']);

    localStorage.setItem(STORAGE_KEY, lang);
    setActiveButton(lang);
  }

  function initButtons() {
    document.querySelectorAll('.lang-switch__item[data-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (SUPPORTED.includes(lang)) applyTranslations(lang);
      });
    });
  }

  async function init() {
    if (!document.body.classList.contains('page-home')) return;

    try {
      const res = await fetch('data/i18n/home.json');
      if (!res.ok) return;
      dictionary = await res.json();
    } catch {
      return;
    }

    initButtons();
    applyTranslations(getStoredLang());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
