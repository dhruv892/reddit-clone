// Create a new file: client/src/config/api.js
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/api" // Use relative URL in production
    : "http://localhost:3000/api"; // Use localhost in development

export default API_BASE_URL;
