# Test Technique - Culture et Formation

Formulaire d'inscription complet avec validation en temps réel, upload
 d'avatar et respect de la charte graphique Culture et Formation.

 ## Choix techniques

 ### Frontend - React + Vite + Tailwind CSS

 - **React 19** : librairie UI performante avec un écosystème mature. Le
 système de hooks permet une gestion propre de l'état et des effets
 (debounce, validation temps réel).
 - **Tailwind CSS v4** : styling utilitaire directement dans le JSX, pas
 besoin de fichiers CSS séparés. Permet de respecter facilement la charte
 graphique via la configuration des couleurs.
 - **React Query (TanStack Query)** : gestion des appels API avec états de
 chargement, erreurs et cache intégrés.
 - **i18next** : internationalisation, les textes et messages d'erreur sont
  centralisés et facilement maintenables.
 - **Axios** : client HTTP avec interceptors et gestion du
 multipart/form-data pour l'upload.
 - **Heroicons** : icônes SVG cohérentes pour les indicateurs de
 validation.

### Backend - Laravel 12 + PHP 8.3

 - **Laravel 12** : framework PHP robuste avec un système de validation
 puissant (Form Requests), un ORM élégant (Eloquent) et une gestion native
 du stockage de fichiers.
 - **PHP 8.3** : typage strict, performances améliorées.
 - **MySQL 8** : base de données relationnelle fiable avec contraintes
 d'unicité (pseudo, email, téléphone).

 ### Infrastructure - Docker

 - **Docker Compose** : environnement de développement reproductible avec 4
  services (backend, frontend, MySQL, phpMyAdmin).

 ## Lancement du projet

 ### Prérequis

 - Docker et Docker Compose

 ### Installation

 ```bash
 git clone git@github.com:dedickerbenoit/testTechnique.git
 cd testTechnique

 # Lancer tous les services
 docker compose up --build -d

 # Attendre que MySQL soit prêt (~10s), puis lancer les migrations
 docker exec laravel_api php artisan migrate

 # Créer le lien symbolique pour le stockage des avatars
 docker exec laravel_api php artisan storage:link
 ```

 ### Accès

 | Service     | URL                        |
 | ----------- | -------------------------- |
 | Frontend    | http://localhost:5173      |
 | API Backend | http://localhost:8000/api  |
 | phpMyAdmin  | http://localhost:8082      |

 ### Arrêt

 ```bash
 docker compose down
 ```


 ## Fonctionnalites

 ### Validation en temps reel (front + back)

 - **Mot de passe** : indicateur visuel avec barre de progression et 6
 regles (longueur, majuscule, minuscule, chiffre, caractere special, pas
 d'info personnelle)
 - **Pseudo** : compteur de caracteres (3-15), verification de
 disponibilite en temps reel avec debounce et spinner de chargement
 - **Email** : format + unicite
 - **Telephone** : format francais (06/07) + unicite
 - **Date de naissance** : affichage dynamique de l'age

 ### Upload d'avatar (bonus)

 - Preview circulaire en temps reel
 - Validation client (JPG/PNG, max 10 Mo)
 - Validation serveur (type MIME, taille)
 - Stockage sous le nom `avatar-{pseudo}.{extension}`

 ### UX et accessibilite

 - Design responsive
 - Charte graphique Culture et Formation (couleurs personnalisees)
 - Animation au survol du bouton d'envoi
 - Indicateurs visuels de validation (check vert / croix grise / spinner)
 - Inputs accessibles (labels, aria-roles, sr-only)
 - Rate limiting sur les routes API (5 req/min inscription, 30 req/min
 check pseudo)
