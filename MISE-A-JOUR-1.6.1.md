# Liberté Premium 1.6.1 — correctif après vérification des captures

## Écrans corrigés

- Retiré le lecteur hérité des éléments de rituel. L’enregistrement vocal et l’ajout de médias sont maintenant accessibles depuis la Bibliothèque uniquement; les boutons sans texte associé et le message « Le texte associé n’est plus disponible » ne sont plus rendus dans le rituel.
- Séparé Audio et Vidéo en deux catégories de Bibliothèque indépendantes, avec un bouton et un filtre propres à chaque catégorie. Les enregistrements vocaux apparaissent comme ressources Audio; chaque ressource conserve son texte associé. Les prises suivantes créent de nouvelles ressources sans écraser les précédentes.
- Séparé le rappel de prudence du texte du guide, y compris dans le formulaire de modification, et affiché ce rappel dans un encadré.
- Reformulé les longues lignes en capitales dans les deux guides par défaut et réparti les longs paragraphes pour faciliter leur lecture et leur modification.
- Migré les anciens enregistrements vocaux associés aux blocs connus vers les ressources Audio de la Bibliothèque quand leurs données locales sont disponibles.
- Conservé la lecture des fichiers sélectionnés à leur URI Android d’origine, sans copie dans l’application.

## Vérifications

- `npm run sync` : synchronisation Capacitor et génération des fichiers Android réussies.
- Tests d’interface : vérification de l’absence de lecteurs dans les rituels, de l’édition du texte nettoyé, de la séparation Audio/Vidéo et de l’ajout de médias depuis le sélecteur Android.
- `node --test tests/*.test.cjs` : 13 tests réussis, aucun échec.
- La compilation Gradle complète n’a pas pu être exécutée ici : l’environnement ne peut pas télécharger la distribution Gradle 8.11.1. Il faudra confirmer l’APK dans GitHub Actions ou Android Studio.
