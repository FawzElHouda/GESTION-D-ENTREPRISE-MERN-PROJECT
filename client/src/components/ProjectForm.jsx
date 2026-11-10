import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../api/axiosClient';
import { addProject } from '../redux/projectSlice';

export default function ProjectForm({ onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('En cours');
  const [priority, setPriority] = useState('Moyenne');
  const [budget, setBudget] = useState(25000);
  const [endDate, setEndDate] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setErrorMsg('');

    try {
      setLoading(true);
      // L'intercepteur Axios injecte automatiquement Authorization: Bearer <token>
      const res = await axiosClient.post('/projects', {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        budget: Number(budget),
        endDate: endDate || null
      });

      dispatch(addProject(res.data));
      setTitle('');
      setDescription('');
      if (onClose) onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Erreur lors de la création du projet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card-container">
      <div className="form-card-header">
        <span className="badge-auth-active">🟢 Session JWT Active • Chef de Projet</span>
        <h3>Nouveau Projet d'Entreprise</h3>
        <p>Créé et certifié par : <strong>{user?.name}</strong> ({user?.role})</p>
      </div>

      {errorMsg && <div className="alert-message error">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="enterprise-form">
        <div className="form-field">
          <label htmlFor="proj-title">Nom du Projet :</label>
          <input
            id="proj-title"
            type="text"
            placeholder="Ex : Digitalisation du Service Client & Facturation"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-row-3">
          <div className="form-field">
            <label htmlFor="proj-status">Statut Initial :</label>
            <select id="proj-status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Planifié">Planifié</option>
              <option value="En cours">En cours</option>
              <option value="En pause">En pause</option>
              <option value="Terminé">Terminé</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="proj-priority">Priorité :</label>
            <select id="proj-priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="Basse">Basse</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Haute">Haute</option>
              <option value="Critique">Critique</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="proj-budget">Budget Estimé (DT) :</label>
            <input
              id="proj-budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              min="0"
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="proj-desc">Description &amp; Objectifs Stratégiques :</label>
          <textarea
            id="proj-desc"
            rows="3"
            placeholder="Périmètre du projet, technologies ciblées et livrables attendus..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-actions-row">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Création en cours...' : '➕ Créer le Projet (JWT Vérifié)'}
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
