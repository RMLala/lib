# Rapport de livraison — Liberté Premium 1.6.6

## Changements réalisés

- **Démarrage biométrique :** le logo Liberté recouvre immédiatement l’écran principal. Si la biométrie est activée, Android la demande en premier. Le PIN applicatif reste disponible par un bouton de secours et n’est plus affiché à chaque déverrouillage.
- **Impression PDF :** la Bibliothèque imprime les ressources cochées. Dans l’APK, Android ouvre la boîte d’impression système où l’utilisateur peut choisir « Enregistrer au format PDF ». Dans un navigateur, l’impression permet également l’enregistrement PDF. Le texte complet est imprimé; les ressources audio/vidéo sont listées par titre et nom de fichier.
- **Sélection globale :** « Tout cocher » et « Tout décocher » règlent en un geste les ressources choisies pour les usages et l’impression.
- **Lecture plein écran :** les ressources textuelles s’ouvrent sur une page de lecture dédiée. La taille du texte est réglable et le téléprompteur est facultatif, avec vitesse réglable.
- **Release Android :** variantes API 23 et API 29; workflow GitHub Actions prévu pour une APK Debug API 23 et deux APK Release signées avec la même clé fournie par secrets.

## Vérifications effectuées

- Suite complète `node --test tests/*.test.cjs` : **18 tests réussis, 0 échec**, y compris les tests d’interface, de sélection globale, de lecture, d’impression navigateur, de pont d’impression Android et de configuration Release.
- `npm run sync` : réussi. Les ressources Web sont copiées dans Android et le plugin natif Android est régénéré depuis sa source.
- Le HTML de `www/` est identique à celui inclus dans les assets Android.
- Archive contrôlée après génération; elle contient les sources, tests, variantes Gradle et workflow, sans dépendances installées.

## Limite de livraison APK

La compilation locale des APK n’a pas pu commencer : le wrapper Gradle n’a pas pu télécharger Gradle 8.11.1 (`Network is unreachable`). Aucun APK n’est donc joint. Le ZIP contient le projet Release configuré et son workflow GitHub Actions; une compilation Release signée nécessite le dépôt GitHub et les secrets de signature. Les APK finales seront produites par ce workflow lorsque le projet sera poussé dans un dépôt connecté.
