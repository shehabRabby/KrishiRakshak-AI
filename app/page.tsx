"use client";

import React, { useState } from "react";
import {
  Upload,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  Globe,
  BookOpen,
  Loader2,
  ShieldCheck,
  Sparkles,
  Cpu,
  Database,
  FlaskConical,
  Sprout,
  Copy,
  Check,
  History,
  Trash2,
  Activity,
} from "lucide-react";
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

interface DiagnosisResult {
  predictions: Prediction[];
  low_confidence_warning: boolean;
  advisory: Advisory;
}

interface HistoryItem {
  id: string;
  timestamp: string;
  preview: string;
  data: DiagnosisResult;
}

export default function HomePage() {
  const [lang, setLang] = useState<"bn" | "en">("bn");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"organic" | "chemical" | "prevention">("organic");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const processFile = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !previewUrl) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch("/api/diagnose", {
        method: "POST",
        body: formData,
      });

      const data: DiagnosisResult & { error?: string } = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      setResult(data);
      setActiveTab("organic");

      setHistory((prev) => [
        {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          preview: previewUrl,
          data,
        },
        ...prev.slice(0, 4),
      ]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrescription = () => {
    if (!result) return;
    const adv = result.advisory;
    const text =
      lang === "bn"
        ? `🌿 KrishiRakshak AI রিপোর্ট\nফসল: ${adv.crop_name_bn}\nরোগ: ${adv.disease_name_bn} (${result.predictions[0]?.confidence}% নিশ্চিত)\nলক্ষণ: ${adv.symptoms_bn}\nজৈব প্রতিকার:\n- ${adv.organic_remedy_bn.join("\n- ")}\nরাসায়নিক মাত্রা: ${adv.chemical_remedy_bn}\nসূত্র: ${adv.guideline_citation}`
        : `🌿 KrishiRakshak AI Report\nCrop: ${adv.crop_name_en}\nDisease: ${adv.disease_name_en} (${result.predictions[0]?.confidence}% confidence)\nSymptoms: ${adv.symptoms_en}\nOrganic Remedies:\n- ${adv.organic_remedy_en.join("\n- ")}\nChemical Dosage: ${adv.chemical_remedy_en}\nSource: ${adv.guideline_citation}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityBadge = (severity: Advisory["severity"]) => {
    switch (severity) {
      case "High":
        return "border-rose-500/40 bg-rose-500/15 text-rose-300";
      case "Moderate":
        return "border-amber-500/40 bg-amber-500/15 text-amber-300";
      case "Low":
        return "border-sky-500/40 bg-sky-500/15 text-sky-300";
      case "Healthy":
        return "border-emerald-500/40 bg-emerald-500/15 text-emerald-300";
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#031510] text-slate-100 selection:bg-emerald-500 selection:text-emerald-950">
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-teal-500/10 blur-[100px]" />
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-emerald-800/40 bg-[#031510]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-emerald-950 shadow-lg shadow-emerald-500/20">
              <Leaf className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">KrishiRakshak AI</h1>
                <span className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 sm:inline-block">
                  v2.0 Pro
                </span>
              </div>
              <p className="text-xs text-emerald-300/80">Crop Guardian • AgriSphere AI</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/docs"
              className="flex items-center gap-1.5 rounded-xl border border-emerald-800/80 bg-emerald-950/60 px-3.5 py-2 text-xs font-medium text-emerald-200 transition hover:border-emerald-600 hover:bg-emerald-900/60"
            >
              <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
              <span>Architecture /docs</span>
            </Link>
            <button
              onClick={() => setLang(lang === "bn" ? "en" : "bn")}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-emerald-950 shadow-md shadow-emerald-500/20 transition hover:bg-emerald-400"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{lang === "bn" ? "English" : "বাংলা"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Hero Banner */}
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {lang === "bn"
                ? "আন্তর্জাতিক AI বিল্ডার্স কংগ্রেস ২০২৬ • স্মার্ট কৃষি সমাধান"
                : "International AI Builders Congress 2026 • Autonomous Agronomy"}
            </span>
          </div>

          <h2 className="bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-5xl sm:leading-tight">
            {lang === "bn"
              ? "ফসলের পাতার রোগ শনাক্ত ও নির্ভুল কৃষি পরামর্শ"
              : "AI Crop Pathology & Verified Agronomy Advisor"}
          </h2>

          <p className="mt-3 text-sm text-emerald-200/75 sm:text-base">
            {lang === "bn"
              ? "আক্রান্ত পাতার ছবি আপলোড করুন—আমাদের MobileNetV2 ভিশন মডেল ও BARI/DAE ভেরিফায়েড RAG ইঞ্জিন মুহূর্তেই রোগ ও নিরাপদ সমাধান দেবে।"
              : "Upload a leaf image for instant MobileNetV2 disease classification paired with BARI/DAE grounded bilingual treatment protocols."}
          </p>

          {/* System Telemetry Pills */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-emerald-300/90">
            <span className="flex items-center gap-1.5 rounded-lg border border-emerald-800/70 bg-emerald-950/70 px-3 py-1.5">
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
              MobileNetV2 ONNX (38 Classes)
            </span>
            <span className="flex items-center gap-1.5 rounded-lg border border-emerald-800/70 bg-emerald-950/70 px-3 py-1.5">
              <Database className="h-3.5 w-3.5 text-teal-400" />
              BARI & DAE Verified RAG
            </span>
            <span className="flex items-center gap-1.5 rounded-lg border border-emerald-800/70 bg-emerald-950/70 px-3 py-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              70% Confidence Guardrail
            </span>
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Scanner & History */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-emerald-800/70 bg-gradient-to-b from-emerald-900/30 to-emerald-950/60 p-5 shadow-2xl backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  {lang === "bn" ? "১. পাতার ছবি স্ক্যানার" : "1. Leaf Optical Scanner"}
                </span>
                {selectedFile && (
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setResult(null);
                    }}
                    className="flex items-center gap-1 text-xs text-rose-300 hover:text-rose-200"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{lang === "bn" ? "মুছুন" : "Clear"}</span>
                  </button>
                )}
              </div>

              {/* Dropzone */}
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative flex min-h-[270px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all ${
                  isDragging
                    ? "border-emerald-400 bg-emerald-800/30 scale-[1.01]"
                    : "border-emerald-700/80 bg-[#020f0b]/80 hover:border-emerald-500"
                }`}
              >
                {previewUrl ? (
                  <div className="relative flex h-full w-full items-center justify-center p-3">
                    <img
                      src={previewUrl}
                      alt="Uploaded leaf"
                      className="max-h-64 rounded-lg object-contain shadow-lg"
                    />
                    {/* Scanning Animation Overlay */}
                    {loading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/75 backdrop-blur-[2px]">
                        <div className="h-1 w-3/4 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_20px_#34d399]" />
                        <p className="mt-3 text-xs font-semibold tracking-wider text-emerald-300 uppercase">
                          {lang === "bn" ? "AI ভিশন স্ক্যান চলছে..." : "Running Neural Inference..."}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
                      <Upload className="h-7 w-7" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-white">
                      {lang === "bn"
                        ? "পাতার ছবি এখানে ছেড়ে দিন অথবা ক্লিক করুন"
                        : "Drag & drop leaf photo here, or click to browse"}
                    </p>
                    <p className="mt-1.5 text-xs text-emerald-300/70">
                      {lang === "bn"
                        ? "আলু, টমেটো, ভুট্টা, স্ট্রবেরি, আপেল, মরিচ সহ ৩৮টি ক্লাস সমর্থিত"
                        : "Supports 38 crop classes (Potato, Tomato, Corn, Strawberry, Apple, etc.)"}
                    </p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!selectedFile || loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-5 py-3.5 text-sm font-bold text-emerald-950 shadow-lg shadow-emerald-500/20 transition hover:from-emerald-300 hover:to-teal-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{lang === "bn" ? "রোগ ও গাইডলাইন বিশ্লেষণ হচ্ছে..." : "Analyzing Pathology & RAG..."}</span>
                  </>
                ) : (
                  <>
                    <Activity className="h-5 w-5" />
                    <span>{lang === "bn" ? "AI দিয়ে রোগ শনাক্ত করুন" : "Run AI Disease Diagnosis"}</span>
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-950/60 p-3.5 text-xs text-rose-200">
                  <strong>Error:</strong> {error}
                </div>
              )}
            </div>

            {/* Session Scan History */}
            {history.length > 0 && (
              <div className="rounded-2xl border border-emerald-800/60 bg-emerald-950/50 p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  <History className="h-3.5 w-3.5" />
                  <span>{lang === "bn" ? "সাম্প্রতিক স্ক্যান হিস্ট্রি" : "Recent Session Scans"}</span>
                </div>
                <div className="space-y-2">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setPreviewUrl(item.preview);
                        setResult(item.data);
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-emerald-800/50 bg-emerald-900/20 p-2.5 text-left transition hover:border-emerald-600 hover:bg-emerald-900/40"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.preview}
                          alt="History leaf"
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-xs font-semibold text-white">
                            {lang === "bn"
                              ? item.data.advisory.disease_name_bn
                              : item.data.advisory.disease_name_en}
                          </p>
                          <p className="text-[11px] text-emerald-300/70">
                            {item.data.predictions[0]?.confidence}% confidence • {item.timestamp}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-emerald-400">View →</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Diagnostic Report */}
          <div className="lg:col-span-7">
            {!result ? (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-emerald-800/60 bg-gradient-to-b from-emerald-900/20 to-emerald-950/40 p-8 text-center">
                <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-400 ring-1 ring-emerald-500/20">
                  <Leaf className="h-10 w-10" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">
                  {lang === "bn" ? "ডায়াগনস্টিক রিপোর্ট প্রস্তুত হচ্ছে" : "Ready for Diagnostic Analysis"}
                </h3>
                <p className="mt-2 max-w-md text-sm text-emerald-200/70">
                  {lang === "bn"
                    ? "বাম পাশের স্ক্যানারে একটি পাতার ছবি আপলোড করলে এখানে রোগের নিশ্চিততার হার (Confidence Chart), লক্ষণ এবং BARI/DAE অনুমোদিত চিকিৎসা দেখা যাবে।"
                    : "Upload a leaf image on the left to generate ML confidence distributions, symptom pathology, and BARI/DAE treatment steps."}
                </p>

                <div className="mt-6 grid w-full max-w-lg grid-cols-3 gap-3 text-left">
                  <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/60 p-3">
                    <p className="text-xs font-bold text-emerald-400">Step 1</p>
                    <p className="mt-1 text-[11px] text-slate-300">
                      {lang === "bn" ? "২২৪×২২৪ ইমেজ প্রসেসিং ও ONNX ইনফারেন্স" : "224×224 Tensor & ONNX Inference"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/60 p-3">
                    <p className="text-xs font-bold text-teal-400">Step 2</p>
                    <p className="mt-1 text-[11px] text-slate-300">
                      {lang === "bn" ? "BARI/DAE গাইডবুক থেকে তথ্য অনুসন্ধান" : "BARI/DAE Guideline Retrieval"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/60 p-3">
                    <p className="text-xs font-bold text-amber-400">Step 3</p>
                    <p className="mt-1 text-[11px] text-slate-300">
                      {lang === "bn" ? "বাংলা ও ইংরেজিতে নিরাপদ প্রেসক্রিপশন" : "Bilingual Safe Prescription"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Low Confidence Guardrail Banner */}
                {result.low_confidence_warning && (
                  <div className="flex items-start gap-3 rounded-2xl border border-amber-500/50 bg-amber-950/70 p-4 text-amber-200 shadow-lg">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                    <div className="text-xs leading-relaxed sm:text-sm">
                      <strong>
                        {lang === "bn" ? "নিম্ন নিশ্চিততা সতর্কতা (<৭০%): " : "Low Confidence Guardrail (<70%): "}
                      </strong>
                      {lang === "bn"
                        ? "ছবিটি অস্পষ্ট হতে পারে বা এই রোগটি মডেলের বাইরে। সঠিক সিদ্ধান্তের জন্য নিকটস্থ উপ-সহকারী কৃষি কর্মকর্তার পরামর্শ নিন।"
                        : "Prediction confidence is below 70%. Please retake a clearer photo or consult a local agricultural extension officer."}
                    </div>
                  </div>
                )}

                {/* Main Pathology & Chart Card */}
                <div className="rounded-2xl border border-emerald-800/80 bg-gradient-to-b from-emerald-900/40 to-emerald-950/70 p-6 shadow-2xl">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
                          {lang === "bn" ? result.advisory.crop_name_bn : result.advisory.crop_name_en}
                        </span>
                        <span className="text-xs font-semibold text-emerald-400">
                          • {result.predictions[0]?.confidence}% Match
                        </span>
                      </div>
                      <h3 className="mt-1.5 text-2xl font-extrabold text-white sm:text-3xl">
                        {lang === "bn" ? result.advisory.disease_name_bn : result.advisory.disease_name_en}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${getSeverityBadge(
                          result.advisory.severity
                        )}`}
                      >
                        Severity: {result.advisory.severity}
                      </span>
                      <button
                        onClick={handleCopyPrescription}
                        className="flex items-center gap-1.5 rounded-xl border border-emerald-700 bg-emerald-900/50 px-3 py-1.5 text-xs font-medium text-emerald-200 transition hover:bg-emerald-800"
                        title="Copy Report"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span>{lang === "bn" ? "কপি হয়েছে" : "Copied"}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>{lang === "bn" ? "কপি" : "Copy"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Symptoms Box */}
                  <div className="mt-4 rounded-xl border border-emerald-800/60 bg-emerald-950/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      {lang === "bn" ? "শনাক্তকৃত লক্ষণসমূহ" : "Observed Pathology Symptoms"}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-200">
                      {lang === "bn" ? result.advisory.symptoms_bn : result.advisory.symptoms_en}
                    </p>
                  </div>

                  {/* Top-3 ML Probability Chart */}
                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                        MobileNetV2 Top-3 Class Probabilities (%)
                      </h4>
                      <span className="text-[11px] text-emerald-400/80">Softmax Output</span>
                    </div>
                    <div className="h-40 w-full rounded-xl border border-emerald-800/50 bg-[#020f0b]/60 p-3">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={result.predictions.map((p) => ({
                            name: p.label.replace(/___/g, " - ").replace(/_/g, " "),
                            confidence: p.confidence,
                          }))}
                          layout="vertical"
                          margin={{ left: 10, right: 20 }}
                        >
                          <XAxis type="number" domain={[0, 100]} stroke="#6ee7b7" fontSize={11} />
                          <YAxis
                            type="category"
                            dataKey="name"
                            width={155}
                            stroke="#d1fae5"
                            fontSize={11}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#022c22",
                              borderColor: "#059669",
                              borderRadius: "8px",
                              fontSize: "12px",
                            }}
                          />
                          <Bar dataKey="confidence" radius={[0, 6, 6, 0]}>
                            {result.predictions.map((_, index) => (
                              <Cell key={index} fill={index === 0 ? "#10b981" : "#065f46"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Interactive Tabbed Agronomy Advisory */}
                <div className="rounded-2xl border border-emerald-800/80 bg-gradient-to-b from-emerald-900/40 to-emerald-950/70 p-6 shadow-2xl">
                  {/* Tab Switcher */}
                  <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#020f0b]/80 p-1.5 ring-1 ring-emerald-800/60">
                    <button
                      onClick={() => setActiveTab("organic")}
                      className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition ${
                        activeTab === "organic"
                          ? "bg-emerald-500 text-emerald-950 shadow"
                          : "text-emerald-200 hover:bg-emerald-900/40"
                      }`}
                    >
                      <Sprout className="h-4 w-4" />
                      <span>{lang === "bn" ? "জৈব প্রতিকার" : "Organic"}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("chemical")}
                      className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition ${
                        activeTab === "chemical"
                          ? "bg-amber-400 text-emerald-950 shadow"
                          : "text-emerald-200 hover:bg-emerald-900/40"
                      }`}
                    >
                      <FlaskConical className="h-4 w-4" />
                      <span>{lang === "bn" ? "রাসায়নিক মাত্রা" : "Chemical"}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("prevention")}
                      className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition ${
                        activeTab === "prevention"
                          ? "bg-teal-400 text-emerald-950 shadow"
                          : "text-emerald-200 hover:bg-emerald-900/40"
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>{lang === "bn" ? "প্রতিরোধ ব্যবস্থা" : "Prevention"}</span>
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="mt-5 min-h-[130px]">
                    {activeTab === "organic" && (
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-300">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>
                            {lang === "bn"
                              ? "পরিবেশবান্ধব ও জৈব ব্যবস্থাপনা (প্রথম পদক্ষেপ)"
                              : "Eco-Friendly & Organic Remedies (First Line of Defense)"}
                          </span>
                        </h4>
                        <ul className="mt-3 space-y-2 text-sm text-slate-200">
                          {(lang === "bn"
                            ? result.advisory.organic_remedy_bn
                            : result.advisory.organic_remedy_en
                          ).map((step, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 rounded-lg border border-emerald-800/40 bg-emerald-950/50 p-3"
                            >
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">
                                {i + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeTab === "chemical" && (
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-amber-300">
                          <FlaskConical className="h-4 w-4" />
                          <span>
                            {lang === "bn"
                              ? "BARI অনুমোদিত নিরাপদ বালাইনাশক ও মাত্রা"
                              : "BARI Approved Safe Chemical Dosage"}
                          </span>
                        </h4>
                        <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/30 p-4 text-sm leading-relaxed text-amber-100">
                          {lang === "bn"
                            ? result.advisory.chemical_remedy_bn
                            : result.advisory.chemical_remedy_en}
                        </div>
                      </div>
                    )}

                    {activeTab === "prevention" && (
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-teal-300">
                          <ShieldCheck className="h-4 w-4" />
                          <span>
                            {lang === "bn"
                              ? "ভবিষ্যতে রোগ প্রতিরোধে করণীয়"
                              : "Preventive Agronomy & Crop Protection"}
                          </span>
                        </h4>
                        <ul className="mt-3 space-y-2 text-sm text-slate-200">
                          {(lang === "bn"
                            ? result.advisory.preventive_tips_bn
                            : result.advisory.preventive_tips_en
                          ).map((tip, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 rounded-lg border border-teal-800/40 bg-teal-950/30 p-3"
                            >
                              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-400" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Verified Citation Footer */}
                  <div className="mt-5 flex items-center justify-between rounded-xl border border-emerald-800/60 bg-[#020f0b]/80 px-4 py-2.5 text-xs text-emerald-300/80">
                    <span>
                      <strong>RAG Knowledge Source:</strong> {result.advisory.guideline_citation}
                    </span>
                    <span className="hidden text-emerald-500 sm:inline">✓ Grounded</span>
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