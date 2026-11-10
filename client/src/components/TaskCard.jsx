import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axiosClient from '../api/axiosClient';
import { updateTask, removeTask } from '../redux/taskSlice';

export default function TaskCard({ task }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const taskId = task._id || task.id;
  const projectTitle = task.project?.title || 'Projet Général';
  const assigneeName = task.assignedTo?.name || 'Non assigné';
  const assigneeRole = task.assignedTo?.role || 'Collaborateur';

  // Changement de statut rapide en 1 clic
  const handleStatusChange = async (newStatus) => {
    if (!user) {
      alert('Veuillez vous connecter pour modifier le statut d\'une tâche.');
      return;
    }

    try {
      const res = await axiosClient.put(`/tasks/${taskId}`, { status: newStatus });
      dispatch(updateTask(res.data));
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la mise à jour du statut.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Supprimer la tâche "${task.title}" ?`)) return;

    try {
      await axiosClient.delete(`/tasks/${taskId}`);
      dispatch(removeTask(taskId));
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression.');
    }
  };

  const getPriorityClass = (p) => {
    switch (p) {
      case 'Haute': return 'badge-priority-high';
      case 'Moyenne': return 'badge-priority-medium';
      default: return 'badge-priority-low';
    }
  };

  const getStatusClass = (s) => {
    switch (s) {
      case 'Terminé': return 'badge-status-done';
      case 'En cours': return 'badge-status-progress';
      case 'En revue': return 'badge-status-review';
      default: return 'badge-status-todo';
    }
  };

  return (
    <div className="task-card-item">
      <div className="task-card-top">
        <span className="task-project-pill">📁 {projectTitle}</span>
        <div className="task-top-badges">
          <span className={`badge-priority ${getPriorityClass(task.priority)}`}>
            {task.priority}
          </span>
          {user && (
            <button
              type="button"
              className="btn-task-delete"
              onClick={handleDelete}
              title="Supprimer la tâche"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <h4 className="task-card-title">{task.title}</h4>
      {task.description && <p className="task-card-desc">{task.description}</p>}

      <div className="task-card-meta">
        <span className="task-assignee">
          👤 Assigné à : <strong>{assigneeName}</strong> ({assigneeRole})
        </span>
      </div>

      {/* Sélecteur de statut dynamique (Protégé par JWT) */}
      <div className="task-status-row">
        <span className="task-status-label">Statut :</span>
        {user ? (
          <select
            className={`task-status-select ${getStatusClass(task.status)}`}
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="À faire">📌 À faire</option>
            <option value="En cours">⚡ En cours</option>
            <option value="En revue">🔍 En revue</option>
            <option value="Terminé">✅ Terminé</option>
          </select>
        ) : (
          <span className={`badge-status ${getStatusClass(task.status)}`}>
            {task.status}
          </span>
        )}
      </div>
    </div>
  );
}
