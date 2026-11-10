const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const { memoryUsers } = require('../data/memoryStore');

// ==============================================================================
// LISTE DES COLLABORATEURS : GET /api/users
// Utilisé pour alimenter la sélection "Assigné à" lors de la création d'une tâche
// ==============================================================================
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find().select('-password').sort({ name: 1 });
      return res.status(200).json(users);
    }

    const safeUsers = memoryUsers.map(({ password, ...u }) => u);
    return res.status(200).json(safeUsers);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur récupération collaborateurs.', error: error.message });
  }
});

module.exports = router;
