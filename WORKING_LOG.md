# WORKING_LOG.md — Journal de développement

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
