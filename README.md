# Plate-forme de création de notes de frais
Cette plate-forme a pour but d'aider les bénévoles qui interviennent dans les associations pour effectuer des activités, en leur facilitant la mise en œuvre de leur notes de frais à transmettre aux associations (trésoriers plus précisément).

## Table des matières
[Technologies utilisées](#technologies-utilisées)<br />
[Fonctionnalités](#fonctionnalités)<br />
[Architecture / Structure](#architecture--structure)<br />
[Installation](#installation)<br />
[Configuration .env](#configuration-env)<br />
[Utilisation / Mode d'emploi](#utilisation--mode-demploi)<br />
[Auteure](#auteure)<br />
[Futur / Roadmap](#futur--roadmap)<br />
[Déploiement](#déploiement)<br />

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
> React 19.2.4 <br />
> TypeScript 5.9.3 <br />
> Redux Toolkit (state global)<br />
> Sass <br /><br />

- **Base de données** : <br />
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
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
 ┃ ┗ 📜security.yaml                            # Gestion du firewall de sécurité des routes
 ┗ 📜services.yaml   
📦public
 ┣ 📂uploads                                     # Uploads et fichiers publics
 ┃ ┣ 📂expenses-documents
 ┃ ┗ 📂reports
 ┗ 📜index.php                                   # Gestion des services de Symfony
📦src
 ┣ 📂Controller                                  # Controller : routes APIs
 ┃ ┣ 📂Api
 ┃ ┗ 📜.gitignore
 ┣ 📂Entity                                       # Entités : Structure des tables à envoyer avec Doctrine
 ┃ ┗ 📜.gitignore
 ┣ 📂Enum                                         # Enum : Typage des ENUM pour les champs de la base de données
 ┣ 📂EventListener                                # Listener du status de déconnexion
 ┃ ┗ 📜LogoutListener.php
 ┣ 📂Repository                                   # Repository : Accès aux données de la base de données via Doctrine
 ┃ ┗ 📜.gitignore
 ┣ 📂Security                                     # Handler de sécurité : gestion des erreurs de connexion
 ┃ ┗ 📜JsonLoginSuccessHandler.php
 ┣ 📂Services                                     # Services métiers associés aux Controllers
 ┃ ┗ 📂Api
 ┗ 📜Kernel.php
📜.env                                              # Variables d'environnement pour Symfony

/frontend                                           # React frontend
📦src
 ┣ 📂App                                            # L'application
 ┃ ┣ 📂pages                                        # Les différentes pages
 ┃ ┗ 📜App.tsx                                      # Composant principal de l'app (gère les routes, les connexions, etc...)
 ┣ 📂constants                                      # Référencement des routes de l'application et des routes des APIs
 ┣ 📂modules                                        # Modules : Blocs composants React avec ou sans hook personnalisé, classés par page
 ┣ 📂services                      # Services frontend pour effectuer des actions APIs complexes
 ┣ 📂stores                         # Redux Toolkit : store global pour stocker l'arrivée des données de la base de données
 ┃ ┣ 📂features                     # Slices du store global
 ┃ ┣ 📂thunks                     # Thunks : actions asynchrones en charge de modifier le store en fonction de l'évolution de la base de données
 ┃ ┗ 📜index.ts                     # Store
 ┣ 📂styles                         # Sass Styles
 ┣ 📂types                          # Types et interfaces personnalisés pour TypeScript
 ┣ 📂utils                          # Fonctions utilitaires (ex : Restructuration de données)
 ┣ 📜main.tsx                       # Entrée de l'application
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
