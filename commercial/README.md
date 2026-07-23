# Commercial — propositions PDF

## Pack centres auto premium

`proposition-alpe-centre-porsche-sierre.pdf` — A4, 2 pages, style newsletter B2B.

- **Suivi interne** : nom de fichier lié à l’opportunité Sierre.
- **Contenu PDF** : aucun concessionnaire nommé. Le ton se calibre sur l’exigence d’une marque automobile d’exception (showroom / vente / atelier).

### Régénérer

```bash
pip3 install reportlab pillow pymupdf
python3 scripts/generate-proposition-centre-porsche-sierre.py
```

Sorties :
- `commercial/proposition-alpe-centre-porsche-sierre.pdf`
- `commercial/previews/centre-porsche-sierre-p1.png`
- `commercial/previews/centre-porsche-sierre-p2.png`

### Structure

**Page 1** — logo/date, accroche automotive, hero broderie, lettre « Madame, Monsieur », CTA devis partenaire, bandeau 01 Devis / 02 Broderie / 03 Livraison Suisse.

**Page 2** — softshell atelier / polo vente / gilet, process 01–05, arguments centres auto exigeants, prochaine étape, footer + WhatsApp.

---

## Newsletter B2B générique

`proposition-alpe-newsletter-b2b.pdf` — même format, angle workwear B2B non sectorisé.

```bash
python3 scripts/generate-proposition-newsletter-b2b.py
```
