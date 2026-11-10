const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { memoryUsers } = require('../data/memoryStore');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'secret_jwt_polytechnique_sousse_2026';
  return jwt.sign(
    {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    },
    secret,
    { expiresIn: '24h' }
  );
};

// ==============================================================================
// 1. Inscription Collaborateur : POST /api/auth/register
// ==============================================================================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Erreur 400 : Nom, adresse email et mot de passe sont obligatoires.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Erreur 400 : Le mot de passe doit comporter au moins 6 caractères.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Mode MongoDB Atlas
    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        return res.status(409).json({
          message: 'Erreur 409 : Un compte existe déjà avec cette adresse email.'
        });
      }

      const newUser = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password,
        role: role || 'Employé',
        department: department || 'Ingénierie & IT'
      });

      const userInfo = {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department
      };
      const token = generateToken(newUser);

      return res.status(201).json({
        message: 'Compte collaborateur créé avec succès 🚀',
        user: userInfo,
        token
      });
    }

    // Mode Résilient Hors-Ligne
    const exists = memoryUsers.find((u) => u.email === cleanEmail);
    if (exists) {
      return res.status(409).json({
        message: 'Erreur 409 : Un compte existe déjà avec cette adresse email.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newId = '65e9b' + Date.now().toString(16).padEnd(19, '0');
    const newUser = {
      _id: newId,
      id: newId,
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: role || 'Employé',
      department: department || 'Ingénierie & IT',
      createdAt: new Date().toISOString()
    };
    memoryUsers.push(newUser);

    const userInfo = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department
    };
    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'Compte collaborateur créé avec succès 🚀',
      user: userInfo,
      token
    });
  } catch (error) {
    console.error('Erreur inscription :', error);
    return res.status(500).json({
      message: 'Erreur serveur 500 lors de la création du compte.',
      error: error.message
    });
  }
});

// ==============================================================================
// 2. Connexion : POST /api/auth/login
// ==============================================================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Erreur 400 : Email et mot de passe sont obligatoires.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Mode MongoDB Atlas
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(401).json({
          message: 'Identifiants incorrects (aucun compte avec cet email).'
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          message: 'Mot de passe incorrect.'
        });
      }

      const userInfo = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      };
      const token = generateToken(user);

      return res.status(200).json({
        message: 'Connexion réussie ✅',
        user: userInfo,
        token
      });
    }

    // Mode Résilient Hors-Ligne
    const user = memoryUsers.find((u) => u.email === cleanEmail);
    if (!user) {
      return res.status(401).json({
        message: 'Identifiants incorrects. Comptes démo : sayarsiwar@polytechnicien.tn / 123456'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Mot de passe incorrect.'
      });
    }

    const userInfo = {
      id: user.id || user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    };
    const token = generateToken(user);

    return res.status(200).json({
      message: 'Connexion réussie (Token JWT délivré) ✅',
      user: userInfo,
      token
    });
  } catch (error) {
    console.error('Erreur connexion :', error);
    return res.status(500).json({
      message: 'Erreur serveur 500 lors de la connexion.',
      error: error.message
    });
  }
});

// ==============================================================================
// 3. Profil Courant : GET /api/auth/me (Protégé par JWT)
// ==============================================================================
router.get('/me', protect, async (req, res) => {
  return res.status(200).json({ user: req.user });
});

module.exports = router;
