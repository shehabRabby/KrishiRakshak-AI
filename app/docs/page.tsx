"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Cpu, Database, ShieldCheck, Layers } from "lucide-react";
import { useKrishiLang } from "@/app/lib/useKrishiStore";

export default function DocsPage() {
  const { lang } = useKrishiLang();

  const cards = [
    {
      icon: Cpu,
      color: "text-emerald-400",
      title_en: "1. Computer Vision ML Pipeline",
      title_bn: "১. কম্পিউটার ভিশন ML পাইপলাইন",
      desc_en:
        "Fine-tuned MobileNetV2 trained on the PlantVillage Dataset (38 crop disease classes). Exported to ONNX (Opset 14) and executed server-side via onnxruntime-node with ImageNet normalization.",
      desc_bn:
        "PlantVillage ডাটাবেসের ৩৮টি ফসলের রোগের ক্লাসের ওপর ট্রেইনকৃত MobileNetV2 মডেল। ONNX ফরম্যাটে রূপান্তর করে সার্ভার-সাইডে onnxruntime-node দিয়ে দ্রুত ইনফারেন্স চালানো হয়।",
    },
    {
      icon: Database,
      color: "text-teal-400",
      title_en: "2. Agronomy RAG & Gemini 2.5",
      title_bn: "২. কৃষি RAG এবং Gemini 2.5 ইঞ্জিন",
      desc_en:
        "Predicted disease classes retrieve verified treatment protocols from BARI & DAE manuals, synthesized by Gemini 2.5 Flash into Zod-validated Bangla & English advisory cards.",
      desc_bn:
        "শনাক্তকৃত রোগের ওপর ভিত্তি করে BARI ও DAE-এর অনুমোদিত ম্যানুয়াল থেকে তথ্য সংগ্রহ করা হয় এবং Gemini 2.5 Flash-এর মাধ্যমে বাংলা ও ইংরেজিতে নির্ভুল পরামর্শ তৈরি হয়।",
    },
    {
      icon: ShieldCheck,
      color: "text-amber-400",
      title_en: "3. Guardrails & Responsible AI",
      title_bn: "৩. সেফটি গার্ডরেইল ও দায়িত্বশীল AI",
      desc_en:
        "Predictions below 70% confidence trigger an automatic guardrail advising farmers to consult local agricultural officers. Dosage limits strictly follow BARI guidelines.",
      desc_bn:
        "মডেলের নিশ্চিততার হার ৭০%-এর নিচে হলে স্বয়ংক্রিয় সতর্কতা দেখানো হয় এবং নিকটস্থ কৃষি কর্মকর্তার পরামর্শ নিতে বলা হয়। ওষুধের মাত্রা কঠোরভাবে BARI নির্দেশিকা অনুসরণ করে।",
    },
    {
      icon: Layers,
      color: "text-sky-400",
      title_en: "4. Full-Stack Architecture",
      title_bn: "৪. ফুল-স্ট্যাক আর্কিটেকচার",
      desc_en:
        "Built with Next.js App Router, TypeScript, Tailwind CSS, Sharp image processing, Recharts visualization, Web Speech API audio, and deployed on Vercel.",
      desc_bn:
        "Next.js App Router, TypeScript, Tailwind CSS, Sharp ইমেজ প্রসেসিং, Recharts ভিজ্যুয়ালাইজেশন এবং Web Speech API অডিও সুবিধা দিয়ে নির্মিত ও Vercel-এ ডিপ্লয়কৃত।",
    },
  ];

  return (
    <main className="animate-fade-in mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-800/80 bg-emerald-950/60 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 transition hover:border-emerald-500"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>{lang === "bn" ? "AI স্ক্যানারে ফিরে যান" : "Back to AI Scanner"}</span>
      </Link>

      <div className="mt-5">
        <h1 className="bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-3xl font-extrabold text-transparent">
          {lang === "bn"
            ? "KrishiRakshak AI — টেকনিক্যাল আর্কিটেকচার ও ডকুমেন্টেশন"
            : "KrishiRakshak AI — Technical Architecture & System Docs"}
        </h1>
        <p className="mt-2 text-sm text-emerald-200/75">
          {lang === "bn"
            ? "আন্তর্জাতিক AI বিল্ডার্স কংগ্রেস ২০২৬ • ডোমেইন: AgriSphere AI • চ্যালেঞ্জ: Crop Guardian"
            : "International AI Builders Congress 2026 • Domain: AgriSphere AI • Challenge: Crop Guardian"}
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-emerald-800/70 bg-gradient-to-b from-emerald-900/25 to-emerald-950/60 p-6 shadow-lg transition hover:border-emerald-600/70"
            >
              <div className="inline-flex rounded-xl bg-[#020f0b] p-2.5 ring-1 ring-emerald-800/60">
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <h2 className="mt-4 text-lg font-bold text-white">
                {lang === "bn" ? card.title_bn : card.title_en}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {lang === "bn" ? card.desc_bn : card.desc_en}
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
}