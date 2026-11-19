# 🌿 KrishiRakshak AI (কৃষিরক্ষক এআই)
**Instant AI Crop Pathology & Verified Bilingual Agronomy Advisor**

> **International AI Builders Congress 2026** • Domain: **AgriSphere AI** • Challenge: **Crop Guardian**

KrishiRakshak AI is a field-ready, full-stack agricultural diagnostic and precision agronomy platform built specifically for Bangladeshi farmers and agricultural extension officers. Combining edge-speed Computer Vision (**MobileNetV2 ONNX**) with a **BARI/DAE-grounded RAG + Gemini 2.5 Flash** pipeline and an **open Model Context Protocol (MCP) Server**, it enables farmers to scan diseased leaves in seconds and receive safe, verified treatment protocols, voice guidance, and precision dosage calculations in both **Bangla (বাংলা)** and **English**.

### 🌐 Live Demo: [https://krishi-rakshak-ai-five.vercel.app/](https://krishi-rakshak-ai-five.vercel.app/)

---

## ✨ Key Features & Modules

### 1. 🔬 Optical Leaf Scanner (`/`) — Real-Time Diagnosis & Live Camera
- **Live Camera Modal & Drag-and-Drop (`getUserMedia` API):** Farmers can either upload photos from their gallery or launch an in-app live viewfinder modal with front/rear camera switching (`environment` / `user`) to capture infected leaves directly in the field across both mobile and desktop devices.
- **2-Layer Out-of-Distribution (OOD) Guardrail:** Prevents Softmax hallucination on non-leaf photos (portraits, animals, indoor objects, documents) using:
  1. **Fast HSV Plant-Pigment Pixel Filter (`sharp`):** Instantly verifies chlorophyll/foliage color ratios before running neural inference.
  2. **Gemini Multimodal Vision Gatekeeper:** Confirms the uploaded image actually depicts a crop leaf or agricultural plant.
- **Server-Side ONNX Inference (MobileNetV2):** Fine-tuned on 38 PlantVillage crop disease classes (**99.64% validation accuracy**), exported to ONNX and executed via `onnxruntime-node` with `sharp` 224×224 ImageNet normalization.
- **Confidence Guardrail (<70%) & Top-3 Chart:** Visualizes Top-3 disease probabilities via Recharts horizontal bar charts and triggers an automatic caution banner advising consultation with local agricultural officers whenever confidence drops below 70%.
- **Bilingual Advisory, Voice Readout & Print Prescription:** Synthesizes structured symptoms, organic remedies, safe chemical dosages, and preventive measures via **Gemini 2.5 Flash + Zod** (with automatic local BARI/DAE fallback), complete with **Web Speech API Bangla/English audio readout (Listen)**, one-click copy, session scan history, and print-friendly prescriptions.

### 2. 🧮 Precision Agronomy Calculators (`/tools`) — Preventing Chemical Overuse
- **Spray Tank Pesticide Dosage Calculator:** Computes exact total water volume and required pesticide quantity (grams/mL) based on recommended dosage per liter, tank capacity, and number of tanks—preventing crop burn, soil toxicity, and wasted expenditure.
- **BARI Balanced Fertilizer Estimator:** Calculates Bangladesh Agricultural Research Institute (BARI) recommended **Urea, TSP, and MOP** quantities tailored to crop type (Rice, Potato, Tomato, Maize, etc.) and local land units (**Decimal / শতাংশ, Bigha / বিঘা, Acre / একর**).

### 3. 📚 Verified BARI/DAE Knowledge Base & Demo Simulator (`/library`)
- **1-Click Sample Leaf Simulator:** Allows judges and first-time users without physical crop leaves on hand to load sample healthy and diseased leaves into the scanner with a single click.
- **Searchable Offline Agronomy Manual:** Provides instant keyword search across verified BARI and Department of Agricultural Extension (DAE) organic and chemical management protocols.

### 4. 🔌 Model Context Protocol (MCP) Server (`mcp-server/index.ts`)
- **Standalone Stdio MCP Server (`@modelcontextprotocol/sdk`):** Exposes KrishiRakshak AI's verified BARI/DAE agronomic dataset and dosage engine to external AI agents and IDEs (such as Claude Desktop and Cursor).
- **MCP Resource (`krishirakshak://bari-guidelines`):** Streams the complete structured JSON knowledge base across 38 crop disease classes.
- **MCP Tools:**
  - `get_crop_disease_protocol`: Retrieves verified BARI/DAE organic remedies, safe chemical dosages, and preventive guidelines by disease class or crop keyword.
  - `calculate_spray_dosage`: Computes exact pesticide/fungicide volume, total water liters, and 16L spray tank counts for land area in decimals (শতাংশ).

### 5. 📖 System Architecture Docs (`/docs`) & Universal Field Accessibility
- **High-Contrast Sunlight (Light) & Dark Emerald Modes:** Engineered with adaptive CSS custom properties so farmers can read results clearly under harsh outdoor sunlight as well as indoors, paired with a responsive two-row mobile navigation bar and instant **বাংলা / English** toggling.

---

## 🌍 Real-World Impact for Farmers

- **Prevents Yield Loss Early:** Enables instant on-field disease identification before infections spread across entire plots.
- **Eliminates Chemical Overuse & Cost Waste:** Precision spray-tank and land-unit fertilizer calculators protect soil health and save farmers money on excess inputs.
- **Bridges Literacy & Language Barriers:** Natural Bangla instructions paired with built-in audio readout (**Listen**) empower farmers with limited literacy to use the platform independently.

---

## 🏗️ System Architecture

```text
Live Camera Capture / File Upload / 1-Click Sample Leaf
       │
       ▼
Next.js API Route (/api/analyze)
  ├── 1. OOD Gatekeeper Layer 1: HSV Plant-Pigment Pixel Filter (sharp)
  ├── 2. OOD Gatekeeper Layer 2: Gemini Vision Leaf Verification
  ├── 3. Preprocessing (224×224 RGB + ImageNet Normalization)
  ├── 4. ONNX ML Inference (MobileNetV2 via onnxruntime-node → Top-3 Probs)
  ├── 5. RAG Retriever (data/bari_guidelines.json → BARI/DAE Protocols)
  └── 6. Gemini 2.5 Flash + Zod Validation (with Local RAG Fallback)
       │
       ▼
Interactive Bilingual Dashboard (Recharts + Bangla TTS + Print Prescription)

External AI Agents (Claude Desktop / Cursor IDE)
       │ (MCP stdio transport)
       ▼
BARI Agronomy MCP Server (mcp-server/index.ts)
  ├── Resource: krishirakshak://bari-guidelines
  └── Tools: get_crop_disease_protocol, calculate_spray_dosage
```

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 (Custom Adaptive Theme Variables), Lucide Icons, Recharts
- **Backend & ML Runtime:** Next.js API Routes, `onnxruntime-node`, `sharp`, Native Web `getUserMedia` & Speech Synthesis APIs
- **AI, RAG & MCP:** Google Generative AI SDK (`gemini-2.5-flash`), Model Context Protocol SDK (`@modelcontextprotocol/sdk`), Zod Schema Validation, BARI/DAE JSON Knowledge Base
- **Model Training (`/ml`):** PyTorch, Torchvision (MobileNetV2), ONNX Opset 14

---

## 🚀 Getting Started (Local Setup)

1. **Clone the Repository**
   ```bash
   git clone [https://github.com/mdshehabalrabby/krishirakshak-ai.git](https://github.com/mdshehabalrabby/krishirakshak-ai.git)
   cd krishirakshak-ai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. **Run the Web Application**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to use the scanner, or explore `/tools`, `/library`, and `/docs`.

5. **Run the BARI Agronomy MCP Server**
   ```bash
   npm run mcp:start
   ```

---

## 📁 Project Structure

```text
krishirakshak-ai/
├── app/
│   ├── api/analyze/route.ts        # 2-layer OOD guardrail + ONNX + RAG + Gemini pipeline
│   ├── components/
│   │   ├── Navbar.tsx              # Responsive 2-row mobile/desktop header + theme/lang toggles
│   │   ├── CameraModal.tsx         # Live getUserMedia viewfinder modal with front/rear flip
│   │   └── LeafScannerPanel.tsx    # Drag-and-drop scanner, live camera trigger & scan history
│   ├── tools/page.tsx              # Spray tank dosage & BARI fertilizer calculators
│   ├── library/page.tsx            # Searchable BARI/DAE manual & 1-click sample leaf simulator
│   ├── docs/page.tsx               # Live system architecture & methodology documentation
│   ├── lib/useKrishiStore.ts       # Persistent theme, language & session scan state
│   ├── globals.css                 # Tailwind CSS v4 + High-Contrast Light/Dark theme rules
│   └── page.tsx                    # Main bilingual diagnostic & Recharts dashboard
├── data/
│   └── bari_guidelines.json        # Verified BARI/DAE RAG knowledge base
├── mcp-server/
│   └── index.ts                    # Standalone Model Context Protocol (MCP) server
├── ml/                             # PyTorch MobileNetV2 training & ONNX export scripts
├── public/models/
│   ├── crop_disease_model.onnx     # Exported MobileNetV2 ONNX model
│   ├── crop_disease_model.onnx.data
│   └── labels.json                 # 38-class index-to-label mapping
└── next.config.ts                  # Server external packages config (onnxruntime-node, sharp)
```

---

## ⚠️ Agricultural Disclaimer

This tool is designed as an AI decision-support assistant. Always follow local Department of Agricultural Extension (DAE) guidelines and consult a local agricultural officer before applying chemical pesticides.