# Liberté Premium — Français / Malagasy

Application bilingue locale Web/PWA et Android Capacitor. Les données de suivi restent sur l’appareil.

## Fonctionnalités documentées (historique 1.6.6)

- Démarrage protégé par un écran portant le logo; la biométrie est demandée en premier, le PIN de Liberté reste un secours manuel.
- Impression PDF des ressources cochées, depuis l’impression Android ou du navigateur.
- Sélection globale « Tout cocher / Tout décocher » des ressources à utiliser.
- Lecture plein écran des ressources texte, avec taille réglable et téléprompteur facultatif à vitesse réglable.
- Variantes Android API 23 et API 29, avec APK Debug et deux APK Release signées via GitHub Actions.

## Développement

Exécute `npm ci`, puis `npm run sync`. Le workflow prêt à lancer se trouve dans `.github/workflows/android-release.yml`. Configure les secrets de signature décrits dans `README-ANDROID.txt`, puis lance le workflow depuis l’onglet Actions.

## Sécurité V3 — en cours de validation

La version applicative courante est définie dans `package.json` et `android/app/build.gradle` après préparation. Le plugin natif `LibertyDevice` expose désormais `biometricAvailability()` et `authenticateBiometric()` en complément de `authenticate()` pour compatibilité. Le raccordement du parcours biométrie prioritaire → PIN de l'application dans l'interface Web et les tests Android restent à vérifier ; la présence des méthodes ne suffit pas à déclarer la fonction conforme. Ne jamais supprimer ni réinitialiser le PIN existant pendant cette migration.
