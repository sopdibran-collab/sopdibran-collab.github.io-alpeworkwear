# Alpë Workwear

> Dernière mise à jour : 2026-07-06
> Site : https://www.alpeworkwear.ch
> Langue : fr-CH
> Statut brief : validé (contexte site)

## Résumé

Fournisseur B2B de vêtements de travail personnalisés (broderie, sérigraphie) pour entreprises en Suisse. Atelier au Kosovo, coordination et livraison depuis la Suisse. Parcours devis — pas d'e-commerce public.

## Fichiers de contexte

| Fichier | Contenu |
|---------|---------|
| [01-identite-marque.md](01-identite-marque.md) | Charte bleu acier, DM Sans, ton B2B |
| [02-client-metier.md](02-client-metier.md) | Workwear, personas, vocabulaire |
| [03-contenu-medias.md](03-contenu-medias.md) | Pages, catalogue, médias |
| [04-seo-aeo-geo.md](04-seo-aeo-geo.md) | SEO local CH, FAQ, schema |
| [05-technique.md](05-technique.md) | Stack statique, config, intégrations |
| [06-feuille-de-route.md](06-feuille-de-route.md) | Phases et maintenance |

## Points d'attention agent

- B2B uniquement — CTA « Demander un devis »
- Vouvoiement obligatoire
- Config : `assets/js/site-config.js`, CSS : `assets/css/main.css`
- Chrome unifié (header/footer/lang) via `scripts/sync-chrome.cjs` — source de vérité = accueil
- Heroes photo (`page-hero--photo`) sur pages métier ; légales en compact
- Ne jamais appliquer la charte d’un autre client (Obsidian + project-context)
