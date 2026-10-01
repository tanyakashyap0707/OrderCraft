/**
 * OrderCraft Procurement Module
 * Manages supplier purchase orders and inbound materials tracking.
 */
window.OrderCraft = window.OrderCraft || {};
window.OrderCraft.modules = window.OrderCraft.modules || {};

window.OrderCraft.modules.procurement = (() => {
    let _cachedPOs = [];

    /**
     * Render POs to the purchase order table
     */
    function renderPOTable(pos) {
        const tableBody = document.querySelector("#purchaseTable tbody");
        if (!tableBody) return;

        if (!pos || pos.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; color: #8a94a6; padding: 25px;">
                        No purchase orders found. Click "+ Create Purchase Order" to create one.
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = pos
            .map((po) => `
            <tr>
                <td><strong>${po.poId}</strong></td>
                <td>${po.material}</td>
                <td>${po.supplier}</td>
                <td>${po.quantity}</td>
                <td>${po.date}</td>
                <td>
                    <span class="status ${
                        po.status === "Received"
                            ? "completed-status"
                            : po.status === "In Transit"
                            ? "production-status"
                            : "pending-status"
                    }">
                        ${po.status || "Pending"}
                    </span>
                </td>
            </tr>
        `)
            .join("");
    }

    /**
     * Load purchase orders from backend API
     */
    async function loadPurchaseOrders() {
        try {
            const pos = await window.OrderCraft.api.purchaseOrders.getAll();
            if (Array.isArray(pos) && pos.length > 0) {
                _cachedPOs = pos;
                window.OrderCraft.state.set("purchaseOrders", pos);
                renderPOTable(pos);
            }
        } catch (error) {
            console.warn("Could not fetch purchase orders from API:", error.message);
        }
    }

    /**
     * Open the Create PO modal, optionally pre-filling material and quantity
     */
    function openPOModal(presetMaterial = "", presetQty = "") {
        const materialInput = document.getElementById("poMaterialInput");
        const qtyInput      = document.getElementById("poQuantityInput");
        if (materialInput && presetMaterial) materialInput.value = presetMaterial;
        if (qtyInput && presetQty)           qtyInput.value      = presetQty;
        window.OrderCraft.modules.modals.open("poModal");
    }

    /**
     * Save a new PO from the modal form
     */
    async function savePO() {
        const supplier = document.getElementById("poSupplierInput")?.value.trim();
        const material = document.getElementById("poMaterialInput")?.value.trim();
        const quantity = document.getElementById("poQuantityInput")?.value;
        const status   = document.getElementById("poStatusInput")?.value || "Pending";

        if (!supplier || !material || !quantity) {
            alert("Please fill in Supplier, Material, and Quantity.");
            return;
        }

        const poId = "PO-" + Math.floor(1000 + Math.random() * 9000);
        const date = new Date().toISOString().split("T")[0];

        const poData = {
            poId,
            supplier,
            material,
            quantity: Number(quantity),
            date,
            status
        };

        try {
            const res = await window.OrderCraft.api.purchaseOrders.create(poData);
            const saved = (res && res.purchaseOrder) || poData;
            _cachedPOs.unshift(saved);
        } catch (e) {
            console.warn("Failed saving PO to DB, saving locally:", e.message);
            _cachedPOs.unshift(poData);
        }

        renderPOTable(_cachedPOs);

        window.OrderCraft.modules.modals.close("poModal");

        // Reset form inputs
        ["poSupplierInput", "poMaterialInput", "poQuantityInput"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });

        // Switch to procurement page to show newly created PO
        window.OrderCraft.modules.navigation.navigateTo("procurementPage");

        alert(`Purchase Order ${poId} created for ${material} from ${supplier}!`);
    }

    /**
     * Initialize the module
     */
    function init() {
        // Collect static table rows from HTML into cache
        document.querySelectorAll("#purchaseTable tbody tr").forEach((row) => {
            const cells = row.querySelectorAll("td");
            if (cells.length >= 6) {
                _cachedPOs.push({
                    poId:     cells[0].textContent.trim(),
                    material: cells[1].textContent.trim(),
                    supplier: cells[2].textContent.trim(),
                    quantity: cells[3].textContent.trim(),
                    date:     cells[4].textContent.trim(),
                    status:   cells[5].textContent.trim()
                });
            }
        });

        // Create PO button → open modal
        document.getElementById("createPOBtn")?.addEventListener("click", () => {
            openPOModal();
        });

        // Close modal button
        document.getElementById("closePOModal")?.addEventListener("click", () => {
            window.OrderCraft.modules.modals.close("poModal");
        });

        // Save PO button
        document.getElementById("savePOBtn")?.addEventListener("click", savePO);

        // Initial load from API
        loadPurchaseOrders();
    }

    return {
        init,
        loadPurchaseOrders,
        openPOModal,
        savePO
    };
})();
