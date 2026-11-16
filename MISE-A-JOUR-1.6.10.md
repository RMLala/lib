# Liberté 1.6.10

- Téléprompteur : les commandes secondaires se masquent pendant le défilement. Le bouton ⚙ dans l’en-tête permet de les réafficher sans quitter la lecture.
- La zone de texte utilise l’espace restant dans la hauteur visible, avec défilement indépendant. Les réglages se referment à chaque ouverture.
- La pause de la voix système suspend également le défilement automatique; Reprendre le relance.
- Enregistrement personnel : bouton Pause présent dès l’ouverture de l’éditeur, activé pendant la prise, puis Reprendre. La même prise est sauvegardée après Terminer, même depuis l’état en pause.
- Les événements pause/reprise du MediaRecorder mettent à jour les commandes et le message d’état.

Validation locale : test de parcours DOM avec microphone et MediaRecorder simulés, conservation de la prise avant/après pause et libération du microphone. Synchronisation Capacitor effectuée. Le test sur un téléphone Android reste nécessaire pour le microphone matériel et le rendu réel.

Base : version 1.6.9 de la PR #6 (ff0ea271ec5b76ad391b955b51b312c811b9606b), conservée pour ne pas perdre les corrections non encore fusionnées.
