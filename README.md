# 🌿 KrishiRakshak AI (কৃষিরক্ষক এআই)
**Instant AI Crop Disease Diagnosis & Bilingual Agronomy Advisor**

> **International AI Builders Congress 2026** • Domain: **AgriSphere AI** • Challenge: **Crop Guardian**

KrishiRakshak AI is a full-stack agentic agricultural diagnostic platform built to help Bangladeshi farmers and extension workers detect crop diseases from leaf photos in seconds and receive safe, verified treatment plans in both **Bangla (বাংলা)** and **English**.

## live Link : https://krishi-rakshak-ai-five.vercel.app/

---

## ✨ Key Features

- **🔬 Server-Side Computer Vision (MobileNetV2 + ONNX):** Fine-tuned MobileNetV2 model trained on the PlantVillage dataset (38 crop disease classes, **99.64% validation accuracy**), exported to ONNX and executed via `onnxruntime-node` with `sharp` image preprocessing.
- **📚 Verified BARI & DAE RAG Pipeline:** Maps predicted disease classes against a localized knowledge base (`data/bari_guidelines.json`) derived from Bangladesh Agricultural Research Institute (BARI) and Department of Agricultural Extension (DAE) protocols.
- **🤖 Bilingual Advisory Synthesis (Gemini 2.5 Flash + Zod):** Generates structured, farmer-friendly Bangla and English diagnoses, organic remedies, safe chemical dosages, and preventive tips strictly validated via Zod schemas.
- **📊 Interactive Confidence Visualization:** Displays Top-3 ML prediction probabilities using Recharts horizontal bar charts.
- **🛡️ Responsible AI Guardrails:** Automatically triggers a caution banner when model confidence drops below 70%, advising farmers to consult local agricultural officers.
- **📖 Built-in Live Documentation (`/docs`):** Includes an integrated system architecture and pipeline documentation module.

---

## 🏗️ System Architecture

```text
Leaf Photo Upload (Client UI)
       │
       ▼
Next.js API Route (/api/diagnose)
  ├── 1. Image Preprocessing (Sharp: 224x224 RGB + ImageNet Normalization)
  ├── 2. ONNX ML Inference (MobileNetV2 via onnxruntime-node → Top-3 Probs)
  ├── 3. RAG Retriever (data/bari_guidelines.json → BARI/DAE Protocols)
  └── 4. Gemini 2.5 Flash + Zod Validation → Bilingual JSON Advisory
       │
       ▼
Interactive Results Dashboard (Recharts + BN/EN Toggle)
```

🛠️ Tech Stack
Frontend: Next.js 16 (App Router), React, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts
Backend & ML Runtime: Next.js API Routes, onnxruntime-node, sharp
AI & Validation: Google Generative AI SDK (gemini-2.5-flash), Zod
Model Training (/ml): PyTorch, Torchvision (MobileNetV2), ONNX Opset 14

🚀 Getting Started (Local Setup)
1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/krishirakshak-ai.git
cd krishirakshak-ai
```

2. Install Dependencies
```bash
npm install
```

3. Configure Environment Variables
Create a `.env.local` file in the root directory and add your Gemini API key:

```plaintext
GEMINI_API_KEY=your_google_gemini_api_key_here
```

4. Run the Development Server
```bash
npm run dev
```

Open http://localhost:3000 in your browser to use the app, or visit http://localhost:3000/docs for technical documentation.

📁 Project Structure
```
krishirakshak-ai/
├── app/
│   ├── api/diagnose/route.ts   # 3-step ML + RAG + Gemini inference pipeline
│   ├── docs/page.tsx           # Live technical documentation module
│   ├── globals.css             # Tailwind CSS v4 entry
│   └── page.tsx                # Main bilingual UI & Recharts dashboard
├── data/
│   └── bari_guidelines.json    # Verified BARI/DAE RAG knowledge base
├── ml/                         # Model training scripts & evaluation artifacts
├── public/models/
│   ├── crop_disease_model.onnx # Exported MobileNetV2 ONNX model
│   ├── crop_disease_model.onnx.data
│   └── labels.json             # 38-class index-to-label mapping
└── next.config.ts              # External server packages config (onnxruntime-node, sharp)
```

⚠️ Agricultural Disclaimer
This tool is designed as an AI decision-support assistant. Always follow local Department of Agricultural Extension (DAE) guidelines and consult an agricultural officer before applying chemical pesticides.