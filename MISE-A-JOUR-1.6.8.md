# Liberté Premium 1.6.8

## Corrections
- Le lecteur plein écran sur mobile garde les commandes principales dans une barre compacte; les réglages secondaires sont repliés et le texte utilise l’espace restant.
- Gemini demande uniquement une clé API saisie dans l’onglet courant. La clé et la conversation ne sont pas sauvegardées.
- Licence AppForge : essai 72 h, activation par code, vérification périodique et preuve signée utilisable hors ligne jusqu’à expiration.
- AppForge Cloud : connexion au compte, choix de l’organisation, synchronisation automatique après modification, stockage local prioritaire et résolution explicite des divergences.
- La biométrie Android est relancée lorsque l’application revient au premier plan.

## Configuration AppForge
- Produit de licence : `LIBERTE-V1`.
- Worker licences : `https://appforge-license-api.appforge-licences-mg.workers.dev`.
- Worker Cloud : `https://appforge-cloud-api.appforge-licences-mg.workers.dev`.
- Le produit `LIBERTE-V1` doit être enregistré dans le service de licences et l’origine HTTPS de l’application autorisée par le Worker Cloud.
- Le jeton Cloud est conservé en mémoire pour la session; le mot de passe n’est pas sauvegardé. Les instantanés D1 ne sont pas chiffrés de bout en bout.

## Vérification de livraison
Workflow réussi : https://github.com/RMLala/lib/actions/runs/43461363833
- Tests : 28 réussis, 0 échec.
- Sync Capacitor, Debug API 23/29 et Release signées API 23/29 : réussis.
- Version Android : 1.6.8 · versionCode 2026111302.

## APK produits
- [Debug API 23](https://github.com/RMLala/lib/actions/runs/43461363833/artifacts/14055498883)
- [Debug API 29](https://github.com/RMLala/lib/actions/runs/43461363833/artifacts/14055873264)
- [Release signée API 23](https://github.com/RMLala/lib/actions/runs/43461363833/artifacts/14056557212)
- [Release signée API 29](https://github.com/RMLala/lib/actions/runs/43461363833/artifacts/14056642012)
