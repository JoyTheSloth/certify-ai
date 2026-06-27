# 🚀 CertifyAI: AI-Powered Certificate Generator (Vite + React + Node + Gemini)

CertifyAI is a production-ready, high-fidelity web application built to generate, customize, verify, and bulk-export professional achievement certificates. Utilizing Vite, Tailwind CSS, Framer Motion, and Google's Gemini 2.5 Flash API, CertifyAI automates certificate descriptions and manages verification tracking via secure registry lookups.

---

## 🛠️ Tech Stack & Architecture

### Frontend (client/)
* **Vite + React.js**: Fast dev server and bundle speeds.
* **Tailwind CSS**: Custom color themes, scrollbar styles, and glassmorphic designs.
* **Framer Motion**: Smooth page entry transitions, hover states, and modal animations.
* **Axios**: Proxy-configured requests interfacing with the Node backend.
* **Lucide React**: Premium icon sets.
* **html2canvas & jsPDF**: Client-side rendering of landscape elements to high-DPI canvases and A4 PDFs.
* **JSZip**: In-memory compilation of bulk-generated PDF credentials into structured ZIP archives.

### Backend (server/)
* **Node.js & Express.js**: Main API host.
* **Google Generative AI SDK**: Integrates `gemini-2.5-flash` to write certificate descriptions based on course title, recipient metrics, and tone.
* **Local JSON Database**: File-based local registry stored in `server/data/certificates.json` for validation tracking.
* **CORS & BodyParsers**: Set to `10MB` limit to accommodate base64-encoded logos and signatures, eliminating CORS issues.

---

## 📂 Folder Structure

```
certificategeno/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI widgets
│   │   ├── pages/          # Home, Dashboard, Verify pages
│   │   ├── templates/      # 7 Premium Certificate Themes
│   │   ├── main.jsx        # React mounting script
│   │   └── App.jsx         # Client routing rules
│   ├── vite.config.js      # Dev Server Proxy rules
│   ├── tailwind.config.js  # Theme, fonts & luxury palettes
│   └── package.json
├── server/                 # Express Backend API
│   ├── controllers/        # AI & Certificate DB controller methods
│   ├── routes/             # Route mapping
│   ├── utils/              # JSON database helper methods
│   ├── data/               # Persistent certificates database
│   ├── server.js           # Server startup script
│   └── package.json
├── .env                    # Environment credentials
├── .gitignore              # Dependency & Build exclusions
├── package.json            # Monorepo runner scripts
└── README.md
```

---

## 🎨 The 7 Premium Certificate Templates

CertifyAI bundles **7 high-end certificate templates** styled using CSS/SVG, making them sharp at any print resolution:
1. **Classic Gold**: Cream parchment background, dual gold borders, serif headings, and a gold sunburst seal.
2. **Modern Blue**: Tech-focused layout with a left navy panel, QR code box, cyan accents, and modern typography.
3. **Minimal White**: High whitespace, thin borders, charcoal sans-serif type, and a clean signature line.
4. **Elegant Black**: Premium charcoal-black background, warm gold accents, and a metallic badge.
5. **Corporate**: Navy headers, slate grey layouts, and a clean double-signature grid.
6. **Academic**: Old-school gothic margins, crimson accents, wax seal, and elegant script.
7. **Luxury Premium**: Emerald green background with royal gold marble filigree and diamond badge.

---

## 🚀 Quick Start Guide

### 1. Prerequisite Installations
Ensure you have **Node.js** (v18+) installed.

### 2. Environment Setup
Rename/edit the `.env` file in the root directory:
```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
PORT=5000
```
> **Note**: If `GEMINI_API_KEY` is not provided or is invalid, the backend automatically redirects to an intelligent local copywriting generator. You can test all features without an API key!

### 3. Install All Dependencies
Run the installation command in the workspace root:
```bash
npm run install:all
```
This runs `npm install` in the root, `client/` folder, and `server/` folder concurrently.

### 4. Start the Application
Run the startup script:
```bash
npm run dev
```
* **Frontend**: `http://localhost:5173`
* **Backend API**: `http://localhost:5000`

---

## 📑 CSV Bulk Upload Guidelines

For **Bulk Generation**, upload a CSV file matching this format:
```csv
Recipient Name,Certificate Title,Course Name,Issue Date,Certificate Number,Instructor Name,Description
Jane Doe,Certificate of Achievement,React Engineering,2026-06-27,CERT-B-001,Dr. John Smith,For building high-performance SPAs.
John Doe,Certificate of Excellence,AI Engineering,2026-06-27,CERT-B-002,Dr. John Smith,For training transformer networks.
```
On upload, you can map headers dynamically. Click "Generate Bulk" to compile a ZIP of all certificates as A4 PDFs in seconds.

---

## 🔍 Verification Flow
Every certificate features a custom verification URL (`/verify/:id`). When scanned or visited, the application pulls verification records directly from the server database, certifying authenticity.
