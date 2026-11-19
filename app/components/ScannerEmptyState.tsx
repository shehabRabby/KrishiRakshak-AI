"use client";

import React from "react";
import Link from "next/link";
import { Leaf, Cpu, Database, ShieldCheck, Sparkles } from "lucide-react";

export default function ScannerEmptyState({ lang }: { lang: "bn" | "en" }) {
  return (
    <div className="animate-fade-in flex h-full min-h-[370px] flex-col items-center justify-center rounded-2xl border border-emerald-800/50 bg-gradient-to-b from-emerald-900/15 to-emerald-950/40 p-8 text-center">
      <div className="rounded-2xl bg-emerald-500/10 p-3.5 text-emerald-400 ring-1 ring-emerald-500/20">
        <Leaf className="h-9 w-9" />
      </div>
      <h3 className="mt-4 text-base font-bold text-white">
        {lang === "bn" ? "ডায়াগনস্টিক রিপোর্ট প্রস্তুত" : "Ready for AI Leaf Pathology"}
      </h3>
      <p className="mt-1.5 max-w-md text-xs text-emerald-200/70 sm:text-sm">
        {lang === "bn"
          ? "বাম পাশ থেকে পাতার ছবি আপলোড করলে এখানে রোগের নিশ্চিততার হার এবং BARI/DAE অনুমোদিত চিকিৎসা দেখা যাবে।"
          : "Upload a crop leaf image on the left to generate ML confidence scores and BARI/DAE treatment steps."}
      </p>

      <div className="mt-6 grid w-full max-w-lg grid-cols-1 gap-3 text-left sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-800/50 bg-[#020f0b]/70 p-3.5 transition hover:border-emerald-600/60">
          <Cpu className="h-4 w-4 text-emerald-400" />
          <p className="mt-2 text-xs font-bold text-white">
            {lang === "bn" ? "১. ভিশন মডেল" : "1. Vision Model"}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {lang === "bn" ? "MobileNetV2 দিয়ে ৩৮টি রোগ শনাক্ত" : "MobileNetV2 ONNX 38-class scan"}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-800/50 bg-[#020f0b]/70 p-3.5 transition hover:border-teal-600/60">
          <Database className="h-4 w-4 text-teal-400" />
          <p className="mt-2 text-xs font-bold text-white">
            {lang === "bn" ? "২. BARI/DAE RAG" : "2. BARI/DAE RAG"}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {lang === "bn" ? "অনুমোদিত কৃষি গাইডলাইন যাচাই" : "Verified agronomy protocol lookup"}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-800/50 bg-[#020f0b]/70 p-3.5 transition hover:border-amber-600/60">
          <ShieldCheck className="h-4 w-4 text-amber-400" />
          <p className="mt-2 text-xs font-bold text-white">
            {lang === "bn" ? "৩. নিরাপদ পরামর্শ" : "3. Safe Advisory"}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {lang === "bn" ? "অডিও ও প্রিন্ট সুবিধা সহ প্রেসক্রিপশন" : "Audio & printable prescription"}
          </p>
        </div>
      </div>

      <Link
        href="/library"
        className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-emerald-700/70 bg-emerald-950/80 px-4 py-1.5 text-xs font-medium text-emerald-300 transition hover:border-emerald-400 hover:text-white"
      >
        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
        <span>
          {lang === "bn"
            ? "ছবি নেই? লাইব্রেরি থেকে ১-ক্লিক ডেমো পাতা টেস্ট করুন →"
            : "No leaf photo? Try 1-click demo samples in Library →"}
        </span>
      </Link>
    </div>
  );
}