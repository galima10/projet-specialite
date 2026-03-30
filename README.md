# Template Full-Stack
Un projet full-stack React/TS Sass et Symfony/Doctrine configuré pour un déploiement gratuit

## Technologies
**Front-end**<br />
=> React<br />
=> Redux Store<br />
=> TypeScript<br />
=> Sass<br />
=> Vite<br /><br />

**Back-end**<br />
=> Symfony (PHP)<br />
=> Doctrine<br />
=> <u>MySQL</u> / PostgreSQL / SQLite<br /><br />

**Hébergement & Déploiement**<br />
=> Front-end : Github Pages<br />
=> Back-end : Railway<br />

## Configurer le déploiement

**Déployer le projet sur Github Pages & Railway**
1. Initialiser un repository Github
2. Cloner en local le repository dans source/ 
3. Créer le template dans le clone
4. Lancer la commande npm run install:all pour installer les dépendances front-end et back-end
5. Créer un nouveau service MySQL dans Railway (Add > Database > MySQL)
6. Créer un nouveau service en liant un repository Github dans Railway
7. Dans les variables Railway du service du repository, ajouter la variable <u>DATABASE_URL</u> avec comme valeur, celle de la variable MySQL_URL dans le service MySQL
8. Ajouter la variable <u>CORS_ALLOW_ORIGIN</u> avec comme valeur https://pseudonyme.github.io (https://galima10.github.io)
9. Dans les paramètres du service back-end du repository, pointer le directory sur backend/
10. Toujours dans les paramètres du service, générer un domaine avec le port 8080
10. Sur le repository Github, dans les Settings > Secret & Variables > Actions, ajouter une nouvelle variable <u>VITE_API_URL</u> avec l'URL publique du service backend sur Railway (ex : https://template-fullstack-react-symfony-production.up.railway.app)
11. Ajouter une nouvelle variable <u>VITE_BASE_URL</u> avec / si il y a un nom de domaine personnalisé ou ./ ou /nomdurepo/ si c'est avec Github Pages
12. Ajouter une nouvelle variable <u>PAT_TOKEN</u> avec le Personal Access Token avec un Repo scope dans les Settings du compte > Developper Settings > Personal Access Token > Tokens (classic), pour permettre à Github Actions de push sur la branche *gh-pages*
13. Pusher le first commit sur la branche *main* pour créer le build de l'app sur la branche *gh-pages*
14. Vérifier que la branche gh-pages est bien servie par Github Pages dans Settings > Pages<br />

**Pour mettre à jour la BDD en local et la synchroniser avec le distant**
1. Effectuer une migration depuis le terminal en local dans backend/ avec php bin/console doctrine:migrations:migrate
2. Dans le terminal, faire railway login si ce n'est pas déjà fait
3. Entrer la commande railway link et choisir le bon projet et le service backend déployé
4. Entrer la commande railway shell
5. Entrer la commande railway run php bin/console doctrine:migrations:migrate --no-interaction
6. Puis, entrer la commande railway run php bin/console doctrine:fixtures:load --no-interaction pour charger les fixtures Symfony et les faire persister dans le service MySQL Railway

## Fonctionnement du template

**Pour lancer le projet en local**
- Bien configurer les .env.local du dossier frontend/ et backend/
- Lancer WAMP pour obtenir la BDD MySQL à connecter à Symfony
- Ouvrir un terminal pour le dossier backend/ et lancer avec symfony serve:start ou 
php bin/console cache:clear 
php bin/console cache:warmup 
symfony serve:start 
pour faire chauffer le cache et lancer plus vite le serveur backend de Symfony
- Ouvrir un autre terminal pour le dossier frontend/ et lancer npm run dev pour lancer l'application React frontend avec Vite

### Développement
**Back-end** (dans le dossier backend/)
- Créer un Controller : php bin/console make:controller NomDuController, puis supprimer le template Twig
- Dans un Controller : peut y avoir plusieurs routes APIs et ne contiennent que la définition des routes APIs
- Les Services : permettent de gérer la logique de restructuration des données brutes en données traitées
- Créer une Entité : php bin/console make:entity et entrer les colonnes en suivant le guide dans le terminal
- Créer une Migration locale en fonction des nouvelles Entités : php bin/console make:migration
- Envoyer une Migration au serveur WAMP : php bin/console doctrine:migrations:migrate
- Créer des Fixtures (NomentitéFixture) : php bin/console make:fixtures
- Envoyer les Fixtures à la BDD du serveur WAMP : php bin/console doctrine:fixtures:load<br />

📦src<br />
 ┣ 📂Controller<br />
 ┃ ┣ 📂Api<br />
 ┃ ┃ ┗ 📜TestController.php<br />
 ┃ ┗ 📜.gitignore<br />
 ┣ 📂DataFixtures<br />
 ┃ ┣ 📜AppFixtures.php<br />
 ┃ ┗ 📜UserFixtures.php<br />
 ┣ 📂Entity<br />
 ┃ ┣ 📜.gitignore<br />
 ┃ ┗ 📜User.php<br />
 ┣ 📂Repository<br />
 ┃ ┣ 📜.gitignore<br />
 ┃ ┗ 📜UserRepository.php<br />
 ┣ 📂Services<br />
 ┃ ┗ 📂Api<br />
 ┃ ┃ ┗ 📜TestService.php<br />
 ┗ 📜Kernel.php<br />
<br />

**Front-end**
- Les slices du Redux Sore permettent de stocker les données de la base de données à travers toutes l'application
- Les extra reducers des slices permettent de mettre à jour de manière asynchrones les slices
- Les thunks sont asynchrones avec createAsyncThunk
- Les thunks exécute des fetch() avec les APIs configurés dans les Controller Symfony pour exécuter des requêtes depuis l'UI
- Les thunks n'ont pas de logique de restructuration
- Les routes front-end qui sont associés à une URL de page sont dans constants/route.ts
- Les routes APIs du backend sont dans constants/apiroute.ts
- Les styles sont scopés par composant avec .module.scss, et des styles globaux sont présents dans styles/<br />
- Bien penser à changer index.html à la racine de frontend/ et ajouter les favicon grâce à [realFaviconGenerator](https://realfavicongenerator.net/) et l'OpenGraph sur [opengraph](https://www.opengraph.xyz/) (fichiers à déposer dans public/)

📦src<br />
 ┣ 📂App<br />
 ┃ ┣ 📂pages<br />
 ┃ ┃ ┗ 📜Home.tsx<br />
 ┃ ┗ 📜App.tsx<br />
 ┣ 📂assets<br />
 ┃ ┣ 📂fonts<br />
 ┃ ┗ 📂images<br />
 ┃ ┃ ┣ 📜hero.png<br />
 ┃ ┃ ┣ 📜react.svg<br />
 ┃ ┃ ┗ 📜vite.svg<br />
 ┣ 📂constants<br />
 ┃ ┣ 📜apiroute.ts<br />
 ┃ ┗ 📜route.ts<br />
 ┣ 📂modules<br />
 ┃ ┣ 📂home<br />
 ┃ ┃ ┣ 📂components<br />
 ┃ ┃ ┃ ┣ 📂atoms<br />
 ┃ ┃ ┃ ┣ 📂molecules<br />
 ┃ ┃ ┃ ┗ 📂organisms<br />
 ┃ ┃ ┃ ┃ ┗ 📂HomeHero<br />
 ┃ ┃ ┃ ┃ ┃ ┗ 📜index.tsx<br />
 ┃ ┃ ┗ 📂hooks<br />
 ┃ ┗ 📂shared<br />
 ┃ ┃ ┣ 📂components<br />
 ┃ ┃ ┃ ┣ 📂Footer<br />
 ┃ ┃ ┃ ┃ ┗ 📜index.tsx<br />
 ┃ ┃ ┃ ┗ 📂Navbar<br />
 ┃ ┃ ┃ ┃ ┗ 📜index.tsx<br />
 ┃ ┃ ┗ 📂hooks<br />
 ┃ ┃ ┃ ┗ 📜redux.ts<br />
 ┣ 📂stores<br />
 ┃ ┣ 📂features<br />
 ┃ ┃ ┗ 📂users<br />
 ┃ ┃ ┃ ┗ 📜index.ts<br />
 ┃ ┣ 📂thunks<br />
 ┃ ┃ ┗ 📂users<br />
 ┃ ┃ ┃ ┗ 📜index.ts<br />
 ┃ ┗ 📜index.ts<br />
 ┣ 📂styles<br />
 ┃ ┣ 📂abstracts<br />
 ┃ ┃ ┣ 📜_functions.scss<br />
 ┃ ┃ ┣ 📜_keyframes.scss<br />
 ┃ ┃ ┣ 📜_mixins.scss<br />
 ┃ ┃ ┣ 📜_placeholders.scss<br />
 ┃ ┃ ┗ 📜_variables.scss<br />
 ┃ ┣ 📂base<br />
 ┃ ┃ ┣ 📜_fonts.scss<br />
 ┃ ┃ ┣ 📜_global.scss<br />
 ┃ ┃ ┣ 📜_reset.scss<br />
 ┃ ┃ ┗ 📜_theme.scss<br />
 ┃ ┗ 📜main.scss<br />
 ┣ 📂types<br />
 ┣ 📂utils<br />
 ┣ 📜env.d.ts<br />
 ┣ 📜global.d.ts<br />
 ┗ 📜main.tsx<br />
<br />