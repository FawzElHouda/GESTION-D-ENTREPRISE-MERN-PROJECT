# INTERACTIVE-DECALE-MERN-PROJECT
## Authentification Full-Stack JWT, Protection des Actions & Déploiement Cloud
**Auteur :** Fawz El Houda Ghalba  
**Enseignant :** Dr. Abdelweheb GUEDDES - École Polytechnique de Sousse  
**Cours :** MERN Stack (Groupe Décalé - Séance 6 Finale)

---

### 🌐 Déploiement Cloud
- **Dépôt GitHub :** [https://github.com/FawzElHouda/INTERACTIVE-DECALE-MERN-PROJECT](https://github.com/FawzElHouda/INTERACTIVE-DECALE-MERN-PROJECT)
- **Application en ligne (Vercel) :** [https://interactive-decale-mern-project.vercel.app](https://interactive-decale-mern-project.vercel.app)

---

### 🚀 1. Démarrer le Serveur Express Sécurisé par JWT (Local)
```bash
cd server
npm install
npm start
```
- Port par défaut : `http://localhost:5001`
- Comptes de test :
  - `gueddes@poly.tn` / `123456` (Admin)
  - `fawzelhouda.ghalba@polytechnicien.tn` / `123456` (Admin)
  - `aya@poly.tn` / `123456` (Auteur)

---

### 💻 2. Démarrer le Client React (Local)
```bash
cd client
npm install
npm run dev
```
Ouvrez `http://localhost:5173` dans le navigateur.

---

### 🛠️ 3. Fonctionnalités Implémentées
1. **Redux Toolkit (`authSlice.js`) :** Gestion d'état global utilisateur et token synchronisé avec `localStorage`.
2. **Intercepteur Axios (`axiosClient.js`) :** Injection automatique du header `Authorization: Bearer <token>`.
3. **Carte d'Authentification (`AuthCard.jsx`) :** Connexion JWT avec gestion d'erreurs et bouton compte démo.
4. **Protection des Actions :** Formulaire de publication et bouton de suppression réservés aux utilisateurs connectés.
5. **Déploiement Cloud Vercel :** Frontend React Vite + Backend Serverless Express sous `/api`.
