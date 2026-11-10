import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import axiosClient from '../api/axiosClient';
import { setProjects } from '../redux/projectSlice';
import { setTasks } from '../redux/taskSlice';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleRefresh = async () => {
    try {
      const [projRes, taskRes] = await Promise.all([
        axiosClient.get('/projects'),
        axiosClient.get('/tasks')
      ]);
      dispatch(setProjects(projRes.data));
      dispatch(setTasks(taskRes.data));
    } catch (err) {
      console.error('Erreur rafraîchissement :', err);
    }
  };

  return (
    <header className="navbar-enterprise">
      <div className="nav-container">
        <div className="nav-brand-section">
          <div className="brand-logo">🏢</div>
          <div>
            <h1 className="brand-name">
              Enterprise Hub <span className="track-badge">MERN PME</span>
            </h1>
            <p className="brand-sub">Gestion des Projets &amp; Suivi des Tâches d'Équipe</p>
          </div>
        </div>

        {/* Onglets de Navigation Principale */}
        <nav className="nav-tabs">
          <button
            type="button"
            className={`tab-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Vue d'Ensemble
          </button>
          <button
            type="button"
            className={`tab-link ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            📁 Projets
          </button>
          <button
            type="button"
            className={`tab-link ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            📋 Tâches
          </button>
        </nav>

        {/* Espace Utilisateur & Session JWT */}
        <div className="nav-actions">
          <button className="btn-refresh-icon" onClick={handleRefresh} title="Synchroniser avec MongoDB">
            🔄 Rafraîchir
          </button>

          {user ? (
            <div className="user-profile-badge">
              <span className="dot-online"></span>
              <div className="user-profile-info">
                <span className="user-profile-name">{user.name}</span>
                <span className="user-profile-meta">
                  {user.role} • {user.department || 'IT'}
                </span>
              </div>
              <button
                className="btn-logout-small"
                onClick={() => dispatch(logout())}
                title="Se déconnecter"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="visitor-badge">
              <span className="dot-visitor"></span>
              <span>Mode Visiteur (Lecture seule)</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
