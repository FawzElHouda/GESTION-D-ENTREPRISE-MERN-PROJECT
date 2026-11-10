import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './components/Navbar';
import AuthCard from './components/AuthCard';
import DashboardStats from './components/DashboardStats';
import ProjectList from './components/ProjectList';
import TaskList from './components/TaskList';
import axiosClient from './api/axiosClient';
import { setProjects } from './redux/projectSlice';
import { setTasks } from './redux/taskSlice';

export default function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Onglet actif de la navigation principale
  const [activeTab, setActiveTab] = useState('dashboard');
  // Projet sélectionné pour filtrer les tâches (clic sur "Voir les tâches")
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Chargement initial des données depuis l'API Express
  useEffect(() => {
    const loadData = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          axiosClient.get('/projects'),
          axiosClient.get('/tasks')
        ]);
        dispatch(setProjects(projRes.data));
        dispatch(setTasks(taskRes.data));
      } catch (err) {
        console.error('Erreur chargement initial :', err.message);
      }
    };

    loadData();
  }, [dispatch]);

  // Navigation vers l'onglet Tâches avec filtre sur un projet spécifique
  const handleSelectProject = (projId) => {
    setSelectedProjectId(projId);
    setActiveTab('tasks');
  };

  return (
    <div className="app-wrapper">
      {/* Barre de Navigation Enterprise */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-layout">
        {/* ================================================================
            COLONNE GAUCHE : Authentification ou Infos Utilisateur Connecté
            ================================================================ */}
        <aside className="sidebar-left">
          {user ? (
            <div className="user-session-card">
              <span className="session-badge-active">🟢 Session JWT Active</span>
              <h3 className="session-welcome">Bonjour, {user.name.split(' ')[0]} 👋</h3>
              <div className="session-user-details">
                <div className="session-row">
                  <span className="session-label">Rôle :</span>
                  <span className="session-value role-chip">{user.role}</span>
                </div>
                <div className="session-row">
                  <span className="session-label">Département :</span>
                  <span className="session-value">{user.department || 'Ingénierie & IT'}</span>
                </div>
                <div className="session-row">
                  <span className="session-label">Email :</span>
                  <span className="session-value email-small">{user.email}</span>
                </div>
              </div>

              <div className="session-permissions-box">
                <span className="session-permissions-title">✅ Accès Débloqués :</span>
                <ul className="permissions-list">
                  <li>Création de projets</li>
                  <li>Création et assignation de tâches</li>
                  <li>Modification du statut des tâches</li>
                  <li>Suppression avec cascade (1:N)</li>
                </ul>
              </div>

              <div className="jwt-info-box">
                <span className="jwt-info-title">🔒 JWT Stateless :</span>
                <p>Votre jeton sécurisé est injecté automatiquement dans chaque requête via l'intercepteur Axios.</p>
              </div>
            </div>
          ) : (
            <AuthCard />
          )}

          {/* Rappel pédagogique sur les modèles Mongoose */}
          <div className="schema-info-card">
            <h4>🗄️ Architecture Mongoose (1:N)</h4>
            <div className="schema-entity">
              <span className="entity-dot blue"></span>
              <div>
                <strong>User</strong>
                <small>Employés & Collaborateurs</small>
              </div>
            </div>
            <div className="schema-arrow">↓ crée des projets (1:N)</div>
            <div className="schema-entity">
              <span className="entity-dot amber"></span>
              <div>
                <strong>Project</strong>
                <small>Projets d'Entreprise (.populate)</small>
              </div>
            </div>
            <div className="schema-arrow">↓ contient des tâches (1:N)</div>
            <div className="schema-entity">
              <span className="entity-dot green"></span>
              <div>
                <strong>Task</strong>
                <small>Tâches assignées (.populate ×2)</small>
              </div>
            </div>
          </div>
        </aside>

        {/* ================================================================
            ZONE PRINCIPALE : Dashboard / Projets / Tâches
            ================================================================ */}
        <section className="main-content-area">
          {activeTab === 'dashboard' && (
            <div>
              <div className="page-hero">
                <div className="hero-badge">💼 Thématique : Gestion d'Entreprise / PME</div>
                <h2 className="hero-title">Vue d'Ensemble du Portefeuille</h2>
                <p className="hero-sub">
                  Application MERN complète : <strong>3 modèles Mongoose</strong> (User, Project, Task),
                  relations <strong>One-to-Many (1:N)</strong> avec <code>.populate()</code>,
                  sécurité <strong>JWT + Bcrypt</strong> et déploiement Cloud.
                </p>
              </div>
              <DashboardStats />
              <div className="dashboard-preview-grids">
                <div>
                  <h3 className="preview-section-title">📁 Projets Récents</h3>
                  <ProjectList onSelectProject={handleSelectProject} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <div className="page-hero">
                <div className="hero-badge">📁 Gestion des Projets d'Entreprise</div>
                <h2 className="hero-title">Portefeuille de Projets</h2>
                <p className="hero-sub">
                  Chaque projet est lié à un <strong>Chef de Projet</strong> via une référence
                  <code> ObjectId (ref: 'User')</code> peuplée dynamiquement avec{' '}
                  <code>.populate('createdBy', 'name email role')</code>.
                </p>
              </div>
              <ProjectList onSelectProject={handleSelectProject} />
            </div>
          )}

          {activeTab === 'tasks' && (
            <div>
              <div className="page-hero">
                <div className="hero-badge">📋 Gestion des Tâches Opérationnelles</div>
                <h2 className="hero-title">Tableau de Bord des Tâches</h2>
                <p className="hero-sub">
                  Chaque tâche est reliée à son <strong>Projet</strong> (<code>ref: 'Project'</code>)
                  et au <strong>Collaborateur assigné</strong> (<code>ref: 'User'</code>) via un double{' '}
                  <code>.populate()</code> (relation 1:N × 2).
                </p>
              </div>
              <TaskList selectedProjectId={selectedProjectId} />
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>
          École Polytechnique de Sousse — Département Génie Informatique — 2025–2026 |{' '}
          <strong>Étudiant :</strong> Fawz El Houda Ghalba &nbsp;|&nbsp;{' '}
          <strong>Enseignant :</strong> Dr. Abdelweheb GUEDDES
        </p>
      </footer>
    </div>
  );
}
