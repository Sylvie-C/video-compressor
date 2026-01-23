# 🎬 VideoCompressor

VideoCompressor est une petite application web **simple, locale et efficace** pour réduire la taille de vidéos directement dans le navigateur, sans envoi vers un serveur. Tout se passe côté client, grâce à **ffmpeg.wasm**.

---

## Fonctionnalités

* Compression de vidéos directement dans le navigateur
* Utilisation de **ffmpeg.wasm** (FFmpeg compilé en WebAssembly)
* Barre de progression en temps réel pendant la compression
* Possibilité d’interrompre le processus (annulation)
* Interface simple, pensée pour aller à l’essentiel

---

## Technologies utilisées

* **React** (composants fonctionnels + hooks)
* **ffmpeg.wasm** pour l’encodage vidéo côté client

---

## Comment ça fonctionne ?

1. L’utilisateur sélectionne une vidéo depuis son ordinateur
2. La vidéo est chargée en mémoire comme fichier temporaire
3. **ffmpeg.wasm** exécute une commande FFmpeg classique pour réduire le bitrate tout en conservant une qualité correcte
4. La progression est suivie via les événements fournis par ffmpeg.wasm
5. La vidéo compressée est générée et proposée au téléchargement

Aucun serveur, aucune API externe, aucun stockage distant.

---

## À propos de ffmpeg.wasm

`ffmpeg.wasm` est une version de FFmpeg compilée en **WebAssembly**, ce qui permet d’exécuter des commandes FFmpeg directement dans le navigateur.

### Avantages

* Respect de la vie privée
* Fonctionne hors backend
* Compatible avec les navigateurs modernes

### Limites

* Consommation CPU élevée
* Performances variables selon la machine
* Moins rapide qu’un FFmpeg natif

---

## Installation (développement)

```bash
npm install
npm run dev
```

Puis ouvrir l’application dans le navigateur.

---

## Utilisation

1. Lancer l’application
2. Sélectionner une vidéo
3. Cliquer sur **Commencer** puis sélectionner le fichier vidéo à compresser
4. Patienter pendant le traitement (barre de progression)
5. Télécharger/Jouer la vidéo compressée

---

## Pistes d’amélioration

* Pré-réglages (low / medium / high quality)
* Estimation du gain de taille
* Support de plusieurs formats de sortie (format .mp4 par défaut)

---

## Statut du projet

Projet **fonctionnel**, volontairement simple, pensé comme :

* un outil pratique
* une démonstration de ffmpeg.wasm
* un bon exercice React orienté "traitement média"

---

## Autrice

Sylvie-C

---

## Licence

MIT