/**
 * OrderCraft Configuration
 * Centralized settings for API endpoints and app behaviors.
 */
window.OrderCraft = window.OrderCraft || {};

window.OrderCraft.config = {
    // Dynamic API Base URL fallback
    API_BASE_URL: (() => {
        // If served from backend server port 5000 or similar
        if (window.location.protocol.startsWith("http")) {
            if (window.location.port === "5000") {
                return "/api";
            }
        }
        // Fallback for file:// or other frontend dev ports
        return "http://localhost:5000/api";
    })(),

    // Request timeout in milliseconds
    REQUEST_TIMEOUT_MS: 10000,

    // Default currency symbol
    CURRENCY: "₹",

    // Default pagination or page size
    DEFAULT_PAGE_SIZE: 10
};
