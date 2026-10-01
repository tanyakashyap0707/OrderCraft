/**
 * OrderCraft Orders Module
 * Manages order creation, retrieval, filtering, and table rendering.
 */
window.OrderCraft = window.OrderCraft || {};
window.OrderCraft.modules = window.OrderCraft.modules || {};

window.OrderCraft.modules.orders = (() => {
    let _cachedOrders = [];

    /**
     * Map status to CSS badge class
     */
    function getStatusClass(status) {
        switch ((status || "").toLowerCase()) {
            case "in production":
                return "production-status";
            case "completed":
                return "completed-status";
            case "pending":
            default:
                return "pending-status";
        }
    }

    /**
     * Render orders array to table
     */
    function renderOrdersTable(ordersToRender) {
        const tableBody = document.querySelector("#ordersTable tbody");
        if (!tableBody) return;

        if (!ordersToRender || ordersToRender.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: #8a94a6; padding: 25px;">
                        No orders found. Create your first order above!
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = ordersToRender
            .map(
                (order) => `
            <tr data-order-id="${order.orderId}">
                <td><strong>${order.orderId}</strong></td>
                <td>${order.customer}</td>
                <td>${order.product}</td>
                <td>${order.quantity}</td>
                <td>${order.date}</td>
                <td>
                    <span class="status ${getStatusClass(order.status)}">
                        ${order.status || "Pending"}
                    </span>
                </td>
            </tr>
        `
            )
            .join("");

        // Attach click listeners to rows to view order details
        tableBody.querySelectorAll("tr[data-order-id]").forEach((row) => {
            row.addEventListener("click", () => {
                const orderId = row.dataset.orderId;
                const found = _cachedOrders.find((o) => o.orderId === orderId);
                if (found && window.OrderCraft.modules.orderDetails) {
                    window.OrderCraft.modules.orderDetails.showOrder(found);
                }
            });
        });
    }

    /**
     * Filter orders by search text and status dropdown
     */
    function filterOrders() {
        const searchInput = document.getElementById("searchOrder");
        const statusFilter = document.getElementById("statusFilter");

        const query = (searchInput?.value || "").toLowerCase().trim();
        const selectedStatus = statusFilter?.value || "All";

        const filtered = _cachedOrders.filter((order) => {
            const matchesQuery =
                !query ||
                (order.orderId && order.orderId.toLowerCase().includes(query)) ||
                (order.customer && order.customer.toLowerCase().includes(query)) ||
                (order.product && order.product.toLowerCase().includes(query));

            const matchesStatus =
                selectedStatus === "All" ||
                (order.status && order.status.toLowerCase() === selectedStatus.toLowerCase());

            return matchesQuery && matchesStatus;
        });

        renderOrdersTable(filtered);
    }

    /**
     * Load orders from backend API
     */
    async function loadOrders() {
        try {
            const orders = await window.OrderCraft.api.orders.getAll();
            if (Array.isArray(orders) && orders.length > 0) {
                _cachedOrders = orders;
                window.OrderCraft.state.set("orders", orders);
                filterOrders();
            }
        } catch (error) {
            console.warn("Could not fetch orders from API, keeping current view:", error.message);
        }
    }

    /**
     * Save new order handler
     */
    async function saveOrder() {
        const customerInput = document.getElementById("customerInput");
        const productInput = document.getElementById("productInput");
        const quantityInput = document.getElementById("quantityInput");
        const dateInput = document.getElementById("dateInput");

        const customer = customerInput?.value.trim();
        const product = productInput?.value.trim();
        const quantity = quantityInput?.value;
        const date = dateInput?.value;

        if (!customer || !product || !quantity || !date) {
            alert("Please fill all fields: Customer, Product, Quantity, and Date.");
            return;
        }

        const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);

        const newOrderData = {
            orderId,
            customer,
            product,
            quantity: Number(quantity),
            date,
            status: "Pending"
        };

        try {
            const res = await window.OrderCraft.api.orders.create(newOrderData);

            // Add to local cache and refresh table
            const savedOrder = (res && res.order) || newOrderData;
            _cachedOrders.unshift(savedOrder);
            window.OrderCraft.state.set("orders", _cachedOrders);
            filterOrders();

            // Close modal & reset form
            window.OrderCraft.modules.modals.close("orderModal");
            customerInput.value = "";
            productInput.value = "";
            quantityInput.value = "";
            dateInput.value = "";

            alert("Order saved successfully!");
        } catch (error) {
            console.error("Order save error:", error);
            // Fallback for offline mode
            _cachedOrders.unshift(newOrderData);
            window.OrderCraft.state.set("orders", _cachedOrders);
            filterOrders();
            window.OrderCraft.modules.modals.close("orderModal");
            alert("Order added locally (Backend connection unavailable).");
        }
    }

    /**
     * Initialize listeners
     */
    function init() {
        // Collect existing static orders if any
        document.querySelectorAll("#ordersTable tbody tr").forEach((row) => {
            const cells = row.querySelectorAll("td");
            if (cells.length >= 6) {
                _cachedOrders.push({
                    orderId: cells[0].textContent.trim(),
                    customer: cells[1].textContent.trim(),
                    product: cells[2].textContent.trim(),
                    quantity: Number(cells[3].textContent.trim()) || 0,
                    date: cells[4].textContent.trim(),
                    status: cells[5].textContent.trim()
                });
            }
        });

        // Open modal buttons
        document.getElementById("createOrderBtn")?.addEventListener("click", () => {
            window.OrderCraft.modules.modals.open("orderModal");
        });
        document.getElementById("dashboardNewOrder")?.addEventListener("click", () => {
            window.OrderCraft.modules.modals.open("orderModal");
        });

        // Close modal button
        document.getElementById("closeModal")?.addEventListener("click", () => {
            window.OrderCraft.modules.modals.close("orderModal");
        });

        // Save order button
        document.getElementById("saveOrderBtn")?.addEventListener("click", saveOrder);

        // Search & Filter listeners
        document.getElementById("searchOrder")?.addEventListener("input", filterOrders);
        document.getElementById("statusFilter")?.addEventListener("change", filterOrders);

        // Fetch from API on startup
        loadOrders();
    }

    return {
        init,
        loadOrders,
        filterOrders,
        saveOrder
    };
})();
