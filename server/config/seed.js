const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

// ==============================================================================
// SEED INITIAL POUR MONGODB ATLAS : Gestion de Projets & Tâches d'Entreprise
// ==============================================================================
const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`ℹ️ Base MongoDB déjà initialisée (${userCount} utilisateurs trouvés).`);
      return;
    }

    console.log('🌱 Initialisation des données d\'entreprise (Users, Projects, Tasks)...');

    // 1. Création des utilisateurs avec mots de passe hachés via bcrypt
    const siwar = await User.create({
      name: 'Siwar Sayar',
      email: 'sayarsiwar@polytechnicien.tn',
      password: '123456',
      role: 'Admin',
      department: 'Direction'
    });

    const fawz = await User.create({
      name: 'Fawz El Houda Ghalba',
      email: 'fawzelhouda.ghalba@polytechnicien.tn',
      password: '123456',
      role: 'Chef de Projet',
      department: 'Ingénierie & IT'
    });

    const polyUser = await User.create({
      name: 'Utilisateur Poly',
      email: 'user@poly.tn',
      password: '123456',
      role: 'Développeur',
      department: 'Ingénierie & IT'
    });

    // 2. Création des projets d'entreprise (1 User -> N Projects)
    const proj1 = await Project.create({
      title: 'Refonte du Système d\'Information & ERP',
      description: 'Migration vers une architecture web moderne basée sur la stack MERN avec authentification JWT.',
      status: 'En cours',
      priority: 'Haute',
      budget: 35000,
      startDate: new Date('2026-10-01'),
      endDate: new Date('2026-12-31'),
      createdBy: siwar._id
    });

    const proj2 = await Project.create({
      title: 'Application Web & Portail Collaboratif PME',
      description: 'Développement d\'une SPA avec React 18, Vite, Redux Toolkit et intercepteur Axios pour le suivi des tâches.',
      status: 'En cours',
      priority: 'Critique',
      budget: 22000,
      startDate: new Date('2026-10-10'),
      endDate: new Date('2026-11-30'),
      createdBy: fawz._id
    });

    const proj3 = await Project.create({
      title: 'Audit Cybersécurité & Durcissement des APIs',
      description: 'Analyse des vulnérabilités, protection par tokens JWT stateless et hachage bcrypt.',
      status: 'Planifié',
      priority: 'Moyenne',
      budget: 15000,
      startDate: new Date('2026-11-15'),
      endDate: new Date('2027-01-15'),
      createdBy: siwar._id
    });

    // 3. Création des tâches liées aux projets et aux employés (1 Project -> N Tasks)
    await Task.create({
      title: 'Modélisation des Schémas Mongoose (User, Project, Task)',
      description: 'Créer les 3 entités avec relations One-to-Many et références ObjectId.',
      status: 'Terminé',
      priority: 'Haute',
      dueDate: new Date('2026-10-15'),
      project: proj1._id,
      assignedTo: fawz._id
    });

    await Task.create({
      title: 'Implémentation du Middleware Sentinelle protect JWT',
      description: 'Intercepter Authorization: Bearer <token> et sécuriser les actions d\'ajout/suppression.',
      status: 'En cours',
      priority: 'Haute',
      dueDate: new Date('2026-10-25'),
      project: proj1._id,
      assignedTo: polyUser._id
    });

    await Task.create({
      title: 'Développement du Dashboard React 18 & Store Redux Toolkit',
      description: 'Gestion globale de l\'état (auth, projects, tasks) avec rendu conditionnel.',
      status: 'En cours',
      priority: 'Moyenne',
      dueDate: new Date('2026-11-05'),
      project: proj2._id,
      assignedTo: polyUser._id
    });

    await Task.create({
      title: 'Audit des En-têtes HTTP et Chiffrement Bcrypt',
      description: 'Vérifier qu\'aucun mot de passe n\'est stocké en clair et que les CORS sont restreints.',
      status: 'À faire',
      priority: 'Basse',
      dueDate: new Date('2026-11-20'),
      project: proj3._id,
      assignedTo: fawz._id
    });

    console.log('✅ Base MongoDB initialisée avec succès ! Comptes prêts : sayarsiwar@polytechnicien.tn / 123456');
  } catch (err) {
    console.error('⚠️ Avertissement lors du seeding initial :', err.message);
  }
};

module.exports = seedDatabase;
