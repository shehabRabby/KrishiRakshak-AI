"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  Search,
  FlaskConical,
  Sprout,
  Droplets,
  Globe,
  BookOpen,
} from "lucide-react";
import guidelines from "@/data/bari_guidelines.json";

export default function AgronomyToolsPage() {
  const lang = useSyncExternalStore(
    (cb) => {
      window.addEventListener("storage", cb);
      return () => window.removeEventListener("storage", cb);
    },
    () => (localStorage.getItem("krishirakshak_lang") === "en" ? "en" : "bn"),
    () => "bn"
  );

  const [tankSizeLiters, setTankSizeLiters] = useState<number>(16);
  const [tankCount, setTankCount] = useState<number>(2);
  const [dosagePerLiter, setDosagePerLiter] = useState<number>(2);
  const [unitType, setUnitType] = useState<"gm" | "ml">("gm");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const toggleLang = () => {
    const next = lang === "bn" ? "en" : "bn";
    localStorage.setItem("krishirakshak_lang", next);
    window.dispatchEvent(new Event("storage"));
  };

  const totalWater = tankSizeLiters * tankCount;
  const totalChemical = (totalWater * dosagePerLiter).toFixed(1);

  const filteredGuidelines = guidelines.filter(
    (g) =>
      g.crop_bn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.crop_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.disease_bn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.disease_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#031510] text-slate-100">
      <header className="sticky top-0 z-30 border-b border-emerald-800/40 bg-[#031510]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-800 bg-emerald-950/70 px-3.5 py-2 text-xs font-semibold text-emerald-300 transition hover:border-emerald-600"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{lang === "bn" ? "স্ক্যানারে ফিরে যান" : "Back to AI Scanner"}</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link
              href="/docs"
              className="flex items-center gap-1.5 rounded-xl border border-emerald-800/80 bg-emerald-950/60 px-3.5 py-2 text-xs font-medium text-emerald-200 hover:border-emerald-600"
            >
              <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
              <span>/docs</span>
            </Link>
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-emerald-950 hover:bg-emerald-400"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{lang === "bn" ? "English" : "বাংলা"}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white">
            {lang === "bn"
              ? "স্মার্ট কৃষি ক্যালকুলেটর ও BARI গাইডলাইন লাইব্রেরি"
              : "Smart Agronomy Dosage Calculator & BARI Knowledge Explorer"}
          </h1>
          <p className="mt-2 text-sm text-emerald-200/75">
            {lang === "bn"
              ? "স্প্রে মেশিনের ট্যাংক অনুযায়ী সঠিক বালাইনাশক ও পানির পরিমাণ হিসাব করুন এবং অনুমোদিত চিকিৎসা খুঁজুন।"
              : "Calculate exact pesticide-to-water ratios for field sprayers and browse verified BARI/DAE protocols."}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left: Pesticide Spray Tank Calculator */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-emerald-800/80 bg-gradient-to-b from-emerald-900/40 to-emerald-950/70 p-6 shadow-xl">
              <div className="flex items-center gap-2.5 text-emerald-300">
                <Calculator className="h-5 w-5" />
                <h2 className="text-lg font-bold text-white">
                  {lang === "bn" ? "বালাইনাশক ডোজ ক্যালকুলেটর" : "Spray Tank Dosage Calculator"}
                </h2>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-emerald-200">
                    {lang === "bn"
                      ? "প্রতি লিটার পানিতে ওষুধের মাত্রা (গাইডলাইন অনুযায়ী)"
                      : "Recommended Dose per Liter of Water"}
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      value={dosagePerLiter}
                      onChange={(e) => setDosagePerLiter(Number(e.target.value) || 0)}
                      className="w-full rounded-xl border border-emerald-700 bg-[#020f0b] px-3.5 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                    />
                    <select
                      value={unitType}
                      onChange={(e) => setUnitType(e.target.value as "gm" | "ml")}
                      className="rounded-xl border border-emerald-700 bg-[#020f0b] px-3 py-2.5 text-sm text-emerald-300"
                    >
                      <option value="gm">{lang === "bn" ? "গ্রাম (gm)" : "Gram (gm)"}</option>
                      <option value="ml">{lang === "bn" ? "মিলি (ml)" : "Milliliter (ml)"}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-200">
                      {lang === "bn" ? "ট্যাংকের ধারণক্ষমতা (লিটার)" : "Tank Capacity (Liters)"}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={tankSizeLiters}
                      onChange={(e) => setTankSizeLiters(Number(e.target.value) || 0)}
                      className="mt-1.5 w-full rounded-xl border border-emerald-700 bg-[#020f0b] px-3.5 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-200">
                      {lang === "bn" ? "মোট স্প্রে ট্যাংক সংখ্যা" : "Number of Tanks"}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={tankCount}
                      onChange={(e) => setTankCount(Number(e.target.value) || 0)}
                      className="mt-1.5 w-full rounded-xl border border-emerald-700 bg-[#020f0b] px-3.5 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    {lang === "bn" ? "সর্বমোট প্রয়োজনীয় মিশ্রণ" : "Total Required Mixture"}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-[#020f0b]/80 p-3">
                      <div className="flex items-center gap-1.5 text-xs text-sky-300">
                        <Droplets className="h-4 w-4" />
                        <span>{lang === "bn" ? "মোট পানি" : "Total Water"}</span>
                      </div>
                      <p className="mt-1 text-xl font-extrabold text-white">
                        {totalWater} {lang === "bn" ? "লিটার" : "L"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-[#020f0b]/80 p-3">
                      <div className="flex items-center gap-1.5 text-xs text-amber-300">
                        <FlaskConical className="h-4 w-4" />
                        <span>{lang === "bn" ? "মোট বালাইনাশক" : "Total Chemical"}</span>
                      </div>
                      <p className="mt-1 text-xl font-extrabold text-amber-300">
                        {totalChemical} {unitType}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: BARI/DAE Verified Knowledge Explorer */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-emerald-800/80 bg-gradient-to-b from-emerald-900/30 to-emerald-950/60 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-white">
                  {lang === "bn"
                    ? "BARI/DAE অনুমোদিত রোগ ও প্রতিকার ভান্ডার"
                    : "BARI/DAE Verified RAG Knowledge Base"}
                </h2>
                <div className="relative w-full sm:w-64">
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

              <div className="mt-5 space-y-3">
                {filteredGuidelines.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-emerald-800/60 bg-[#020f0b]/70 p-4 transition hover:border-emerald-600/70"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-md bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                        {lang === "bn" ? item.crop_bn : item.crop_en}
                      </span>
                      <span className="text-[11px] text-emerald-400/70">{item.guideline_source}</span>
                    </div>
                    <h3 className="mt-1.5 text-base font-bold text-white">
                      {lang === "bn" ? item.disease_bn : item.disease_en}
                    </h3>
                    <div className="mt-2.5 space-y-1.5 text-xs text-slate-300">
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}