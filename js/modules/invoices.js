/**
 * OrderCraft Invoices Module
 * Handles billing, tax breakdown, document rendering, and print export.
 */
window.OrderCraft = window.OrderCraft || {};
window.OrderCraft.modules = window.OrderCraft.modules || {};

window.OrderCraft.modules.invoices = (() => {
    function scrollToInvoice() {
        const doc = document.getElementById("invoiceDocument");
        if (doc) {
            doc.scrollIntoView({ behavior: "smooth" });
        }
    }

    function printInvoice() {
        window.print();
    }

    function init() {
        document.getElementById("createInvoiceBtn")?.addEventListener("click", scrollToInvoice);
        document.getElementById("printInvoiceBtn")?.addEventListener("click", printInvoice);
    }

    return {
        init,
        scrollToInvoice,
        printInvoice
    };
})();
