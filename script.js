/**
 * OrderCraft Legacy Entrypoint
 * Preserved for backwards compatibility with any existing bookmarks or caches.
 * In modern setups, modules are loaded individually via the <script> tags in index.html.
 */
(() => {
    if (window.OrderCraft && window.OrderCraft.modules) {
        console.log("OrderCraft modular system is active.");
        return;
    }

    const scripts = [
        "js/config.js",
        "js/state.js",
        "js/api.js",
        "js/modules/navigation.js",
        "js/modules/modals.js",
        "js/modules/orders.js",
        "js/modules/orderDetails.js",
        "js/modules/bom.js",
        "js/modules/inventory.js",
        "js/modules/procurement.js",
        "js/modules/production.js",
        "js/modules/invoices.js",
        "js/modules/payments.js",
        "js/modules/analytics.js",
        "js/modules/suppliers.js",
        "js/app.js"
    ];

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    scripts.reduce((promise, src) => promise.then(() => loadScript(src)), Promise.resolve())
        .catch((err) => console.error("Error loading modular scripts:", err));
})();