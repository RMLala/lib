# Liberté Premium 1.6.1 — Français / Malagasy

Application bilingue Web/PWA et projet Android Capacitor. Les données de suivi restent locales à l’appareil.

## Nouveautés 1.6.1.1

- Enregistrement vocal depuis la Bibliothèque. Chaque prise ajoute une nouvelle ressource audio qui conserve le texte associé; les prises précédentes restent disponibles.
- Catégories audio et vidéo séparées. Sur Android, les fichiers sont sélectionnés dans le stockage du téléphone et lus depuis leur URI d’origine, sans copie dans l’application.
- Lecteur compact avec progression, arrêt, boucle, cadence et amplification du volume.
- La voix synthétique du système et les boutons d’enregistrement dans les protocoles/rituels ne sont plus utilisés.
- Rappel médical mieux contrasté, texte long plus lisible et espace de défilement suffisant au-dessus de la barre fixe.
- Barre inférieure alignée sur le volet de navigation, sans raccourci Assistant.

## Développement et compilation

Exécute `npm ci`, puis `npm run sync`. Ouvre ensuite `android/` dans Android Studio ou utilise le workflow GitHub situé dans `GITHUB_WORKFLOW_A_COPIER`.

L’APK doit être compilé dans GitHub Actions ou Android Studio. Le rapport de livraison `MISE-A-JOUR-1.6.md` détaille les vérifications et la limite de compilation locale.
