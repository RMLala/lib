# Liberté Premium 1.6.6 — Français / Malagasy

Application bilingue locale Web/PWA et Android Capacitor. Les données de suivi restent sur l’appareil.

## Nouveautés 1.6.6

- Démarrage protégé par un écran portant le logo; la biométrie est demandée en premier, le PIN de Liberté reste un secours manuel.
- Impression PDF des ressources cochées, depuis l’impression Android ou du navigateur.
- Sélection globale « Tout cocher / Tout décocher » des ressources à utiliser.
- Lecture plein écran des ressources texte, avec taille réglable et téléprompteur facultatif à vitesse réglable.
- Variantes Android API 23 et API 29, avec APK Debug et deux APK Release signées via GitHub Actions.

## Développement

Exécute `npm ci`, puis `npm run sync`. Le workflow prêt à lancer se trouve dans `.github/workflows/android-release.yml`. Configure les secrets de signature décrits dans `README-ANDROID.txt`, puis lance le workflow depuis l’onglet Actions.
