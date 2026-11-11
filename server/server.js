const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedDatabase = require('./config/seed');

// Import des routes modulaires (User, Project, Task)
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ==============================================================================
// 1. Middlewares Globaux : CORS & JSON
// ==============================================================================
app.use(
  cors({
    origin: (origin, callback) => {
      // Autorise les requêtes sans origine (curl, mobile, tests) et toutes les origines (Vercel, localhost, etc.)
      callback(null, true);
    },
    credentials: true
  })
);
app.use(express.json());

// ==============================================================================
// 2. Connexion Base de Données MongoDB (Atlas ou Local)
// ==============================================================================
connectDB().then((connected) => {
  if (connected) {
    seedDatabase();
  }
});

// ==============================================================================
// 3. Route Racine & Contrôle de Santé (Healthcheck)
// ==============================================================================
app.get(['/', '/api'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    project: 'Gestion de Projets & Tâches d\'Entreprise PME',
    stack: 'MERN (MongoDB, Express, React, Node.js)',
    author: 'Fawz El Houda Ghalba',
    school: 'École Polytechnique de Sousse - Dr. Abdelweheb GUEDDES',
    timestamp: new Date().toISOString()
  });
});

// Route de réinitialisation manuelle des données de démo
app.post(['/api/seed', '/seed'], async (req, res) => {
  try {
    await seedDatabase();
    res.status(200).json({ message: 'Données de démonstration vérifiées / initialisées.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du seeding', error: err.message });
  }
});

// ==============================================================================
// 4. Montage des Routes d'API
// ==============================================================================
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/projects', projectRoutes);
app.use('/projects', projectRoutes);

app.use('/api/tasks', taskRoutes);
app.use('/tasks', taskRoutes);

app.use('/api/users', userRoutes);
app.use('/users', userRoutes);

// ==============================================================================
// 5. Gestion des erreurs 404
// ==============================================================================
app.use((req, res) => {
  res.status(404).json({
    message: `Route introuvable : ${req.method} ${req.originalUrl}`
  });
});

// ==============================================================================
// 6. Gestionnaire d'erreurs global (500)
// ==============================================================================
app.use((err, req, res, next) => {
  console.error('❌ Erreur Serveur :', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Erreur interne du serveur'
  });
});

// ==============================================================================
// 7. Démarrage du Serveur Express
// ==============================================================================
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur Gestion d'Entreprise (Projets & Tâches) démarré sur le port ${PORT}`);
    console.log(`📡 URL API : http://localhost:${PORT}/api`);
    console.log(`🔒 Authentification JWT & Protection Sentinelle actives`);
  });
}

module.exports = app;
