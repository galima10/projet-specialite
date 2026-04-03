# Plate-forme de création de notes de frais
Cette plate-forme a pour but d'aider les bénévoles qui interviennent dans les associations pour effectuer des activités, en leur facilitant la mise en œuvre de leur notes de frais à transmettre aux associations (trésoriers plus précisément).

## Table des matières
[Technologies utilisées](#technologies-utilisées)
[Fonctionnalités](#fonctionnalités)
[Architecture / Structure](#architecture--structure)
[Installation](#installation)
[Configuration .env](#configuration-env)
[Utilisation / Mode d'emploi](#utilisation--mode-demploi)
[Auteure](#auteure)
[Futur / Roadmap](#futur--roadmap)
[Déploiement](#déploiement)

## Technologies utilisées
- **Back-end** :<br />
![Symfony](https://img.shields.io/badge/Symfony-FFFFFF?style=for-the-badge&logo=symfony&logoColor=black)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
> Symfony 8 <br />
> PHP 8.5.4 <br />
> Doctrine ORM<br /><br />

- **Front-end** :<br />
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
> React 19.2.4 <br />
> TypeScript 5.9.3 <br />
> Redux Toolkit (state global)<br />
> Sass <br /><br />

- **Base de données** : <br />
> MySQL <br />

- **PDF** : <br />
> html2pdf.js<br /><br />

- **Authentification** : <br />
> Symfony Security<br />

## Fonctionnalités
- Authentification et rôles (ROLE_MEMBER, ROLE_TREASURER, ROLE_ADMIN)
- Gestion des notes de frais :
  - Entrée des informations globale de la note
  - Ajout/modification/suppression des dépenses
  - Upload de justificatifs
  - Calcul automatique des totaux en fonction de barèmes
  - Génération de PDF
  - Stockage des fichiers de justificatifs des dépenses
- Gestion des barèmes kilométriques et abandon de frais
- Dashboard pour l'admin, le trésorier et le membre
- Gestion des utilisateurs (Admin)

## Architecture / Structure

```
/backend                                        # Symfony Backend
📦config                                        # Config
 ┣ 📂packages
 ┃ ┣ 📜framework.yaml                           # Gestion de la sécurité des cookies
 ┃ ┣ 📜security.yaml                            # Gestion du firewall de sécurité des routes
 ┣ 📜bundles.php
 ┣ 📜preload.php
 ┣ 📜reference.php
 ┣ 📜routes.yaml
 ┗ 📜services.yaml   
📦public
 ┣ 📂uploads                                     # Uploads et fichiers publics
 ┃ ┣ 📂expenses-documents
 ┃ ┗ 📂reports
 ┗ 📜index.php                                   # Gestion des services de Symfony
📦src
 ┣ 📂Controller                                  # Controller : routes APIs
 ┃ ┣ 📂Api
 ┃ ┃ ┣ 📜AssociationContactsController.php
 ┃ ┃ ┣ 📜ExpensesDocumentsController.php
 ┃ ┃ ┣ 📜ExpensesListsController.php
 ┃ ┃ ┣ 📜ExpensesReportsController.php
 ┃ ┃ ┣ 📜InfosRequestsController.php
 ┃ ┃ ┣ 📜KmMileageRatesController.php
 ┃ ┃ ┣ 📜LoginController.php
 ┃ ┃ ┣ 📜UsersController.php
 ┃ ┃ ┗ 📜WaiverMileageRatesController.php
 ┃ ┣ 📜.gitignore
 ┣ 📂Entity                                       # Entités : Structure des tables à envoyer avec Doctrine
 ┃ ┣ 📜.gitignore
 ┃ ┣ 📜AssociationContacts.php
 ┃ ┣ 📜ExpensesDocuments.php
 ┃ ┣ 📜ExpensesLists.php
 ┃ ┣ 📜ExpensesReports.php
 ┃ ┣ 📜InfosRequests.php
 ┃ ┣ 📜KmMileageRates.php
 ┃ ┣ 📜Users.php
 ┃ ┗ 📜WaiverMileageRates.php
 ┣ 📂Enum                                         # Enum : Typage des ENUM pour les champs de la base de données
 ┃ ┣ 📜Budget.php
 ┃ ┗ 📜Role.php
 ┣ 📂EventListener                                # Listener du status de déconnexion
 ┃ ┗ 📜LogoutListener.php
 ┣ 📂Repository                                   # Repository : Accès aux données de la base de données via Doctrine
 ┃ ┣ 📜.gitignore
 ┃ ┣ 📜AssociationContactsRepository.php
 ┃ ┣ 📜ExpensesDocumentsRepository copy.php
 ┃ ┣ 📜ExpensesDocumentsRepository.php
 ┃ ┣ 📜ExpensesListsRepository.php
 ┃ ┣ 📜ExpensesReportsRepository.php
 ┃ ┣ 📜InfosRequestsRepository.php
 ┃ ┣ 📜KmMileageRatesRepository.php
 ┃ ┣ 📜UsersRepository.php
 ┃ ┗ 📜WaiverMileageRatesRepository.php
 ┣ 📂Security                                     # Handler de sécurité : gestion des erreurs de connexion
 ┃ ┗ 📜JsonLoginSuccessHandler.php
 ┣ 📂Services                                     # Services métiers associés aux Controllers
 ┃ ┗ 📂Api
 ┃ ┃ ┣ 📜AssociationContactsService.php
 ┃ ┃ ┣ 📜ExpensesDocumentsService.php
 ┃ ┃ ┣ 📜ExpensesListsService.php
 ┃ ┃ ┣ 📜ExpensesReportsService.php
 ┃ ┃ ┣ 📜InfosRequestsService.php
 ┃ ┃ ┣ 📜KmMileageRatesService.php
 ┃ ┃ ┣ 📜LoginService.php
 ┃ ┃ ┣ 📜UsersService.php
 ┃ ┃ ┗ 📜WaiverMileageRatesService.php
 ┗ 📜Kernel.php
📜.env                                              # Variables d'environnement pour Symfony

/frontend                                           # React frontend
📦src
 ┣ 📂App                                            # L'application
 ┃ ┣ 📂pages                                        # Les différentes pages
 ┃ ┃ ┣ 📂Auth                                       # Pages d'authentification
 ┃ ┃ ┃ ┣ 📜LoginPage.tsx
 ┃ ┃ ┃ ┗ 📜RegisterPage.tsx
 ┃ ┃ ┣ 📂Dashboards                                 # Dashboards en fonction des rôles
 ┃ ┃ ┃ ┣ 📜AdminDashboard.tsx
 ┃ ┃ ┃ ┣ 📜MemberDashboard.tsx
 ┃ ┃ ┃ ┗ 📜TreasurerDashboard.tsx
 ┃ ┃ ┣ 📜Home.tsx                                   # Page d'accueil
 ┃ ┃ ┗ 📜Profile.tsx
 ┃ ┗ 📜App.tsx                                      # Composant principal de l'app (gère les routes, les connexions, etc...)
 ┣ 📂assets
 ┃ ┗ 📂images
 ┣ 📂constants                                      # Référencement des routes de l'application et des routes des APIs
 ┃ ┣ 📜apiroute.ts
 ┃ ┗ 📜route.ts
 ┣ 📂modules                                        # Modules : Blocs composants React avec ou sans hook personnalisé, classés par page
 ┃ ┣ 📂auth
 ┃ ┃ ┗ 📂components
 ┃ ┃ ┃ ┣ 📂molecules
 ┃ ┃ ┃ ┃ ┣ 📂LoginForm
 ┃ ┃ ┃ ┃ ┃ ┣ 📜index.tsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📜LoginForm.module.scss
 ┃ ┃ ┃ ┃ ┗ 📂RegisterForm
 ┃ ┃ ┃ ┃ ┃ ┣ 📜index.tsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📜Register.module.scss
 ┃ ┃ ┃ ┗ 📂organisms
 ┃ ┣ 📂dashboards
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📂molecules
 ┃ ┃ ┃ ┃ ┣ 📂AssociationContactManagement
 ┃ ┃ ┃ ┃ ┃ ┣ 📜AssociationContactManagement.module.scss
 ┃ ┃ ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┃ ┃ ┣ 📂ExpensesReportsForm
 ┃ ┃ ┃ ┃ ┃ ┣ 📜ExpensesReportForm.module.scss
 ┃ ┃ ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┃ ┃ ┣ 📂MileagesManagement
 ┃ ┃ ┃ ┃ ┃ ┣ 📜index.tsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📜MileagesManagement.module.scss
 ┃ ┃ ┃ ┃ ┣ 📂UserForm
 ┃ ┃ ┃ ┃ ┃ ┣ 📜index.tsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📜UserForm.module.scss
 ┃ ┃ ┃ ┃ ┣ 📂UserProfile
 ┃ ┃ ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┃ ┃ ┣ 📂UserReport
 ┃ ┃ ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┃ ┃ ┗ 📂UsersList
 ┃ ┃ ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┃ ┗ 📂organisms
 ┃ ┃ ┃ ┃ ┣ 📂ContentAdminDashboard
 ┃ ┃ ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┃ ┃ ┣ 📂ContentMemberDashboard
 ┃ ┃ ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┃ ┃ ┗ 📂ContentTreasurerDashboard
 ┃ ┃ ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┣ 📂hooks
 ┃ ┃ ┃ ┗ 📂useExpensesReportsForm
 ┃ ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┗ 📂member
 ┃ ┃ ┃ ┗ 📂components
 ┃ ┃ ┃ ┃ ┣ 📂molecules
 ┃ ┃ ┃ ┃ ┗ 📂organisms
 ┃ ┣ 📂home
 ┃ ┃ ┗ 📂components
 ┃ ┃ ┃ ┗ 📂organisms
 ┃ ┃ ┃ ┃ ┗ 📂HomeHero
 ┃ ┃ ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┗ 📂shared
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📂Footer
 ┃ ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┃ ┗ 📂Header
 ┃ ┃ ┃ ┃ ┣ 📜Header.module.scss
 ┃ ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┗ 📂hooks
 ┃ ┃ ┃ ┗ 📜redux.ts
 ┣ 📂services                      # Services frontend pour effectuer des actions APIs complexes
 ┃ ┗ 📂expensesReports
 ┃ ┃ ┗ 📜index.ts
 ┣ 📂stores                         # Redux Toolkit : store global pour stocker l'arrivée des données de la base de données
 ┃ ┣ 📂features                     # Slices du store global
 ┃ ┃ ┣ 📂association
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┣ 📂expensesReports
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┣ 📂mileages
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┗ 📂users
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┣ 📂thunks                     # Thunks : actions asynchrones en charge de modifier le store en fonction de l'évolution de la base de données
 ┃ ┃ ┣ 📂association
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┣ 📂expensesReports
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┣ 📂mileages
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┗ 📂users
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┗ 📜index.ts
 ┣ 📂styles                         # Sass Styles
 ┃ ┣ 📂abstracts                    # Abstracts Sass : partials des fonctions Sass, mixins, placeholders et variables
 ┃ ┃ ┣ 📜_functions.scss
 ┃ ┃ ┣ 📜_keyframes.scss
 ┃ ┃ ┣ 📜_mixins.scss
 ┃ ┃ ┣ 📜_placeholders.scss
 ┃ ┃ ┗ 📜_variables.scss
 ┃ ┣ 📂base                         # Styles de base
 ┃ ┃ ┣ 📜_fonts.scss                # Gestion de la police
 ┃ ┃ ┣ 📜_global.scss               # Gestion du style global
 ┃ ┃ ┣ 📜_reset.scss                # Réinitialisation du style par défaut
 ┃ ┃ ┗ 📜_theme.scss                # Thème de l'application
 ┃ ┗ 📜main.scss
 ┣ 📂types                          # Types et interfaces personnalisés pour TypeScript
 ┃ ┗ 📜WithRequiredId.d.ts
 ┣ 📂utils                          # Fonctions utilitaires (ex : Restructuration de données)
 ┃ ┗ 📂formatExpensesReports
 ┃ ┃ ┗ 📜index.ts
 ┣ 📜env.d.ts                       # Typage globaux pour TypeScript
 ┣ 📜global.d.ts                    
 ┣ 📜main.tsx                       # Entrée de l'application
 ┗ 📜window.d.ts
📜.env                              # Variables d'environnement pour Vite
```

## Installation
- **Backend** : 
```
cd backend
composer install
```

- **Frontend** : 
```
cd frontend
npm install
```


## Configuration .env
### Variables
- **Backend** :
  - DATABASE_URL
  - CORS_ALLOW_ORIGIN
  - SESSION_COOKIE_DOMAIN

- **Frontend** : 
  - VITE_API_URL
  - VITE_BASE_URL

### Exemples de .env.local pour un environnement de développement local
```
/backend/.env.local :

DATABASE_URL="mysql://user:password@127.0.0.1:3306/db_name?serverVersion=8"     # Connexion à la base de donnée d'un serveur (WAMP, XAMPP, MAMP etc...)

CORS_ALLOW_ORIGIN=http://localhost:5173               # Permettre les requêtes envoyées depuis le frontend

SESSION_COOKIE_DOMAIN=localhost                       # Permettre l'envoi de cookies de session



/frontend/.env.local

VITE_API_URL=http://localhost:8000                    # Récupération de l'URL où le backend Symfony écoute

VITE_BASE_URL=./                                      # Réglage des chemins relatifs de build Vite
```

### Exemples de .env.local pour un environnement de développement avec IP local exposée (pour plusieurs appareils)

```
/backend/.env.local :

DATABASE_URL="mysql://user:password@127.0.0.1:3306/db_name?serverVersion=8"     # Connexion à la base de donnée d'un serveur (WAMP, XAMPP, MAMP etc...)

CORS_ALLOW_ORIGIN=http://ADREESS_IP:5173              # Permettre les requêtes envoyées depuis le frontend

SESSION_COOKIE_DOMAIN=ADREESS_IP                       # Permettre l'envoi de cookies de session



/frontend/.env.local

VITE_API_URL=http://ADREESS_IP:8000               # Récupération de l'URL où le backend Symfony écoute

VITE_BASE_URL=./                                      # Réglage des chemins relatifs de build Vite
```

## Utilisation / Mode d'emploi

### Utilisation
*Notes* : 
- Le premier utilisateur à vouloir créer un compte aura forcément un compte Admin, les prochains auront forcément le rôle Membre
- Seuls les admin peuvent créer d'autres comptes Admin et Trésoriers, ainsi que les modifier et les supprimer
- Les admin et trésoriers peuvent voir les notes de frais de tous les utilisateurs membres, seuls les membres ne peuvent voir que les leurs
- Les justificatifs de dépenses sont accessibles depuis la plate-forme

**Lancer l'application** : 
- Backend : 
```
cd backend
php bin/console cache:clear                         # Vider le cache Symfony si nécessaire
php bin/console cache:warmup                        # Faire chauffer le cache
symfony serve --listen-ip=0.0.0.0 --port=8000       # <--- --listen-ip=0.0.0.0 --port=8000 pour exposer l'adresse IP ou juste symfony serve:start pour un environnement de développement local
```

- Frontend : 
```
cd frontend
npm run dev
```


### Mode d'emploi
- Se connecter ou créer un compte
- Ajouter une note de frais
- Ajouter des dépenses et télécharger les justificatifs
- Générer le PDF


## Auteur
- **Nom** : Magali MAI
- **LinkedInd** : https://www.linkedin.com/in/mai-magali/
- **Github** : https://github.com/galima10/
- **Site** : https://magalimai.fr/

## Futur / Roadmap
- Envoi des notes par mail (la table des adresses mail avec ajout, modification et suppression avec leurs actions sont déjà en place)
- Dashboard statistique avancé
- Version mobile responsive
- Design frontend UI attrayant

## Déploiement
- Docker / Docker Compose pour backend + frontend
- Hébergement backend : Symfony Flex / VPS / Cloud (ex : Render, AWS, OVH)
- Hébergement frontend : Vite build → dist/ → Netlify / Vercel
- Config SSL / SMTP réel en production