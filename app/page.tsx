"use client";

import React, { useState } from "react";
import DiagnosisReport, { DiagnosisResult } from "./components/DiagnosisReport";
import LeafScannerPanel from "./components/LeafScannerPanel";
import ScannerEmptyState from "./components/ScannerEmptyState";
import {
  useKrishiLang,
  useKrishiSession,
  updateSession,
  fileToPersistentDataUrl,
  HistoryItem,
} from "./lib/useKrishiStore";

export default function HomePage() {
  const { lang } = useKrishiLang();
  const session = useKrishiSession();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setError(null);
    const dataUrl = await fileToPersistentDataUrl(file);
    updateSession({ previewUrl: dataUrl, result: null, history: session.history });
  };

  const handleClear = () => {
    setSelectedFile(null);
    setError(null);
    updateSession({ previewUrl: null, result: null, history: session.history });
  };

  const handleAnalyze = async () => {
    if (!session.previewUrl) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("image", selectedFile);
      } else {
        const blob = await (await fetch(session.previewUrl)).blob();
        formData.append("image", blob, "leaf.jpg");
      }

      const res = await fetch("/api/diagnose", { method: "POST", body: formData });
      const data: DiagnosisResult & { error?: string } = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        preview: session.previewUrl,
        data,
      };

      updateSession({
        previewUrl: session.previewUrl,
        result: data,
        history: [newItem, ...session.history.slice(0, 3)],
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 text-center no-print">
        <h2 className="bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
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
        <LeafScannerPanel
          lang={lang}
          session={session}
          loading={loading}
          error={error}
          onFileSelect={handleFileSelect}
          onClear={handleClear}
          onAnalyze={handleAnalyze}
        />

        <div className="lg:col-span-7">
          {!session.result ? (
            <ScannerEmptyState lang={lang} />
          ) : (
            <div className="animate-fade-in">
              <DiagnosisReport result={session.result} lang={lang} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}