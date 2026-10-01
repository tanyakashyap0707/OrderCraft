/**
 * OrderCraft Order Details Module
 * Handles order inspection view, workflow tracking timeline, and detail actions.
 */
window.OrderCraft = window.OrderCraft || {};
window.OrderCraft.modules = window.OrderCraft.modules || {};

window.OrderCraft.modules.orderDetails = (() => {
    let _activeOrder = null;

    /**
     * Display order details view with populated data
     */
    function showOrder(order) {
        _activeOrder = order;
        window.OrderCraft.state.set("currentOrder", order);

        const page = document.getElementById("orderDetailsPage");
        if (!page) return;

        // Update page heading
        const heading = page.querySelector(".page-heading h1");
        if (heading) {
            heading.textContent = `Order ${order.orderId}`;
        }

        // Update status badge
        const badge = page.querySelector(".page-heading .status");
        if (badge) {
            badge.textContent = order.status || "Pending";
            badge.className = `status ${
                order.status === "In Production"
                    ? "production-status"
                    : order.status === "Completed"
                    ? "completed-status"
                    : "pending-status"
            }`;
        }

        // Update detail cards
        const cards = page.querySelectorAll(".detail-cards .detail-card");
        if (cards.length >= 4) {
            // Customer
            const custH3 = cards[0].querySelector("h3");
            if (custH3) custH3.textContent = order.customer || "Customer";

            // Product & Qty
            const prodH3 = cards[1].querySelector("h3");
            const prodSpan = cards[1].querySelector("span");
            if (prodH3) prodH3.textContent = order.product || "Product";
            if (prodSpan) prodSpan.textContent = `Quantity: ${order.quantity || 1}`;

            // Date
            const dateH3 = cards[3].querySelector("h3");
            if (dateH3) dateH3.textContent = order.date || new Date().toLocaleDateString();
        }

        // Navigate to details page
        window.OrderCraft.modules.navigation.navigateTo("orderDetailsPage");
    }

    function init() {
        // Generate invoice button
        document.getElementById("generateInvoiceBtn")?.addEventListener("click", () => {
            alert(`Invoice generated successfully for ${_activeOrder ? _activeOrder.orderId : "order"}!`);
        });

        // Mark as paid button
        document.getElementById("markPaidBtn")?.addEventListener("click", () => {
            alert(`Payment recorded as PAID for ${_activeOrder ? _activeOrder.orderId : "order"}!`);
        });
    }

    return {
        init,
        showOrder
    };
})();
