# 🎨 Intexto - Site React Moderne

Site web moderne pour le journal haïtien Intexto, construit avec **React + Vite** et système de gestion de contenu intégré.

## Production et référencement

Le site public tourne sur **Railway avec Node/Express** : `npm run build` puis
`npm start`. Le serveur `server/app.js` doit servir le site ; un hébergement
purement statique ou `vite preview` ne fournit pas le rendu et les sitemaps
dynamiques décrits ici. L'ancienne configuration Netlify n'est pas le chemin de
déploiement de production actuel.

Le serveur fournit le même HTML complet aux lecteurs et aux robots : accueil,
articles, vidéos et balados. Les métadonnées, URL canoniques, traductions publiées
et schémas JSON-LD utilisent `src/lib/seo.js`, également utilisé par le client.
Le contenu initial est transmis à React pour éviter un écran de chargement lors
de l'ouverture directe d'un article. Les réponses sont compressées et les
lectures CMS sont mises en cache pendant une minute, avec déduplication des
requêtes simultanées. Une panne CMS donne une réponse temporaire 503, jamais
un faux article ou un sitemap vide en cache.

- `/sitemap.xml` : tous les contenus publiés, paginés dans les trois langues.
- `/news-sitemap.xml` : articles des dernières 48 heures seulement.
- `/robots.txt` : exploration publique autorisée, prévisualisations exclues.
- Une URL absente retourne 404 ; les prévisualisations restent `noindex`.
- `server/legacy-redirects.json` : correspondances exactes issues des champs
  `source_url` et `slug` de `intextoarchives/content/index.json`, relevés le
  12 novembre 2026. Les anciennes URL redirigent en 301 vers leur article
  récupéré sur le site d'archives, sans redirection générale vers l'accueil.

Validation : `npm run test:seo` (tests HTTP et rendu), puis `npm run build`.
Après déploiement, soumettre les deux sitemaps dans Google Search Console et
Bing Webmaster Tools, inspecter l'accueil et quelques articles, puis vérifier
les motifs d'exclusion, les éventuelles actions manuelles et les demandes de
suppression. Les corrections techniques permettent l'exploration ; elles ne
garantissent ni un classement ni une citation dans les réponses IA.

## ✨ Caractéristiques

### 🚀 Technologies
- **React 18** - UI library moderne
- **Vite** - Build tool ultra-rapide
- **Framer Motion** - Animations fluides
- **Context API** - Gestion d'état
- **Lucide React** - Icônes modernes
- **localStorage** - Stockage local (migration API facile)

### 🎨 Design
- Interface glassmorphism avec effets de flou
- Animations fluides avec Framer Motion
- Grid dynamique responsive
- Charte de couleurs Intexto préservée
- Components React réutilisables

### 📱 Fonctionnalités
- 📝 Gestion d'articles
- 🎬 Support vidéo
- 🎵 Support audio/podcast
- 🔍 Recherche en temps réel
- 🏷️ Filtres par catégorie et type
- ⭐ Système de contenu à la une
- ⚙️ Panel d'administration intégré
- 100% Responsive

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour production
npm run build

# Preview du build
npm run preview
```

## 📖 Utilisation

### Développement

Le site se lance sur `http://localhost:5173`

### Administration

1. Cliquez sur l'icône ⚙️ en bas à droite
2. **Ajouter** - Créer nouveau contenu
3. **Gérer** - Voir et supprimer le contenu

### Structure du Projet

```
intexto-react/
├── public/
│   └── Images/              # Logo et images statiques
├── src/
│   ├── components/
│   │   ├── common/          # Composants réutilisables
│   │   │   ├── ContentCard.jsx
│   │   │   ├── HeroCard.jsx
│   │   │   └── ContentModal.jsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── SearchOverlay.jsx
│   │   └── admin/           # Admin panel
│   │       ├── AdminPanel.jsx
│   │       ├── AddContentForm.jsx
│   │       └── ContentList.jsx
│   ├── context/
│   │   └── ContentContext.jsx  # State management
│   ├── services/
│   │   └── cmsService.js       # CMS abstraction layer
│   ├── pages/
│   │   └── HomePage.jsx
│   ├── styles/
│   │   ├── index.css
│   │   └── App.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

## 🎯 Architecture CMS

### Service Abstraction Layer

Le `cmsService.js` est conçu pour faciliter la migration:

```javascript
// Actuellement: localStorage
const USE_API = false;

// Plus tard: Basculer vers API
const USE_API = true;
```

### Migration vers CMS Headless

Le code est **prêt** pour migrer vers:

#### Option 1: Strapi
```bash
npx create-strapi-app intexto-cms
```

#### Option 2: Contentful
- Créer compte sur contentful.com
- Configurer Content Types
- Mettre à jour `VITE_API_URL`

#### Option 3: Sanity.io
```bash
npm create sanity@latest
```

## 🎨 Personnalisation

### Couleurs

Dans `src/styles/App.css`:
```css
:root {
  --color-primary: #dd4f4f;
  --color-secondary: #dd9933;
  --color-accent: #ffc61c;
  --color-cyan: #00c8fa;
  --color-blue: #008bff;
}
```

### Logo

Remplacer `public/Images/intextologo.png`

## 📦 Build & Déploiement

### Build Production

```bash
npm run build
```

Le dossier `dist/` contient les fichiers optimisés.

### Déploiement

#### Vercel
```bash
npm i -g vercel
vercel
```

#### Netlify
```bash
npm i -g netlify-cli
netlify deploy
```

#### GitHub Pages
```bash
npm run build
# Push le dossier dist/ vers gh-pages branch
```

## 🔧 Configuration Avancée

### Variables d'environnement

Créer `.env`:
```
VITE_API_URL=https://api.intexto.ca
VITE_USE_API=false
```

### Optimisations

Le build Vite inclut automatiquement:
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Lazy loading
- ✅ Image optimization

## 🌐 Compatibilité

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile iOS/Android

## 📱 Responsive

- Desktop: 1400px+
- Laptop: 1024px - 1399px
- Tablet: 768px - 1023px
- Mobile: < 768px

## 🎯 Prochaines Étapes

### Phase 1: CMS Headless (Recommandé)
1. Installer Strapi
2. Créer Content Types
3. Migrer données localStorage
4. Mettre à jour `USE_API = true`

### Phase 2: Backend
1. Authentification admin
2. API REST/GraphQL
3. Upload d'images
4. Multi-utilisateurs

### Phase 3: SEO & Performance
1. SSR avec Next.js
2. Sitemap XML
3. Open Graph tags
4. Analytics
5. CDN pour images

## 🆘 Scripts Disponibles

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Linter (si configuré)
```

## 💡 Conseils

- Utilisez des images optimisées (WebP recommandé)
- Gardez les extraits < 200 caractères
- Maximum 5 articles à la une
- Testez sur mobile régulièrement

## 🤝 Contribution

Pour contribuer:
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

© 2026 Intexto. Tous droits réservés.

---

**Créé avec ⚛️ React + ⚡ Vite pour Intexto**
