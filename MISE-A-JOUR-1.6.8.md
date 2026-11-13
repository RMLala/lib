# Liberté Premium 1.6.8

## Corrections
- La barre du lecteur plein écran est compacte : les commandes principales restent sur une seule rangée et les réglages secondaires sont repliés. La zone du texte occupe l’espace restant sur mobile.
- Gemini demande une seule clé API, saisie dans l’onglet courant. La clé n’est pas incluse dans les sauvegardes locales ou Cloud.
- Ajout de la licence AppForge : essai initial de 72 h, activation par code et vérification en ligne au plus toutes les 24 h. Une preuve signée permet le contrôle hors ligne jusqu’à expiration.
- Ajout de la connexion AppForge Cloud : compte e-mail/mot de passe, organisation, instantané par application, synchronisation après modification, lecture/restauration manuelle et résolution explicite des conflits.
- Le jeton Cloud est conservé uniquement en mémoire pendant la session ; le mot de passe n’est pas sauvegardé. Les données restent locales si le Cloud est indisponible. Les instantanés D1 ne sont pas chiffrés de bout en bout.
- La demande biométrique Android est relancée lorsque l’application revient au premier plan, après que l’écran de verrouillage s’est affiché.

## Configuration AppForge
- Produit de licence : `LIBERTE-V1`.
- Licence : `https://appforge-license-api.appforge-licences-mg.workers.dev`.
- Synchronisation : `https://appforge-cloud-api.appforge-licences-mg.workers.dev`.
- Le produit `LIBERTE-V1` doit être enregistré dans le service de licences. Le Worker Cloud doit autoriser l’origine HTTPS utilisée par l’application.

## Version Android
- Version : `1.6.8`.
- VersionCode : `2026111302`.
- APK attendus : Debug API 23/29 et Release signées API 23/29 via les secrets d’organisation déjà configurés.
- Les résultats de compilation et les liens d’APK seront ajoutés après la fin du workflow GitHub Actions.
