/**
 * Hero — accueil Alpë Workwear
 * Référence maquette : fond broderie macro, titre 4 lignes, 2 CTA empilés.
 * Classes CSS : assets/css/home.css (.home-hero)
 */
export function Hero() {
  return (
    <section className="home-hero" aria-labelledby="hero-title">
      <div className="home-hero__bg" aria-hidden="true">
        <img
          src="/assets/images/embroidery-preview.webp"
          alt=""
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className="home-hero__content container">
        <h1 id="hero-title" className="home-hero__title">
          <span>Qualité suisse.</span>
          <span>Craft dédié.</span>
          <span>Votre identité</span>
          <span>portée avec fierté.</span>
        </h1>
        <div className="home-hero__actions">
          <a href="/contact.html" className="btn btn-primary home-hero__btn">
            Demander un devis partenaire
          </a>
          <a href="/catalogue.html" className="home-hero__btn home-hero__btn--ghost">
            Explorer la collection
          </a>
        </div>
      </div>
    </section>
  );
}
