# Commercial — propositions PDF

## Proposition Centre Porsche Sierre

Fichier : `proposition-alpe-centre-porsche-sierre.pdf`  
Destinataire : Centre Porsche Sierre — Garage Olympic SA (Route de la Bonne-Eau 2, 3960 Sierre).

### Régénérer

Depuis la racine du dépôt :

```bash
pip3 install reportlab pillow pymupdf
python3 scripts/generate-proposition-porsche-sierre.py
```

Sorties :
- `commercial/proposition-alpe-centre-porsche-sierre.pdf` (A4, 2 pages)
- `commercial/previews/proposition-porsche-sierre-p1.png`
- `commercial/previews/proposition-porsche-sierre-p2.png`

### Dépendances assets

- Polices : `assets/fonts/DMSans-*.ttf`
- Logo : `assets/brand/logo-responsive.png`
- Hero : `assets/brand/og-embroidery-alpe.jpg`
- Produits : softshell / polo / gilet dans `assets/catalogue/`

### Contenu

Page 1 — header, accroche automotive, hero, lettre personnalisée, CTA « Demander un devis partenaire », bandeau 01 Devis / 02 Broderie / 03 Livraison Suisse.  
Page 2 — 3 produits, process 01–05, arguments centres auto, prochaine étape, footer + WhatsApp.
