# 🏢 Gestion d'Entreprise — Projets & Tâches (MERN Stack)

[![Frontend on Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel&logoColor=white)](https://gestion-d-entreprise-mern-project.vercel.app)
[![Backend on Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white)](https://gestion-d-entreprise-mern-project.onrender.com)
[![Database MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?logo=mongodb&logoColor=white)](https://cloud.mongodb.com)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Redux Toolkit](https://img.shields.io/badge/Redux-Toolkit-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org)
[![JWT Auth](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io)

> **École Polytechnique de Sousse** · Dr. Abdelweheb GUEDDES · Séance 6  
> **Auteure :** Fawz El Houda Ghalba  
> **Dépôt GitHub :** [GESTION-D-ENTREPRISE-MERN-PROJECT](https://github.com/FawzElHouda/GESTION-D-ENTREPRISE-MERN-PROJECT)

---

## 🌐 Liens de Déploiement Cloud (Production)

| Composant | Hébergeur | URL de Production | Statut |
|-----------|-----------|-------------------|--------|
| **Frontend SPA** | **Vercel** | [[https://gestion-d-entreprise-mern-project.vercel.app]([https://interactive-decale-mern-project.vercel.app/](https://interactive-decale-mern-project.vercel.app/))]((https://interactive-decale-mern-project.vercel.app/)) | 🚀 En ligne |
| **Backend API** | **Render** | [https://gestion-d-entreprise-mern-project.onrender.com](https://gestion-d-entreprise-mern-project.onrender.com) | 🟢 Actif |
| **Healthcheck API** | **Render** | [https://gestion-d-entreprise-mern-project.onrender.com/api](https://gestion-d-entreprise-mern-project.onrender.com/api) | ✅ JSON 200 OK |
| **Base de Données** | **MongoDB Atlas** | Cluster Cloud M0 (AWS eu-central-1) | 🗄️ Connecté |

---

## 🏛️ Architecture Globale du Projet

```
               ┌────────────────────────────────────────────────────────┐
               │              CLIENT (Navigateur Utilisateur)           │
               └──────────────────────────┬─────────────────────────────┘
                                          │
                                          │ Requêtes HTTPS
                                          ▼
   ┌────────────────────────────────────────────────────────────────────────────┐
   │                          FRONTEND (Vercel)                                 │
   │  • React 19 + Vite 8 + Redux Toolkit (Slices: auth, project, task)         │
   │  • Axios Client avec intercepteur automatique Authorization: Bearer <JWT> │
   │  • Rewrites Vercel transparents (/api/* ──► Render API)                    │
   └──────────────────────────────────────┬─────────────────────────────────────┘
                                          │
                                          │ Appels REST API
                                          ▼
   ┌────────────────────────────────────────────────────────────────────────────┐
   │                          BACKEND (Render)                                  │
   │  • Node.js + Express 4                                                     │
   │  • Middleware de sécurité CORS dynamique & JSON parser                     │
   │  • Middleware sentinelle `protect` : vérification JWT stateless            │
   │  • Hachage bcryptjs (Salt rounds: 10)                                      │
   │  • Modèles Mongoose relationnels avec `.populate()` 1:N                    │
   └──────────────────────────────────────┬─────────────────────────────────────┘
                                          │
                                          │ Pilote Mongoose (TLS/SSL)
                                          ▼
   ┌────────────────────────────────────────────────────────────────────────────┐
   │                     BASE DE DONNÉES (MongoDB Atlas)                        │
   │  • Collections : `users`, `projects`, `tasks`                              │
   │  • Mode résilient automatique (fallback en mémoire si Atlas indisponible)  │
   └────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗃️ Schéma des Modèles Mongoose & Relations 1:N

```
┌──────────────────────────────────────┐
│                USER                  │
├──────────────────────────────────────┤
│ _id         : ObjectId               │
│ name        : String                 │
│ email       : String (unique)        │
│ password    : String (hash bcrypt)   │
│ role        : String (Admin / Chef)  │
│ department  : String                 │
└──────────────────┬───────────────────┘
                   │ 1:N (createdBy)
                   ▼
┌──────────────────────────────────────┐
│               PROJECT                │
├──────────────────────────────────────┤
│ _id         : ObjectId               │
│ title       : String                 │
│ description : String                 │
│ status      : String (En cours...)   │
│ priority    : String (Haute/Moyenne) │
│ budget      : Number                 │
│ startDate   : Date                   │
│ endDate     : Date                   │
│ createdBy   : ObjectId ──► Ref: User │
└──────────────────┬───────────────────┘
                   │ 1:N (project)
                   ▼
┌──────────────────────────────────────┐
│                TASK                  │
├──────────────────────────────────────┤
│ _id         : ObjectId               │
│ title       : String                 │
│ description : String                 │
│ status      : String (A faire...)    │
│ priority    : String                 │
│ dueDate     : Date                   │
│ project     : ObjectId ──► Ref: Proj │
│ assignedTo  : ObjectId ──► Ref: User │
└──────────────────────────────────────┘
```

**Relations clés & Peuplement :**
- `User` ──► `Project` : 1:N via le champ `createdBy` (peuplé avec `.populate('createdBy', 'name email role')`).
- `Project` ──► `Task` : 1:N via le champ `project` (cascade automatique à la suppression d'un projet).
- `User` ──► `Task` : 1:N via le champ `assignedTo` (double peuplement projet + assigné).

---

## 🔐 Comptes de Démonstration

Le serveur initialise automatiquement des données de test si la base est vide :

| Rôle | Email | Mot de passe | Permissions |
|------|-------|-------------|-------------|
| **Administrateur** | `sayarsiwar@polytechnicien.tn` | `123456` | Gestion globale, création/suppression |
| **Chef de Projet** | `fawzelhouda.ghalba@polytechnicien.tn` | `123456` | Création de projets, assignation de tâches |
| **Développeur** | `user@poly.tn` | `123456` | Mise à jour de statut, consultation |

---

## 🚀 Guide de Déploiement Vercel (Frontend)

Ce projet est prêt à être déployé sur **Vercel** de deux façons équivalentes :

### Méthode 1 : Déploiement automatique depuis GitHub (Recommandée)

1. Rendez-vous sur votre dashboard [Vercel](https://vercel.com/new).
2. Cliquez sur **"Add New..."** ➔ **"Project"**.
3. Importez le dépôt GitHub : `FawzElHouda/GESTION-D-ENTREPRISE-MERN-PROJECT`.
4. Configurez le projet :
   - **Framework Preset :** `Vite`
   - **Root Directory :** `./` (ou sélectionnez `client`)
   - **Build Command :** `cd client && npm install && npm run build` (détecté automatiquement via `vercel.json`)
   - **Output Directory :** `client/dist` (détecté automatiquement via `vercel.json`)
5. Ajoutez la variable d'environnement (**Environment Variables**) :
   - **Name :** `VITE_API_URL`
   - **Value :** `https://gestion-d-entreprise-mern-project.onrender.com/api`
6. Cliquez sur **Deploy**.

> 💡 **Remarque sur le proxy Vercel :**  
> Les fichiers `vercel.json` à la racine et dans `client/` contiennent une règle de réécriture (`rewrites`) redirigeant automatiquement toute requête `/api/*` vers Render. Même sans variable d'environnement, l'application fonctionnera sans aucun problème de CORS !

---

## ☁️ Guide de Déploiement Render (Backend)

1. Connectez-vous sur [Render.com](https://dashboard.render.com).
2. Cliquez sur **"New +"** ➔ **"Web Service"**.
3. Connectez le dépôt : `FawzElHouda/GESTION-D-ENTREPRISE-MERN-PROJECT`.
4. Renseignez les paramètres suivants :
   - **Name :** `gestion-d-entreprise-mern-project`
   - **Region :** Frankfurt (EU) ou Oregon (US)
   - **Branch :** `main`
   - **Root Directory :** `server`
   - **Runtime :** `Node`
   - **Build Command :** `npm install`
   - **Start Command :** `node server.js`
5. Ajoutez les variables d'environnement (**Environment Variables**) :
   - `PORT` = `5001`
   - `MONGODB_URI` = `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/entreprise?retryWrites=true&w=majority`
   - `JWT_SECRET` = `une_cle_secrete_longue_et_aleatoire_jwt`
   - `CLIENT_URL` = `https://gestion-d-entreprise-mern-project.vercel.app`

---

## 💻 Installation & Démarrage en Local

### 1. Cloner le projet

```bash
git clone https://github.com/FawzElHouda/GESTION-D-ENTREPRISE-MERN-PROJECT.git
cd GESTION-D-ENTREPRISE-MERN-PROJECT
```

### 2. Configurer les variables d'environnement

Créer le fichier `server/.env` :

```env
PORT=5001
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/entreprise
JWT_SECRET=super_secret_jwt_key_pour_test_local_2026
CLIENT_URL=http://localhost:5173
```

*(Optionnel)* Créer le fichier `client/.env` :

```env
VITE_API_URL=http://localhost:5001/api
```

### 3. Installer les dépendances & lancer l'application

**Lancer le backend :**
```bash
cd server
npm install
npm start
# 📡 Backend actif sur http://localhost:5001/api
```

**Lancer le frontend :**
```bash
cd ../client
npm install
npm run dev
# 💻 Frontend actif sur http://localhost:5173
```

---

## 🌐 Endpoints de l'API REST

### Authentification (`/api/auth`)
| Méthode | Route | Auth requise | Description |
|---------|-------|--------------|-------------|
| `POST` | `/api/auth/register` | ❌ Non | Inscription d'un nouvel utilisateur |
| `POST` | `/api/auth/login` | ❌ Non | Connexion, retourne token JWT et profil |
| `GET` | `/api/auth/me` | 🔒 JWT (`Bearer`) | Récupération du profil connecté |

### Projets (`/api/projects`)
| Méthode | Route | Auth requise | Description |
|---------|-------|--------------|-------------|
| `GET` | `/api/projects` | ❌ Non | Liste de tous les projets avec créateur |
| `GET` | `/api/projects/:id` | ❌ Non | Détails complets d'un projet |
| `POST` | `/api/projects` | 🔒 JWT (`Bearer`) | Créer un nouveau projet (rattaché à `req.user.id`) |
| `PUT` | `/api/projects/:id` | 🔒 JWT (`Bearer`) | Modifier un projet existant |
| `DELETE` | `/api/projects/:id` | 🔒 JWT (`Bearer`) | Supprimer un projet + suppression en cascade des tâches |

### Tâches (`/api/tasks`)
| Méthode | Route | Auth requise | Description |
|---------|-------|--------------|-------------|
| `GET` | `/api/tasks` | ❌ Non | Liste des tâches (filtre optionnel `?projectId=...`) |
| `POST` | `/api/tasks` | 🔒 JWT (`Bearer`) | Créer une tâche liée à un projet et un assigné |
| `PUT` | `/api/tasks/:id` | 🔒 JWT (`Bearer`) | Modifier le statut ou les informations d'une tâche |
| `DELETE` | `/api/tasks/:id` | 🔒 JWT (`Bearer`) | Supprimer une tâche |

### Utilisateurs (`/api/users`)
| Méthode | Route | Auth requise | Description |
|---------|-------|--------------|-------------|
| `GET` | `/api/users` | ❌ Non | Liste des collaborateurs pour l'assignation |

---

## 📁 Structure du Répertoire

```
GESTION-D-ENTREPRISE-MERN-PROJECT/
├── client/                     # Application Front-End React 19
│   ├── public/                 # Assets statiques
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosClient.js  # Client Axios + Injection automatique JWT Bearer
│   │   ├── components/         # Composants UI (Navbar, Cards, Modals, Forms)
│   │   ├── redux/              # Store Redux Toolkit & Slices (auth, project, task)
│   │   ├── App.jsx             # Composant racine
│   │   └── main.jsx            # Point d'entrée React 19
│   ├── package.json
│   ├── vercel.json             # Configuration de redirection SPA pour Vercel
│   └── vite.config.js
├── server/                     # Application Back-End Express + Mongoose
│   ├── config/
│   │   ├── db.js               # Connexion résiliente MongoDB Atlas
│   │   └── seed.js             # Initialisation des données de démo
│   ├── middleware/
│   │   └── authMiddleware.js   # Sentinelle de protection JWT (Bearer token)
│   ├── models/                 # Modèles Mongoose (User, Project, Task)
│   ├── routes/                 # Routes REST modulaires (auth, projects, tasks, users)
│   ├── server.js               # Serveur HTTP Express & configuration CORS
│   └── test-api.js             # Suite de 9 tests automatisés
├── vercel.json                 # Configuration racine de build & rewrites Vercel
├── package.json                # Scripts npm globaux
└── README.md                   # Documentation complète
```

---

## 🎓 Évaluation & Soutenance

Projet réalisé dans le cadre du module **Architecture MERN** à l'**École Polytechnique de Sousse**, sous la direction de **Dr. Abdelweheb GUEDDES**.
