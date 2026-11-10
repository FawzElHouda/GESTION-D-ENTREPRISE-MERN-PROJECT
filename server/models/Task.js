const mongoose = require('mongoose');

// ==============================================================================
// MODÈLE MONGOOSE 3 : Tâche de Projet (Task)
// Thématique : Gestion d'Entreprise / PME (Entité Liée 1:N)
// Relations :
//   - Un projet regroupe plusieurs tâches (1 Project -> N Tasks)
//   - Un collaborateur se voit assigner plusieurs tâches (1 User -> N Tasks)
// ==============================================================================
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre de la tâche est obligatoire'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['À faire', 'En cours', 'En revue', 'Terminé'],
      default: 'À faire'
    },
    priority: {
      type: String,
      enum: ['Basse', 'Moyenne', 'Haute'],
      default: 'Moyenne'
    },
    dueDate: {
      type: Date
    },
    // Référence vers le Projet associé (1 Projet -> N Tâches)
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Le projet associé est obligatoire']
    },
    // Référence vers le Collaborateur assigné (1 User -> N Tâches)
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Le collaborateur assigné est obligatoire']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Task', taskSchema);
