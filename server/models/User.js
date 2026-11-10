const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ==============================================================================
// MODÈLE MONGOOSE 1 : Utilisateur & Employé (User)
// Thématique : Gestion d'Entreprise / PME
// ==============================================================================
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom complet de l\'employé est obligatoire'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'L\'adresse email est obligatoire'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Format d\'adresse email invalide']
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire'],
      minlength: [6, 'Le mot de passe doit comporter au moins 6 caractères']
    },
    role: {
      type: String,
      enum: ['Admin', 'Chef de Projet', 'Développeur', 'Employé'],
      default: 'Employé'
    },
    department: {
      type: String,
      enum: ['Direction', 'Ingénierie & IT', 'Marketing & Ventes', 'Ressources Humaines', 'Finance'],
      default: 'Ingénierie & IT'
    }
  },
  {
    timestamps: true
  }
);

// ------------------------------------------------------------------------------
// Hook Mongoose pré-enregistrement : Hachage automatique du mot de passe avec bcrypt
// ------------------------------------------------------------------------------
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ------------------------------------------------------------------------------
// Méthode de vérification du mot de passe avec bcrypt.compare()
// ------------------------------------------------------------------------------
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
