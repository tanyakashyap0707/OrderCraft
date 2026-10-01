/**
 * OrderCraft Bill of Materials (BOM) Module
 * Manages BOM creation, recipe management, and raw material assembly.
 */
window.OrderCraft = window.OrderCraft || {};
window.OrderCraft.modules = window.OrderCraft.modules || {};

window.OrderCraft.modules.bom = (() => {
    let _materialsInBom = [];

    /**
     * Add material row to the BOM in creation modal
     */
    async function addMaterial() {
        const modal = document.getElementById("bomModal");
        if (!modal) return;

        // Query scoped to BOM modal to avoid duplicate ID issues
        const nameInput = modal.querySelector(".material-row input[type='text']");
        const qtyInput = modal.querySelector(".material-row input[type='number']");
        const unitSelect = modal.querySelector(".material-row select");

        const name = nameInput?.value.trim();
        const quantity = qtyInput?.value.trim();
        const unit = unitSelect?.value || "kg";

        if (!name || !quantity) {
            alert("Please enter both material name and quantity.");
            return;
        }

        const materialData = {
            name,
            unit,
            available: Number(quantity),
            required: 0,
            shortage: 0,
            status: "Available"
        };

        try {
            // Attempt to save to backend
            await window.OrderCraft.api.materials.create(materialData);
        } catch (e) {
            console.warn("Saving material to backend failed, continuing locally:", e.message);
        }

        // Add to active BOM list
        _materialsInBom.push({ name, quantity, unit });

        const materialList = document.getElementById("materialList");
        if (materialList) {
            const item = document.createElement("div");
            item.className = "material-item";
            item.innerHTML = `
                <span>
                    <strong>${name}</strong> — ${quantity} ${unit}
                </span>
            `;
            materialList.appendChild(item);
        }

        // Clear inputs
        if (nameInput) nameInput.value = "";
        if (qtyInput) qtyInput.value = "";
        nameInput?.focus();
    }

    /**
     * Save the entire BOM to table
     */
    function saveBom() {
        const productInput = document.getElementById("bomProduct");
        const versionInput = document.getElementById("bomVersion");

        const product = productInput?.value.trim();
        const version = versionInput?.value.trim() || "v1.0";

        if (!product || _materialsInBom.length === 0) {
            alert("Please provide a product name and add at least one material.");
            return;
        }

        const bomId = "BOM-" + Math.floor(100 + Math.random() * 900);
        const tableBody = document.querySelector("#bomTable tbody");

        if (tableBody) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><strong>${bomId}</strong></td>
                <td>${product}</td>
                <td>${_materialsInBom.length} Materials</td>
                <td>${version}</td>
                <td>
                    <span class="status completed-status">Active</span>
                </td>
            `;
            tableBody.prepend(row);
        }

        // Reset
        if (productInput) productInput.value = "";
        if (versionInput) versionInput.value = "";
        const materialList = document.getElementById("materialList");
        if (materialList) materialList.innerHTML = "";
        _materialsInBom = [];

        window.OrderCraft.modules.modals.close("bomModal");
        alert(`BOM ${bomId} created successfully!`);
    }

    function init() {
        // Modal toggles
        document.getElementById("createBomBtn")?.addEventListener("click", () => {
            window.OrderCraft.modules.modals.open("bomModal");
        });

        document.getElementById("closeBomModal")?.addEventListener("click", () => {
            window.OrderCraft.modules.modals.close("bomModal");
        });

        // Add material to list
        document.getElementById("addMaterialBtn")?.addEventListener("click", addMaterial);

        // Save BOM
        document.getElementById("saveBomBtn")?.addEventListener("click", saveBom);
    }

    return {
        init,
        addMaterial,
        saveBom
    };
})();
