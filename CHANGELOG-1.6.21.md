# Liberté 1.6.21 — Worker AppForge central V3

- Worker de licences et Cloud fixé par défaut à `https://appforge-license-api.lalainaadclick.workers.dev`.
- Ressource Cloud alignée sur `default`; plus aucune sélection d’organisation ni adresse Cloud distincte.
- Suppression au démarrage de l’ancienne préférence d’organisation `liberte-cloud-preferences-v1`; les données métier restent intactes.
- Version Android 1.6.21, versionCode 2026111901.

Identifiant produit conservé : `LIBERTE` (identifiant déjà configuré dans la dernière version de l’application). La route publique `/v1/config` ne publie pas la liste D1; les vérifications sans licence sur `/v1/cloud/token` ont répondu « application désactivée » pour `LIBERTE` et `LIBERTE-V1`. Il faut confirmer/activer l’identifiant exact dans AppForge Studio avant test d’activation réelle.
