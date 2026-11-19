"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Upload,
  Camera,
  Loader2,
  Trash2,
  Activity,
  History,
  X,
} from "lucide-react";
import { SavedSession, updateSession } from "@/app/lib/useKrishiStore";
import CameraModal from "./CameraModal";

interface Props {
  lang: "bn" | "en";
  session: SavedSession;
  loading: boolean;
  error: string | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  onAnalyze: () => void;
}

export default function LeafScannerPanel({
  lang,
  session,
  loading,
  error,
  onFileSelect,
  onClear,
  onAnalyze,
}: Props) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleDeleteHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    updateSession({
      previewUrl: session.previewUrl,
      result: session.result,
      history: session.history.filter((item) => item.id !== id),
    });
  };

  return (
    <div className="space-y-5 lg:col-span-5 no-print">
      {isCameraOpen && (
        <CameraModal
          lang={lang}
          onCapture={(file) => onFileSelect(file)}
          onClose={() => setIsCameraOpen(false)}
        />
      )}

      <div className="rounded-2xl border border-emerald-800/70 bg-gradient-to-b from-emerald-900/25 to-emerald-950/60 p-5 shadow-xl">
        <div className="mb-3 flex items-center justify-between text-xs font-semibold text-emerald-300">
          <span className="tracking-wider uppercase">
            {lang === "bn"
              ? "১. পাতার ছবি স্ক্যানার"
              : "1. Optical Leaf Scanner"}
          </span>
          {session.previewUrl && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 rounded-lg bg-rose-950/60 px-2 py-1 text-rose-300 transition hover:bg-rose-900/70"
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
            if (file?.type.startsWith("image/")) onFileSelect(file);
          }}
          className="relative flex min-h-[245px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-emerald-700/80 bg-[#020f0b]/85 p-5 transition hover:border-emerald-400"
        >
          {session.previewUrl ? (
            <div className="relative flex items-center justify-center">
              <Image
                src={session.previewUrl}
                alt="Leaf preview"
                width={240}
                height={240}
                unoptimized
                className="max-h-56 w-auto rounded-lg object-contain shadow-lg"
              />
              {loading && (
                <>
                  <div className="animate-scan-beam absolute inset-x-0 h-1 rounded-full bg-emerald-400 shadow-[0_0_18px_#34d399]" />
                  <div className="absolute inset-0 rounded-lg bg-emerald-500/10 backdrop-blur-[1px]" />
                </>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
                <Upload className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-semibold text-white">
                {lang === "bn"
                  ? "ছবি ড্র্যাগ করুন অথবা ক্লিক করুন"
                  : "Drag & drop or click to upload"}
              </p>
              <p className="mt-1 text-xs text-emerald-300/60">
                JPG, PNG, WEBP • 38 Crop Classes
              </p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files?.[0] && onFileSelect(e.target.files[0])
            }
            className="hidden"
          />
        </label>

        <button
          type="button"
          onClick={() => setIsCameraOpen(true)}
          className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-700/80 bg-[#020f0b]/80 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:border-emerald-500 hover:bg-emerald-950/60"
        >
          <Camera className="h-4 w-4 text-emerald-400" />
          <span>
            {lang === "bn" ? "ক্যামেরা দিয়ে ছবি তুলুন" : "Capture with Camera"}
          </span>
        </button>

        <button
          onClick={onAnalyze}
          disabled={!session.previewUrl || loading}
          className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-4 py-3 text-sm font-bold text-emerald-950 shadow-lg shadow-emerald-500/20 transition hover:from-emerald-300 hover:to-teal-400 active:scale-[0.99] disabled:opacity-40"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                {lang === "bn"
                  ? "AI ভিশন বিশ্লেষণ চলছে..."
                  : "Running Neural Scan..."}
              </span>
            </>
          ) : (
            <>
              <Activity className="h-4 w-4" />
              <span>
                {lang === "bn" ? "রোগ শনাক্ত করুন" : "Diagnose Disease"}
              </span>
            </>
          )}
        </button>

        {error && (
          <p className="mt-3 rounded-lg bg-rose-950/70 p-3 text-xs text-rose-200">
            {error}
          </p>
        )}
      </div>

      {session.history.length > 0 && (
        <div className="animate-fade-in rounded-2xl border border-emerald-800/60 bg-emerald-950/40 p-4">
          <div className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
            <History className="h-3.5 w-3.5" />
            <span>{lang === "bn" ? "সাম্প্রতিক স্ক্যান" : "Recent Scans"}</span>
          </div>
          <div className="space-y-2">
            {session.history.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  updateSession({
                    previewUrl: item.preview,
                    result: item.data,
                    history: session.history,
                  })
                }
                className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-emerald-800/50 bg-[#020f0b]/60 p-2 text-left transition hover:border-emerald-500/70"
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
                <button
                  onClick={(e) => handleDeleteHistoryItem(e, item.id)}
                  title={lang === "bn" ? "মুছে ফেলুন" : "Remove"}
                  className="rounded-lg p-1 text-slate-400 hover:bg-rose-950/60 hover:text-rose-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
