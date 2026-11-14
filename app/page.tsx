"use client";

import React, { useState } from "react";
import { Upload, Leaf, AlertTriangle, CheckCircle2, Globe, BookOpen, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import Link from "next/link";

interface Prediction {
  label: string;
  confidence: number;
}

interface Advisory {
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

export default function HomePage() {
  const [lang, setLang] = useState<"bn" | "en">("bn");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    predictions: Prediction[];
    low_confidence_warning: boolean;
    advisory: Advisory;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch("/api/diagnose", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-emerald-800/60 bg-emerald-900/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">KrishiRakshak AI</h1>
              <p className="text-xs text-emerald-300">Crop Guardian • AgriSphere AI</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/docs"
              className="flex items-center gap-1.5 rounded-lg border border-emerald-700 px-3 py-1.5 text-sm text-emerald-200 hover:bg-emerald-800/50"
            >
              <BookOpen className="h-4 w-4" />
              <span>/docs</span>
            </Link>
            <button
              onClick={() => setLang(lang === "bn" ? "en" : "bn")}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
            >
              <Globe className="h-4 w-4" />
              <span>{lang === "bn" ? "English" : "বাংলা"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {lang === "bn"
              ? "ফসলের পাতার ছবি দিন, মুহূর্তেই রোগ ও সমাধান জানুন"
              : "Instant AI Crop Disease Diagnosis & Agronomy Advisor"}
          </h2>
          <p className="mt-2 text-emerald-200/80">
            {lang === "bn"
              ? "MobileNetV2 কম্পিউটার ভিশন + BARI/DAE কৃষি গাইডলাইন RAG চালিত"
              : "Powered by MobileNetV2 Computer Vision + BARI/DAE Verified RAG Pipeline"}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Image Upload */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-emerald-800 bg-emerald-900/30 p-6">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-700 bg-emerald-950/50 p-6 transition hover:border-emerald-400">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Uploaded leaf"
                    className="max-h-64 rounded-lg object-contain"
                  />
                ) : (
                  <div className="py-8 text-center">
                    <Upload className="mx-auto h-10 w-10 text-emerald-400" />
                    <p className="mt-3 text-sm font-medium text-white">
                      {lang === "bn" ? "আক্রান্ত পাতার ছবি আপলোড করুন" : "Click to upload a crop leaf photo"}
                    </p>
                    <p className="mt-1 text-xs text-emerald-300/70">JPG, PNG, WEBP</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>

              <button
                onClick={handleAnalyze}
                disabled={!selectedFile || loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{lang === "bn" ? "বিশ্লেষণ করা হচ্ছে..." : "Analyzing Leaf..."}</span>
                  </>
                ) : (
                  <span>{lang === "bn" ? "রোগ শনাক্ত করুন" : "Diagnose Crop Disease"}</span>
                )}
              </button>

              {error && (
                <div className="mt-4 rounded-lg border border-red-500/50 bg-red-950/50 p-3 text-sm text-red-200">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Results & Chart */}
          <div className="lg:col-span-7">
            {!result ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-emerald-800/60 bg-emerald-900/20 p-8 text-center text-emerald-300/60">
                <Leaf className="mb-3 h-12 w-12 opacity-40" />
                <p>
                  {lang === "bn"
                    ? "বাম পাশ থেকে পাতার ছবি আপলোড করে 'রোগ শনাক্ত করুন' বাটনে ক্লিক করুন।"
                    : "Upload a leaf image on the left to view ML confidence scores and treatment steps."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Low Confidence Guardrail Alert */}
                {result.low_confidence_warning && (
                  <div className="flex items-start gap-3 rounded-xl border border-amber-500/50 bg-amber-950/60 p-4 text-amber-200">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                    <p className="text-sm">
                      {lang === "bn"
                        ? "সতর্কতা: মডেলের নিশ্চিততার হার ৭০%-এর নিচে। সঠিক সিদ্ধান্তের জন্য নিকটস্থ উপ-সহকারী কৃষি কর্মকর্তার পরামর্শ নিন।"
                        : "Guardrail Alert: Model confidence is below 70%. Please verify with a local agricultural extension officer."}
                    </p>
                  </div>
                )}

                {/* Diagnosis Summary Card */}
                <div className="rounded-2xl border border-emerald-800 bg-emerald-900/40 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                        {lang === "bn" ? result.advisory.crop_name_bn : result.advisory.crop_name_en}
                      </span>
                      <h3 className="text-2xl font-bold text-white">
                        {lang === "bn" ? result.advisory.disease_name_bn : result.advisory.disease_name_en}
                      </h3>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                      Severity: {result.advisory.severity}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-200">
                    {lang === "bn" ? result.advisory.symptoms_bn : result.advisory.symptoms_en}
                  </p>

                  {/* Recharts Top-3 ML Confidence Chart */}
                  <div className="mt-6">
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                      MobileNetV2 Top-3 Confidence Scores (%)
                    </h4>
                    <div className="h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={result.predictions.map((p) => ({
                            name: p.label.replace(/___/g, " - ").replace(/_/g, " "),
                            confidence: p.confidence,
                          }))}
                          layout="vertical"
                          margin={{ left: 10, right: 20 }}
                        >
                          <XAxis type="number" domain={[0, 100]} stroke="#6ee7b7" fontSize={12} />
                          <YAxis
                            type="category"
                            dataKey="name"
                            width={150}
                            stroke="#a7f3d0"
                            fontSize={11}
                          />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#064e3b", borderColor: "#059669" }}
                          />
                          <Bar dataKey="confidence" radius={[0, 6, 6, 0]}>
                            {result.predictions.map((_, index) => (
                              <Cell key={index} fill={index === 0 ? "#10b981" : "#047857"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Treatment Plan Card */}
                <div className="rounded-2xl border border-emerald-800 bg-emerald-900/40 p-6 space-y-4">
                  <div>
                    <h4 className="flex items-center gap-2 font-semibold text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>
                        {lang === "bn" ? "জৈব ও ঘরোয়া প্রতিকার (Organic Remedy)" : "Organic Remedies"}
                      </span>
                    </h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-200">
                      {(lang === "bn"
                        ? result.advisory.organic_remedy_bn
                        : result.advisory.organic_remedy_en
                      ).map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-emerald-800/60 pt-4">
                    <h4 className="font-semibold text-amber-300">
                      {lang === "bn"
                        ? "রাসায়নিক বালাইনাশক (নিরাপদ মাত্রা)"
                        : "Chemical Treatment (Safe BARI Dosage)"}
                    </h4>
                    <p className="mt-1 text-sm text-slate-200">
                      {lang === "bn"
                        ? result.advisory.chemical_remedy_bn
                        : result.advisory.chemical_remedy_en}
                    </p>
                  </div>

                  <div className="rounded-lg bg-emerald-950/70 p-3 text-xs text-emerald-300/80">
                    <strong>Verified Source:</strong> {result.advisory.guideline_citation}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}