LIBERTÉ — COMPILATION ANDROID ET GITHUB

Cette archive est le projet web + Capacitor de départ. Elle ne contient pas encore un APK compilé.

A. COMPILATION AVEC GITHUB (sans installer Android Studio sur le PC)
1. Crée un dépôt GitHub vide.
2. Décompresse cette archive et envoie TOUS les fichiers qu’elle contient à la racine du dépôt. Il faut notamment voir package.json, package-lock.json, capacitor.config.ts et www/.
3. Dans GitHub, ouvre l’onglet Actions et active les workflows si GitHub le demande.
4. Copie `GITHUB_WORKFLOW_A_COPIER/build-apk.yml` vers `.github/workflows/build-apk.yml` à la racine du dépôt. Le workflow « Construire APK Android » démarre à chaque push sur main/master. Tu peux aussi le lancer dans Actions > Construire APK Android > Run workflow.
5. À la fin, ouvre l’exécution réussie, va dans Artifacts et télécharge liberte-apk-debug.
6. Décompresse le fichier téléchargé : app-debug.apk est l’APK de test. Transfère-le sur ton Android et autorise l’installation de cette source si Android le demande.

B. COMPILATION AVEC ANDROID STUDIO SOUS WINDOWS
Prérequis : installer Node.js LTS, Android Studio et le SDK Android.
1. Décompresse le projet dans un dossier simple, par exemple C:\LibertéAndroid.
2. Ouvre un terminal (PowerShell) dans le dossier qui contient package.json.
3. Exécute, une commande à la fois :
   npm ci
   npm run sync
   npx cap open android
4. Android Studio s’ouvre. Attends la fin de la synchronisation Gradle et accepte l’installation des composants SDK demandés.
5. Pour créer l’APK : Build > Build Bundle(s) / APK(s) > Build APK(s).
6. En cas de succès, Android Studio indique un lien « locate ». Le fichier se trouve généralement dans android/app/build/outputs/apk/debug/app-debug.apk.

POUR METTRE À JOUR LE CONTENU WEB PLUS TARD
- Remplace les fichiers concernés dans www/.
- Puis exécute npm run sync avant de recompiler.

NOTES
- JavaScript/PWA : les fichiers sont dans www/.
- L’APK Debug est destiné aux tests. Pour publier sur Play Store, il faudra préparer une clé de signature et compiler un AAB signé.
- Les tests JavaScript passent et la synchronisation Capacitor est réussie. La compilation Gradle locale doit être confirmée par GitHub Actions ou Android Studio, car cet environnement ne peut pas télécharger Gradle 8.11.1.
- Le workflow installe les dépendances depuis package-lock.json.
- Les données locales du navigateur et celles de l’APK peuvent être stockées séparément. Exporte une sauvegarde avant tout changement de version.

CORRECTIF 2.0.1 — EXPORTS ET ICÔNE
- JSON et CSV : dans l’APK, le bouton ouvre le sélecteur Android « Enregistrer sous ».
  Choisir Téléchargements (ou un autre dossier), puis Enregistrer.
- Annuler ferme le sélecteur sans afficher un faux succès.
- Le navigateur conserve le téléchargement classique.
- L’icône Liberté existante est intégrée à Android lors de npm run sync.
- native/ et scripts/ doivent être ajoutés au dépôt, avec les autres fichiers modifiés.
- Aucun changement de l’identifiant application ni des clés des données locales.

VALIDATION SUR TÉLÉPHONE APRÈS COMPILATION
1. Exporter une sauvegarde JSON, choisir Téléchargements, vérifier son contenu.
2. Exporter le CSV et vérifier les accents, les dates et les valeurs.
3. Annuler un export, puis relancer : les boutons doivent rester utilisables.
4. Vérifier l’icône dans la liste des applications et sur l’écran d’accueil.
5. Restaurer la sauvegarde sur une installation de test pour vérifier les données.

INSTALLATION SANS PERDRE LES DONNÉES
Ne désinstalle pas l’ancienne application et n’efface pas ses données.
Une mise à jour doit être signée avec la même clé que l’APK installé.
Attention : GitHub Actions peut générer une nouvelle clé debug à chaque exécution.
Si Android refuse la mise à jour, récupérer/réutiliser la clé de signature précédente ;
ne pas désinstaller pour contourner ce refus sans sauvegarde récupérable.


Sauvegarde Android : sur Android 10 et versions suivantes, les exports sont créés directement dans Download/Backup (nom unique, sans écraser un fichier existant). Sur les versions antérieures, Android ouvre son sélecteur de documents pour choisir la destination.


NOUVEAUTÉS RITUELS ET SAUVEGARDE
Les rituels se sélectionnent et se classent par moment dans Bibliothèque. Les groupes se replient une fois terminés. Si la biométrie est activée, elle est proposée d’abord à l’ouverture; le PIN de Liberté reste accessible comme secours. Sur Android 10+, les sauvegardes vont automatiquement dans Download/Backup.

Pour GitHub Actions, copie GITHUB_WORKFLOW_A_COPIER/build-apk.yml vers .github/workflows/build-apk.yml à la racine du dépôt. Le dossier source android est inclus.


MISE À JOUR 1.6.1 — BIBLIOTHÈQUE AUDIO/VIDÉO
- Enregistre chaque lecture depuis la Bibliothèque comme une nouvelle ressource audio avec son texte associé. Les enregistrements antérieurs ne sont pas écrasés.
- Ajoute des fichiers audio ou vidéo avec le sélecteur du téléphone; Android conserve l’accès au fichier à son emplacement d’origine.
- Les rituels et protocoles n’affichent plus de commande d’enregistrement. La lecture des ressources et ses réglages sont regroupés dans la Bibliothèque.
- Le système de permission microphone utilise une seule demande WebView; le code ne demande plus la même permission une seconde fois via le plugin natif.
