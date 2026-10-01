/**
 * OrderCraft Main Application Entry
 * Bootstraps all modular subsystems and initializes DOM listeners.
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("⚡ OrderCraft Modular Architecture Initialized");

    const modules = window.OrderCraft?.modules;
    if (!modules) {
        console.error("OrderCraft modules failed to load!");
        return;
    }

    try {
        // Initialize core infrastructure first
        modules.modals?.init();
        modules.navigation?.init();

        // Initialize domain modules
        modules.orders?.init();
        modules.orderDetails?.init();
        modules.bom?.init();
        modules.inventory?.init();
        modules.procurement?.init();
        modules.production?.init();
        modules.invoices?.init();
        modules.payments?.init();
        modules.analytics?.init();
        modules.suppliers?.init();

        console.log("✅ All OrderCraft modules loaded and bound successfully.");
    } catch (error) {
        console.error("Initialization error:", error);
    }
});
