# 🎨 Intexto - Site React Moderne

Site web moderne pour le journal haïtien Intexto, construit avec **React + Vite** et système de gestion de contenu intégré.

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
