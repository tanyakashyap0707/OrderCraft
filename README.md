# OrderCraft — Modular Manufacturing Operations Platform

OrderCraft is a full-stack manufacturing execution and enterprise resource planning (ERP) platform designed for tracking customer orders, Bill of Materials (BOM), raw material inventory, procurement purchase orders, invoicing, and analytics.

---

## 🏗️ Architecture & Modular Structure

The codebase has been refactored from large monolithic files into a decoupled, highly maintainable modular system.

```
ordercraft/
├── index.html                   # Compiled application interface
├── style.css                    # Master stylesheet importing modular CSS
├── script.js                   # Backwards-compatibility loader
├── package.json                 # Root project scripts (build, dev, start)
│
├── views/                       # Modular HTML components and page views
│   ├── components/              # Reusable UI components
│   │   ├── sidebar.html         # Sidebar navigation and logo
│   │   └── topbar.html          # Global header search and user profile
│   ├── pages/                   # Isolated application views
│   │   ├── dashboard.html       # Executive KPIs, production overview, material alerts
│   │   ├── orders.html          # Manufacturing orders table, search & filter
│   │   ├── order-details.html   # Order tracking timeline, workflow, invoice details
│   │   ├── bom.html             # Bill of Materials definitions & active recipes
│   │   ├── inventory.html       # Raw materials stock, shortages, PO triggers
│   │   ├── procurement.html     # Supplier purchase orders & inbound deliveries
│   │   ├── production.html      # Manufacturing jobs & batch scheduling
│   │   ├── invoices.html        # Customer tax invoices & printable view
│   │   ├── payments.html        # Payment reconciliation & status tracking
│   │   ├── analytics.html       # Monthly output trends & operations insights
│   │   └── suppliers.html       # Vendor directory & procurement ratings
│   └── modals/                  # Self-contained modal dialogs
│       ├── order-modal.html     # Create manufacturing order dialog
│       ├── bom-modal.html       # Create Bill of Materials dialog
│       └── material-modal.html  # Add raw material dialog
│
├── css/                         # Modular CSS stylesheets
│   ├── variables.css            # Design tokens, color palette, spacing, typography
│   ├── base.css                 # Reset, body typography, main layout container
│   ├── components/              # Modular component styles
│   │   ├── sidebar.css          # Fixed sidebar & active indicators
│   │   ├── topbar.css           # Header bar, search bar, profile badge
│   │   ├── cards.css            # Stat cards, detail cards, panels
│   │   ├── tables.css           # Data tables, headers, row hover states
│   │   ├── status.css           # Badges (Pending, In Production, Completed, Shortage)
│   │   ├── buttons.css          # Primary actions & purchase trigger buttons
│   │   ├── modals.css           # Backdrop, dialog box, form grids
│   │   └── timeline.css         # Order tracking timeline nodes & progress
│   └── pages/                   # Page-specific styling rules
│       ├── dashboard.css        # Dashboard grid, charts, alert items
│       ├── orders.css           # Orders toolbar, search inputs
│       ├── order-details.css    # Order inspection layout, progress bars
│       ├── bom.css              # BOM page layout
│       ├── inventory.css        # Inventory layout & shortage alerts
│       ├── procurement.css      # Purchase orders table layout
│       ├── production.css       # Mini progress indicators
│       ├── invoices.css         # Printable invoice document layout
│       ├── payments.css         # Payment rows & balance summary
│       ├── analytics.css        # Performance bar charts & insight cards
│       └── suppliers.css        # Vendor directory table
│
├── js/                          # Modular Frontend JavaScript
│   ├── config.js                # Environment settings & dynamic API base URL
│   ├── state.js                 # Central reactive state store with event listeners
│   ├── api.js                   # Unified REST API service layer (Orders, Materials, POs)
│   ├── modules/                 # Single-responsibility feature modules
│   │   ├── navigation.js        # Page router & active tab switcher
│   │   ├── modals.js            # Universal modal manager (ESC, backdrop click)
│   │   ├── orders.js            # Orders CRUD, table rendering, search & status filter
│   │   ├── orderDetails.js      # Order inspection & workflow timeline
│   │   ├── bom.js               # BOM creation, material adding, recipe builder
│   │   ├── inventory.js         # Material inventory, shortage handling, add material
│   │   ├── procurement.js       # Purchase order management & shortage PO creation
│   │   ├── production.js        # Production dispatching & tracking
│   │   ├── invoices.js          # Invoice generation, smooth scrolling, printing
│   │   ├── payments.js          # Payment recording & reconciliation
│   │   ├── analytics.js         # Operations analytics refresh & stats
│   │   └── suppliers.js         # Suppliers directory module
│   └── app.js                   # Main application bootstrap & orchestrator
│
├── backend/                     # Modular Node.js / Express Backend
│   ├── .env                     # MongoDB URI, PORT, NODE_ENV
│   ├── package.json             # Backend dependencies & scripts
│   ├── server.js                # Root backend server entrypoint
│   └── src/
│       ├── app.js               # Express application, middleware, static hosting
│       ├── server.js            # HTTP server startup & database connection
│       ├── config/
│       │   └── db.js            # MongoDB connection with Mongoose
│       ├── models/              # Mongoose schemas with validation & timestamps
│       │   ├── Order.js         # Order model
│       │   ├── Material.js      # Material model with automatic shortage calculation
│       │   └── PurchaseOrder.js # PurchaseOrder model
│       ├── controllers/         # RESTful business logic controllers
│       │   ├── orderController.js
│       │   ├── materialController.js
│       │   └── purchaseOrderController.js
│       ├── routes/              # Express API routers
│       │   ├── orderRoutes.js
│       │   ├── materialRoutes.js
│       │   ├── purchaseOrderRoutes.js
│       │   └── index.js         # Mounted at /api with /health endpoint
│       └── middleware/          # Express middleware
│           ├── cors.js          # Cross-Origin Resource Sharing
│           └── errorHandler.js  # Centralized error handler
│
└── scripts/                     # Developer Tooling & Build Scripts
    ├── build-html.js            # Compiles views/ into production index.html
    └── split-html.js            # HTML section extraction utility
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas connection URI configured in `backend/.env`)

### 2. Start the Backend Server
```bash
# From project root:
npm start

# Or with automatic reload during development:
npm run dev
```
The server will start on `http://localhost:5000`:
- **Web App**: `http://localhost:5000/` (served statically)
- **API Health**: `http://localhost:5000/api/health`
- **REST Endpoints**: `http://localhost:5000/api/...`

### 3. Open the Frontend
You can either:
- Open `http://localhost:5000/` in your browser (recommended, backend serves frontend).
- Or double-click `index.html` in your file explorer.

### 4. Editing Views & Rebuilding HTML
When modifying individual view files inside `views/`:
```bash
# One-time build:
npm run build:html

# Continuous watch mode:
npm run watch:html
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status & uptime |
| `GET` | `/api/orders` | List all manufacturing orders |
| `GET` | `/api/orders/:id` | Get order by ID |
| `POST` | `/api/orders` | Create a new manufacturing order |
| `PUT` | `/api/orders/:id/status` | Update order status (`Pending`, `In Production`, `Completed`) |
| `DELETE` | `/api/orders/:id` | Delete an order |
| `GET` | `/api/materials` | List all raw materials & stock |
| `POST` | `/api/materials` | Add a new material |
| `PUT` | `/api/materials/:id` | Update material stock or requirement |
| `DELETE` | `/api/materials/:id` | Delete a material |
| `GET` | `/api/purchase-orders` | List all supplier purchase orders |
| `POST` | `/api/purchase-orders` | Create a new purchase order |
| `PUT` | `/api/purchase-orders/:id/status` | Update PO status (`Pending`, `In Transit`, `Received`) |

---

## 💡 Key Improvements & Bug Fixes

1. **Monolithic Files Split**:
   - `index.html` (2,300 lines) split into 16 modular views and components with automated compiler.
   - `style.css` (960 lines) split into design tokens, 8 components, and 11 page stylesheets.
   - `script.js` (780 lines) split into configuration, reactive state, API service layer, and 12 feature modules.
   - Backend `server.js` split into MVC architecture (models, controllers, routes, config, middleware).
2. **Eliminated Scoping Bugs**: Fixed unhandled outer-scope element references (`ReferenceError: bomLink is not defined`).
3. **Removed Duplicate Event Listeners**: Cleaned up duplicated click events on navigation links and action buttons.
4. **Resolved Conflicting Element IDs**: Fixed duplicated IDs across modal dialogs (`#materialName`, `#materialQty`, `#materialUnit`).
5. **Persistent Orders & Materials**: Connected orders to MongoDB with real-time fetching, searching, and filtering.
6. **Unified Static Serving**: The backend now serves the frontend directly from `http://localhost:5000/`.
