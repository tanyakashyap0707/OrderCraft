/**
 * OrderCraft Inventory & Materials Module
 * Manages raw materials stock, shortage detection, and material addition.
 */
window.OrderCraft = window.OrderCraft || {};
window.OrderCraft.modules = window.OrderCraft.modules || {};

window.OrderCraft.modules.inventory = (() => {
    let _cachedMaterials = [];

    /**
     * Render materials table rows
     */
    function renderMaterialsTable(materials) {
        const tableBody = document.querySelector("#inventoryTable tbody");
        if (!tableBody) return;

        if (!materials || materials.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center; color: #8a94a6; padding: 25px;">
                        No materials available. Click "+ Add Material" to create one.
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = materials
            .map((mat) => {
                const isShortage = mat.shortage > 0 || mat.status === "Shortage";
                return `
                <tr>
                    <td><strong>${mat.name}</strong></td>
                    <td>${mat.unit || "kg"}</td>
                    <td>${mat.available || 0}</td>
                    <td>${mat.required || 0}</td>
                    <td>${mat.shortage || 0}</td>
                    <td>
                        <span class="status ${isShortage ? "pending-status" : "completed-status"}">
                            ${mat.status || (isShortage ? "Shortage" : "Available")}
                        </span>
                    </td>
                    <td>
                        ${
                            isShortage
                                ? `<button class="purchase-btn" data-material="${mat.name}" data-shortage="${mat.shortage}">
                                    Create PO
                                   </button>`
                                : `<button class="purchase-btn disabled">No Action</button>`
                        }
                    </td>
                </tr>
            `;
            })
            .join("");
    }

    /**
     * Load materials from backend API
     */
    async function loadMaterials() {
        try {
            const materials = await window.OrderCraft.api.materials.getAll();
            if (Array.isArray(materials) && materials.length > 0) {
                _cachedMaterials = materials;
                window.OrderCraft.state.set("materials", materials);
                renderMaterialsTable(materials);
            }
        } catch (error) {
            console.warn("Could not fetch materials from API:", error.message);
        }
    }

    /**
     * Save new standalone material from modal
     */
    async function saveMaterial() {
        const modal = document.getElementById("materialModal");
        if (!modal) return;

        const nameInput = modal.querySelector("#materialName");
        const qtyInput = modal.querySelector("#materialQty");
        const unitSelect = modal.querySelector("#materialUnit");

        const name = nameInput?.value.trim();
        const quantity = qtyInput?.value.trim();
        const unit = unitSelect?.value || "kg";

        if (!name || !quantity) {
            alert("Please enter material name and available quantity.");
            return;
        }

        const newMat = {
            name,
            unit,
            available: Number(quantity),
            required: 0,
            shortage: 0,
            status: "Available"
        };

        try {
            const res = await window.OrderCraft.api.materials.create(newMat);
            const saved = (res && res.material) || newMat;
            _cachedMaterials.unshift(saved);
            window.OrderCraft.state.set("materials", _cachedMaterials);
            renderMaterialsTable(_cachedMaterials);

            window.OrderCraft.modules.modals.close("materialModal");
            if (nameInput) nameInput.value = "";
            if (qtyInput) qtyInput.value = "";

            alert("Material added successfully!");
        } catch (e) {
            console.error("Save material error:", e);
            _cachedMaterials.unshift(newMat);
            window.OrderCraft.state.set("materials", _cachedMaterials);
            renderMaterialsTable(_cachedMaterials);
            window.OrderCraft.modules.modals.close("materialModal");
            alert("Material added locally.");
        }
    }

    function init() {
        // Collect existing HTML static materials
        document.querySelectorAll("#inventoryTable tbody tr").forEach((row) => {
            const cells = row.querySelectorAll("td");
            if (cells.length >= 6) {
                _cachedMaterials.push({
                    name: cells[0].textContent.trim(),
                    unit: cells[1].textContent.trim(),
                    available: Number(cells[2].textContent.trim()) || 0,
                    required: Number(cells[3].textContent.trim()) || 0,
                    shortage: Number(cells[4].textContent.trim()) || 0,
                    status: cells[5].textContent.trim()
                });
            }
        });

        // Add Material Modal triggers
        document.getElementById("openMaterialModalBtn")?.addEventListener("click", () => {
            window.OrderCraft.modules.modals.open("materialModal");
        });

        document.getElementById("closeMaterialModal")?.addEventListener("click", () => {
            window.OrderCraft.modules.modals.close("materialModal");
        });

        document.getElementById("saveMaterialBtn")?.addEventListener("click", saveMaterial);

        // Delegated listener for "Create PO" button in inventory table
        document.addEventListener("click", (e) => {
            if (e.target && e.target.classList.contains("purchase-btn") && !e.target.classList.contains("disabled")) {
                const material = e.target.dataset.material;
                const shortage = e.target.dataset.shortage;

                if (material && window.OrderCraft.modules.procurement) {
                    window.OrderCraft.modules.procurement.promptCreatePO(material, shortage);
                }
            }
        });

        // Initial load
        loadMaterials();
    }

    return {
        init,
        loadMaterials,
        saveMaterial
    };
})();
