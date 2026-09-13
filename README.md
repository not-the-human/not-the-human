# ⚡️ NOT THE HUMAN // NFC AI KIT

A premium, cyberpunk-themed NFC utility dashboard built with **Next.js (App Router)**, **Tailwind CSS**, and **Framer Motion**. It blends a dark terminal/hacker aesthetic with the fluid shared-element gallery interactions popularized by the Next.js Conf site and a Spotify-style sidebar dashboard layout.

This project transforms ordinary, cheap physical NFC tags (NTAG213/215) into hardware-bound "AI Agent Nodes" or tactical web triggers with zero friction.

---

### 🖨️ Physical Assets & Print Sheets
- **Asset Hub:** [Digital Soul Cloudinary Collection](https://collection.cloudinary.com/xs3nq3zj/5ae1bd7cdf95b134cd6a2311787c0e77)
- **License:** **Free for personal use** (non-commercial).
- **Specs:** 300 DPI transparent PNGs, aligned for A3 print sheets and standard 25mm–30mm NTAG213/NTAG215 adhesive tags.

## 🚀 Key Features

- **Spotify-Style Dashboard Layout:** Sticky sidebar (desktop) and reactive bottom navigation (mobile) for instant tag kit filtering: *AI Portals, Utility Hooks, Media/Pranks, and All Kits*.
- **Next.js Conf-Style Animated Gallery:** Interactive sticker cards utilize Framer Motion `layoutId` shared-element transitions, expanding smoothly into deep metadata views without a single jarring browser reload.
- **WebNFC Single-Tap Tag Programmer:** Features an integrated browser-native `[ INITIALIZE DIGITAL SOUL ]` button using the Chromium `NDEFReader` / `NDEFWriter` API to link physical chips to the grid instantly over secure environments.
- **Live Network Scanner (Tavily Recon Node):** Features a specialized `network_scanner` runtime model. When initialized, the application leverages Tavily Core to scrape online telemetry and injects the live context into NVIDIA NIM for on-the-fly terminal intelligence.
- **Dual-Engine AI Marketplace Routing:** A serverless API route (`/api/chat`) proxies complex context payloads natively to either **NVIDIA Inference Microservices (NIM)** running optimized *Llama 3* or **Nebius AI Studio** cluster arrays, toggled dynamically from the UI.
- **DatoCMS CLI Jamstack Sync:** Equipped with modular GraphQL POST query hooks (`lib/datocms.js`) to dynamically render active models, featuring an offline structured fallback mock dataset (`data/mockStickers.js`) for seamless standalone execution.
- **Cloudinary Asset Delivery:** Pre-configured to request and enforce direct-download links for production-ready high-resolution custom print media wrappers (PDF/PNG).

---

## 📁 Project Structure

```text
not-the-human/
├── app/
│   ├── layout.js            # Global layout wrappers, retro scanline overlays, viewport & typography
│   ├── globals.css          # Core CSS custom layers & neon terminal primitives
│   ├── page.js              # Server Component orchestration: DatoCMS hydrator & main layout
│   └── api/
│       └── chat/route.js    # NVIDIA NIM + Nebius router proxy with live Tavily pipelines
├── components/
│   ├── Header.js            # Top-level UI telemetry banner
│   ├── Sidebar.js           # Spotify-inspired filter controller
│   ├── StickerGrid.js       # Framer Motion animated responsive layout container
│   ├── StickerCard.js       # Shared element transition anchor
│   ├── StickerModal.js      # Expanded asset detail controller with WebNFC callouts
│   ├── NfcWriteButton.js    # WebNFC NDEF writer hook implementation
│   └── IntegrationsMarketplace.js # Interactive terminal debugger (Chat / Translate / Scanner)
├── lib/
│   ├── datocms.js           # Lightweight GraphQL client wrapper
│   ├── cloudinary.js        # Dynamic remote asset delivery path handlers
│   └── webnfc.js            # Client hardware capability detectors & NDEF schemas
├── data/
│   └── mockStickers.js      # Zero-config local offline catalog configuration with Network Scanner
├── migrations/
│   └── 01_create_sticker_model.js # DatoCMS Content Management API automated schema script
├── datocms.config.json      # DatoCMS schema profile tracking blueprint
└── .env.example             # Global environment configuration placeholders
```

## 🚀 One-Click Deploy

The fastest way to get your own instance of this project up and running is by clicking the button below. Vercel will automatically clone the repository, deploy the site, and guide you through setting up a mirrored template on your DatoCMS account:

[![Deploy with Vercel](https://vercel.com)](https://vercel.com)

### 🔑 Required API Keys
During the Vercel deployment process, the system will prompt you to enter your personal API keys for the AI and media modules. You can grab them here (most offer free tiers or starting credits):

* **NVIDIA_NIM_KEY** – Create an account on [NVIDIA Build](https://nvidia.com) and generate your `nvapi-...` key.
* **NEBIUS_API_KEY** – Sign up at [Nebius AI Studio](https://nebius.com) and create an API token in your settings.
* **TAVILY_API_KEY** – Register at [Tavily AI](https://tavily.com) to get your key for the Live Network Scanner functionality.
* **Cloudinary Keys** – Sign up for a free account on [Cloudinary](https://cloudinary.com). Copy the **Cloud Name**, **API Key**, and **API Secret** from your main dashboard and paste them into the corresponding Vercel environment variables (`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).

*Note: You do not need to manually generate a DatoCMS API key (`DATOCMS_TOKEN`). The Vercel and DatoCMS integration will automatically create and link it behind the scenes during deployment.*


---

## 🛠️ Getting Started & Local Installation

### 1. Clone the repository and install dependencies
```bash
npm install
```

### 2. Configure Environment Secrets
Copy the template structure and fill in your unique development keys:
```bash
cp .env.example .env.local
```

Open `.env.local` and configure your preferences:
```text
NVIDIA_NIM_KEY=nvapi-your-nvidia-nim-token
NEBIUS_API_KEY=your-nebius-ai-studio-token
TAVILY_API_KEY=tvly-your-tavily-search-token
DATOCMS_TOKEN=your-datocms-read-only-delivery-token
```
*Note: The app runs out of the box using the bundled mock sticker data (`data/mockStickers.js`) if DatoCMS variables are not set, so you can preview the UI immediately.*

### 3. Deploy Content Models to DatoCMS automatically
Instead of clicking around the web UI, deploy the complete, pre-configured database schema directly from your terminal using the DatoCMS CLI migration engine:
```bash
npx datocms migrations:run --api-token="YOUR_DATOCMS_MANAGEMENT_TOKEN" --fast-fork --destination="dev-migration-v2" --force
```
*This command creates an isolated secure sandbox branch, auto-injects the data types (Sticker metadata fields, color palettes, and asset nodes), and promotes it instantly.*

### 4. Fire up the development engine
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your browser.

---

## 🐳 Core Workflows: Self-Hosting a 100% Local AI Backend

If your team requires zero data leakage and enterprise-grade privacy, you can bypass cloud gateways and run the **NVIDIA NIM** pipeline locally on an open-source architecture using Docker and your workstation's RTX hardware.

### 1. Pull and instantiate the local NIM Container
Ensure [Docker Desktop](https://docker.com) and the **NVIDIA Container Toolkit** are installed on your Linux instance, then spin up the optimized Llama 3 instance:
```bash
# Authenticate onto the NVIDIA container registry
docker login nvcr.io

# Execute the isolated local runtime microservice
docker run -d --gpus all \
  -e NGC_API_KEY=YOUR_NVIDIA_NGC_KEY \
  -v ~/local_cache:/opt/nim/.cache \
  -p 8000:8000 \
  nvcr.io/nim/meta/llama3-8b-instruct:latest
```

### 2. Point your app endpoint to your GPU
Open `app/api/chat/route.js` and alter your registry destination to consume your local computing resource instead of the cloud gateway:
```javascript
// Change from cloud endpoint to your local hardware port:
baseUrl: "http://localhost:8000/v1"
```
The client stack and hardware stickers will now interface directly with your graphics hardware locally with maximum privacy.

---

## 📱 Hardware & Client WebNFC Support

The browser-level native WebNFC interface (`NDEFReader` / `NDEFWriter`) executes globally without requiring dedicated application wrappers. 

- **Compatibility:** Currently natively supported inside Chromium-based modern browsers (Chrome, Edge, Opera) running on Android over a secure connection (`HTTPS` or `localhost`).
- **Graceful Degradation:** On devices or browsers lacking direct chip-interfacing capabilities, the application seamlessly adapts, prompting user feedback via a reactive notification badge without blocking the AI Integrations Marketplace debugging panel.

---

## 📡 AI API Payload Structure

`POST /api/chat` accepts:

```json
{
  "backend": "nvidia" | "nebius",
  "mode": "chat" | "translate",
  "uloga": "default" | "network_scanner",
  "messages": [{ "role": "user", "content": "Your query text here" }],
  "targetLanguage": "es"
}
```

The `backend` field defaults to `NEXT_PUBLIC_DEFAULT_AI_BACKEND` and lets the Integrations Marketplace UI toggle between NVIDIA NIM and Nebius without any client-side code changes.

## ⚖️ Intellectual Property & Licensing

- **Software & Source Code:** The underlying frontend dashboard, API routes, and automation scripts contained within this repository are open-source and distributed under the **MIT License**. You are free to modify, fork, and self-host the code.
- **Artwork & Sticker Designs:** All visual assets, graphic wrappers, logos, and print media templates hosted on Cloudinary or generated under the **"Not The Human"** brand are the exclusive **Intellectual Property (IP)** of the project author. 
  - *Permitted Use:* You are granted a personal license to download and print the stickers for individual, non-commercial use.
  - *Prohibited Use:* Commercial redistribution, reselling of printed tags using these designs, or rebranding the artwork under a different commercial entity is strictly prohibited without explicit written consent.


## 📄 License
This project is open-source under the MIT License guidelines. Build, expand, hack responsibly.

