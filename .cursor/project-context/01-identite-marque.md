# 01 — Identité & marque — Alpë Workwear

## Couleurs

### Principales (bleu acier — B2B industriel)
| Nom | Hex | Usage |
|-----|-----|-------|
| Acier | `#49657f` | Primaire, liens, focus, boutons |
| Acier foncé | `#3a5268` | Hover |
| Acier muted | `#5c6f82` | Texte secondaire |
| Acier pâle | `#d8e2ea` | Fonds légers |
| Fond | `#ffffff` | Arrière-plan |
| Fond alt | `#eef3f7` | Sections alternées |
| Texte | `#1f2933` | Corps |
| Textile | `#11151a` | Titres produits |
| Navy | `#0f2138` | Hero sombre |

### Variables CSS (`assets/css/main.css`)
```css
:root {
  --color-steel: #49657f;
  --color-steel-dark: #3a5268;
  --color-steel-muted: #5c6f82;
  --color-steel-pale: #d8e2ea;
  --color-bg: #ffffff;
  --color-bg-alt: #eef3f7;
  --color-text: #1f2933;
  --color-textile: #11151a;
  --color-navy: #0f2138;
  --font-sans: 'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --radius: 2px;
}
```

## Typographie

| Élément | Police | Fallback | Poids |
|---------|--------|----------|-------|
| Titres & corps | DM Sans | system-ui | 400, 500, 600 |

## Logo

Couleur marque Affinity : **`#6B879C`** (`rgb(107, 135, 156)`).

Source Affinity : `WEBDEV/Variantes logos/Alpë Workwear/`  
Livrables site : `assets/brand/` (SVG + PNG + JPG)  
Réf. plan de travail : `assets/brand/reference/affinity-logo-variants.png`

| Variante Affinity | Fichier site | Usage |
|-------------------|--------------|-------|
| PRINCIPALE | `logo-principale.svg/.png/.jpg` | Vertical — docs, réseaux, OG |
| RESPONSIVE | `logo-responsive.svg/.png/.jpg` | Header desktop / lockup horizontal |
| TEXT | `logo-text.svg/.png/.jpg` | Wordmark seul |
| SUBMARK | `logo-submark.svg/.png/.jpg` | Icône seule, app, watermark |
| FAVICON32X32 | `logo-favicon-32.svg/.png` | Favicon navigateur |
| MONOCHROMENOIR | `logo-monochrome-noir.*` | Impression N&B |
| MONOCHROMEBLANC | `logo-monochrome-blanc.*` | Fond acier (artboard avec fond) |
| GRAYSCALE | `logo-grayscale.*` | Niveaux de gris |
| COULEURINVERSEE | `logo-couleur-inversee.*` | Acier sur fond noir (artboard) |

Dérivés web :
- `logo-apple-touch-180.png`, `logo-submark-512.png`
- Alias : `assets/favicon.png`, `assets/favicon.svg`, `assets/logo.png` (= principale)

### Intégration site

| Emplacement | Variante |
|-------------|----------|
| Header | RESPONSIVE (SVG) |
| Footer (fond sombre) | RESPONSIVE SVG + filtre blanc (`site-logo__img--on-dark`) |
| Favicon / apple-touch | FAVICON32X32 + apple-touch 180 |
| Schema / OG défaut | `assets/logo.png` (principale) |

Anciens fichiers `assets/images/logo-bleu-acier.png` / `logo-blanc-acier.png` : legacy — ne plus utiliser.

## Voix & ton

- **Ton** : professionnel, concret, rassurant
- **Vouvoiement** obligatoire
- **À privilégier** : devis, catalogue pro, broderie, sérigraphie, livraison Suisse, workwear
- **À éviter** : e-commerce grand public, « pas cher », délais non confirmés

## UI

- Style B2B minimal, rayons 2px, container 72rem, nav fixe 4.5rem
- CTA magenta `#c41e6e` (boutons principaux) — acier pour liens / accents secondaires
- Heroes internes : photo plein cadre + fondu sombre (schéma type sopjanitech)
- Chrome unique synchronisé : `scripts/sync-chrome.cjs`
