import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axiosClient from '../api/axiosClient';
import { loginSuccess } from '../redux/authSlice';

export default function AuthCard() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Chef de Projet');
  const [department, setDepartment] = useState('Ingénierie & IT');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      setLoading(true);

      if (isRegisterMode) {
        // Inscription : POST /api/auth/register (Bcrypt)
        const res = await axiosClient.post('/auth/register', {
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          department
        });
        dispatch(loginSuccess(res.data));
        setSuccessMsg('Compte collaborateur créé avec succès ! Session active.');
      } else {
        // Connexion : POST /api/auth/login (JWT)
        const res = await axiosClient.post('/auth/login', {
          email: email.trim(),
          password
        });
        dispatch(loginSuccess(res.data));
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Erreur lors de la communication avec l\'API Express.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword = '123456') => {
    setIsRegisterMode(false);
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div className="auth-box-card">
      <div className="auth-card-header">
        <span className="auth-security-pill">
          🔒 Authentification Sécurisée (JWT &amp; Bcrypt)
        </span>
        <h2>{isRegisterMode ? 'Enregistrer un Collaborateur' : 'Espace Collaborateur'}</h2>
        <p>
          {isRegisterMode
            ? 'Renseignez les détails pour générer votre compte d\'entreprise avec mot de passe haché.'
            : 'Connectez-vous pour obtenir votre Token JWT et débloquer la gestion des projets et des tâches.'}
        </p>

        <div className="auth-toggle-buttons">
          <button
            type="button"
            className={`auth-toggle-btn ${!isRegisterMode ? 'active' : ''}`}
            onClick={() => {
              setIsRegisterMode(false);
              setErrorMsg('');
              setSuccessMsg('');
            }}
          >
            Se Connecter
          </button>
          <button
            type="button"
            className={`auth-toggle-btn ${isRegisterMode ? 'active' : ''}`}
            onClick={() => {
              setIsRegisterMode(true);
              setErrorMsg('');
              setSuccessMsg('');
            }}
          >
            Créer un Compte
          </button>
        </div>
      </div>

      {successMsg && <div className="alert-message success">{successMsg}</div>}
      {errorMsg && <div className="alert-message error">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="auth-form-fields">
        {isRegisterMode && (
          <>
            <div className="form-field">
              <label htmlFor="name">Nom Complet du Collaborateur :</label>
              <input
                id="name"
                type="text"
                placeholder="Ex : Siwar Sayari"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-field">
                <label htmlFor="role">Rôle :</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="Admin">Admin</option>
                  <option value="Chef de Projet">Chef de Projet</option>
                  <option value="Développeur">Développeur</option>
                  <option value="Employé">Employé</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="department">Département :</label>
                <select id="department" value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="Direction">Direction</option>
                  <option value="Ingénierie & IT">Ingénierie &amp; IT</option>
                  <option value="Marketing & Ventes">Marketing &amp; Ventes</option>
                  <option value="Ressources Humaines">Ressources Humaines</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
            </div>
          </>
        )}

        <div className="form-field">
          <label htmlFor="email">Email Professionnel :</label>
          <input
            id="email"
            type="email"
            placeholder="sayarsiwar@polytechnicien.tn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Mot de Passe :</label>
          <input
            id="password"
            type="password"
            placeholder="6 caractères minimum (ex : 123456)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary-block" disabled={loading}>
          {loading
            ? 'Vérification en cours...'
            : isRegisterMode
            ? 'Valider l\'Inscription (Bcrypt + JWT)'
            : 'Se Connecter (Obtenir Jeton JWT)'}
        </button>

        {!isRegisterMode && (
          <div className="demo-accounts-container">
            <span className="demo-title">⚡ Comptes de Démonstration Rapides :</span>
            <div className="demo-buttons-grid">
              <button
                type="button"
                className="btn-demo-pill"
                onClick={() => fillDemoAccount('sayarsiwar@polytechnicien.tn')}
              >
                👑 Admin (sayarsiwar)
              </button>
              <button
                type="button"
                className="btn-demo-pill"
                onClick={() => fillDemoAccount('fawzelhouda.ghalba@polytechnicien.tn')}
              >
                💼 Chef de Projet (fawz)
              </button>
              <button
                type="button"
                className="btn-demo-pill"
                onClick={() => fillDemoAccount('user@poly.tn')}
              >
                💻 Développeur (user)
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
