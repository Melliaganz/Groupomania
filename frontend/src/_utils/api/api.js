import axios from 'axios';

// Créez une instance d'axios avec la configuration de base
const api = axios.create({
  baseURL: process.env.REACT_APP_GOOGLE_API_LIEN, // URL de base de votre API
  withCredentials: true, // Inclure les credentials dans toutes les requêtes
});

// Exportez l'instance configurée pour une utilisation dans toute l'application
export default api;
