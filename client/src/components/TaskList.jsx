import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

export default function TaskList({ selectedProjectId }) {
  const { items: tasks, loading, error } = useSelector((state) => state.tasks);
  const { items: projects } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  const [filterProject, setFilterProject] = useState(selectedProjectId || '');
  const [filterStatus, setFilterStatus] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Synchroniser avec un filtre venant du parent (ex: clic sur "Voir les tâches" d'un projet)
  React.useEffect(() => {
    if (selectedProjectId) {
      setFilterProject(selectedProjectId);
    }
  }, [selectedProjectId]);

  const filteredTasks = tasks.filter((t) => {
    const projId = t.project?._id || t.project?.id || t.project;
    const matchProject = filterProject ? projId === filterProject : true;
    const matchStatus = filterStatus ? t.status === filterStatus : true;
    return matchProject && matchStatus;
  });

  return (
    <div className="section-container">
      <div className="section-header-row">
        <div>
          <h2>📋 Suivi Opérationnel des Tâches</h2>
          <p className="section-sub">
            Attribution des tâches par projet et collaborateur (Double relation 1:N)
          </p>
        </div>

        <div className="section-actions-row">
          <div className="filters-group">
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
            >
              <option value="">Tous les projets</option>
              {projects.map((p) => (
                <option key={p._id || p.id} value={p._id || p.id}>
                  {p.title}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="À faire">À faire</option>
              <option value="En cours">En cours</option>
              <option value="En revue">En revue</option>
              <option value="Terminé">Terminé</option>
            </select>
          </div>

          {user && (
            <button
              type="button"
              className="btn-create-action"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Fermer le formulaire' : '➕ Nouvelle Tâche'}
            </button>
          )}
        </div>
      </div>

      {showForm && user && (
        <div className="inline-form-modal">
          <TaskForm
            onClose={() => setShowForm(false)}
            defaultProjectId={filterProject}
          />
        </div>
      )}

      {error && <div className="alert-message error">{error}</div>}
      {loading && <div className="loading-state">Chargement des tâches depuis l'API Express...</div>}

      {!loading && filteredTasks.length === 0 && (
        <div className="empty-state-box">
          <p>Aucune tâche ne correspond aux critères sélectionnés.</p>
        </div>
      )}

      <div className="tasks-grid">
        {filteredTasks.map((task) => (
          <TaskCard key={task._id || task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
