/**
 * Génère un FAQPage JSON-LD unique à partir de toutes les .faq-list[data-faq-schema].
 */
(function () {
  const lists = document.querySelectorAll('.faq-list[data-faq-schema]');
  if (!lists.length) return;

  const mainEntity = [];
  lists.forEach(function (list) {
    list.querySelectorAll('.faq-item details').forEach(function (details) {
      const summary = details.querySelector('summary');
      const answerEl = details.querySelector('.faq-answer, p, .answer-block');
      if (!summary || !answerEl) return;
      mainEntity.push({
        '@type': 'Question',
        name: summary.textContent.trim(),
        acceptedAnswer: {
          '@type': 'Answer',
          text: answerEl.textContent.replace(/\s+/g, ' ').trim(),
        },
      });
    });
  });

  if (!mainEntity.length) return;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: mainEntity,
  });
  document.head.appendChild(script);
})();
