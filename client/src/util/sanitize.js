import DOMPurify from "dompurify";

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Removes dangerous tags like <script>, <iframe>, event handlers, etc.
 *
 * @param {string} dirty - Unsanitized user input
 * @returns {string} - Safe HTML string
 */
export function sanitizeHTML(dirty) {
  // Configure DOMPurify to be strict
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href"],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * For plain text that should never contain HTML
 * Escapes all HTML characters
 */
export function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
