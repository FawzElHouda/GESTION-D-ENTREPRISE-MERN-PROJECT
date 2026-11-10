const mongoose = require('mongoose');

// ==============================================================================
// CONFIGURATION DE LA CONNEXION MONGODB (Atlas ou Local)
// Thématique : Gestion d'Entreprise / PME
// ==============================================================================
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('ℹ️ MONGODB_URI non renseigné dans server/.env : Démarrage en mode développement local.');
    console.log('💡 Pour connecter votre cluster gratuit MongoDB Atlas M0, ajoutez MONGODB_URI dans server/.env.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // 5 secondes de délai max
    });
    console.log(`✅ Base de données MongoDB Atlas connectée avec succès : ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`⚠️ Erreur de connexion MongoDB : ${error.message}`);
    console.log('💡 Conseil : Vérifiez les accès IP (0.0.0.0/0) et vos identifiants dans MongoDB Atlas.');
    return false;
  }
};

module.exports = connectDB;
