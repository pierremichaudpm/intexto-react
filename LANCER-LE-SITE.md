# 🚀 Comment lancer le site Intexto

## Méthode Simple (Recommandée)

Ouvrez un terminal et tapez:

```bash
cd "/home/pierre/Documents/Intexto/site intexto/intexto-react"
./start.sh
```

Puis ouvrez votre navigateur à: **http://localhost:5173**

---

## Méthode Manuelle

```bash
cd "/home/pierre/Documents/Intexto/site intexto/intexto-react"
npm run dev
```

---

## ✨ Contenu du Site

Le site contient maintenant:
- ✅ **15 vrais articles** d'Intexto.ca
- ✅ **Vraies images** et photos
- ✅ **Vrais auteurs** (Jean Numa Goudou, Roger Romulus, etc.)
- ✅ **Hero carousel** avec auto-scroll
- ✅ **Animations buttery smooth**
- ✅ **Espaces publicitaires** (bannière + big box)
- ✅ **Design moderne** avec couleurs vibrantes

---

## 🎨 Fonctionnalités

1. **Hero Carousel** - Swipe ou cliquez les flèches
2. **Filtres** - Cliquez pour filtrer par type
3. **Recherche** - Icône loupe en haut à droite
4. **Admin Panel** - Bouton ⚙️ en bas à droite
5. **Responsive** - Fonctionne sur mobile/tablette

---

## 🛠️ Si ça ne marche pas

1. Vérifiez que Node.js est installé:
   ```bash
   node --version
   ```

2. Réinstallez les dépendances:
   ```bash
   cd "/home/pierre/Documents/Intexto/site intexto/intexto-react"
   rm -rf node_modules
   npm install
   ```

3. Nettoyez et rebuild:
   ```bash
   npm run build
   npm run preview
   ```
   Ouvrez http://localhost:4173

---

## 📦 Build pour Production

```bash
npm run build
```

Les fichiers seront dans le dossier `dist/`

Pour déployer:
- **Vercel**: `vercel`
- **Netlify**: `netlify deploy`
- **GitHub Pages**: Push le dossier `dist/`

---

**Le site est prêt! Ouvrez http://localhost:5173** 🎉
