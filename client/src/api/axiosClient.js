import axios from 'axios';

// 1. Instance Axios pointant vers le serveur Express (ou l'URL Cloud Render en production)
const axiosClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD
      ? 'https://gestion-d-entreprise-mern-project.onrender.com/api'
      : 'http://localhost:5001/api')
});

// ============================================================================
// ÉTAPE 3 (Page 3 du support PDF) : Ajouter l'Intercepteur JWT en 5 lignes
// ============================================================================
axiosClient.interceptors.request.use((config) => {
  // TODO (Étape 3 - Page 3) :
   const token = localStorage.getItem('token');
   if (token) {
    config.headers.Authorization = `Bearer ${token}`;
   }
  return config;
});

export default axiosClient;
