/**
 * Alliance — accueil Alpë Workwear
 * Référence maquette : 3 colonnes (précision suisse · pont · craft Kosovo).
 * Classes CSS : assets/css/home.css (.home-alliance)
 */
export function Alliance() {
  return (
    <section className="home-alliance" aria-labelledby="alliance-title">
      <div className="container home-alliance__inner">
        <h2 id="alliance-title" className="home-alliance__title">
          Notre alliance stratégique
        </h2>

        <div className="home-alliance__grid">
          <article className="home-alliance__col home-alliance__col--swiss">
            <h3 className="home-alliance__heading">La précision suisse</h3>
            <p className="home-alliance__text">
              Coordination, conseil et contrôle qualité depuis la Suisse — un interlocuteur unique
              pour cadrer chaque projet B2B avec rigueur et fiabilité.
            </p>
            <div className="home-alliance__media home-alliance__media--round">
              <img
                src="/assets/images/alliance-precision.svg"
                alt=""
                width={160}
                height={160}
                loading="lazy"
              />
            </div>
          </article>

          <div className="home-alliance__bridge" aria-hidden="true">
            <div className="home-alliance__bridge-top">
              <span className="home-alliance__bridge-label">Alpes suisses</span>
              <span className="home-alliance__bridge-label">Kosovo</span>
            </div>
            <div className="home-alliance__bridge-maps">
              <img
                src="/assets/images/map-suisse.svg"
                alt=""
                className="home-alliance__map"
                width={88}
                height={52}
              />
              <span className="home-alliance__bridge-dot" />
              <img
                src="/assets/images/alliance-handshake.svg"
                alt=""
                className="home-alliance__handshake"
                width={48}
                height={54}
              />
              <span className="home-alliance__bridge-dot" />
              <img
                src="/assets/images/map-kosovo.svg"
                alt=""
                className="home-alliance__map"
                width={72}
                height={80}
              />
            </div>
          </div>

          <article className="home-alliance__col home-alliance__col--kosovo">
            <div className="home-alliance__media home-alliance__media--rect">
              <img
                src="/assets/images/embroidery-preview.webp"
                alt="Broderie professionnelle en atelier"
                width={320}
                height={240}
                loading="lazy"
              />
            </div>
            <h3 className="home-alliance__heading">Le craft du Kosovo</h3>
            <p className="home-alliance__text">
              Savoir-faire textile ancestral et ateliers dédiés — broderie, confection et marquage
              exécutés avec précision pour vos volumes professionnels.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
