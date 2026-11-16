# Liberté 1.6.12

- Icône choisie n°3 : croix lumineuse et chaînes brisées, fond violet; intégrée au HTML et aux lanceurs Android.
- Lecture système Android : nouveau plugin natif TextToSpeech, enregistré au démarrage et conservé par la préparation Capacitor. Déclaration de visibilité du service TTS pour Android 11+.
- Lecture découpée en segments pour les textes longs; pause et reprise à la dernière position signalée par le moteur. Sur les anciens moteurs sans frontières de mots, reprise au début du segment (160 caractères au plus).
- Téléprompteur : suivi des frontières de mots quand le moteur les fournit, défilement automatique sinon.
- Messages explicites pour moteur absent, initialisation en cours ou langue non installée. Aucun basculement silencieux du malgache vers une autre langue.
- Le navigateur conserve sa synthèse vocale Web Speech. Les voix disponibles dépendent des voix installées sur l'appareil.
- Contrôles automatisés : parcours du pont vocal Android simulé, lecture/pause/reprise/arrêt, annulation avant démarrage, erreurs et préservation du moteur navigateur; tests de non-régression existants.
- À vérifier sur téléphone : sortie audio réelle, voix installées, cadence et reprise. Le test simulé ne valide pas le haut-parleur du téléphone.

- Lecture plein écran : choix entre voix système et enregistrement « Ma voix » associé au texte.
- Démarrage vocal : état visible pendant la connexion et message si le moteur ne démarre pas.
