# 🎓 Guide de Soutenance Orale — Gestion d'Entreprise MERN

> École Polytechnique de Sousse | Dr. Abdelweheb GUEDDES | Séance 6

---

## 📌 Questions Probables & Réponses Clés

---

### 1. Les Modèles Mongoose

**Q : Expliquez vos 3 modèles et leurs relations.**

> Notre projet utilise 3 modèles Mongoose :
> - **User** : représente les employés. Champs : `name`, `email`, `password` (haché bcrypt), `role` (Admin/Chef de Projet/Développeur/Employé), `department`.
> - **Project** : représente un projet d'entreprise. Champs : `title`, `description`, `status`, `priority`, `budget`, `startDate`, `endDate`, et `createdBy` qui est une **référence** vers le modèle User.
> - **Task** : représente une tâche. Champs : `title`, `description`, `status`, `priority`, `dueDate`, `project` (référence vers Project) et `assignedTo` (référence vers User).
>
> **Relations 1:N :**
> - Un User peut créer plusieurs Projects → `createdBy: { type: ObjectId, ref: 'User' }`
> - Un Project peut avoir plusieurs Tasks → `project: { type: ObjectId, ref: 'Project' }`
> - Un User peut être assigné à plusieurs Tasks → `assignedTo: { type: ObjectId, ref: 'User' }`

---

### 2. Le Peuplement avec `.populate()`

**Q : Comment fonctionne `.populate()` dans Mongoose ? Montrez un exemple.**

> `.populate()` remplace les ObjectId stockés en base par les documents complets des collections référencées.
>
> **Exemple — Projet avec créateur :**
> ```js
> const projects = await Project.find().populate('createdBy', 'name email role');
> // createdBy n'est plus un simple ObjectId mais un objet { name, email, role }
> ```
>
> **Exemple — Double populate sur les tâches :**
> ```js
> const tasks = await Task.find()
>   .populate('project', 'title status')
>   .populate('assignedTo', 'name email');
> // Chaque tâche contient le titre du projet ET le nom de l'assigné
> ```
>
> Sans `.populate()`, on obtiendrait seulement des IDs comme `"64abc123..."`.

---

### 3. L'Authentification JWT

**Q : Comment fonctionne votre authentification JWT ?**

> 1. **Login** : L'utilisateur envoie `email` + `password` via POST `/api/auth/login`
> 2. **Vérification** : On cherche l'utilisateur en base, on compare le mot de passe avec `bcrypt.compare()`
> 3. **Token** : Si valide, on génère un JWT avec `jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })`
> 4. **Stockage** : Le frontend stocke le token dans `localStorage` via Redux (authSlice)
> 5. **Protection** : Pour chaque requête protégée, Axios envoie automatiquement `Authorization: Bearer <token>` via l'intercepteur
> 6. **Vérification middleware** : `protect` middleware vérifie le token avec `jwt.verify()` et attache `req.user` à la requête

**Q : Pourquoi JWT plutôt que sessions ?**

> JWT est **stateless** : le serveur ne stocke pas de session. Idéal pour les API REST et le déploiement sur plusieurs serveurs.

---

### 4. bcrypt et la Sécurité des Mots de Passe

**Q : Pourquoi hasher les mots de passe ? Comment fonctionne bcrypt ?**

> On ne stocke jamais un mot de passe en clair. bcrypt applique une fonction de hachage à sens unique avec un **salt** aléatoire.
>
> ```js
> // Dans User.js — avant sauvegarde
> userSchema.pre('save', async function(next) {
>   if (!this.isModified('password')) return next();
>   this.password = await bcrypt.hash(this.password, 10); // 10 = salt rounds
> });
>
> // Vérification au login
> const isMatch = await bcrypt.compare(passwordSaisi, user.password);
> ```
>
> Le **salt** est unique par utilisateur → deux utilisateurs avec le même mot de passe ont des hashs différents.

---

### 5. Redux Toolkit

**Q : Expliquez votre store Redux. Pourquoi 3 slices ?**

> Notre store Redux Toolkit a 3 slices :
> - **authSlice** : gère `user`, `token` (synchronisé avec localStorage), `loading`, `error`
> - **projectSlice** : gère la liste `projects`, `loading`, `error`. Actions : `setProjects`, `addProject`, `updateProject`, `removeProject`
> - **taskSlice** : gère la liste `tasks`, `loading`, `error`. Actions : `setTasks`, `addTask`, `updateTask`, `removeTask`
>
> On utilise `useSelector` pour lire l'état et `useDispatch` pour déclencher les actions. Redux Toolkit simplifie la création des slices avec `createSlice` (plus de switch/case).

---

### 6. La Suppression en Cascade

**Q : Que se passe-t-il quand on supprime un projet ? Montrez la logique.**

> Quand on supprime un projet, toutes ses tâches associées doivent être supprimées aussi (intégrité référentielle).
>
> ```js
> // Dans projectRoutes.js — DELETE /api/projects/:id
> router.delete('/:id', protect, async (req, res) => {
>   // 1. Supprimer toutes les tâches du projet
>   await Task.deleteMany({ project: req.params.id });
>   // 2. Supprimer le projet lui-même
>   await Project.findByIdAndDelete(req.params.id);
>   res.json({ message: 'Projet et tâches associées supprimés avec succès' });
> });
> ```
>
> Sans cette cascade, on aurait des tâches orphelines en base (tâches pointant vers un projet qui n'existe plus).

---

### 7. L'Architecture MERN

**Q : Décrivez le flux complet d'une requête, par exemple "Créer un projet".**

> 1. **Frontend** : L'utilisateur remplit le formulaire `ProjectForm.jsx` et clique "Créer"
> 2. **Redux** : Le composant dispatch une action, Axios envoie POST `/api/projects` avec le token JWT dans le header
> 3. **Intercepteur Axios** : `axiosClient.js` ajoute automatiquement `Authorization: Bearer <token>`
> 4. **Backend Express** : Route `POST /api/projects` → middleware `protect` vérifie le JWT → extrait `req.user`
> 5. **Mongoose** : `Project.create({ ...data, createdBy: req.user.id })` sauvegarde en MongoDB
> 6. **Réponse** : Le projet créé (avec `.populate('createdBy')`) est renvoyé en JSON 201
> 7. **Redux update** : Le frontend dispatch `addProject(newProject)` → Redux met à jour le state → React re-render automatique

---

### 8. Mode Résilient (sans MongoDB)

**Q : Votre serveur démarre même sans base de données. Comment ?**

> Nous avons implémenté un **fallback mémoire** (`server/data/memoryStore.js`) avec 3 utilisateurs, 3 projets et 4 tâches pré-définis.
>
> Le middleware `protect` vérifie `mongoose.connection.readyState === 1` avant d'utiliser MongoDB. Si MongoDB n'est pas connecté, il bascule automatiquement sur les tableaux en mémoire.
>
> Cela permet de faire des **démos** sans cluster Atlas et d'avoir un serveur toujours démarrable, même en l'absence de réseau.

---

### 9. Déploiement (Bonus)

**Q : Comment déployer ce projet en production ?**

> - **Base de données** → MongoDB Atlas (cluster gratuit M0)
> - **Backend** → Render.com (Web Service gratuit, variable `MONGODB_URI` + `JWT_SECRET`)
> - **Frontend** → Vercel (détecte Vite automatiquement, variable `VITE_API_URL`)
> - Le fichier `vercel.json` redirige les routes SPA et proxifie `/api` vers le backend

---

## Checklist Démo Live

- [ ] Ouvrir http://localhost:5174
- [ ] Se connecter avec `sayarsiwar@polytechnicien.tn` / `123456`
- [ ] Montrer le Dashboard (statistiques)
- [ ] Aller dans Projets → Montrer les projets avec leur créateur peuplé
- [ ] Créer un nouveau projet → JWT visible dans Network tab DevTools
- [ ] Aller dans Tâches → Montrer le double populate (projet + assigné)
- [ ] Filtrer les tâches par projet
- [ ] Changer le statut d'une tâche (PUT inline)
- [ ] Supprimer un projet → vérifier la cascade sur les tâches
- [ ] Se déconnecter → tenter de créer un projet → erreur 401
- [ ] Montrer le code du middleware `protect` dans `authMiddleware.js`

---

*Bonne soutenance !*
