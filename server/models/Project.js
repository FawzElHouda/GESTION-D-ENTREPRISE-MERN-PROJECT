const mongoose = require('mongoose');

// ==============================================================================
// MODÈLE MONGOOSE 2 : Projet d'Entreprise (Project)
// Thématique : Gestion d'Entreprise / PME (Métier Principal)
// Relation One-to-Many (1 -> N) : Un utilisateur (Chef de Projet) crée/gère plusieurs projets
// ==============================================================================
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le nom ou titre du projet est obligatoire'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'La description du projet est obligatoire'],
      trim: true
    },
    status: {
      type: String,
      enum: ['Planifié', 'En cours', 'En pause', 'Terminé'],
      default: 'En cours'
    },
    priority: {
      type: String,
      enum: ['Basse', 'Moyenne', 'Haute', 'Critique'],
      default: 'Moyenne'
    },
    budget: {
      type: Number,
      default: 10000
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    // Référence vers l'utilisateur créateur / chef de projet (1 User -> N Projets)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Le créateur du projet est obligatoire']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Project', projectSchema);
