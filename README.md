# NyayaTula — न्यायतुला ⚖️📦

### Software System for Compliance Checking of Packaged Commodities under Legal Metrology (Packaged Commodities) Rules, 2011

> **SIH 2026**  
> Ministry of Consumer Affairs, Food & Public Distribution  
> Department of Consumer Affairs (DoCA)

NyayaTula (meaning "Scale of Justice" in Sanskrit) is an AI-powered web application that scans product labels, extracts mandatory declarations via OCR, and automatically validates compliance with the Legal Metrology (Packaged Commodities) Rules, 2011. It generates detailed compliance reports and provides enforcement dashboards.

---

## 🌟 Key Features

### 📸 Product Label Scanning
- Upload product images (front, back, side labels)
- Drag-and-drop or camera capture
- Multi-image support for comprehensive analysis

### 🔍 OCR Text Extraction
- Automated text extraction using Tesseract.js
- Intelligent parsing of mandatory declarations (MRP, Net Qty, Manufacturer, etc.)
- Confidence scoring and manual correction support

### ✅ Compliance Validation (15+ Rules)
| Rule | Declaration | Reference | Severity |
|------|------------|-----------|----------|
| RULE_001 | Name of Commodity | Rule 6(1)(a) | Critical |
| RULE_002 | Net Quantity | Rule 6(1)(b) | Critical |
| RULE_003 | MRP Declaration | Rule 6(1)(c) | Critical |
| RULE_004 | MRP Inclusive Text | Rule 6(1)(c) | Major |
| RULE_005 | Manufacturer Name | Rule 6(1)(d) | Critical |
| RULE_006 | Manufacturer Address | Rule 6(1)(d) | Critical |
| RULE_007 | Date of Manufacture | Rule 6(1)(e) | Critical |
| RULE_008 | Best Before / Expiry | Rule 6(1)(f) | Major |
| RULE_009 | Consumer Care Details | Rule 6(1)(g) | Major |
| RULE_010 | Country of Origin | Rule 6(1)(h) | Critical |
| RULE_011 | Generic/Common Name | Rule 6(2) | Minor |
| RULE_012 | FSSAI License | FSSAI Act | Major |
| RULE_013 | Importer Details | Rule 6(1)(d) | Critical |
| RULE_014 | Net Quantity Unit Standard | Rule 6(3) | Minor |
| RULE_015 | MRP Format | Rule 6(1)(c) | Minor |

### 📊 Enforcement Dashboard
- Real-time compliance statistics
- Compliance trend charts (30-day view)
- Top violations ranking
- Recent scans with status badges
- Quick scan access

### 📋 Compliance Reports
- Detailed per-product compliance reports
- Pass/fail status for each mandatory declaration
- Severity classification (Critical/Major/Minor)
- Export to PDF format
- Print-ready reports

### 🗄️ Product Repository
- Searchable product history
- Filter by status, category, date range
- Sort by any column
- Export to CSV

### 📈 Analytics
- Monthly compliance trends
- Violation breakdown by category
- Compliance by product category
- Top non-compliant manufacturers
- Inspector activity metrics

### 🔐 Authentication & Security
- Role-based access (Admin, Inspector, Viewer)
- JWT-based authentication
- Secure password hashing (bcrypt)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS (Government theme) |
| Charts | Recharts |
| OCR | Tesseract.js |
| PDF Export | jsPDF + html2canvas |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcrypt |
| File Upload | Multer |
| Icons | Lucide React |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)

### Installation

```bash
# Navigate to project directory
cd "SIH sample"

# Install all dependencies
npm run install:all

# Configure environment
# Edit server/.env with your MongoDB URI

# Start both client & server
npm run dev
```

### Access
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

### Demo Login
- **Email**: admin@nyayatula.gov.in
- **Password**: admin123

---

## 📁 Project Structure

```
NyayaTula/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/              # Sidebar, Header, AppLayout
│   │   │   └── common/              # StatsCard, StatusBadge, DataTable, etc.
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Authentication
│   │   │   ├── Dashboard.jsx        # Enforcement dashboard
│   │   │   ├── ScanProduct.jsx      # Image upload + OCR + compliance check
│   │   │   ├── ComplianceReport.jsx # Detailed report view
│   │   │   ├── ProductHistory.jsx   # Product repository
│   │   │   └── Analytics.jsx        # Violation analytics
│   │   ├── services/
│   │   │   ├── api.js               # Axios HTTP client
│   │   │   ├── ocrEngine.js         # Tesseract.js OCR wrapper
│   │   │   └── complianceRules.js   # Client-side rule engine
│   │   ├── context/AuthContext.jsx   # Authentication state
│   │   └── hooks/useOCR.js          # OCR processing hook
│   └── tailwind.config.js           # Government color theme
├── server/                          # Node.js Backend
│   ├── src/
│   │   ├── models/                  # User, Product, ComplianceReport
│   │   ├── routes/                  # auth, products, compliance, dashboard
│   │   ├── services/                # Compliance engine
│   │   └── middleware/              # JWT auth + RBAC
│   └── .env                        # Environment config
└── README.md
```

---

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login, get JWT |
| GET | `/api/auth/profile` | Current user profile |
| POST | `/api/products` | Create scanned product |
| GET | `/api/products` | List products (paginated) |
| GET | `/api/products/:id` | Get product details |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| POST | `/api/compliance/check` | Run compliance check |
| GET | `/api/compliance/report/:productId` | Get compliance report |
| GET | `/api/compliance/reports` | List all reports |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/dashboard/trends` | Compliance trends |
| GET | `/api/dashboard/violations` | Top violations |
| GET | `/api/dashboard/recent` | Recent scans |

---

## 🎨 Design Theme

### Color Palette (Government / Official)
- **Navy Blue** (`#003366`) — Primary, Government authority
- **Saffron Gold** (`#FF9933`) — Accent, Indian national color
- **Emerald Green** (`#138808`) — Compliant status
- **Alert Red** (`#DC2626`) — Non-compliant / Violations
- **Slate Gray** — Neutral, secondary elements

---

## 📜 Legal Reference

This system validates compliance with:
- **Legal Metrology Act, 2009**
- **Legal Metrology (Packaged Commodities) Rules, 2011**
- **FSSAI (Food Safety and Standards Authority of India)** regulations for food products

---

## 🤝 Team

Built for **Smart India Hackathon 2026** | Theme: Miscellaneous  
Organization: Ministry of Consumer Affairs, Food & Public Distribution

---

## 📜 License

MIT License — Built with ❤️ for consumer protection in India.
