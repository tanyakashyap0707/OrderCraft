/**
 * OrderCraft API Service Layer
 * Centralized HTTP client for interacting with backend REST endpoints.
 */
window.OrderCraft = window.OrderCraft || {};

window.OrderCraft.api = (() => {
    const getBaseUrl = () => window.OrderCraft.config.API_BASE_URL;

    /**
     * Generic fetch wrapper with timeout and error handling
     */
    async function request(endpoint, options = {}) {
        const url = `${getBaseUrl()}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
        const timeout = window.OrderCraft.config.REQUEST_TIMEOUT_MS || 10000;

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);

        const config = {
            headers: {
                "Content-Type": "application/json",
                ...options.headers
            },
            signal: controller.signal,
            ...options
        };

        try {
            const response = await fetch(url, config);
            clearTimeout(timer);

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                const message = (data && data.message) || response.statusText || "Request failed";
                throw new Error(message);
            }

            return data;
        } catch (error) {
            clearTimeout(timer);
            if (error.name === "AbortError") {
                throw new Error("Request timed out. Please check backend connection.");
            }
            throw error;
        }
    }

    // Orders Service
    const orders = {
        async getAll() {
            return request("/orders");
        },
        async getById(id) {
            return request(`/orders/${id}`);
        },
        async create(orderData) {
            return request("/orders", {
                method: "POST",
                body: JSON.stringify(orderData)
            });
        },
        async updateStatus(id, status) {
            return request(`/orders/${id}/status`, {
                method: "PUT",
                body: JSON.stringify({ status })
            });
        }
    };

    // Materials Service
    const materials = {
        async getAll() {
            return request("/materials");
        },
        async create(materialData) {
            return request("/materials", {
                method: "POST",
                body: JSON.stringify(materialData)
            });
        },
        async update(id, data) {
            return request(`/materials/${id}`, {
                method: "PUT",
                body: JSON.stringify(data)
            });
        }
    };

    // Purchase Orders Service
    const purchaseOrders = {
        async getAll() {
            return request("/purchase-orders");
        },
        async create(poData) {
            return request("/purchase-orders", {
                method: "POST",
                body: JSON.stringify(poData)
            });
        },
        async updateStatus(id, status) {
            return request(`/purchase-orders/${id}/status`, {
                method: "PUT",
                body: JSON.stringify({ status })
            });
        }
    };

    return {
        request,
        orders,
        materials,
        purchaseOrders
    };
})();
