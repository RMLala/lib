# Liberté 1.6.15 — lecteur vocal plein écran

- Ajout du choix entre voix système et enregistrement personnel associé à une ressource dans le lecteur plein écran.
- Ajout de la pause, de la reprise et de l’arrêt de la voix personnelle depuis le même lecteur.
- Synchronisation du défilement du texte avec les mots prononcés par la voix système et, pour la voix personnelle, avec la durée de l’enregistrement.
- Maintien des commandes essentielles visibles lorsque le téléprompteur est actif ; les réglages secondaires restent repliables.
- Conservation des enregistrements et données utilisateur existants.

Les tests automatisés couvrent le parcours de lecture personnel. La lecture TTS native, les voix installées, les icônes du lanceur et le déverrouillage doivent encore être contrôlés sur un appareil Android réel.
- Compatibilité conservée avec les anciens enregistrements attachés aux identifiants `resource-*`, `protocol-*` et `ritual-*`.
- Retrait du manifeste et du Service Worker PWA ; la livraison reste le HTML autonome et les APK Android.
