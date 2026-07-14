# Ajouter un article au catalogue

1. Déposer la photo dans `assets/catalogue/` (JPG ou WebP recommandé, nom sans caractères spéciaux si possible).

2. Ouvrir `data/products.json` et ajouter un objet dans `products` :

```json
{
  "id": "mon-article-slug",
  "category": "softshell-polaire",
  "name": "Nom affiché",
  "tag": null,
  "description": null,
  "image": "assets/catalogue/mon-fichier.jpg",
  "imageAlt": "Description accessible de l’image",
  "reference": null,
  "published": true
}
```

3. Catégories disponibles : voir le tableau `categories` dans le même fichier.

4. Champs optionnels :
   - `description` : texte spécifique à l’article (sinon description de catégorie ou « Description à compléter »)
   - `reference` : référence interne
   - `tag` : ex. « EN ISO 20471 »
   - `published: false` : masquer sans supprimer

5. Régénérer le HTML statique : `node scripts/build-seo.js` (automatique au déploiement CI).
