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

| Variante | Fichier | Usage |
|----------|---------|-------|
| Principal | `assets/logo.png` | Général, OG |
| Bleu acier | `assets/images/logo-bleu-acier.png` | Header |
| Blanc acier | `assets/images/logo-blanc-acier.png` | Fond sombre |
| Texte header | ALPË + Workwear | Navigation |

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
