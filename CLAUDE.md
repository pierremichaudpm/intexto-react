# CLAUDE.md — Intexto React

## Projet
Site d'information communautaire haïtien-québécois. Frontend React + Vite, backend Strapi (Railway), médias sur Cloudinary, déployé sur Netlify.

## Stack technique
- **Frontend** : React 18, Vite, Framer Motion, Plyr (audio/vidéo), react-i18next
- **CMS** : Strapi v5 (Railway) avec Cloudinary pour les médias
- **Déploiement** : Netlify (frontend), Railway (Strapi + PostgreSQL)
- **Proxy** : Express server.js proxie /api/* vers Strapi (contourne les pare-feux gouvernementaux)

## Architecture clé
```
src/
├── components/
│   ├── common/         # ContentModal, ContentCard, ResponsiveImage
│   ├── layout/         # Header, Footer, Hero
│   ├── sections/       # ContentGrid, LineupSection
│   └── seo/            # SEOHead, StructuredData
├── config/categories.js
├── context/ContentContext.jsx
├── services/
│   ├── cmsService.js   # Abstraction CMS (délègue à strapiService)
│   └── strapiService.js # Appels API Strapi, transformations
└── i18n/               # Traductions fr/en/ht
```

## Conventions
- Les vidéos utilisent **videoUrl** (URL YouTube ou externe). Le champ videoFile a été supprimé du schema Strapi.
- Les URLs YouTube sont détectées et rendues via iframe youtube-nocookie.com. Les autres URLs vidéo utilisent Plyr.
- Les lineups (manchettes) sont ordonnées côté Strapi FR, l'ordre est appliqué aux autres locales.
- Les images passent par Cloudinary (URLs absolues) ou Strapi local (URLs relatives préfixées).
- **Slugs de catégorie normalisés sans tiret** : `strapiService.normalizeCategorySlug()` retire les tirets des slugs Strapi à la réception (ex. `en-direct` → `endirect`). Ça permet à l'utilisateur CMS de créer une catégorie en tapant juste son nom dans Strapi (slug auto-généré avec tiret) sans avoir à corriger le slug pour qu'il matche les clés de `config/categories.js`.
- **Catégories spéciales sans lien avec la nav** : `publireportage`, `avisdedeces`, `chronique`, `moisdelhistoiredesnoirs`, `endirect`, `balado` existent dans `categoryColors`/`categoryLabels` mais ne sont pas forcément dans `CategoryFilter.jsx` (`categorySlugs`) — ce sont deux listes distinctes à mettre à jour séparément selon le besoin.

## Catégories vidéo/audio « En direct » / « Balado » (2026-07-14)
Pour les balados diffusés en direct sur YouTube : Goudou assigne manuellement la catégorie **En direct** (slug `endirect`) pendant le live (badge rouge pulsant sur toutes les cartes, y compris vidéo/audio dont le badge est normalement transparent), puis bascule vers **Balado** (slug `balado`) une fois le live terminé. Gestion 100% manuelle côté CMS, aucune automatisation. Guide pas-à-pas pour Goudou : voir `GUIDE-EN-DIRECT-BALADO.md` à la racine du repo (aussi publié en artifact Claude).

## Commandes
```bash
npm run dev          # Dev local (Vite, port 5173)
npm run build        # Build production
node server.js       # Serveur Express avec proxy API (production)
```

## Repo GitHub
`git@github.com:pierremichaudpm/intexto-react.git` (branche main)
