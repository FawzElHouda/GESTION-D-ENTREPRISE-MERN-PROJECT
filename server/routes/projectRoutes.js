const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');
const { memoryProjects, memoryTasks } = require('../data/memoryStore');

// ==============================================================================
// 1. LIRE TOUS LES PROJETS : GET /api/projects (PUBLIQUE / Visiteur)
// Utilise .populate() pour charger les informations du Chef de Projet (User)
// ==============================================================================
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const projects = await Project.find()
        .populate('createdBy', 'name email role department')
        .sort({ createdAt: -1 });

      return res.status(200).json(projects);
    }

    return res.status(200).json(memoryProjects);
  } catch (error) {
    console.error('Erreur lecture projets :', error);
    return res.status(500).json({
      message: 'Erreur serveur 500 lors de la récupération des projets.',
      error: error.message
    });
  }
});

// ==============================================================================
// 2. LIRE UN PROJET PAR ID : GET /api/projects/:id
// ==============================================================================
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const project = await Project.findById(req.params.id)
        .populate('createdBy', 'name email role department');

      if (!project) {
        return res.status(404).json({ message: 'Projet introuvable.' });
      }

      return res.status(200).json(project);
    }

    const project = memoryProjects.find((p) => (p._id || p.id) === req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Projet introuvable.' });
    }
    return res.status(200).json(project);
  } catch (error) {
    return res.status(400).json({
      message: 'Identifiant de projet invalide.',
      error: error.message
    });
  }
});

// ==============================================================================
// 3. CRÉER UN PROJET : POST /api/projects (PROTÉGÉE PAR JWT via protect)
// ==============================================================================
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, status, priority, budget, startDate, endDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Le titre du projet est obligatoire.' });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'La description du projet est obligatoire.' });
    }

    // Mode MongoDB Atlas
    if (mongoose.connection.readyState === 1) {
      const newProject = await Project.create({
        title: title.trim(),
        description: description.trim(),
        status: status || 'En cours',
        priority: priority || 'Moyenne',
        budget: Number(budget) || 10000,
        startDate: startDate || new Date(),
        endDate: endDate || null,
        createdBy: req.user._id || req.user.id
      });

      await newProject.populate('createdBy', 'name email role department');
      return res.status(201).json(newProject);
    }

    // Mode Résilient Hors-Ligne
    const newId = '65e9c' + Date.now().toString(16).padEnd(19, '0');
    const newProject = {
      _id: newId,
      id: newId,
      title: title.trim(),
      description: description.trim(),
      status: status || 'En cours',
      priority: priority || 'Moyenne',
      budget: Number(budget) || 10000,
      startDate: startDate || new Date().toISOString(),
      endDate: endDate || null,
      createdBy: {
        _id: req.user._id || req.user.id,
        id: req.user._id || req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role || 'Chef de Projet',
        department: req.user.department || 'Ingénierie & IT'
      },
      createdAt: new Date().toISOString()
    };
    memoryProjects.unshift(newProject);

    return res.status(201).json(newProject);
  } catch (error) {
    console.error('Erreur création projet :', error);
    return res.status(500).json({
      message: 'Erreur serveur 500 lors de la création du projet.',
      error: error.message
    });
  }
});

// ==============================================================================
// 4. METTRE À JOUR UN PROJET : PUT /api/projects/:id (PROTÉGÉE PAR JWT via protect)
// ==============================================================================
router.put('/:id', protect, async (req, res) => {
  try {
    const { status, priority, description } = req.body;

    if (mongoose.connection.readyState === 1) {
      const updated = await Project.findByIdAndUpdate(
        req.params.id,
        { status, priority, description },
        { new: true, runValidators: true }
      ).populate('createdBy', 'name email role department');

      if (!updated) return res.status(404).json({ message: 'Projet introuvable.' });
      return res.status(200).json(updated);
    }

    const project = memoryProjects.find((p) => (p._id || p.id) === req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet introuvable.' });
    if (status) project.status = status;
    if (priority) project.priority = priority;
    if (description) project.description = description;

    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur mise à jour projet.', error: error.message });
  }
});

// ==============================================================================
// 5. SUPPRIMER UN PROJET : DELETE /api/projects/:id (PROTÉGÉE PAR JWT via protect)
// Supprime le projet et nettoie en cascade toutes ses tâches associées (1 -> N)
// ==============================================================================
router.delete('/:id', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Projet introuvable.' });
      }

      // Suppression en cascade des tâches liées à ce projet (Intégrité 1:N)
      await Task.deleteMany({ project: project._id });
      await Project.findByIdAndDelete(project._id);

      return res.status(200).json({
        message: 'Projet et tâches associées supprimés avec succès ✅',
        id: project._id
      });
    }

    // Mode Résilient Hors-Ligne
    const index = memoryProjects.findIndex((p) => (p._id || p.id) === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Projet introuvable.' });
    }

    const deleted = memoryProjects.splice(index, 1)[0];
    const targetId = deleted._id || deleted.id;

    // Suppression en cascade des tâches associées
    const tasksToKeep = memoryTasks.filter(
      (t) => (t.project?._id || t.project?.id || t.project) !== targetId
    );
    memoryTasks.length = 0;
    memoryTasks.push(...tasksToKeep);

    return res.status(200).json({
      message: 'Projet et tâches associées supprimés avec succès ✅',
      id: targetId
    });
  } catch (error) {
    console.error('Erreur suppression projet :', error);
    return res.status(500).json({
      message: 'Erreur serveur 500 lors de la suppression du projet.',
      error: error.message
    });
  }
});

module.exports = router;
