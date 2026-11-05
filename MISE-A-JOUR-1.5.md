# Liberté Premium 1.5 — mise à jour

## Interface des ressources
- Passage en paragraphes courts, lignes clés légèrement mises en évidence et texte conservé à une taille lisible.
- Rappel de prudence médicale isolé dans un encadré avec contraste et icône.
- Carte du rituel plus compacte : case et titre sur la première ligne, commandes de réorganisation à droite, puis lien « Ouvrir le contenu ».
- Espacement inférieur augmenté pour que la dernière ressource reste accessible au-dessus de la navigation fixe.

## Audio et médias
- Suppression de la voix synthétique du système dans l’interface et du moteur TTS natif.
- Lecteur compact par bloc lisible : enregistrer sa voix, écouter, arrêter, boucle, cadence, progression et amplification jusqu’à 2,5×.
- Les enregistrements de voix sont conservés localement sur l’appareil dans IndexedDB.
- Android ouvre le sélecteur système audio/vidéo et mémorise l’autorisation vers le fichier choisi. Le fichier reste dans le stockage du téléphone et n’est pas copié dans l’application.
- Dans le HTML ouvert dans un navigateur, le fichier choisi est lu directement via le sélecteur. Le navigateur ne permet pas de conserver durablement cette autorisation locale : il faut le choisir à nouveau après fermeture/réouverture.
- La permission du microphone est demandée au moment de commencer un enregistrement.

## Contrôle qualité
- Dépendances : `npm ci` exécuté.
- Synchronisation Android : `npm run sync` réussie.
- Suite : `node --test tests/*.test.cjs`.
- La compilation APK n’a pas pu être exécutée ici : le wrapper Gradle 8.11.1 doit être téléchargé et le réseau de compilation a refusé la connexion.
- Barre inférieure alignée sur l’ordre du volet : Accueil, Rituels, Protocoles, Statistiques tabac, Statistiques alcool, Parcours tabac, Parcours alcool, Bibliothèque. Le raccourci Gemini et les Réglages ont été retirés de cette barre; Gemini reste disponible dans le volet.

## Correctif Android après livraison
- Le dernier échec Gradle indiquait que `@PermissionCallback` n’était pas importé dans le plugin Android. L’import `com.getcapacitor.annotation.PermissionCallback` est maintenant présent dans la source et le fichier Android synchronisé.
- Le test Android vérifie explicitement cet import et l’identité entre le plugin source et le fichier généré.
- `npm run sync` et les 10 tests ciblés (plugin Android, médias et export) passent. La compilation Gradle complète reste à confirmer dans GitHub Actions.
