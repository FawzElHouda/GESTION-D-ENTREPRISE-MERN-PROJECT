import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axiosClient from '../api/axiosClient';
import { removeProject } from '../redux/projectSlice';
import { removeTask } from '../redux/taskSlice';

export default function ProjectCard({ project, onSelectProject }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: allTasks } = useSelector((state) => state.tasks);

  const projId = project._id || project.id;
  const creatorName = project.createdBy?.name || 'Chef de Projet';
  const creatorRole = project.createdBy?.role || 'Direction';

  // Calcul du nombre de tâches et de l'avancement pour ce projet
  const projectTasks = allTasks.filter(
    (t) => (t.project?._id || t.project?.id || t.project) === projId
  );
  const completedTasks = projectTasks.filter((t) => t.status === 'Terminé').length;
  const progressPercent = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Supprimer le projet "${project.title}" et toutes ses tâches associées ?`)) {
      return;
    }

    try {
      await axiosClient.delete(`/projects/${projId}`);
      dispatch(removeProject(projId));
      // Nettoyer localement les tâches liées
      projectTasks.forEach((t) => dispatch(removeTask(t._id || t.id)));
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression.');
    }
  };

  const getPriorityClass = (p) => {
    switch (p) {
      case 'Critique': return 'badge-priority-critical';
      case 'Haute': return 'badge-priority-high';
      case 'Moyenne': return 'badge-priority-medium';
      default: return 'badge-priority-low';
    }
  };

  const getStatusClass = (s) => {
    switch (s) {
      case 'Terminé': return 'badge-status-done';
      case 'En cours': return 'badge-status-progress';
      case 'Planifié': return 'badge-status-planned';
      default: return 'badge-status-paused';
    }
  };

  return (
    <div className="project-card-item">
      <div className="project-card-header">
        <div className="project-badges-row">
          <span className={`badge-status ${getStatusClass(project.status)}`}>
            {project.status}
          </span>
          <span className={`badge-priority ${getPriorityClass(project.priority)}`}>
            {project.priority}
          </span>
        </div>

        {user ? (
          <button
            type="button"
            className="btn-card-delete"
            onClick={handleDelete}
            title="Supprimer ce projet (JWT requis)"
          >
            🗑️ Supprimer
          </button>
        ) : (
          <span className="badge-read-only">🔒 Lecture seule</span>
        )}
      </div>

      <h3 className="project-card-title">{project.title}</h3>
      <p className="project-card-desc">{project.description}</p>

      {/* Barre de progression des tâches liées (1:N) */}
      <div className="project-progress-wrapper">
        <div className="project-progress-labels">
          <span>Progression ({completedTasks}/{projectTasks.length} tâches)</span>
          <span><strong>{progressPercent}%</strong></span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="project-card-footer">
        <div className="project-creator-info">
          <span>👤 Responsable : <strong>{creatorName}</strong> ({creatorRole})</span>
          {project.budget && (
            <span className="project-budget">💰 Budget : {Number(project.budget).toLocaleString()} DT</span>
          )}
        </div>

        {onSelectProject && (
          <button
            type="button"
            className="btn-view-tasks"
            onClick={() => onSelectProject(projId)}
          >
            Voir les tâches ({projectTasks.length}) →
          </button>
        )}
      </div>
    </div>
  );
}
