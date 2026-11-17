# Liberté 1.6.17 — partage Drive et images adaptées

- Ajoute le partage natif Android d’une sauvegarde JSON : le menu de partage permet de choisir Google Drive sans OAuth intégré.
- Ajoute la restauration depuis le sélecteur Android, qui peut ouvrir Google Drive, et conserve l’import de fichier sur navigateur.
- Propose le chiffrement facultatif AES-256-GCM avec dérivation PBKDF2; le mot de passe n’est pas enregistré. Avant remplacement, une copie locale de secours est conservée.
- Cache le panneau de synchronisation AppForge Cloud pendant l’essai / sans licence payée active; la synchronisation Premium et les sauvegardes Google Drive sont présentées comme des fonctions distinctes.
- Affiche les images d’accueil en mode cover dans le bloc, sans laisser les marges du conteneur apparaître en vert.
- Données existantes préservées.
