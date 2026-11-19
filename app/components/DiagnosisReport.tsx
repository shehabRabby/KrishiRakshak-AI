"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  FlaskConical,
  Sprout,
  Copy,
  Check,
  Volume2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export interface Prediction {
  label: string;
  confidence: number;
}

export interface Advisory {
  crop_name_en: string;
  crop_name_bn: string;
  disease_name_en: string;
  disease_name_bn: string;
  severity: "Low" | "Moderate" | "High" | "Healthy";
  symptoms_en: string;
  symptoms_bn: string;
  organic_remedy_en: string[];
  organic_remedy_bn: string[];
  chemical_remedy_en: string;
  chemical_remedy_bn: string;
  preventive_tips_en: string[];
  preventive_tips_bn: string[];
  guideline_citation: string;
}

export interface DiagnosisResult {
  predictions: Prediction[];
  low_confidence_warning: boolean;
  advisory: Advisory;
}

interface Props {
  result: DiagnosisResult;
  lang: "bn" | "en";
}

export default function DiagnosisReport({ result, lang }: Props) {
  const [activeTab, setActiveTab] = useState<
    "organic" | "chemical" | "prevention"
  >("organic");
  const [copied, setCopied] = useState(false);
  const adv = result.advisory;

  const severityColors: Record<Advisory["severity"], string> = {
    High: "border-rose-500/40 bg-rose-500/15 text-rose-300",
    Moderate: "border-amber-500/40 bg-amber-500/15 text-amber-300",
    Low: "border-sky-500/40 bg-sky-500/15 text-sky-300",
    Healthy: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
  };

  const handleCopy = () => {
    const text =
      lang === "bn"
        ? `🌿 KrishiRakshak AI রিপোর্ট\nফসল: ${adv.crop_name_bn}\nরোগ: ${adv.disease_name_bn} (${result.predictions[0]?.confidence}%)\nলক্ষণ: ${adv.symptoms_bn}\nজৈব: ${adv.organic_remedy_bn.join(", ")}\nরাসায়নিক: ${adv.chemical_remedy_bn}\nসূত্র: ${adv.guideline_citation}`
        : `🌿 KrishiRakshak AI Report\nCrop: ${adv.crop_name_en}\nDisease: ${adv.disease_name_en} (${result.predictions[0]?.confidence}%)\nSymptoms: ${adv.symptoms_en}\nOrganic: ${adv.organic_remedy_en.join(", ")}\nChemical: ${adv.chemical_remedy_en}\nSource: ${adv.guideline_citation}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const text =
      lang === "bn"
        ? `${adv.crop_name_bn} ফসলে ${adv.disease_name_bn} শনাক্ত হয়েছে। ${adv.symptoms_bn}। জৈব প্রতিকার: ${adv.organic_remedy_bn.join("। ")}। রাসায়নিক মাত্রা: ${adv.chemical_remedy_bn}`
        : `Detected ${adv.disease_name_en} on ${adv.crop_name_en}. ${adv.symptoms_en}. Organic remedy: ${adv.organic_remedy_en.join(". ")}. Chemical dosage: ${adv.chemical_remedy_en}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "bn" ? "bn-BD" : "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-5">
      {result.low_confidence_warning && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/50 bg-amber-950/70 p-4 text-xs text-amber-200 sm:text-sm">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <p>
            <strong>
              {lang === "bn" ? "সতর্কতা (<৭০%): " : "Guardrail (<70%): "}
            </strong>
            {lang === "bn"
              ? "নিশ্চিততার হার কম। সঠিক পরামর্শের জন্য উপ-সহকারী কৃষি কর্মকর্তার সাথে যোগাযোগ করুন।"
              : "Confidence is below 70%. Please consult a local agricultural extension officer."}
          </p>
        </div>
      )}

      {/* Main Pathology & Probability Card */}
      <div className="rounded-2xl border border-emerald-800/70 bg-emerald-950/60 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 uppercase">
                {lang === "bn" ? adv.crop_name_bn : adv.crop_name_en}
              </span>
              <span>• {result.predictions[0]?.confidence}% Match</span>
            </div>
            <h3 className="mt-1.5 text-2xl font-extrabold text-white">
              {lang === "bn" ? adv.disease_name_bn : adv.disease_name_en}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold ${severityColors[adv.severity]}`}
            >
              {adv.severity}
            </span>
            <button
              onClick={handleSpeak}
              className="flex items-center gap-1 rounded-xl border border-emerald-700 bg-emerald-900/50 px-3 py-1.5 text-xs font-medium text-emerald-200 hover:bg-emerald-800"
            >
              <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>{lang === "bn" ? "শুনুন" : "Listen"}</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-xl border border-emerald-700 bg-emerald-900/50 px-3 py-1.5 text-xs font-medium text-emerald-200 hover:bg-emerald-800"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>
                {copied
                  ? lang === "bn"
                    ? "কপি"
                    : "Copied"
                  : lang === "bn"
                    ? "কপি"
                    : "Copy"}
              </span>
            </button>
          </div>
        </div>

        <p className="mt-3 rounded-xl border border-emerald-800/50 bg-[#020f0b]/70 p-3.5 text-sm text-slate-200">
          {lang === "bn" ? adv.symptoms_bn : adv.symptoms_en}
        </p>

        {/* Top-3 Chart */}
        <div className="mt-5 h-36 w-full rounded-xl border border-emerald-800/40 bg-[#020f0b]/60 p-2.5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={result.predictions.map((p) => ({
                name: p.label.replace(/___/g, " - ").replace(/_/g, " "),
                confidence: p.confidence,
              }))}
              layout="vertical"
              margin={{ left: 5, right: 15 }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                stroke="#6ee7b7"
                fontSize={11}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={145}
                stroke="#d1fae5"
                fontSize={11}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#022c22",
                  borderColor: "#059669",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="confidence" radius={[0, 6, 6, 0]}>
                {result.predictions.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? "#10b981" : "#065f46"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabbed Treatment Card */}
      <div className="rounded-2xl border border-emerald-800/70 bg-emerald-950/60 p-6">
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#020f0b]/80 p-1">
          {[
            {
              id: "organic",
              icon: Sprout,
              bn: "জৈব প্রতিকার",
              en: "Organic",
              active: "bg-emerald-500 text-emerald-950",
            },
            {
              id: "chemical",
              icon: FlaskConical,
              bn: "রাসায়নিক",
              en: "Chemical",
              active: "bg-amber-400 text-emerald-950",
            },
            {
              id: "prevention",
              icon: ShieldCheck,
              bn: "প্রতিরোধ",
              en: "Prevention",
              active: "bg-teal-400 text-emerald-950",
            },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${
                  activeTab === tab.id
                    ? tab.active
                    : "text-emerald-200 hover:bg-emerald-900/40"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{lang === "bn" ? tab.bn : tab.en}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-sm text-slate-200">
          {activeTab === "organic" && (
            <ul className="space-y-2">
              {(lang === "bn"
                ? adv.organic_remedy_bn
                : adv.organic_remedy_en
              ).map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-[#020f0b]/70 p-3"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === "chemical" && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-4 text-amber-100">
              {lang === "bn" ? adv.chemical_remedy_bn : adv.chemical_remedy_en}
            </div>
          )}

          {activeTab === "prevention" && (
            <ul className="space-y-2">
              {(lang === "bn"
                ? adv.preventive_tips_bn
                : adv.preventive_tips_en
              ).map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-[#020f0b]/70 p-3"
                >
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 rounded-lg bg-[#020f0b]/80 px-3.5 py-2 text-xs text-emerald-300/80">
          <strong>Source:</strong> {adv.guideline_citation}
        </div>
      </div>
    </div>
  );
}
