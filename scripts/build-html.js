const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const viewsDir = path.join(rootDir, "views");

function readFile(relPath) {
    const fullPath = path.join(rootDir, relPath);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`File not found: ${relPath}`);
    }
    return fs.readFileSync(fullPath, "utf-8").trim();
}

function buildHtml() {
    console.log("🔨 Building modular index.html from views...");

    const sidebar = readFile("views/components/sidebar.html");
    const topbar = readFile("views/components/topbar.html");

    const pages = [
        "views/pages/dashboard.html",
        "views/pages/orders.html",
        "views/pages/order-details.html",
        "views/pages/bom.html",
        "views/pages/inventory.html",
        "views/pages/procurement.html",
        "views/pages/production.html",
        "views/pages/invoices.html",
        "views/pages/payments.html",
        "views/pages/analytics.html",
        "views/pages/suppliers.html"
    ].map(readFile).join("\n\n        ");

    const modals = [
        "views/modals/material-modal.html",
        "views/modals/bom-modal.html",
        "views/modals/order-modal.html"
    ].map(readFile).join("\n\n        ");

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OrderCraft - Manufacturing Operations Platform</title>

    <!-- Master Modular Stylesheet -->
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="app">

    <!-- ================= SIDEBAR ================= -->
    ${sidebar}

    <!-- ================= MAIN CONTENT ================= -->
    <main class="main">

        <!-- TOPBAR -->
        ${topbar}

        <!-- ================= PAGES ================= -->
        ${pages}

        <!-- ================= MODALS ================= -->
        ${modals}

    </main>

</div>

<!-- ================= MODULAR JAVASCRIPT SYSTEM ================= -->
<script src="js/config.js"></script>
<script src="js/state.js"></script>
<script src="js/api.js"></script>
<script src="js/modules/navigation.js"></script>
<script src="js/modules/modals.js"></script>
<script src="js/modules/orders.js"></script>
<script src="js/modules/orderDetails.js"></script>
<script src="js/modules/bom.js"></script>
<script src="js/modules/inventory.js"></script>
<script src="js/modules/procurement.js"></script>
<script src="js/modules/production.js"></script>
<script src="js/modules/invoices.js"></script>
<script src="js/modules/payments.js"></script>
<script src="js/modules/analytics.js"></script>
<script src="js/modules/suppliers.js"></script>
<script src="js/app.js"></script>

</body>
</html>
`;

    const outPath = path.join(rootDir, "index.html");
    fs.writeFileSync(outPath, fullHtml, "utf-8");
    console.log("✅ index.html generated successfully!");
}

if (process.argv.includes("--watch")) {
    buildHtml();
    console.log("👀 Watching views/ directory for changes...");
    fs.watch(viewsDir, { recursive: true }, (eventType, filename) => {
        if (filename && filename.endsWith(".html")) {
            console.log(`🔄 Change detected in ${filename}. Rebuilding...`);
            try {
                buildHtml();
            } catch (err) {
                console.error("❌ Build error:", err.message);
            }
        }
    });
} else {
    buildHtml();
}
