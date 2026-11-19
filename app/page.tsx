"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Upload,
  Leaf,
  Globe,
  BookOpen,
  Calculator,
  Loader2,
  Trash2,
  Activity,
  History,
  Cpu,
  Database,
  ShieldCheck,
} from "lucide-react";

import DiagnosisReport, { DiagnosisResult } from "./components/DiagnosisReport";

interface HistoryItem {
  id: string;
  timestamp: string;
  preview: string;
  data: DiagnosisResult;
}

export default function HomePage() {
  const lang = useSyncExternalStore<"bn" | "en">(
    (cb) => {
      window.addEventListener("storage", cb);
      return () => window.removeEventListener("storage", cb);
    },
    () => (localStorage.getItem("krishirakshak_lang") === "en" ? "en" : "bn"),
    () => "bn"
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const toggleLang = () => {
    const next = lang === "bn" ? "en" : "bn";
    localStorage.setItem("krishirakshak_lang", next);
    window.dispatchEvent(new Event("storage"));
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !previewUrl) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch("/api/diagnose", { method: "POST", body: formData });
      const data: DiagnosisResult & { error?: string } = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      setResult(data);
      setHistory((prev) => [
        {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          preview: previewUrl,
          data,
        },
        ...prev.slice(0, 3),
      ]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#031510] text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-emerald-800/40 bg-[#031510]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-emerald-950">
              <Leaf className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">KrishiRakshak AI</h1>
              <p className="text-[11px] text-emerald-300/80">Crop Guardian • AgriSphere AI</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/tools"
              className="flex items-center gap-1.5 rounded-xl border border-emerald-800 bg-emerald-950/70 px-3 py-1.5 text-xs font-medium text-emerald-200 hover:border-emerald-600"
            >
              <Calculator className="h-3.5 w-3.5 text-amber-400" />
              <span>{lang === "bn" ? "ক্যালকুলেটর" : "Tools"}</span>
            </Link>
            <Link
              href="/docs"
              className="flex items-center gap-1.5 rounded-xl border border-emerald-800 bg-emerald-950/70 px-3 py-1.5 text-xs font-medium text-emerald-200 hover:border-emerald-600"
            >
              <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
              <span>/docs</span>
            </Link>
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-emerald-950 hover:bg-emerald-400"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{lang === "bn" ? "English" : "বাংলা"}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {lang === "bn"
              ? "ফসলের পাতার রোগ শনাক্ত ও কৃষি পরামর্শ"
              : "AI Crop Pathology & Verified Agronomy Advisor"}
          </h2>
          <p className="mt-2 text-sm text-emerald-200/75">
            {lang === "bn"
              ? "MobileNetV2 ভিশন মডেল + BARI/DAE ভেরিফায়েড RAG গাইডলাইন"
              : "Powered by MobileNetV2 ONNX Vision + BARI/DAE Grounded RAG Pipeline"}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left: Upload & History */}
          <div className="space-y-5 lg:col-span-5">
            <div className="rounded-2xl border border-emerald-800/70 bg-emerald-950/50 p-5">
              <div className="mb-3 flex items-center justify-between text-xs font-semibold text-emerald-300">
                <span>{lang === "bn" ? "পাতার ছবি আপলোড" : "LEAF SCANNER"}</span>
                {selectedFile && (
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setResult(null);
                    }}
                    className="flex items-center gap-1 text-rose-300 hover:text-rose-200"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{lang === "bn" ? "মুছুন" : "Clear"}</span>
                  </button>
                )}
              </div>

              <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file?.type.startsWith("image/")) processFile(file);
                }}
                className="flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-700/80 bg-[#020f0b]/80 p-5 transition hover:border-emerald-400"
              >
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Leaf preview"
                    width={240}
                    height={240}
                    unoptimized
                    className="max-h-60 w-auto rounded-lg object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-9 w-9 text-emerald-400" />
                    <p className="mt-3 text-sm font-semibold text-white">
                      {lang === "bn" ? "ছবি ড্র্যাগ করুন অথবা ক্লিক করুন" : "Drag & drop or click to upload"}
                    </p>
                    <p className="mt-1 text-xs text-emerald-300/60">JPG, PNG, WEBP (38 Classes)</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleAnalyze}
                disabled={!selectedFile || loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-emerald-950 transition hover:bg-emerald-400 disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{lang === "bn" ? "বিশ্লেষণ চলছে..." : "Analyzing..."}</span>
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4" />
                    <span>{lang === "bn" ? "রোগ শনাক্ত করুন" : "Diagnose Disease"}</span>
                  </>
                )}
              </button>

              {error && (
                <p className="mt-3 rounded-lg bg-rose-950/70 p-3 text-xs text-rose-200">{error}</p>
              )}
            </div>

            {history.length > 0 && (
              <div className="rounded-2xl border border-emerald-800/60 bg-emerald-950/40 p-4">
                <div className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                  <History className="h-3.5 w-3.5" />
                  <span>{lang === "bn" ? "সাম্প্রতিক স্ক্যান" : "Recent Scans"}</span>
                </div>
                <div className="space-y-2">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setPreviewUrl(item.preview);
                        setResult(item.data);
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-emerald-800/50 bg-[#020f0b]/60 p-2 text-left hover:border-emerald-600"
                    >
                      <div className="flex items-center gap-2.5">
                        <Image
                          src={item.preview}
                          alt="Thumb"
                          width={36}
                          height={36}
                          unoptimized
                          className="h-9 w-9 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-xs font-semibold text-white">
                            {lang === "bn"
                              ? item.data.advisory.disease_name_bn
                              : item.data.advisory.disease_name_en}
                          </p>
                          <p className="text-[11px] text-emerald-300/70">
                            {item.data.predictions[0]?.confidence}% • {item.timestamp}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-emerald-400">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Report or Clean 3-Step Pipeline Guide */}
          <div className="lg:col-span-7">
            {!result ? (
              <div className="flex h-full min-h-[360px] flex-col items-center justify-center rounded-2xl border border-emerald-800/50 bg-emerald-950/30 p-8 text-center">
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
                  <div className="rounded-xl border border-emerald-800/50 bg-[#020f0b]/70 p-3.5">
                    <Cpu className="h-4 w-4 text-emerald-400" />
                    <p className="mt-2 text-xs font-bold text-white">
                      {lang === "bn" ? "১. ভিশন মডেল" : "1. Vision Model"}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {lang === "bn" ? "MobileNetV2 দিয়ে ৩৮টি রোগ শনাক্ত" : "MobileNetV2 ONNX 38-class scan"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-800/50 bg-[#020f0b]/70 p-3.5">
                    <Database className="h-4 w-4 text-teal-400" />
                    <p className="mt-2 text-xs font-bold text-white">
                      {lang === "bn" ? "২. BARI/DAE RAG" : "2. BARI/DAE RAG"}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {lang === "bn" ? "অনুমোদিত কৃষি গাইডলাইন যাচাই" : "Verified agronomy protocol lookup"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-800/50 bg-[#020f0b]/70 p-3.5">
                    <ShieldCheck className="h-4 w-4 text-amber-400" />
                    <p className="mt-2 text-xs font-bold text-white">
                      {lang === "bn" ? "৩. নিরাপদ পরামর্শ" : "3. Safe Advisory"}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {lang === "bn" ? "অডিও ও কপি সুবিধা সহ প্রেসক্রিপশন" : "Bilingual audio & copy prescription"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <DiagnosisReport result={result} lang={lang} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}