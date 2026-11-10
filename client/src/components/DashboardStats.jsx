import React from 'react';
import { useSelector } from 'react-redux';

export default function DashboardStats() {
  const { items: projects } = useSelector((state) => state.projects);
  const { items: tasks } = useSelector((state) => state.tasks);

  const completedTasks = tasks.filter((t) => t.status === 'Terminé').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'En cours').length;
  const activeProjects = projects.filter((p) => p.status === 'En cours').length;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon-wrapper blue">📁</div>
        <div className="stat-info">
          <span className="stat-number">{projects.length}</span>
          <span className="stat-title">Projets d'Entreprise</span>
          <span className="stat-sub">{activeProjects} en cours de réalisation</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper amber">📋</div>
        <div className="stat-info">
          <span className="stat-number">{tasks.length}</span>
          <span className="stat-title">Tâches Assignées</span>
          <span className="stat-sub">{inProgressTasks} en cours d'exécution</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper green">✅</div>
        <div className="stat-info">
          <span className="stat-number">{completedTasks}</span>
          <span className="stat-title">Tâches Finalisées</span>
          <span className="stat-sub">
            {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}% de taux de succès
          </span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper purple">👥</div>
        <div className="stat-info">
          <span className="stat-number">3</span>
          <span className="stat-title">Équipes Connectées</span>
          <span className="stat-sub">Direction • IT • Métiers</span>
        </div>
      </div>
    </div>
  );
}
