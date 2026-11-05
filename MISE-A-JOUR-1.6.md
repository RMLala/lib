# Liberté Premium 1.6 — rapport de livraison

## Changements réalisés

- Déplacé l’enregistrement vocal dans la Bibliothèque. Chaque prise crée une nouvelle ressource audio avec le titre et le texte du contenu lu; un nouvel enregistrement ne remplace pas les précédents.
- Retiré les commandes d’enregistrement des écrans de rituel et de protocole. Les nouvelles ressources audio disposent de leur propre lecteur dans la Bibliothèque.
- Ajouté les catégories Audio et Vidéo et la sélection depuis le stockage Android. L’application garde l’URI du fichier sélectionné et ne télécharge ni ne copie le média dans ses données.
- Ajouté un lecteur compact avec barre de progression, arrêt, cadence, boucle et amplification du volume.
- Corrigé la demande répétée d’autorisation du microphone : l’enregistrement utilise directement l’accès média de WebView sans demander d’abord la même permission au plugin Android.
- Amélioré la lisibilité des passages longs, conservé les déclarations courtes en capitales, renforcé le contraste du rappel médical et réservé assez d’espace pour défiler au-delà de la barre fixe.
- Conservé la barre inférieure dans l’ordre du volet de navigation, sans raccourci Assistant.
- Mis à jour la version Web/PWA et Android à 1.6.0.

## Vérifications

- `npm run sync` : réussi; les fichiers Web et le plugin natif ont été synchronisés vers Android.
- `node --test tests/*.test.cjs` : 13 tests réussis, aucun échec.
- Vérification de la syntaxe de chaque script JavaScript : réussie par la suite de tests.
- `bash gradlew assembleDebug` : non terminé ici. Le wrapper Gradle ne peut pas télécharger Gradle 8.11.1, car l’environnement bloque la connexion réseau. Relancer le workflow GitHub Actions ou compiler dans Android Studio pour confirmer l’APK.

## À savoir

- Les voix enregistrées sont conservées dans le stockage local du navigateur/WebView (IndexedDB) et leur index dans les données locales de l’application. Elles ne sont pas téléversées.
- Sous Android, l’accès aux fichiers sélectionnés est conservé par URI de document. Dans un navigateur web classique, un lien de fichier local peut expirer après fermeture; la fiche permet alors de re-sélectionner le média.
- Les fichiers audio/vidéo ne sont pas inclus dans la sauvegarde JSON standard.
