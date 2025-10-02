/**
 * Removes HTML tags and dangerous characters
 * This is server-side sanitization to prevent XSS attacks
 *
 * WHY: Even if frontend sanitizes, a malicious user can bypass it
 * by sending direct API requests. Server MUST validate everything.
 */

function stripHtml(text) {
  if (!text) return "";

  // Remove HTML tags
  return text
    .replace(/<script[^>]*>.*?<\/script>/gi, "") // Remove script tags
    .replace(/<[^>]+>/g, "") // Remove all other HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers (onclick, onerror, etc)
    .trim();
}

function escapeHtml(text) {
  if (!text) return "";

  const htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return text.replace(/[&<>"'\/]/g, (char) => htmlEscapes[char]);
}

module.exports = {
  stripHtml,
  escapeHtml,
};
