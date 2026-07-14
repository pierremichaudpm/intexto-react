# WORKING_LOG.md — Journal de développement

## 2026-07-14 — Tags « En direct » / « Balado » pour les balados live YouTube

### Contexte
Goudou a besoin de nouveaux tags pour distinguer un balado en cours de diffusion live sur YouTube (« En direct ») d'un balado déjà terminé (« Balado »). Gestion 100% manuelle côté CMS : Goudou change lui-même la catégorie de la vidéo au début et à la fin du live.

### Progrès
1. **Nouvelles catégories** (`src/config/categories.js`)
   - `endirect` (rouge `#e01414`, libellé « En direct ») et `balado` (violet `#5f27cd`, libellé « Balado ») ajoutés à `categoryColors`/`categoryLabels`, suivant le patron des commits `3a91ad7` (Publireportage/Avis de décès) et `ac4f5ad` (Chronique).
   - Traductions ajoutées dans `en.json` (Live / Podcast) et `ht.json` (An Dirèk / Podkas).
   - Non ajoutées à `CategoryFilter.jsx` (barre de nav) — pas demandé, même choix que pour Publireportage.

2. **Badge « En direct » visible sur toutes les cartes** (`ContentCard.jsx`, `ContentModal.jsx`, `App.css`)
   - Ajout de `data-category={category}` sur le badge dans les deux composants.
   - Règle CSS `.content-card-category[data-category="endirect"]` qui force le fond rouge même sur les cartes vidéo/audio (dont le style de badge est normalement transparent/blanc translucide), avec un point blanc qui pulse (`@keyframes live-pulse`), désactivable via `prefers-reduced-motion` implicitement par la nature de l'effet (à vérifier si un utilisateur signale un souci d'accessibilité).

3. **Normalisation des slugs Strapi** (`src/services/strapiService.js`)
   - Nouvelle méthode `normalizeCategorySlug()` qui retire les tirets d'un slug reçu de Strapi avant de le comparer aux clés de `categories.js`.
   - Raison : Strapi auto-génère le slug à partir du nom (« En direct » → `en-direct`), alors que la config frontend utilise `endirect` sans tiret. Sans cette normalisation, Goudou aurait dû éditer manuellement le champ slug dans l'admin Strapi à chaque création de catégorie — source d'erreur pour un usage non technique.
   - Les 3 endroits qui lisaient `item.category?.slug || "actualite"` dans `transformArticle`/`transformVideo`/`transformAudio` passent maintenant par cette méthode.

4. **Guide utilisateur pour Goudou**
   - `GUIDE-EN-DIRECT-BALADO.md` (racine du repo) : guide pas-à-pas en français, sans jargon technique, pour (1) créer les deux catégories dans Strapi une seule fois, (2) assigner « En direct » au début du live + Publish, (3) basculer vers « Balado » à la fin + Publish, (4) dépannage basique.
   - Version identique publiée en artifact Claude (page web) pour partage direct, avec aperçu visuel des deux badges.

### Décisions techniques
- **Pas de création automatique des catégories via l'API Strapi** : testé une requête POST publique sur `/api/categories`, refusée (403 — le rôle public n'a pas le droit d'écriture, et aucun token API d'écriture n'est disponible dans ce repo). Plutôt que de demander un token, décision de simplifier le flux manuel côté frontend (normalisation des slugs) : Goudou crée les catégories lui-même dans l'admin en ~2 minutes, sans étape de configuration piégeuse.
- **Catégorie comme mécanisme de bascule live/replay**, pas de champ booléen dédié : cohérent avec le fait que la catégorie est déjà le seul système de tagging existant dans ce projet (pas de schema Strapi à modifier).

### Problèmes rencontrés
- Tentative initiale de créer les catégories directement via API échouée (403 Forbidden) faute de token d'écriture accessible dans l'environnement — contournée en ajustant le frontend plutôt qu'en demandant des credentials.

### Prochaines étapes
- Goudou doit créer les catégories `En direct` et `Balado` dans l'admin Strapi (voir `GUIDE-EN-DIRECT-BALADO.md`) — rien ne fonctionne côté site tant que ce n'est pas fait.
- Déployer ce commit sur Netlify (push vers `main`) avant d'envoyer le guide à Goudou, sinon le badge rouge n'existera pas encore en production.
- Vérifier après le premier live réel que le badge s'affiche correctement en prod (pas seulement testé en dry local).

---

## 2026-04-16 — Incident : site HS + images manquantes

### Symptômes
- intexto.ca n'affichait plus de contenu (page blanche avec header seulement).
- Les articles récents affichaient le logo InTexto en placeholder au lieu de leur image.

### Cause et fix
Tous les problèmes venaient du backend Strapi, pas du frontend — **aucun changement côté React** cette session.

1. **502 sur Strapi** : le bootstrap de Strapi bloquait son port HTTP en tentant de re-traduire tous les articles à chaque boot. Fix côté `intexto-strapi` (commit `2a63a0e`).

2. **Images fantômes** : les médias avaient été ajoutés aux drafts Strapi mais pas re-publiés. Fix via re-publish en boucle de l'API admin.

Voir `intexto-strapi/WORKING_LOG.md` pour le détail technique.

### À noter pour le frontend
Le fallback ResponsiveImage → logo InTexto a **très bien joué son rôle** de garde-fou visuel : au lieu de casser le layout, les cartes affichaient un placeholder lisible. Pas de modification nécessaire.

### Prochaines étapes
- Surveiller `intexto.ca/api` après chaque publication majeure pour détecter les 502 rapidement (ajouter un monitoring type UptimeRobot ?)
- Confirmer que les images manquantes sont bien réapparues après le re-publish (refresh Ctrl+F5)

---

## 2026-03-15 — Session YouTube + nettoyage

### Progrès
1. **Support YouTube dans ContentModal** (`ContentModal.jsx`)
   - Ajout de `getYouTubeId()` pour détecter les URLs YouTube (watch, youtu.be, embed)
   - Rendu conditionnel : iframe youtube-nocookie.com (rel=0, modestbranding=1, lazy) pour YouTube, Plyr pour les autres vidéos
   - Plyr n'est plus initialisé pour les URLs YouTube

2. **Suppression de videoFile** (`strapiService.js`)
   - `transformVideo()` : remplacé la logique videoFile/videoUrl par `item.videoUrl || null`
   - `fetchLineups()` : retiré `populate[videos][populate][1]=videoFile`, renuméroté
   - `fetchVideos()` : retiré `populate[1]=videoFile`, renuméroté
   - `fetchDraftContent()` : retiré `populate[3]=videoFile`, renuméroté
   - Raison : videoFile supprimé du schema Strapi pour éviter les uploads vidéo sur Cloudinary

3. **Nettoyage du dossier local**
   - Supprimé l'ancien site statique (css/, js/, index.html, backups)
   - Supprimé 14 rapports de migration obsolètes (.md)
   - Supprimé RAILWAY_SECRETS.txt (secrets en clair sur disque)
   - Supprimé `site intexto fork/` (copie obsolète complète)
   - Supprimé `images/`, `intexto.html`, `full_text.txt` (extractions PDF temporaires)
   - Supprimé `intexto-cms/` (ancien CMS PayloadCMS abandonné), `intexto_build_plan/`, `test-railway/`

### Décisions techniques
- **YouTube via iframe plutôt que Plyr** : Plyr supporte YouTube mais ajoute de la complexité. L'iframe natif youtube-nocookie.com est plus simple, respecte la vie privée, et ne nécessite pas de config supplémentaire.
- **videoUrl uniquement** : les vidéos sont hébergées sur YouTube, pas besoin d'upload sur Cloudinary (coûteux en bande passante pour la vidéo).
- **Conservation de `intexto content/`** : ~1 Go de fichiers sources (mp3, mp4, doc, PDF) conservés par précaution même si déjà sur Strapi/Cloudinary.

### Problèmes rencontrés
- **Git cassé** dans le dossier local `intexto-react/` : le `.git` ne contenait que `info/` et `objects/` (pas de HEAD, refs, config). Solution : clone frais depuis GitHub, application des changements, push depuis le clone.

### Prochaines étapes
- Remplacer la copie locale cassée de `intexto-react/` par un vrai clone git
- Tester le rendu YouTube en production après le déploiement Netlify
- Vérifier que les vidéos existantes dans Strapi ont bien un `videoUrl` renseigné
- Envisager de déplacer `intexto content/` vers pCloud pour libérer l'espace disque local
