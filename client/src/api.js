// Create a new file: client/src/config/api.js
const API_BASE_URL = import.meta.env.DEV ? "http://localhost:3000/api" : "/api";

export default API_BASE_URL;
