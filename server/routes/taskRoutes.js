const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { memoryTasks, memoryProjects, memoryUsers } = require('../data/memoryStore');

// ==============================================================================
// 1. LIRE TOUTES LES TÂCHES : GET /api/tasks (PUBLIQUE / Visiteur)
// Double .populate() : charge le Projet lié (1:N) et le Collaborateur assigné (User)
// ==============================================================================
router.get('/', async (req, res) => {
  try {
    const { projectId } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = projectId ? { project: projectId } : {};
      const tasks = await Task.find(filter)
        .populate('project', 'title status priority')
        .populate('assignedTo', 'name email role department')
        .sort({ createdAt: -1 });

      return res.status(200).json(tasks);
    }

    // Mode Résilient Hors-Ligne
    let tasks = memoryTasks;
    if (projectId) {
      tasks = tasks.filter(
        (t) => (t.project?._id || t.project?.id || t.project) === projectId
      );
    }
    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Erreur lecture tâches :', error);
    return res.status(500).json({
      message: 'Erreur serveur 500 lors de la récupération des tâches.',
      error: error.message
    });
  }
});

// ==============================================================================
// 2. CRÉER UNE NOUVELLE TÂCHE : POST /api/tasks (PROTÉGÉE PAR JWT via protect)
// ==============================================================================
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project, assignedTo } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Le titre de la tâche est obligatoire.' });
    }

    if (!project) {
      return res.status(400).json({ message: 'Le projet associé est obligatoire.' });
    }

    // Mode MongoDB Atlas
    if (mongoose.connection.readyState === 1) {
      // Vérifier que le projet existe
      const proj = await Project.findById(project);
      if (!proj) {
        return res.status(404).json({ message: 'Projet associé introuvable.' });
      }

      // Collaborateur assigné (par défaut l'utilisateur connecté s'il n'est pas spécifié)
      const assignedUserId = assignedTo || req.user._id || req.user.id;

      const newTask = await Task.create({
        title: title.trim(),
        description: (description || '').trim(),
        status: status || 'À faire',
        priority: priority || 'Moyenne',
        dueDate: dueDate || null,
        project,
        assignedTo: assignedUserId
      });

      await newTask.populate('project', 'title status priority');
      await newTask.populate('assignedTo', 'name email role department');

      return res.status(201).json(newTask);
    }

    // Mode Résilient Hors-Ligne
    const proj = memoryProjects.find((p) => (p._id || p.id) === project);
    const assignedUser = memoryUsers.find((u) => (u._id || u.id) === (assignedTo || req.user._id || req.user.id)) || req.user;

    const newId = '65e9d' + Date.now().toString(16).padEnd(19, '0');
    const newTask = {
      _id: newId,
      id: newId,
      title: title.trim(),
      description: (description || '').trim(),
      status: status || 'À faire',
      priority: priority || 'Moyenne',
      dueDate: dueDate || null,
      project: proj
        ? { _id: proj._id || proj.id, id: proj._id || proj.id, title: proj.title, status: proj.status }
        : { _id: project, title: 'Projet' },
      assignedTo: {
        _id: assignedUser._id || assignedUser.id,
        id: assignedUser._id || assignedUser.id,
        name: assignedUser.name,
        email: assignedUser.email,
        role: assignedUser.role || 'Développeur',
        department: assignedUser.department || 'Ingénierie & IT'
      },
      createdAt: new Date().toISOString()
    };
    memoryTasks.unshift(newTask);

    return res.status(201).json(newTask);
  } catch (error) {
    console.error('Erreur création tâche :', error);
    return res.status(500).json({
      message: 'Erreur serveur 500 lors de la création de la tâche.',
      error: error.message
    });
  }
});

// ==============================================================================
// 3. CHANGER LE STATUT D'UNE TÂCHE : PUT /api/tasks/:id (PROTÉGÉE PAR JWT via protect)
// ==============================================================================
router.put('/:id', protect, async (req, res) => {
  try {
    const { status, priority, description } = req.body;

    if (mongoose.connection.readyState === 1) {
      const updateData = {};
      if (status) updateData.status = status;
      if (priority) updateData.priority = priority;
      if (description) updateData.description = description;

      const updated = await Task.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true
      })
        .populate('project', 'title status priority')
        .populate('assignedTo', 'name email role department');

      if (!updated) return res.status(404).json({ message: 'Tâche introuvable.' });
      return res.status(200).json(updated);
    }

    const task = memoryTasks.find((t) => (t._id || t.id) === req.params.id);
    if (!task) return res.status(404).json({ message: 'Tâche introuvable.' });
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (description) task.description = description;

    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur mise à jour tâche.', error: error.message });
  }
});

// ==============================================================================
// 4. SUPPRIMER UNE TÂCHE : DELETE /api/tasks/:id (PROTÉGÉE PAR JWT via protect)
// ==============================================================================
router.delete('/:id', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ message: 'Tâche introuvable.' });

      await Task.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: 'Tâche supprimée avec succès ✅', id: req.params.id });
    }

    const index = memoryTasks.findIndex((t) => (t._id || t.id) === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Tâche introuvable.' });

    memoryTasks.splice(index, 1);
    return res.status(200).json({ message: 'Tâche supprimée avec succès ✅', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur suppression tâche.', error: error.message });
  }
});

module.exports = router;
