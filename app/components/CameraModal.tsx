"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, X, SwitchCamera, AlertCircle } from "lucide-react";

interface CameraModalProps {
  lang: "bn" | "en";
  onCapture: (file: File) => void;
  onClose: () => void;
}

export default function CameraModal({ lang, onCapture, onClose }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function startCamera() {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        if (isMounted) {
          setCameraError(
            lang === "bn"
              ? "ক্যামেরা চালু করা যাচ্ছে না। ব্রাউজারে ক্যামেরা পারমিশন দিন অথবা ছবি আপলোড করুন।"
              : "Unable to access camera. Please allow camera permission in your browser."
          );
        }
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [facingMode, lang]);

  const handleTakePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const capturedFile = new File([blob], `leaf_capture_${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        onCapture(capturedFile);
        onClose();
      },
      "image/jpeg",
      0.92
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="animate-fade-in w-full max-w-lg overflow-hidden rounded-2xl border border-emerald-700 bg-[#031510] shadow-2xl">
        <div className="flex items-center justify-between border-b border-emerald-800/60 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Camera className="h-4 w-4 text-emerald-400" />
            <span>{lang === "bn" ? "লাইভ পাতা স্ক্যান ক্যামেরা" : "Live Leaf Capture Camera"}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-950/60 hover:text-rose-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative flex aspect-video w-full items-center justify-center bg-black">
          {cameraError ? (
            <div className="flex flex-col items-center gap-2 px-6 text-center text-xs text-rose-300">
              <AlertCircle className="h-7 w-7 text-rose-400" />
              <p>{cameraError}</p>
            </div>
          ) : (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-8 rounded-xl border-2 border-dashed border-emerald-400/70" />
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 bg-[#020f0b] px-4 py-3.5">
          <button
            type="button"
            onClick={() => setFacingMode((prev) => (prev === "environment" ? "user" : "environment"))}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-800 bg-emerald-950/70 px-3 py-2 text-xs font-semibold text-emerald-200 hover:border-emerald-500"
          >
            <SwitchCamera className="h-4 w-4 text-emerald-400" />
            <span>{lang === "bn" ? "ক্যামেরা ঘোরান" : "Flip"}</span>
          </button>

          <button
            type="button"
            disabled={!!cameraError}
            onClick={handleTakePhoto}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-emerald-950 shadow-lg hover:bg-emerald-400 disabled:opacity-40"
          >
            <Camera className="h-4 w-4" />
            <span>{lang === "bn" ? "ছবি তুলুন ও স্ক্যানারে দিন" : "Snap & Use Photo"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}