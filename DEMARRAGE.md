# 🚀 Démarrage Rapide - Intexto React

## ⚡ Lancer le site

```bash
cd "/home/pierre/Documents/Intexto/site intexto/intexto-react"
npm run dev
```

Le site sera disponible sur: **http://localhost:5173**

## 🔍 Si la page est blanche

1. **Ouvrez la console du navigateur** (F12)
2. Cherchez les erreurs en rouge
3. Vérifiez l'onglet Network

## 🛠️ Debugging

### Vérifier que le serveur tourne
```bash
curl http://localhost:5173
```

### Voir les logs du serveur
Les logs s'affichent dans le terminal où vous avez lancé `npm run dev`

### Rebuild complet
```bash
# Nettoyer
rm -rf node_modules dist

# Réinstaller
npm install

# Relancer
npm run dev
```

## 📦 Version Production (Build)

```bash
# Build
npm run build

# Tester le build
npm run preview
```

Ouvre http://localhost:4173

## 🌐 Ouvrir dans le navigateur

```bash
# Firefox
firefox http://localhost:5173

# Chrome
google-chrome http://localhost:5173

# Ou simplement
xdg-open http://localhost:5173
```

## ✅ Checklist de vérification

- [ ] Node.js installé (`node --version`)
- [ ] Dependencies installées (`ls node_modules`)
- [ ] Serveur Vite lancé (message "ready in X ms")
- [ ] Port 5173 libre (`lsof -i :5173`)
- [ ] Navigateur moderne (Chrome, Firefox, Edge)
- [ ] JavaScript activé dans le navigateur

## 🆘 En cas de problème

### Port déjà utilisé
```bash
# Tuer le processus sur le port 5173
lsof -ti:5173 | xargs kill -9

# Ou utiliser un autre port
npm run dev -- --port 3000
```

### Cache du navigateur
1. Ouvrir DevTools (F12)
2. Clic droit sur le bouton Refresh
3. "Empty Cache and Hard Reload"

### Erreur de compilation
Regardez les messages d'erreur dans le terminal et corrigez les fichiers mentionnés.

---

**Le site devrait maintenant fonctionner!** 🎉

Ouvrez http://localhost:5173 dans votre navigateur.
