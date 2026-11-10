# 🏢 Gestion d'Entreprise — Projets & Tâches

> **École Polytechnique de Sousse** · Dr. Abdelweheb GUEDDES · Séance 6  
> **Auteure :** Fawz El Houda Ghalba

Application **MERN Stack** complète de gestion de projets et tâches pour PME, avec authentification JWT, relations 1:N Mongoose avec `.populate()`, et Redux Toolkit.

---

## 🌐 Démo en ligne

| Service | URL |
|---------|-----|
| **Frontend** (Vercel) | _(à renseigner après déploiement)_ |
| **Backend** (Render) | _(à renseigner après déploiement)_ |

---

## 🗃️ Schéma des Modèles Mongoose

```
┌──────────────────────────────────┐
│              USER                │
│──────────────────────────────────│
│ _id, name, email, password       │
│ role, department                 │
└───────────────┬──────────────────┘
                │ 1:N  (createdBy)
                ▼
┌──────────────────────────────────┐
│             PROJECT              │
│──────────────────────────────────│
│ _id, title, description          │
│ status, priority, budget         │
│ startDate, endDate               │
│ createdBy  ──► ref: User         │
└───────────────┬──────────────────┘
                │ 1:N  (project)
                ▼
┌──────────────────────────────────┐
│              TASK                │
│──────────────────────────────────│
│ _id, title, description          │
│ status, priority, dueDate        │
│ project    ──► ref: Project      │
│ assignedTo ──► ref: User         │
└──────────────────────────────────┘
```

**Relations :**
- `User` → `Project` : 1:N via `createdBy`
- `Project` → `Task` : 1:N via `project`
- `User` → `Task` : 1:N via `assignedTo`
- Peuplement : `.populate('createdBy')` sur projets, double `.populate()` sur tâches

---

## 🚀 Démarrage Local

### Prérequis
- Node.js ≥ 18 / npm ≥ 9
- (Optionnel) Cluster MongoDB Atlas gratuit M0

### 1. Cloner le projet

```bash
git clone git@github.com:FawzElHouda/GESTION-D-ENTREPRISE-MERN-PROJECT.git
cd GESTION-D-ENTREPRISE-MERN-PROJECT
```

### 2. Installer les dépendances

```bash
npm --prefix server install
npm --prefix client install
```

### 3. Configurer l'environnement serveur

```bash
cp server/.env.example server/.env
```

Édite `server/.env` :

```env
PORT=5001
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/entreprise
JWT_SECRET=un_secret_fort_et_long
CLIENT_URL=http://localhost:5173
```

> ⚡ **Sans `MONGODB_URI`**, le serveur démarre automatiquement en **mode mémoire** avec des données de démo — aucune installation MongoDB requise.

### 4. Lancer le backend

```bash
npm --prefix server start
# → http://localhost:5001/api
```

### 5. Lancer le frontend

```bash
npm --prefix client run dev
# → http://localhost:5173
```

---

## 🔐 Comptes de Test

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| `sayarsiwar@polytechnicien.tn` | `123456` | Admin |
| `fawzelhouda.ghalba@polytechnicien.tn` | `123456` | Chef de Projet |
| `user@poly.tn` | `123456` | Développeur |

---

## 🧪 Tests Automatisés (Backend)

```bash
npm --prefix server test
```

**9 tests validés :**

| # | Test | Résultat |
|---|------|----------|
| 1 | Healthcheck | ✅ 200 |
| 2 | Connexion JWT (Siwar Sayar) | ✅ 200 |
| 3 | Inscription bcrypt | ✅ 201 |
| 4 | Lecture projets avec `.populate('createdBy')` | ✅ 200 |
| 5 | Création projet (protégé JWT) | ✅ 201 |
| 6 | Lecture tâches — double `.populate()` | ✅ 200 |
| 7 | Création tâche 1:N (protégée JWT) | ✅ 201 |
| 8 | Modification statut (PUT) | ✅ 200 |
| 9 | Suppression projet + cascade tâches (DELETE) | ✅ 200 |

---

## 🌐 Endpoints API

### Authentification
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/auth/register` | ❌ | Inscription |
| POST | `/api/auth/login` | ❌ | Connexion → JWT |
| GET | `/api/auth/me` | 🔒 JWT | Profil connecté |

### Projets
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/projects` | ❌ | Liste tous (populate creator) |
| GET | `/api/projects/:id` | ❌ | Détail d'un projet |
| POST | `/api/projects` | 🔒 JWT | Créer un projet |
| PUT | `/api/projects/:id` | 🔒 JWT | Modifier |
| DELETE | `/api/projects/:id` | 🔒 JWT | Supprimer + cascade tâches |

### Tâches
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/tasks` | ❌ | Liste (`?projectId=` pour filtrer) |
| POST | `/api/tasks` | 🔒 JWT | Créer une tâche |
| PUT | `/api/tasks/:id` | 🔒 JWT | Modifier statut |
| DELETE | `/api/tasks/:id` | 🔒 JWT | Supprimer |

### Utilisateurs
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/users` | ❌ | Liste (sélecteur d'assigné) |

---

## 🏗️ Structure du Projet

```
GESTION-D-ENTREPRISE-MERN-PROJECT/
├── client/                   # React 19 + Vite + Redux Toolkit
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosClient.js        # Intercepteur JWT automatique
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── AuthCard.jsx
│   │   │   ├── DashboardStats.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── ProjectList.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskList.jsx
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   ├── authSlice.js
│   │   │   ├── projectSlice.js
│   │   │   └── taskSlice.js
│   │   └── App.jsx
│   └── package.json
├── server/                   # Node.js + Express + Mongoose
│   ├── config/
│   │   ├── db.js             # Connexion MongoDB (résiliente)
│   │   └── seed.js           # Données initiales
│   ├── data/
│   │   └── memoryStore.js    # Fallback sans MongoDB
│   ├── middleware/
│   │   └── authMiddleware.js # Middleware JWT protect
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── server.js
│   ├── test-api.js           # Suite de 9 tests automatisés
│   └── package.json
├── vercel.json               # Config déploiement Vercel
└── README.md
```

---

## ☁️ Déploiement Production

### Base de données → MongoDB Atlas
1. Créer un cluster gratuit **M0** sur [cloud.mongodb.com](https://cloud.mongodb.com)
2. Whitelist `0.0.0.0/0` dans Network Access
3. Créer un utilisateur DB et copier la connection string

### Backend → Render.com
1. New Web Service → connecter ce repo GitHub
2. **Root Directory :** `server`
3. **Build Command :** `npm install`
4. **Start Command :** `node server.js`
5. Variables d'environnement :
   - `MONGODB_URI` = ta connection string Atlas
   - `JWT_SECRET` = clé secrète longue et aléatoire
   - `CLIENT_URL` = URL Vercel du frontend

### Frontend → Vercel
1. New Project → connecter ce repo GitHub
2. **Framework :** Vite
3. **Root Directory :** `client`
4. Variable d'environnement :
   - `VITE_API_URL` = `https://ton-backend.onrender.com/api`

---

## 🛡️ Sécurité

| Mécanisme | Détail |
|-----------|--------|
| **JWT** | Tokens stateless, expiration 7 jours |
| **bcryptjs** | Hachage mot de passe, salt rounds = 10 |
| **Middleware `protect`** | Vérifie `Authorization: Bearer <token>` |
| **Mode résilient** | Pas de crash si MongoDB indisponible |

---

## 📦 Stack Technique

| Couche | Technologies |
|--------|-------------|
| **Frontend** | React 19, Vite 8, Redux Toolkit, Axios |
| **Styling** | CSS Variables, Grid/Flexbox (sans framework CSS) |
| **Backend** | Node.js, Express 4 |
| **Base de données** | MongoDB + Mongoose |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **Déploiement** | Vercel + Render + MongoDB Atlas |
