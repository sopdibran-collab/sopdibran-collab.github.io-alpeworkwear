# Commercial — newsletter / proposition B2B

## Fichier

`proposition-alpe-newsletter-b2b.pdf` — A4, 2 pages, style newsletter.

Angle : workwear B2B générique (accueil / vente / atelier). **Pas de destinataire nommé** (ex. pas de concession ciblée dans le texte).

## Sources

Le vault Obsidian local (`~/Documents/AlpëWorkwear/…`) n’est pas monté dans l’environnement cloud. Contenu calé sur :

- `.cursor/project-context/` (charte, ton, vocabulaire)
- `data/i18n/home.json`, `data/cas-clients.json`, `data/timeline.json`
- Assets site : logo, OG broderie, catalogue, réalisations clients, timeline production

## Régénérer

```bash
pip3 install reportlab pillow pymupdf
python3 scripts/generate-proposition-newsletter-b2b.py
```

Sorties :
- `commercial/proposition-alpe-newsletter-b2b.pdf`
- `commercial/previews/newsletter-b2b-p1.png`
- `commercial/previews/newsletter-b2b-p2.png`

## Structure

**Page 1** — logo/date, sous-titre + titre (rythme SFS), hero dual (OG broderie + détail), lettre, CTA contour magenta, bandeau 01 Devis / 02 Broderie / 03 Livraison Suisse.

**Page 2** — 3 produits catalogue, 3 preuves clients, process 01–05 sur image atelier, arguments équipes, prochaine étape, footer + WhatsApp.
