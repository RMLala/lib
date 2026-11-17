# Liberté — vérification sécurité V3

## Constats vérifiés
- `package.json` annonce 1.6.14 alors que `README.md` annonce 1.6.6 : documentation à réconcilier avec les versions Android.
- README affirme biométrie prioritaire avec PIN de secours, sans preuve de test sur appareil.
- README mentionne Web/PWA : vérifier les scripts et artefacts avant de conclure qu'un build PWA existe.

## Vérifications / corrections à réaliser
1. Localiser le code natif biométrique, vérifier priorité, repli PIN, stockage sécurisé, tentatives et récupération.
2. Inspecter la page À propos : AppForge Studio, support, Made in Madagascar, statut licence/Cloud et absence d'historique des versions.
3. Vérifier sauvegarde/partage natif Drive et chiffrement facultatif ; compatibilité des restaurations existantes.
4. Contrôler logos adaptatifs, écran de déverrouillage, versions Debug/Release et builds API23/API29.
5. Tests instrumentés sur Android et vérification des artefacts signés.

## Statut
Plan d'audit uniquement, sans modification fonctionnelle.