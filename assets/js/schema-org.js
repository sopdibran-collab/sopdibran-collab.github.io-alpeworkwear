/**
 * Schéma Organization / WebSite / BreadcrumbList — une fois par page.
 * Définir window.ALPE_BREADCRUMBS (optionnel) avant ce script.
 */
(function () {
  const c = window.ALPE_CONFIG || {};
  const siteUrl = (c.siteUrl || 'https://www.alpeworkwear.com').replace(/\/$/, '');
  const orgId = siteUrl + '/#organization';

  const graph = [
    {
      '@type': ['Organization', 'LocalBusiness'],
      '@id': orgId,
      name: c.brand || 'Alpë Workwear',
      legalName: c.legalName || c.brand,
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: siteUrl + '/assets/logo.png' },
      image: siteUrl + '/assets/logo.png',
      email: c.email,
      telephone: c.phoneTel,
      description: c.orgDescription,
      priceRange: '$$',
      areaServed: (c.serviceAreas || ['Suisse']).map(function (name) {
        return name === 'Suisse'
          ? { '@type': 'Country', name: 'Suisse' }
          : { '@type': 'City', name: name, containedInPlace: { '@type': 'Country', name: 'Suisse' } };
      }),
      address: {
        '@type': 'PostalAddress',
        addressLocality: c.addressLocality || 'Prishtina',
        addressCountry: c.addressCountry || 'XK',
      },
      knowsAbout: c.knowsAbout,
    },
    {
      '@type': 'WebSite',
      '@id': siteUrl + '/#website',
      name: c.brand || 'Alpë Workwear',
      url: siteUrl,
      inLanguage: 'fr-CH',
      publisher: { '@id': orgId },
    },
  ];

  const crumbs = window.ALPE_BREADCRUMBS;
  if (Array.isArray(crumbs) && crumbs.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map(function (item, i) {
        return {
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: item.url,
        };
      }),
    });
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  document.head.appendChild(script);
})();
