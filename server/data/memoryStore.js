const bcrypt = require('bcryptjs');

// ==============================================================================
// DONNÉES EN MÉMOIRE (Mode Résilient Hors-Ligne / Fallback)
// Permet d'exécuter et tester le projet sans configuration préalable de MongoDB Atlas.
// Dès que MONGODB_URI est connecté, Mongoose prend le relais directement.
// ==============================================================================

const memoryUsers = [
  {
    _id: '65e9b1f2a3c4d5e6f7a8b901',
    id: '65e9b1f2a3c4d5e6f7a8b901',
    name: 'Siwar Sayar',
    email: 'sayarsiwar@polytechnicien.tn',
    password: bcrypt.hashSync('123456', 10),
    role: 'Admin',
    department: 'Direction',
    createdAt: new Date('2026-10-01T08:00:00Z').toISOString()
  },
  {
    _id: '65e9b1f2a3c4d5e6f7a8b902',
    id: '65e9b1f2a3c4d5e6f7a8b902',
    name: 'Fawz El Houda Ghalba',
    email: 'fawzelhouda.ghalba@polytechnicien.tn',
    password: bcrypt.hashSync('123456', 10),
    role: 'Chef de Projet',
    department: 'Ingénierie & IT',
    createdAt: new Date('2026-10-02T09:00:00Z').toISOString()
  },
  {
    _id: '65e9b1f2a3c4d5e6f7a8b903',
    id: '65e9b1f2a3c4d5e6f7a8b903',
    name: 'Utilisateur Poly',
    email: 'user@poly.tn',
    password: bcrypt.hashSync('123456', 10),
    role: 'Développeur',
    department: 'Ingénierie & IT',
    createdAt: new Date('2026-10-03T10:00:00Z').toISOString()
  }
];

const memoryProjects = [
  {
    _id: '65e9c1f2a3c4d5e6f7a8b911',
    id: '65e9c1f2a3c4d5e6f7a8b911',
    title: 'Refonte du Système d\'Information & ERP',
    description: 'Migration vers une architecture web moderne basée sur la stack MERN (MongoDB, Express, React, Node.js) avec authentification JWT.',
    status: 'En cours',
    priority: 'Haute',
    budget: 35000,
    startDate: new Date('2026-10-01').toISOString(),
    endDate: new Date('2026-12-31').toISOString(),
    createdBy: {
      _id: '65e9b1f2a3c4d5e6f7a8b901',
      id: '65e9b1f2a3c4d5e6f7a8b901',
      name: 'Siwar Sayar',
      email: 'sayarsiwar@polytechnicien.tn',
      role: 'Admin'
    },
    createdAt: new Date('2026-10-05T08:30:00Z').toISOString()
  },
  {
    _id: '65e9c1f2a3c4d5e6f7a8b912',
    id: '65e9c1f2a3c4d5e6f7a8b912',
    title: 'Application Web & Portail Collaboratif PME',
    description: 'Développement d\'une SPA avec React 18, Vite, Redux Toolkit et intercepteur Axios pour le suivi des tâches et des équipes.',
    status: 'En cours',
    priority: 'Critique',
    budget: 22000,
    startDate: new Date('2026-10-10').toISOString(),
    endDate: new Date('2026-11-30').toISOString(),
    createdBy: {
      _id: '65e9b1f2a3c4d5e6f7a8b902',
      id: '65e9b1f2a3c4d5e6f7a8b902',
      name: 'Fawz El Houda Ghalba',
      email: 'fawzelhouda.ghalba@polytechnicien.tn',
      role: 'Chef de Projet'
    },
    createdAt: new Date('2026-10-12T10:00:00Z').toISOString()
  },
  {
    _id: '65e9c1f2a3c4d5e6f7a8b913',
    id: '65e9c1f2a3c4d5e6f7a8b913',
    title: 'Audit Cybersécurité & Durcissement des APIs',
    description: 'Analyse des vulnérabilités, protection par tokens JWT stateless, hachage bcrypt et mise en place de sentinelles de sécurité.',
    status: 'Planifié',
    priority: 'Moyenne',
    budget: 15000,
    startDate: new Date('2026-11-15').toISOString(),
    endDate: new Date('2027-01-15').toISOString(),
    createdBy: {
      _id: '65e9b1f2a3c4d5e6f7a8b901',
      id: '65e9b1f2a3c4d5e6f7a8b901',
      name: 'Siwar Sayar',
      email: 'sayarsiwar@polytechnicien.tn',
      role: 'Admin'
    },
    createdAt: new Date('2026-10-20T14:15:00Z').toISOString()
  }
];

const memoryTasks = [
  {
    _id: '65e9d1f2a3c4d5e6f7a8b921',
    id: '65e9d1f2a3c4d5e6f7a8b921',
    title: 'Modélisation des Schémas Mongoose (User, Project, Task)',
    description: 'Créer les 3 entités avec relations One-to-Many et références ObjectId.',
    status: 'Terminé',
    priority: 'Haute',
    dueDate: new Date('2026-10-15').toISOString(),
    project: {
      _id: '65e9c1f2a3c4d5e6f7a8b911',
      id: '65e9c1f2a3c4d5e6f7a8b911',
      title: 'Refonte du Système d\'Information & ERP',
      status: 'En cours'
    },
    assignedTo: {
      _id: '65e9b1f2a3c4d5e6f7a8b902',
      id: '65e9b1f2a3c4d5e6f7a8b902',
      name: 'Fawz El Houda Ghalba',
      email: 'fawzelhouda.ghalba@polytechnicien.tn',
      role: 'Chef de Projet'
    },
    createdAt: new Date('2026-10-06T09:00:00Z').toISOString()
  },
  {
    _id: '65e9d1f2a3c4d5e6f7a8b922',
    id: '65e9d1f2a3c4d5e6f7a8b922',
    title: 'Implémentation du Middleware Sentinelle protect JWT',
    description: 'Intercepter Authorization: Bearer <token> et sécuriser les actions d\'ajout/suppression.',
    status: 'En cours',
    priority: 'Haute',
    dueDate: new Date('2026-10-25').toISOString(),
    project: {
      _id: '65e9c1f2a3c4d5e6f7a8b911',
      id: '65e9c1f2a3c4d5e6f7a8b911',
      title: 'Refonte du Système d\'Information & ERP',
      status: 'En cours'
    },
    assignedTo: {
      _id: '65e9b1f2a3c4d5e6f7a8b903',
      id: '65e9b1f2a3c4d5e6f7a8b903',
      name: 'Utilisateur Poly',
      email: 'user@poly.tn',
      role: 'Développeur'
    },
    createdAt: new Date('2026-10-08T11:00:00Z').toISOString()
  },
  {
    _id: '65e9d1f2a3c4d5e6f7a8b923',
    id: '65e9d1f2a3c4d5e6f7a8b923',
    title: 'Développement du Dashboard React 18 & Store Redux Toolkit',
    description: 'Gestion globale de l\'état (auth, projects, tasks) avec rendu conditionnel.',
    status: 'En cours',
    priority: 'Moyenne',
    dueDate: new Date('2026-11-05').toISOString(),
    project: {
      _id: '65e9c1f2a3c4d5e6f7a8b912',
      id: '65e9c1f2a3c4d5e6f7a8b912',
      title: 'Application Web & Portail Collaboratif PME',
      status: 'En cours'
    },
    assignedTo: {
      _id: '65e9b1f2a3c4d5e6f7a8b903',
      id: '65e9b1f2a3c4d5e6f7a8b903',
      name: 'Utilisateur Poly',
      email: 'user@poly.tn',
      role: 'Développeur'
    },
    createdAt: new Date('2026-10-14T14:30:00Z').toISOString()
  },
  {
    _id: '65e9d1f2a3c4d5e6f7a8b924',
    id: '65e9d1f2a3c4d5e6f7a8b924',
    title: 'Audit des En-têtes HTTP et Chiffrement Bcrypt',
    description: 'Vérifier qu\'aucun mot de passe n\'est stocké en clair et que les CORS sont restreints.',
    status: 'À faire',
    priority: 'Basse',
    dueDate: new Date('2026-11-20').toISOString(),
    project: {
      _id: '65e9c1f2a3c4d5e6f7a8b913',
      id: '65e9c1f2a3c4d5e6f7a8b913',
      title: 'Audit Cybersécurité & Durcissement des APIs',
      status: 'Planifié'
    },
    assignedTo: {
      _id: '65e9b1f2a3c4d5e6f7a8b902',
      id: '65e9b1f2a3c4d5e6f7a8b902',
      name: 'Fawz El Houda Ghalba',
      email: 'fawzelhouda.ghalba@polytechnicien.tn',
      role: 'Chef de Projet'
    },
    createdAt: new Date('2026-10-22T08:00:00Z').toISOString()
  }
];

module.exports = {
  memoryUsers,
  memoryProjects,
  memoryTasks
};
