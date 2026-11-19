import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KrishiRakshak AI • Autonomous Crop Pathology & Agronomy Advisor",
  description: "MobileNetV2 ONNX Vision + BARI/DAE Grounded RAG Bilingual Crop Advisory Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex min-h-screen flex-col antialiased`}>
        <Navbar />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-emerald-900/50 bg-[#020f0b] py-4 text-center text-xs text-emerald-300/60">
          KrishiRakshak AI • International AI Builders Congress 2026 • Grounded in BARI & DAE Protocols
        </footer>
      </body>
    </html>
  );
}