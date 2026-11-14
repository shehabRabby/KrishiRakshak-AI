import Link from "next/link";
import { ArrowLeft, Cpu, Database, ShieldCheck, Layers } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-emerald-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to KrishiRakshak AI App
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-white">
          KrishiRakshak AI — Technical Architecture & System Docs
        </h1>
        <p className="mt-2 text-emerald-200/80">
          International AI Builders Congress 2026 • Domain: AgriSphere AI •
          Challenge: Crop Guardian
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-800 bg-emerald-900/30 p-5">
            <Cpu className="h-6 w-6 text-emerald-400" />
            <h2 className="mt-3 text-lg font-semibold text-white">
              1. Computer Vision ML Pipeline
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Fine-tuned MobileNetV2 trained on the Kaggle PlantVillage Dataset
              (38 crop disease classes). Exported to ONNX (Opset 14) and
              executed server-side via <code>onnxruntime-node</code> with
              ImageNet normalization.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-800 bg-emerald-900/30 p-5">
            <Database className="h-6 w-6 text-emerald-400" />
            <h2 className="mt-3 text-lg font-semibold text-white">
              2. Agronomy RAG & Gemini 2.5
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Predicted disease classes retrieve verified treatment protocols
              from BARI & DAE manuals, synthesized by Gemini 2.5 Flash into
              Zod-validated Bangla & English advisory cards.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-800 bg-emerald-900/30 p-5">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <h2 className="mt-3 text-lg font-semibold text-white">
              3. Guardrails & Responsible AI
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Predictions below 70% confidence trigger an automatic guardrail
              advising farmers to consult local agricultural officers. Dosage
              limits strictly follow BARI guidelines.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-800 bg-emerald-900/30 p-5">
            <Layers className="h-6 w-6 text-emerald-400" />
            <h2 className="mt-3 text-lg font-semibold text-white">
              4. Full-Stack Architecture
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Built with Next.js App Router, TypeScript, Tailwind CSS, Sharp
              image processing, Recharts visualization, and deployed on Vercel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
