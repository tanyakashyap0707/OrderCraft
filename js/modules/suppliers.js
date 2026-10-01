/**
 * OrderCraft Suppliers Module
 * Handles vendor relationships, material procurement catalogs, and contact directories.
 */
window.OrderCraft = window.OrderCraft || {};
window.OrderCraft.modules = window.OrderCraft.modules || {};

window.OrderCraft.modules.suppliers = (() => {
    let _cachedSuppliers = [];

    /**
     * Render suppliers to the table
     */
    function renderSupplierTable(list) {
        const tbody = document.querySelector("#supplierTable tbody");
        if (!tbody) return;

        if (!list || list.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center; color:#8a94a6; padding:25px;">
                        No suppliers found. Click "+ Add Supplier" to add one.
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = list.map(s => `
            <tr>
                <td><strong>${s.name}</strong></td>
                <td>${s.contact}</td>
                <td>${s.material}</td>
                <td>${s.orders}</td>
                <td>
                    <span class="status ${s.status === 'Active' ? 'completed-status' : 'pending-status'}">
                        ${s.status}
                    </span>
                </td>
            </tr>
        `).join("");
    }

    /**
     * Filter the supplier table based on search input
     */
    function filterSuppliers() {
        const query = (document.getElementById("searchSupplier")?.value || "").toLowerCase().trim();
        const filtered = query
            ? _cachedSuppliers.filter(s =>
                s.name.toLowerCase().includes(query) ||
                s.material.toLowerCase().includes(query) ||
                s.contact.toLowerCase().includes(query)
              )
            : _cachedSuppliers;
        renderSupplierTable(filtered);
    }

    /**
     * Save a new supplier from the modal form
     */
    function saveSupplier() {
        const name     = document.getElementById("supplierNameInput")?.value.trim();
        const contact  = document.getElementById("supplierContactInput")?.value.trim();
        const material = document.getElementById("supplierMaterialInput")?.value.trim();
        const status   = document.getElementById("supplierStatusInput")?.value || "Active";

        if (!name || !contact || !material) {
            alert("Please fill in Supplier Name, Contact, and Material.");
            return;
        }

        const newSupplier = {
            name,
            contact,
            material,
            orders: 0,
            status
        };

        _cachedSuppliers.unshift(newSupplier);
        renderSupplierTable(_cachedSuppliers);

        // Update summary card counts
        const totalEl = document.querySelector(".suppliers-page .detail-card:nth-child(1) h3");
        const activeEl = document.querySelector(".suppliers-page .detail-card:nth-child(2) h3");
        if (totalEl) totalEl.textContent = _cachedSuppliers.length;
        if (activeEl) activeEl.textContent = _cachedSuppliers.filter(s => s.status === "Active").length;

        window.OrderCraft.modules.modals.close("supplierModal");

        // Reset form
        ["supplierNameInput", "supplierContactInput", "supplierMaterialInput"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });

        alert(`Supplier "${name}" added successfully!`);
    }

    /**
     * Initialize the module
     */
    function init() {
        // Collect static rows from HTML into cache
        document.querySelectorAll("#supplierTable tbody tr").forEach(row => {
            const cells = row.querySelectorAll("td");
            if (cells.length >= 5) {
                _cachedSuppliers.push({
                    name:     cells[0].textContent.trim(),
                    contact:  cells[1].textContent.trim(),
                    material: cells[2].textContent.trim(),
                    orders:   cells[3].textContent.trim(),
                    status:   cells[4].textContent.trim()
                });
            }
        });

        // Add Supplier button → open modal
        document.getElementById("addSupplierBtn")?.addEventListener("click", () => {
            window.OrderCraft.modules.modals.open("supplierModal");
        });

        // Close modal button
        document.getElementById("closeSupplierModal")?.addEventListener("click", () => {
            window.OrderCraft.modules.modals.close("supplierModal");
        });

        // Save supplier button
        document.getElementById("saveSupplierBtn")?.addEventListener("click", saveSupplier);

        // Live search
        document.getElementById("searchSupplier")?.addEventListener("input", filterSuppliers);
    }

    return {
        init,
        renderSupplierTable,
        filterSuppliers,
        saveSupplier
    };
})();
