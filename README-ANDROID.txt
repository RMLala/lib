LIBERTÉ — BUILDS ANDROID 1.6.6

Le projet utilise Capacitor et produit trois APK via GitHub Actions : Debug API 23, Release signée API 23 (Android 6+) et Release signée API 29 (Android 10+). Les deux APK Release utilisent la même clé. Le nom de version reste 1.6.6 ; le code de version distribué est 2026111101.

GITHUB ACTIONS
1. Décompresse le projet et pousse-le dans une branche dédiée du dépôt Liberté. Le workflow est déjà dans .github/workflows/android-release.yml.
2. Configure ces secrets du dépôt, tous requis pour les APK Release : ANDROID_RELEASE_KEY_BASE64, ANDROID_RELEASE_STORE_PASSWORD, ANDROID_RELEASE_KEY_ALIAS et ANDROID_RELEASE_KEY_PASSWORD. La clé keystore ne doit jamais être ajoutée au projet.
3. Lance « Liberté — builds Android » depuis Actions, ou pousse un tag v* / une branche codex/**, work/** ou release/**.
4. Télécharge les artefacts liberte-debug-api23, liberte-release-api23 et liberte-release-api29.

ANDROID STUDIO
Prérequis : Node.js LTS, Android Studio et SDK Android. Dans le dossier contenant package.json, exécute npm ci puis npm run sync. Dans Android Studio, sélectionne la variante api23Debug pour tester, ou api23Release / api29Release après configuration locale des variables de signature.

Le workflow exécute d’abord les tests JavaScript, synchronise Capacitor et signe les builds Release avec la même clé Android. Ne désinstalle pas une version déjà installée pour mettre à jour : il faut conserver la même clé de signature.

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

Le workflow complet est déjà présent dans .github/workflows/android-release.yml; GITHUB_WORKFLOW_A_COPIER/build-apk.yml est une copie pour les dépôts existants. Le dossier source android est inclus.


MISE À JOUR 1.6.1 — BIBLIOTHÈQUE AUDIO/VIDÉO
- Enregistre chaque lecture depuis la Bibliothèque comme une nouvelle ressource audio avec son texte associé. Les enregistrements antérieurs ne sont pas écrasés.
- Ajoute des fichiers audio ou vidéo avec le sélecteur du téléphone; Android conserve l’accès au fichier à son emplacement d’origine.
- Les rituels et protocoles n’affichent plus de commande d’enregistrement. La lecture des ressources et ses réglages sont regroupés dans la Bibliothèque.
- Le système de permission microphone utilise une seule demande WebView; le code ne demande plus la même permission une seconde fois via le plugin natif.
