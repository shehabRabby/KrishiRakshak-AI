"use client";

import { useSyncExternalStore } from "react";
import { DiagnosisResult } from "@/app/components/DiagnosisReport";

export interface HistoryItem {
  id: string;
  timestamp: string;
  preview: string;
  data: DiagnosisResult;
}

export interface SavedSession {
  previewUrl: string | null;
  result: DiagnosisResult | null;
  history: HistoryItem[];
}

const SESSION_KEY = "krishirakshak_active_session";
const EMPTY_SESSION: SavedSession = { previewUrl: null, result: null, history: [] };
let cachedRawSession: string | null = null;
let cachedParsedSession: SavedSession = EMPTY_SESSION;

function getSessionSnapshot(): SavedSession {
  if (typeof window === "undefined") return EMPTY_SESSION;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (raw === cachedRawSession) return cachedParsedSession;
  cachedRawSession = raw;
  try {
    cachedParsedSession = raw ? (JSON.parse(raw) as SavedSession) : EMPTY_SESSION;
  } catch {
    cachedParsedSession = EMPTY_SESSION;
  }
  return cachedParsedSession;
}

export function updateSession(next: SavedSession) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
  } catch {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ ...next, history: next.history.slice(0, 1) })
    );
  }
  window.dispatchEvent(new Event("krishirakshak_session_change"));
}

export function useKrishiLang() {
  const lang = useSyncExternalStore<"bn" | "en">(
    (cb) => {
      window.addEventListener("storage", cb);
      return () => window.removeEventListener("storage", cb);
    },
    () => (localStorage.getItem("krishirakshak_lang") === "en" ? "en" : "bn"),
    () => "bn"
  );

  const toggleLang = () => {
    const next = lang === "bn" ? "en" : "bn";
    localStorage.setItem("krishirakshak_lang", next);
    window.dispatchEvent(new Event("storage"));
  };

  return { lang, toggleLang };
}

export function useKrishiSession() {
  return useSyncExternalStore<SavedSession>(
    (cb) => {
      window.addEventListener("krishirakshak_session_change", cb);
      return () => window.removeEventListener("krishirakshak_session_change", cb);
    },
    getSessionSnapshot,
    () => EMPTY_SESSION
  );
}

export function fileToPersistentDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 480;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function useKrishiTheme() {
  const theme = useSyncExternalStore<"dark" | "light">(
    (cb) => {
      window.addEventListener("krishirakshak_theme_change", cb);
      return () => window.removeEventListener("krishirakshak_theme_change", cb);
    },
    () => (localStorage.getItem("krishirakshak_theme") === "light" ? "light" : "dark"),
    () => "dark"
  );

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    localStorage.setItem("krishirakshak_theme", next);
    if (next === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    window.dispatchEvent(new Event("krishirakshak_theme_change"));
  };

  return { theme, toggleTheme };
}