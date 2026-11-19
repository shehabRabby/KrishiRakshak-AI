"use client";

import React, { useState } from "react";
import {
  Calculator,
  FlaskConical,
  Droplets,
  Sprout,
} from "lucide-react";
import { useKrishiLang } from "@/app/lib/useKrishiStore";

const FERTILIZER_RATES_PER_DECIMAL: Record<
  string,
  { name_bn: string; name_en: string; urea_gm: number; tsp_gm: number; mop_gm: number }
> = {
  potato: { name_bn: "আলু (Potato)", name_en: "Potato", urea_gm: 1300, tsp_gm: 900, mop_gm: 1100 },
  tomato: { name_bn: "টমেটো (Tomato)", name_en: "Tomato", urea_gm: 1500, tsp_gm: 1200, mop_gm: 1000 },
  corn: { name_bn: "ভুট্টা (Corn/Maize)", name_en: "Corn / Maize", urea_gm: 1600, tsp_gm: 850, mop_gm: 750 },
  chili: { name_bn: "মরিচ ও সবজি (Vegetables)", name_en: "Chili & Vegetables", urea_gm: 900, tsp_gm: 650, mop_gm: 600 },
};

export default function AgronomyToolsPage() {
  const { lang } = useKrishiLang();

  // Spray Tank State
  const [tankSizeLiters, setTankSizeLiters] = useState<number>(16);
  const [tankCount, setTankCount] = useState<number>(2);
  const [dosagePerLiter, setDosagePerLiter] = useState<number>(2);
  const [unitType, setUnitType] = useState<"gm" | "ml">("gm");

  // Fertilizer Calculator State
  const [selectedCrop, setSelectedCrop] = useState<string>("potato");
  const [landArea, setLandArea] = useState<number>(33);
  const [landUnit, setLandUnit] = useState<"decimal" | "bigha" | "acre">("decimal");

  const totalWater = tankSizeLiters * tankCount;
  const totalChemical = (totalWater * dosagePerLiter).toFixed(1);

  const multiplier = landUnit === "decimal" ? 1 : landUnit === "bigha" ? 33 : 100;
  const totalDecimals = landArea * multiplier;
  const rate = FERTILIZER_RATES_PER_DECIMAL[selectedCrop];
  const ureaKg = ((totalDecimals * rate.urea_gm) / 1000).toFixed(2);
  const tspKg = ((totalDecimals * rate.tsp_gm) / 1000).toFixed(2);
  const mopKg = ((totalDecimals * rate.mop_gm) / 1000).toFixed(2);

  return (
    <main className="animate-fade-in mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-3xl font-extrabold text-transparent">
          {lang === "bn"
            ? "স্মার্ট কৃষি ডোজ ও সুষম সার ক্যালকুলেটর"
            : "Smart Pesticide Dosage & Balanced Fertilizer Calculators"}
        </h1>
        <p className="mt-2 text-sm text-emerald-200/75">
          {lang === "bn"
            ? "BARI অনুমোদিত মাত্রা অনুযায়ী স্প্রে মেশিনের মিশ্রণ ও জমির সুষম সারের পরিমাণ নির্ণয় করুন।"
            : "Compute exact field sprayer ratios and BARI-recommended balanced fertilizer doses by land area."}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Card 1: Pesticide Spray Tank Calculator */}
        <div className="rounded-2xl border border-emerald-800/80 bg-gradient-to-b from-emerald-900/25 to-emerald-950/60 p-6 shadow-xl">
          <div className="flex items-center gap-2.5 text-emerald-300">
            <Calculator className="h-5 w-5" />
            <h2 className="text-lg font-bold text-white">
              {lang === "bn" ? "১. বালাইনাশক স্প্রে ক্যালকুলেটর" : "1. Spray Tank Dosage Calculator"}
            </h2>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-200">
                {lang === "bn" ? "প্রতি লিটার পানিতে ওষুধের মাত্রা" : "Recommended Dose per Liter"}
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
                  {lang === "bn" ? "ট্যাংকের আয়তন (লিটার)" : "Tank Capacity (Liters)"}
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
                  {lang === "bn" ? "মোট ট্যাংক সংখ্যা" : "Number of Tanks"}
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
                {lang === "bn" ? "প্রয়োজনীয় মিশ্রণ" : "Total Required Mixture"}
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
                    <span>{lang === "bn" ? "মোট ওষুধ" : "Total Chemical"}</span>
                  </div>
                  <p className="mt-1 text-xl font-extrabold text-amber-300">
                    {totalChemical} {unitType}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Land Area Fertilizer Calculator */}
        <div className="rounded-2xl border border-emerald-800/80 bg-gradient-to-b from-teal-900/20 to-emerald-950/60 p-6 shadow-xl">
          <div className="flex items-center gap-2.5 text-teal-300">
            <Sprout className="h-5 w-5" />
            <h2 className="text-lg font-bold text-white">
              {lang === "bn" ? "২. সুষম সার ক্যালকুলেটর (BARI)" : "2. Balanced Fertilizer Estimator"}
            </h2>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-200">
                {lang === "bn" ? "ফসল নির্বাচন করুন" : "Select Crop"}
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-emerald-700 bg-[#020f0b] px-3.5 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
              >
                {Object.entries(FERTILIZER_RATES_PER_DECIMAL).map(([key, val]) => (
                  <option key={key} value={key}>
                    {lang === "bn" ? val.name_bn : val.name_en}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-emerald-200">
                  {lang === "bn" ? "জমির পরিমাণ" : "Land Size"}
                </label>
                <input
                  type="number"
                  min="1"
                  value={landArea}
                  onChange={(e) => setLandArea(Number(e.target.value) || 0)}
                  className="mt-1.5 w-full rounded-xl border border-emerald-700 bg-[#020f0b] px-3.5 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-200">
                  {lang === "bn" ? "একক (Unit)" : "Area Unit"}
                </label>
                <select
                  value={landUnit}
                  onChange={(e) => setLandUnit(e.target.value as typeof landUnit)}
                  className="mt-1.5 w-full rounded-xl border border-emerald-700 bg-[#020f0b] px-3.5 py-2.5 text-sm text-emerald-300"
                >
                  <option value="decimal">{lang === "bn" ? "শতক (Decimal)" : "Decimal"}</option>
                  <option value="bigha">{lang === "bn" ? "বিঘা (৩৩ শতক)" : "Bigha (33 Dec)"}</option>
                  <option value="acre">{lang === "bn" ? "একর (১০০ শতক)" : "Acre (100 Dec)"}</option>
                </select>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-teal-500/40 bg-teal-500/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                {lang === "bn"
                  ? `BARI অনুমোদিত সারের পরিমাণ (${totalDecimals} শতক)`
                  : `BARI Recommended Fertilizer (${totalDecimals} Decimals)`}
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2.5">
                <div className="rounded-lg bg-[#020f0b]/80 p-3">
                  <span className="text-[11px] text-emerald-300">
                    {lang === "bn" ? "ইউরিয়া (Urea)" : "Urea"}
                  </span>
                  <p className="mt-1 text-lg font-extrabold text-white">{ureaKg} kg</p>
                </div>
                <div className="rounded-lg bg-[#020f0b]/80 p-3">
                  <span className="text-[11px] text-amber-300">
                    {lang === "bn" ? "টিএসপি (TSP)" : "TSP"}
                  </span>
                  <p className="mt-1 text-lg font-extrabold text-white">{tspKg} kg</p>
                </div>
                <div className="rounded-lg bg-[#020f0b]/80 p-3">
                  <span className="text-[11px] text-sky-300">
                    {lang === "bn" ? "এমওপি (MOP)" : "MOP"}
                  </span>
                  <p className="mt-1 text-lg font-extrabold text-white">{mopKg} kg</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}