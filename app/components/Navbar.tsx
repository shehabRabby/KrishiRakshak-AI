"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Globe, BookOpen, Calculator, Library, ScanLine, Sun, Moon } from "lucide-react";
import { useKrishiLang, useKrishiTheme } from "@/app/lib/useKrishiStore";

export default function Navbar() {
  const pathname = usePathname();
  const { lang, toggleLang } = useKrishiLang();
  const { theme, toggleTheme } = useKrishiTheme();

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [theme]);

  const navItems = [
    { href: "/", icon: ScanLine, bn: "স্ক্যানার", en: "Scanner", color: "text-emerald-500" },
    { href: "/tools", icon: Calculator, bn: "ক্যালকুলেটর", en: "Tools", color: "text-amber-500" },
    { href: "/library", icon: Library, bn: "গাইডলাইন", en: "Library", color: "text-teal-500" },
    { href: "/docs", icon: BookOpen, bn: "ডকস", en: "Docs", color: "text-sky-500" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-800/40 bg-[#031510]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-emerald-950 shadow-md shadow-emerald-500/20 transition group-hover:scale-105">
            <Leaf className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">KrishiRakshak AI</h1>
            <p className="text-[11px] text-emerald-300/80">Crop Guardian • AgriSphere AI</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition sm:px-3 ${
                  isActive
                    ? "border-emerald-500/60 bg-emerald-500/15 text-white shadow-sm"
                    : "border-emerald-800/70 bg-emerald-950/60 text-emerald-200 hover:border-emerald-600"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${item.color}`} />
                <span className="hidden sm:inline">{lang === "bn" ? item.bn : item.en}</span>
              </Link>
            );
          })}

          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="flex items-center justify-center rounded-xl border border-emerald-800/70 bg-emerald-950/60 p-2 text-amber-400 transition hover:border-emerald-500 active:scale-95"
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5 text-emerald-700" />}
          </button>

          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-emerald-950 shadow-sm transition hover:bg-emerald-400 active:scale-95"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{lang === "bn" ? "English" : "বাংলা"}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}