/**
 * OrderCraft Configuration
 * Centralized settings for API endpoints and app behaviors.
 */
window.OrderCraft = window.OrderCraft || {};

window.OrderCraft.config = {
    // Relative path works on Vercel (shared domain, rewrite routes /api/* to the
    // api service) and locally when Express serves the frontend on the same port.
    API_BASE_URL: "/api",

    // Request timeout in milliseconds
    REQUEST_TIMEOUT_MS: 10000,

    // Default currency symbol
    CURRENCY: "₹",

    // Default pagination or page size
    DEFAULT_PAGE_SIZE: 10
};
