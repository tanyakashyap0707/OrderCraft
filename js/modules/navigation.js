/**
 * OrderCraft Navigation Module
 * Single-responsibility page router and navigation manager.
 */
window.OrderCraft = window.OrderCraft || {};
window.OrderCraft.modules = window.OrderCraft.modules || {};

window.OrderCraft.modules.navigation = (() => {
    const pageMapping = [
        { linkId: "dashboardLink", pageId: "dashboardPage" },
        { linkId: "ordersLink", pageId: "ordersPage" },
        { linkId: "productionLink", pageId: "productionPage" },
        { linkId: "bomLink", pageId: "bomPage" },
        { linkId: "inventoryLink", pageId: "inventoryPage" },
        { linkId: "procurementLink", pageId: "procurementPage" },
        { linkId: "suppliersLink", pageId: "suppliersPage" },
        { linkId: "invoiceLink", pageId: "invoicePage" },
        { linkId: "paymentsLink", pageId: "paymentsPage" },
        { linkId: "analyticsLink", pageId: "analyticsPage" }
    ];

    const allPages = [
        "dashboardPage",
        "ordersPage",
        "orderDetailsPage",
        "bomPage",
        "inventoryPage",
        "procurementPage",
        "productionPage",
        "invoicePage",
        "paymentsPage",
        "analyticsPage",
        "suppliersPage"
    ];

    /**
     * Switch view to target page
     */
    function navigateTo(targetPageId) {
        // Hide all page sections
        allPages.forEach((id) => {
            const el = document.getElementById(id);
            if (el) {
                el.style.display = "none";
            }
        });

        // Show target page
        const targetEl = document.getElementById(targetPageId);
        if (targetEl) {
            targetEl.style.display = "block";
        }

        // Update active class on nav links
        pageMapping.forEach(({ linkId, pageId }) => {
            const link = document.getElementById(linkId);
            if (link) {
                if (pageId === targetPageId) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            }
        });

        // Update state
        window.OrderCraft.state.set("activePage", targetPageId);

        // Page load triggers
        if (targetPageId === "inventoryPage") {
            window.OrderCraft.modules.inventory?.loadMaterials();
        } else if (targetPageId === "ordersPage") {
            window.OrderCraft.modules.orders?.loadOrders();
        } else if (targetPageId === "procurementPage") {
            window.OrderCraft.modules.procurement?.loadPurchaseOrders();
        }
    }

    /**
     * Initialize navigation listeners
     */
    function init() {
        pageMapping.forEach(({ linkId, pageId }) => {
            const link = document.getElementById(linkId);
            if (link) {
                link.addEventListener("click", (e) => {
                    e.preventDefault();
                    navigateTo(pageId);
                });
            }
        });

        // "View all →" link on Dashboard recent orders
        const viewOrders = document.getElementById("viewOrders");
        if (viewOrders) {
            viewOrders.addEventListener("click", (e) => {
                e.preventDefault();
                navigateTo("ordersPage");
            });
        }
    }

    return {
        init,
        navigateTo
    };
})();
