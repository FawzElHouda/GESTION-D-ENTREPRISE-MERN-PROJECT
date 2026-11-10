import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../api/axiosClient';
import { addTask } from '../redux/taskSlice';

export default function TaskForm({ onClose, defaultProjectId }) {
  const { items: projects } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState(defaultProjectId || (projects[0]?._id || projects[0]?.id || ''));
  const [assignedTo, setAssignedTo] = useState(user?.id || user?._id || '');
  const [priority, setPriority] = useState('Moyenne');
  const [status, setStatus] = useState('À faire');
  const [usersList, setUsersList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    // Charger la liste des collaborateurs pour l'assignation
    const fetchUsers = async () => {
      try {
        const res = await axiosClient.get('/users');
        setUsersList(res.data);
        if (!assignedTo && res.data.length > 0) {
          setAssignedTo(res.data[0]._id || res.data[0].id);
        }
      } catch (err) {
        console.error('Erreur chargement collaborateurs :', err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (defaultProjectId) {
      setProject(defaultProjectId);
    } else if (!project && projects.length > 0) {
      setProject(projects[0]._id || projects[0].id);
    }
  }, [defaultProjectId, projects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !project) return;
    setErrorMsg('');

    try {
      setLoading(true);
      const res = await axiosClient.post('/tasks', {
        title: title.trim(),
        description: description.trim(),
        project,
        assignedTo: assignedTo || user?.id || user?._id,
        priority,
        status
      });

      dispatch(addTask(res.data));
      setTitle('');
      setDescription('');
      if (onClose) onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Erreur lors de la création de la tâche.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card-container">
      <div className="form-card-header">
        <span className="badge-auth-active">🟢 Session JWT Active • Assignation de Tâche</span>
        <h3>Nouvelle Tâche de Projet</h3>
        <p>Assignation collaborative (Relation One-to-Many Mongoose)</p>
      </div>

      {errorMsg && <div className="alert-message error">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="enterprise-form">
        <div className="form-field">
          <label htmlFor="task-title">Intitulé de la Tâche :</label>
          <input
            id="task-title"
            type="text"
            placeholder="Ex : Conception du schéma Mongoose et des clés ref"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-row-2">
          <div className="form-field">
            <label htmlFor="task-proj">Projet Associé (1:N) :</label>
            <select
              id="task-proj"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              required
            >
              {projects.length === 0 && <option value="">Aucun projet disponible</option>}
              {projects.map((p) => (
                <option key={p._id || p.id} value={p._id || p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="task-assignee">Assigner au Collaborateur :</label>
            <select
              id="task-assignee"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              {usersList.map((u) => (
                <option key={u._id || u.id} value={u._id || u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-field">
            <label htmlFor="task-priority">Niveau de Priorité :</label>
            <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="Basse">Basse</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Haute">Haute</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="task-status">Statut Initial :</label>
            <select id="task-status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="À faire">À faire</option>
              <option value="En cours">En cours</option>
              <option value="En revue">En revue</option>
              <option value="Terminé">Terminé</option>
            </select>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="task-desc">Description &amp; Consignes :</label>
          <textarea
            id="task-desc"
            rows="2"
            placeholder="Détails des opérations techniques à mener..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-actions-row">
          <button type="submit" className="btn-primary" disabled={loading || projects.length === 0}>
            {loading ? 'Enregistrement...' : '➕ Enregistrer la Tâche (JWT)'}
          </button>
          {onClose && (
            <button type="button" className="btn-secondary" onClick={onClose}>
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
