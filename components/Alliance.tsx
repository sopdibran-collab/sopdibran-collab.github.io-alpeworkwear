/**
 * Alliance — accueil Alpë Workwear
 * Référence maquette : 3 colonnes (précision suisse · pont · craft Kosovo).
 * Classes CSS : assets/css/home.css (.home-alliance)
 */
import { AllianceBridge } from './AllianceBridge';

export function Alliance() {
  return (
    <section className="home-alliance" aria-labelledby="alliance-title">
      <div className="container home-alliance__inner">
        <h2 id="alliance-title" className="home-alliance__title">
          Notre alliance stratégique
        </h2>

        <div className="home-alliance__grid">
          <article className="home-alliance__col home-alliance__col--swiss">
            <div className="home-alliance__row">
              <div className="home-alliance__copy">
                <h3 className="home-alliance__heading">La précision suisse</h3>
                <p className="home-alliance__text">
                  Coordination, exigence, qualité et fiabilité. Basés en Suisse, nous orchestrons chaque projet avec
                  rigueur et transparence.
                </p>
              </div>
              <div className="home-alliance__media home-alliance__media--round">
                <img
                  src="/assets/images/alliance-precision.webp"
                  alt=""
                  width={120}
                  height={120}
                  loading="lazy"
                />
              </div>
            </div>
          </article>

          <div className="home-alliance__bridge" aria-hidden="true">
            <div className="home-alliance__bridge-panel">
              <div className="home-alliance__bridge-top">
                <span className="home-alliance__bridge-label">Alpes suisses</span>
                <span className="home-alliance__bridge-label">Kosovo</span>
              </div>
              <div className="home-alliance__bridge-graphic">
                <AllianceBridge />
              </div>
            </div>
          </div>

          <article className="home-alliance__col home-alliance__col--kosovo">
            <div className="home-alliance__row home-alliance__row--reverse">
              <div className="home-alliance__media home-alliance__media--rect">
                <img
                  src="/assets/images/alliance-atelier.webp"
                  alt="Confection textile en atelier"
                  width={120}
                  height={120}
                  loading="lazy"
                />
              </div>
              <div className="home-alliance__copy">
                <h3 className="home-alliance__heading">Le craft du Kosovo</h3>
                <p className="home-alliance__text">
                  Un savoir-faire textile ancestral, des ateliers engagés et des artisans passionnés au service d'une
                  qualité durable et responsable.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
