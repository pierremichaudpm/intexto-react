# Guide — Balados en direct : les tags « En direct » et « Balado »

Quand tu diffuses un balado en direct sur YouTube, la vidéo porte un badge rouge
« EN DIRECT » qui clignote sur le site. Quand le live est terminé, tu la bascules
en « Balado ». Deux clics, et voici comment.

---

## Partie 1 — À faire UNE SEULE FOIS : créer les deux catégories (≈ 2 minutes)

1. Connecte-toi à l'admin Strapi avec tes identifiants habituels :
   https://intexto-strapi-production.up.railway.app/admin
2. Dans le menu de gauche, clique **Content Manager**, puis clique **Category**.
3. En haut à droite, clique **Create new entry**.
   Vérifie que la langue affichée dans le formulaire est bien **French (fr)**
   (menu « Locales » en haut à droite).
4. Dans le champ **name**, tape exactement : `En direct`
   Le champ **slug** se remplit tout seul (« en-direct ») — n'y touche pas.
5. Clique **Save**. La première catégorie est créée.
6. Refais les étapes 3 à 5 avec le nom : `Balado`

> ⚠️ **Important** : ne modifie pas et ne supprime pas les catégories déjà
> existantes (Actualité, Politique, Culture…) — elles sont branchées sur le site.

> 💡 **Et l'anglais / le créole ?** Pas besoin de traduire ces catégories : le
> site affiche automatiquement « Live » en anglais et « An Dirèk » en créole.
> Créer les deux fiches en français suffit.

---

## Partie 2 — À CHAQUE BALADO

### Quand le live commence

1. Dans **Content Manager**, clique **Video**, puis **Create new entry**
   (ou ouvre la fiche de la vidéo si elle existe déjà).
2. Remplis la fiche comme d'habitude : le titre, l'image (**thumbnail**), et
   dans **videoUrl**, colle le lien YouTube du live
   (sur YouTube : bouton « Partager » sous la vidéo → « Copier le lien »).
3. Dans le champ **category**, choisis **En direct**.
4. Clique **Publish** — pas seulement Save.
   → Sur le site, la vidéo affiche le badge rouge « EN DIRECT » qui clignote.

### Quand le live est terminé

1. Rouvre la même vidéo dans **Content Manager → Video**.
2. Dans le champ **category**, remplace **En direct** par **Balado**.
3. Clique **Publish** pour republier. C'est tout.
   Ne change rien d'autre : le lien YouTube reste le même, YouTube garde
   automatiquement l'enregistrement du live.

---

## En cas de pépin

| Ce que tu vois | Quoi faire |
|---|---|
| Le badge n'apparaît pas sur le site | Vérifie que tu as bien cliqué **Publish**, attends une minute, recharge la page (Ctrl+Maj+R). |
| La vidéo affiche « Actualité » au lieu de « En direct » | Le champ **category** est resté vide. Rouvre la fiche, choisis la catégorie, republie. |
| « En direct » n'est pas dans la liste des catégories | La Partie 1 n'a pas été faite (ou pas sauvegardée). Reprends-la — c'est 2 minutes. |

Pour tout le reste : écris à Pierre. Rien de ce qui est décrit ici ne peut
briser le site — au pire, une vidéo porte le mauvais badge le temps de corriger.
