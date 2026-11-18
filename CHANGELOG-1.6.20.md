# Liberté 1.6.20 — Cloud de licence sans compte client

- Suppression du parcours Cloud par e-mail, mot de passe et organisation.
- Obtention et renouvellement en mémoire du jeton Cloud via les droits de licence de l’installation.
- Vérification automatique de la licence et reprise Cloud en ligne; statut affiché uniquement après validation serveur.
- Synchronisation locale/Cloud avec contrôle de révision, détection de conflit et choix explicite sans écrasement silencieux.
- Version Android 1.6.20, versionCode 2026111801.

Dépendance de déploiement : les routes `/v1/cloud/token` et `/v1/cloud/snapshot` sont dans le PR AppForge `RMLala/appforg#8`; elles doivent être fusionnées, migrées (D1 `0006_cloud_snapshots.sql`) et déployées sur le Worker de licence avant validation en production.
