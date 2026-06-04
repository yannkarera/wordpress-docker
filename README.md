## Le projet est un thème WordPress sur mesure développé dans un environnement containerisé avec Docker. L'architecture de navigation est conçue comme une SPA (Single Page Application) : le fichier index.php sert de structure unique, et un script JavaScript (app.js) intercepte les clics pour charger dynamiquement le contenu dans le conteneur principal sans recharger la page.

## Pour la section Actualités, afin de contourner les restrictions des requêtes asynchrones directes (CORS, masquage de la clé API), j'ai créé une route d'API REST personnalisée et sécurisée dans WordPress via le fichier functions.php. C'est le serveur PHP qui interroge l'API externe NewsAPI en injectant les en-têtes requis, puis qui redistribue proprement les données au format JSON vers le Front-End.


# 🌐 Mon Portfolio WordPress SPA avec Docker

Ce projet est un thème WordPress personnalisé et développé de zéro. Il intègre une architecture **SPA (Single Page Application)** en JavaScript natif et un système de récupération d'actualités dynamiques via une route d'API REST sécurisée.

---

## 🚀 Prérequis

Avant de commencer, assure-toi d'avoir installé sur ton ordinateur (idéalement sous Linux/Ubuntu) :
* **Docker** (v20.10+)
* **Docker Compose**

---

## 📦 Téléchargement et Installation

### 1. Cloner le dépôt Git
Ouvre ton terminal et récupère le projet sur ton ordinateur :
```bash
git clone [https://github.com/](https://github.com/)[ton-pseudo-github]/[nom-de-ton-depot].git
cd [nom-de-ton-depot]

##Lancer l'environnement Docker
Bash

docker-compose up -d
3. Importer la Base de Données

## Pour retrouver toute la configuration du site (les menus, les articles et les configurations de pages), importe le dump SQL fourni à la racine :
Bash

docker-compose exec -T db mysql -u myuser -pmypassword mydatabase < backup_db.sql

🔑 Accès à l'Application

## Une fois les conteneurs démarrés, l'application est disponible localement :

    🌐 Site Web (Front-End) : http://localhost:8000

    🛠️ Administration WordPress : http://localhost:8000/wp-admin

## 🔐 Identifiants de connexion (Admin)

    Identifiant : y_karera

    Mot de passe : QOj!3^FpF7Ou7!&jzs

##  Commandes Docker Utiles (Mémo)

    Arrêter le projet : docker-compose down

    Redémarrer le projet (après modification du code) : docker-compose restart

    Vérifier l'état des conteneurs : docker ps

    Voir les logs en direct (en cas de problème) : docker-compose logs -f

## Structure clé du Thème Personnalisé

    index.php : Structure HTML unique faisant office de conteneur SPA.

    functions.php : Configuration du thème et création de la route d'API REST personnalisée (/wp-json/custom/v1/news) avec gestion du User-Agent.

    js/app.js : Routeur SPA asynchrone interceptant les clics de navigation et effectuant les requêtes fetch.

    style.css : Styles généraux et grilles d'affichage responsive pour les actualités.


