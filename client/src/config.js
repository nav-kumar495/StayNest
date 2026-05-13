// Central API base URL config
// In production (Render), VITE_API_BASE_URL is set to the backend URL.
// In local development, it's empty so the Vite proxy handles it.
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default API_BASE;
