"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FlaskConical,
  Sprout,
  Sparkles,
  Play,
} from "lucide-react";
import guidelines from "@/data/bari_guidelines.json";
import { useKrishiLang, useKrishiSession, updateSession } from "@/app/lib/useKrishiStore";

const DEMO_SAMPLES = [
  {
    id: "blight",
    title_bn: "টমেটো/আলুর নাবি ধসা পাতা (Demo)",
    title_en: "Potato/Tomato Late Blight Leaf (Demo)",
    crop_bn: "আলু / টমেটো",
    crop_en: "Potato / Tomato",
    bg: "#2d4a22",
    spotColor: "#4a2c18",
  },
  {
    id: "rust",
    title_bn: "ভুট্টার পাতার মরিচা রোগ (Demo)",
    title_en: "Corn Common Rust Leaf (Demo)",
    crop_bn: "ভুট্টা",
    crop_en: "Corn (Maize)",
    bg: "#3b5e2b",
    spotColor: "#b85d19",
  },
  {
    id: "healthy",
    title_bn: "সুস্থ সবুজ ফসলের পাতা (Demo)",
    title_en: "Healthy Green Crop Leaf (Demo)",
    crop_bn: "সুস্থ ফসল",
    crop_en: "Healthy Crop",
    bg: "#1e6b34",
    spotColor: "#288542",
  },
];

function generateSyntheticLeafDataUrl(bg: string, spotColor: string): string {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.fillStyle = "#122418";
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.ellipse(128, 128, 65, 105, Math.PI / 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#8bc34a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(90, 215);
  ctx.lineTo(165, 42);
  ctx.stroke();

  ctx.fillStyle = spotColor;
  for (let i = 0; i < 14; i++) {
    const x = 95 + ((i * 29) % 70);
    const y = 65 + ((i * 43) % 125);
    ctx.beginPath();
    ctx.arc(x, y, 5 + (i % 5), 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas.toDataURL("image/jpeg", 0.9);
}

export default function KnowledgeLibraryPage() {
  const router = useRouter();
  const { lang } = useKrishiLang();
  const session = useKrishiSession();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLoadDemoLeaf = (bg: string, spotColor: string) => {
    const dataUrl = generateSyntheticLeafDataUrl(bg, spotColor);
    updateSession({
      previewUrl: dataUrl,
      result: null,
      history: session.history,
    });
    router.push("/");
  };

  const filteredGuidelines = guidelines.filter(
    (g) =>
      g.crop_bn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.crop_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.disease_bn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.disease_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="animate-fade-in mx-auto max-w-6xl px-4 py-8">
      {/* Instant Demo Sample Leaves Section */}
      <section className="mb-10 rounded-2xl border border-emerald-700/60 bg-gradient-to-r from-emerald-900/30 to-teal-950/40 p-6 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>
            {lang === "bn"
              ? "জাজ ও ভিজিটরদের জন্য ইনস্ট্যান্ট ডেমো পাতা"
              : "Instant Demo Sample Leaves (1-Click Test)"}
          </span>
        </div>
        <p className="mt-1 text-xs text-emerald-200/75">
          {lang === "bn"
            ? "হাতের কাছে পাতার ছবি না থাকলে নিচের যেকোনো স্যাম্পল পাতা সিলেক্ট করে সরাসরি AI স্ক্যানারে পরীক্ষা করুন।"
            : "Don't have a leaf photo handy? Load a sample specimen directly into the AI Scanner."}
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {DEMO_SAMPLES.map((sample) => (
            <div
              key={sample.id}
              className="flex items-center justify-between rounded-xl border border-emerald-800/70 bg-[#020f0b]/80 p-3.5 transition hover:border-emerald-500/60"
            >
              <div>
                <span className="text-[11px] font-semibold text-emerald-400">
                  {lang === "bn" ? sample.crop_bn : sample.crop_en}
                </span>
                <p className="mt-0.5 text-xs font-bold text-white">
                  {lang === "bn" ? sample.title_bn : sample.title_en}
                </p>
              </div>
              <button
                onClick={() => handleLoadDemoLeaf(sample.bg, sample.spotColor)}
                className="flex shrink-0 items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-emerald-950 transition hover:bg-emerald-400 active:scale-95"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>{lang === "bn" ? "টেস্ট" : "Load"}</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* BARI/DAE Verified Knowledge Explorer */}
      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
              {lang === "bn"
                ? "BARI/DAE অনুমোদিত রোগ ও প্রতিকার লাইব্রেরি"
                : "BARI/DAE Verified RAG Knowledge Base"}
            </h1>
            <p className="mt-1 text-xs text-emerald-200/70">
              {lang === "bn"
                ? "বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট (BARI) ও কৃষি সম্প্রসারণ অধিদপ্তর (DAE) নির্দেশিকা"
                : "Grounded protocols from Bangladesh Agricultural Research Institute (BARI) & DAE"}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-emerald-400" />
            <input
              type="text"
              placeholder={lang === "bn" ? "ফসল বা রোগ খুঁজুন..." : "Search crop or disease..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-emerald-700 bg-[#020f0b] py-2 pl-9 pr-3 text-xs text-white placeholder-emerald-400/50 focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredGuidelines.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-emerald-800/60 bg-gradient-to-b from-emerald-900/20 to-emerald-950/60 p-5 transition hover:border-emerald-600/70"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-md bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                  {lang === "bn" ? item.crop_bn : item.crop_en}
                </span>
                <span className="text-[11px] text-emerald-400/70">{item.guideline_source}</span>
              </div>
              <h3 className="mt-2 text-base font-bold text-white">
                {lang === "bn" ? item.disease_bn : item.disease_en}
              </h3>
              <div className="mt-3 space-y-2 text-xs text-slate-300">
                <p className="flex items-start gap-2">
                  <Sprout className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <span>
                    <strong className="text-emerald-300">
                      {lang === "bn" ? "জৈব: " : "Organic: "}
                    </strong>
                    {lang === "bn" ? item.organic_remedy_bn : item.organic_remedy_en}
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <FlaskConical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                  <span>
                    <strong className="text-amber-300">
                      {lang === "bn" ? "রাসায়নিক: " : "Chemical: "}
                    </strong>
                    {lang === "bn" ? item.chemical_dosage_bn : item.chemical_dosage_en}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}