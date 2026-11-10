const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { memoryUsers } = require('../data/memoryStore');

// ==============================================================================
// MIDDLEWARE SENTINELLE : protect
// Rôle : Protège les routes privées (création, suppression, etc.)
// Vérifie la présence et la validité du Token JWT dans l'en-tête Authorization
// ==============================================================================
const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  // 1. Contrôler la présence du préfixe standard "Bearer <token>"
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      // 2. Extraire la signature du jeton après l'espace
      token = authHeader.split(' ')[1];

      // 3. Décoder et vérifier le token avec la clé secrète JWT
      const secret = process.env.JWT_SECRET || 'secret_jwt_polytechnique_sousse_2026';
      const decoded = jwt.verify(token, secret);

      // 4. Récupérer l'utilisateur en base (sans exposer son mot de passe haché)
      let user = null;
      if (mongoose.connection.readyState === 1) {
        try {
          user = await User.findById(decoded.id).select('-password');
        } catch (dbErr) {
          // Erreur d'accès base
        }
      } else {
        const found = memoryUsers.find((u) => (u._id || u.id) === decoded.id);
        if (found) {
          const { password, ...safeUser } = found;
          user = safeUser;
        }
      }

      // Attacher l'utilisateur vérifié à l'objet Request (req.user)
      req.user = user || {
        _id: decoded.id,
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role || 'Employé'
      };

      return next(); // Passage au contrôleur suivant
    } catch (err) {
      console.error('Erreur de validation JWT :', err.message);
      return res.status(401).json({
        message: 'Accès refusé (401) : Token JWT invalide ou expiré.'
      });
    }
  }

  // Si aucun en-tête d'autorisation ou mauvais format
  return res.status(401).json({
    message: 'Accès refusé (401) : Vous devez être connecté pour effectuer cette action (Token JWT manquant).'
  });
};

module.exports = { protect };
