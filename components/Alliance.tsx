/**
 * Alliance — typo pure (Suisse | Kosovo), sans images.
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
            <p className="home-alliance__pole-label">Alpes suisses</p>
            <h3 className="home-alliance__heading">La précision suisse</h3>
            <p className="home-alliance__text">
              Coordination, exigence, qualité et fiabilité. Basés en Suisse, nous orchestrons chaque projet avec
              rigueur et transparence.
            </p>
          </article>
          <div className="home-alliance__spine" aria-hidden="true">
            <span className="home-alliance__spine-line" />
            <span className="home-alliance__spine-mark" />
            <span className="home-alliance__spine-line" />
          </div>
          <article className="home-alliance__col home-alliance__col--kosovo">
            <p className="home-alliance__pole-label">Kosovo</p>
            <h3 className="home-alliance__heading">Le craft du Kosovo</h3>
            <p className="home-alliance__text">
              Un savoir-faire textile ancestral, des ateliers engagés et des artisans passionnés au service d'une
              qualité durable et responsable.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
