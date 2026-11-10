import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import projectReducer from './projectSlice';
import taskReducer from './taskSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,         // Gestion de session (Utilisateur & Token JWT)
    projects: projectReducer,   // Entité 2 : Gestion des Projets d'Entreprise
    tasks: taskReducer         // Entité 3 : Gestion des Tâches Liées (1:N)
  }
});
