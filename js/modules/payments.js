/**
 * OrderCraft Payments Module
 * Handles accounts receivable, payment recording, and balance reconciliation.
 */
window.OrderCraft = window.OrderCraft || {};
window.OrderCraft.modules = window.OrderCraft.modules || {};

window.OrderCraft.modules.payments = (() => {
    let _cachedPayments = [];

    /**
     * Map status to CSS badge class
     */
    function getStatusClass(status) {
        switch ((status || "").toLowerCase()) {
            case "paid":      return "completed-status";
            case "overdue":   return "overdue-status";
            case "pending":
            default:          return "pending-status";
        }
    }

    /**
     * Render the payment table
     */
    function renderPaymentTable(list) {
        const tbody = document.querySelector(".payments-page table tbody");
        if (!tbody) return;

        if (!list || list.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; color:#8a94a6; padding:25px;">
                        No payments recorded yet. Click "+ Record Payment" to add one.
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = list.map(p => `
            <tr>
                <td>${p.paymentId}</td>
                <td>${p.customer}</td>
                <td>${p.invoice}</td>
                <td>₹${Number(p.amount).toLocaleString("en-IN")}</td>
                <td>${p.date || "—"}</td>
                <td>
                    <span class="status ${getStatusClass(p.status)}">
                        ${p.status}
                    </span>
                </td>
            </tr>
        `).join("");
    }

    /**
     * Update the Outstanding Payments panel
     */
    function updateOutstanding() {
        const container = document.querySelector(".payments-page .payment-overview");
        if (!container) return;

        const outstanding = _cachedPayments.filter(p =>
            p.status.toLowerCase() === "pending" || p.status.toLowerCase() === "overdue"
        );

        const rows = container.querySelectorAll(".payment-row");
        rows.forEach(r => r.remove());

        outstanding.forEach(p => {
            const row = document.createElement("div");
            row.className = "payment-row";
            row.innerHTML = `
                <div>
                    <strong>${p.customer}</strong>
                    <p>Invoice ${p.invoice}</p>
                </div>
                <strong>₹${Number(p.amount).toLocaleString("en-IN")}</strong>
                <span class="status ${getStatusClass(p.status)}">${p.status}</span>
            `;
            container.appendChild(row);
        });
    }

    /**
     * Update summary stat cards
     */
    function updateSummaryCards() {
        const cards = document.querySelectorAll(".payments-page .detail-card");
        if (!cards.length) return;

        const received = _cachedPayments
            .filter(p => p.status.toLowerCase() === "paid")
            .reduce((sum, p) => sum + Number(p.amount), 0);
        const pending = _cachedPayments
            .filter(p => p.status.toLowerCase() === "pending")
            .reduce((sum, p) => sum + Number(p.amount), 0);
        const overdue = _cachedPayments
            .filter(p => p.status.toLowerCase() === "overdue")
            .reduce((sum, p) => sum + Number(p.amount), 0);
        const total = received + pending + overdue;
        const successRate = total > 0 ? Math.round((received / total) * 100) : 0;

        if (cards[0]) cards[0].querySelector("h3").textContent = `₹${(received / 100000).toFixed(1)} L`;
        if (cards[1]) cards[1].querySelector("h3").textContent = `₹${(pending / 100000).toFixed(1)} L`;
        if (cards[2]) cards[2].querySelector("h3").textContent = `₹${Math.round(overdue / 1000)} K`;
        if (cards[3]) cards[3].querySelector("h3").textContent = `${successRate}%`;
    }

    /**
     * Save new payment from modal form
     */
    function savePayment() {
        const customer = document.getElementById("paymentCustomerInput")?.value.trim();
        const invoice  = document.getElementById("paymentInvoiceInput")?.value.trim();
        const amount   = document.getElementById("paymentAmountInput")?.value;
        const status   = document.getElementById("paymentStatusInput")?.value || "Pending";

        if (!customer || !invoice || !amount) {
            alert("Please fill in Customer, Invoice, and Amount.");
            return;
        }

        const paymentId = "PAY-" + Math.floor(1000 + Math.random() * 9000);
        const date = status.toLowerCase() === "paid"
            ? new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
            : "—";

        const newPayment = { paymentId, customer, invoice, amount: Number(amount), date, status };

        _cachedPayments.unshift(newPayment);
        renderPaymentTable(_cachedPayments);
        updateOutstanding();
        updateSummaryCards();

        window.OrderCraft.modules.modals.close("paymentModal");

        // Reset form
        ["paymentCustomerInput", "paymentInvoiceInput", "paymentAmountInput"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });

        alert(`Payment ${paymentId} recorded: ₹${Number(amount).toLocaleString("en-IN")} from ${customer} — ${status}`);
    }

    /**
     * Initialize the module
     */
    function init() {
        // Collect static rows from HTML into cache
        document.querySelectorAll(".payments-page table tbody tr").forEach(row => {
            const cells = row.querySelectorAll("td");
            if (cells.length >= 6) {
                _cachedPayments.push({
                    paymentId: cells[0].textContent.trim(),
                    customer:  cells[1].textContent.trim(),
                    invoice:   cells[2].textContent.trim(),
                    amount:    cells[3].textContent.replace(/[₹,]/g, "").trim(),
                    date:      cells[4].textContent.trim(),
                    status:    cells[5].textContent.trim()
                });
            }
        });

        // Record Payment button → open modal
        document.getElementById("recordPaymentBtn")?.addEventListener("click", () => {
            window.OrderCraft.modules.modals.open("paymentModal");
        });

        // Close modal button
        document.getElementById("closePaymentModal")?.addEventListener("click", () => {
            window.OrderCraft.modules.modals.close("paymentModal");
        });

        // Save payment button
        document.getElementById("savePaymentBtn")?.addEventListener("click", savePayment);
    }

    return {
        init,
        renderPaymentTable,
        savePayment
    };
})();
