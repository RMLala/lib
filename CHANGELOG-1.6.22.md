# Liberté 1.6.22 — Cloud pendant l’essai AppForge

- Le client ne bloque plus le Cloud selon le type local `trial` / `license` : après validation d’une preuve signée, il demande le jeton au Worker. Le Worker reste seul juge des droits Cloud; un refus serveur garde le Cloud inactif.
- Un essai valide de 72 h peut donc obtenir un jeton si le Worker accorde ce droit. Une licence payée éligible continue à demander automatiquement son jeton après activation et à reprendre la synchronisation après reconnexion.
- À expiration ou rejet du droit, le verrou de licence demande une activation et les données locales restent intactes.
- Les choix existants de conflit, d’envoi et de restauration Cloud sont conservés.
- Version 1.6.22 / Android versionCode 2026111902.

Cette correction du client ne prouve pas l’accès Cloud en production. La ligne produit D1, une licence de test dédiée, l’émission réelle du jeton et les échanges authentifiés restent à valider.
