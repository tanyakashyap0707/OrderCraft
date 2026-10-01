const fs = require("fs");
const path = require("path");

const htmlPath = path.resolve(__dirname, "../index.html");
const rawHtml = fs.readFileSync(htmlPath, "utf-8").replace(/\r\n/g, "\n");

const sections = [
    {
        name: "views/components/sidebar.html",
        start: '<aside class="sidebar">',
        end: '</aside>'
    },
    {
        name: "views/components/topbar.html",
        start: '<header class="topbar">',
        end: '</header>'
    },
    {
        name: "views/pages/dashboard.html",
        start: '<section id="dashboardPage">',
        end: '</section>\n\n\n        <!-- ================= ORDERS PAGE ================= -->'
    },
    {
        name: "views/pages/orders.html",
        start: '<section class="orders-page" id="ordersPage">',
        end: '</section>\n\n        <!-- ================= ORDER DETAILS ================= -->'
    },
    {
        name: "views/pages/order-details.html",
        start: '<section class="order-details-page" id="orderDetailsPage">',
        end: '</section>\n\n        <!-- ================= BOM PAGE ================= -->'
    },
    {
        name: "views/pages/bom.html",
        start: '<section class="bom-page" id="bomPage">',
        end: '</section>\n\n<!-- ================= INVENTORY PAGE ================= -->'
    },
    {
        name: "views/pages/inventory.html",
        start: '<section class="inventory-page" id="inventoryPage">',
        end: '</section>\n\n<!-- ================= PROCUREMENT PAGE ================= -->'
    },
    {
        name: "views/pages/procurement.html",
        start: '<section class="procurement-page" id="procurementPage">',
        end: '</section>\n\n<!-- ================= PRODUCTION PAGE ================= -->'
    },
    {
        name: "views/pages/production.html",
        start: '<section class="production-page" id="productionPage">',
        end: '</section>\n<!-- ================= INVOICE PAGE ================= -->'
    },
    {
        name: "views/pages/invoices.html",
        start: '<section class="invoice-page" id="invoicePage">',
        end: '</section>\n<!-- ================= PAYMENTS PAGE ================= -->'
    },
    {
        name: "views/pages/payments.html",
        start: '<section class="payments-page" id="paymentsPage">',
        end: '</section>\n\n<!-- ================= ANALYTICS PAGE ================= -->'
    },
    {
        name: "views/pages/analytics.html",
        start: '<section class="analytics-page" id="analyticsPage">',
        end: '</section>\n<!-- ADD MATERIAL MODAL -->'
    },
    {
        name: "views/modals/material-modal.html",
        start: '<div class="modal" id="materialModal">',
        end: '</div>\n\n\n<!-- CREATE BOM MODAL -->'
    },
    {
        name: "views/modals/bom-modal.html",
        start: '<div class="modal" id="bomModal">',
        end: '</div>\n<!-- ================= SUPPLIERS PAGE ================= -->'
    },
    {
        name: "views/pages/suppliers.html",
        start: '<section class="suppliers-page" id="suppliersPage">',
        end: '</section>\n\n\n        <!-- ================= CREATE ORDER MODAL ================= -->'
    },
    {
        name: "views/modals/order-modal.html",
        start: '<div class="modal" id="orderModal">',
        end: '</div>\n\n    </main>'
    }
];

sections.forEach(({ name, start, end }) => {
    const sIdx = rawHtml.indexOf(start);
    if (sIdx === -1) {
        console.error(`Marker not found: ${start}`);
        return;
    }
    const eIdx = rawHtml.indexOf(end, sIdx);
    if (eIdx === -1) {
        console.error(`End marker not found for ${name}`);
        return;
    }
    let content;
    if (end.includes("</section>")) {
        content = rawHtml.slice(sIdx, eIdx) + "</section>";
    } else if (end.includes("</div>")) {
        content = rawHtml.slice(sIdx, eIdx) + "</div>";
    } else {
        content = rawHtml.slice(sIdx, eIdx + end.length);
    }
    const outPath = path.resolve(__dirname, "..", name);
    fs.writeFileSync(outPath, content.trim() + "\n", "utf-8");
    console.log(`Extracted: ${name}`);
});
console.log("All views and components successfully extracted!");
