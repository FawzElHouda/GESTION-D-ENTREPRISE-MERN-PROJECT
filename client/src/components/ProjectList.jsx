import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';

export default function ProjectList({ onSelectProject }) {
  const { items: projects, loading, error } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filteredProjects = projects.filter((p) => {
    const matchStatus = filterStatus ? p.status === filterStatus : true;
    const matchPriority = filterPriority ? p.priority === filterPriority : true;
    return matchStatus && matchPriority;
  });

  return (
    <div className="section-container">
      <div className="section-header-row">
        <div>
          <h2>📁 Projets d'Entreprise &amp; Portefeuilles</h2>
          <p className="section-sub">
            Synchronisation temps réel avec MongoDB Atlas • {projects.length} projet(s) au total
          </p>
        </div>

        <div className="section-actions-row">
          <div className="filters-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">Tous les statuts</option>
              <option value="Planifié">Planifié</option>
              <option value="En cours">En cours</option>
              <option value="En pause">En pause</option>
              <option value="Terminé">Terminé</option>
            </select>

            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="">Toutes les priorités</option>
              <option value="Basse">Basse</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Haute">Haute</option>
              <option value="Critique">Critique</option>
            </select>
          </div>

          {user && (
            <button
              type="button"
              className="btn-create-action"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Fermer le formulaire' : '➕ Nouveau Projet'}
            </button>
          )}
        </div>
      </div>

      {showForm && user && (
        <div className="inline-form-modal">
          <ProjectForm onClose={() => setShowForm(false)} />
        </div>
      )}

      {error && <div className="alert-message error">{error}</div>}
      {loading && <div className="loading-state">Chargement des projets depuis l'API Express...</div>}

      {!loading && filteredProjects.length === 0 && (
        <div className="empty-state-box">
          <p>Aucun projet ne correspond aux filtres appliqués.</p>
        </div>
      )}

      <div className="projects-grid">
        {filteredProjects.map((proj) => (
          <ProjectCard
            key={proj._id || proj.id}
            project={proj}
            onSelectProject={onSelectProject}
          />
        ))}
      </div>
    </div>
  );
}
