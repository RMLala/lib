# Liberté 1.6.19 — lecture plein écran et Cloud simplifié

- Le téléprompteur de la voix personnelle défile à une vitesse manuelle réglable ; il ne suit plus artificiellement la durée du fichier.
- La voix système reste synchronisée sur les événements de mots.
- La lecture de la voix personnelle en plein écran utilise un service Android au premier plan, avec notification et commandes pause/reprise/arrêt pour continuer écran verrouillé.
- La voix système Android conserve un service au premier plan pendant la synthèse vocale.
- L’organisation Cloud est résolue automatiquement en interne et n’est plus affichée comme un choix client.
- Le versionCode Android passe à 2026111705.

La liaison Cloud par licence seule dépend d’une route de provisionnement du Worker Cloud ; l’API client actuelle requiert toujours des identifiants de compte Cloud.
