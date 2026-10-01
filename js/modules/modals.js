/**
 * OrderCraft Modals Module
 * Centralized modal opening, closing, backdrop clicking, and keyboard shortcuts.
 */
window.OrderCraft = window.OrderCraft || {};
window.OrderCraft.modules = window.OrderCraft.modules || {};

window.OrderCraft.modules.modals = (() => {
    function open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "flex";
            document.body.style.overflow = "hidden";
        }
    }

    function close(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "none";
            document.body.style.overflow = "";
        }
    }

    function init() {
        // Close on backdrop click
        document.querySelectorAll(".modal").forEach((modal) => {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) {
                    close(modal.id);
                }
            });
        });

        // Close on ESC key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                document.querySelectorAll(".modal").forEach((modal) => {
                    if (modal.style.display === "flex") {
                        close(modal.id);
                    }
                });
            }
        });
    }

    return {
        init,
        open,
        close
    };
})();
