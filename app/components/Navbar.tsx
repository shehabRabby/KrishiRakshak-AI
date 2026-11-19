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
    { href: "/tools", icon: Calculator, bn: "টুলস", en: "Tools", color: "text-amber-500" },
    { href: "/library", icon: Library, bn: "গাইড", en: "Library", color: "text-teal-500" },
    { href: "/docs", icon: BookOpen, bn: "ডকস", en: "Docs", color: "text-sky-500" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-800/40 bg-[#031510]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-3 py-2.5 sm:px-4 sm:py-3">
        {/* Top Row: Brand + Desktop Nav + Theme & Lang Actions */}
        <div className="flex items-center justify-between gap-2">
          <Link href="/" className="group flex min-w-0 items-center gap-2 sm:gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-emerald-950 shadow-md shadow-emerald-500/20 transition group-hover:scale-105 sm:h-9 sm:w-9">
              <Leaf className="h-4 w-4 stroke-[2.5] sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold tracking-tight text-white sm:text-base">
                KrishiRakshak AI
              </h1>
              <p className="truncate text-[10px] text-emerald-300/80 sm:text-[11px]">
                Crop Guardian • AgriSphere AI
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                    isActive
                      ? "border-emerald-500/60 bg-emerald-500/15 text-white shadow-sm"
                      : "border-emerald-800/70 bg-emerald-950/60 text-emerald-200 hover:border-emerald-600"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${item.color}`} />
                  <span>{lang === "bn" ? item.bn : item.en}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Theme + Language */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-800/70 bg-emerald-950/60 text-amber-400 transition hover:border-emerald-500 active:scale-95"
            >
              {theme === "dark" ? (
                <Sun className="h-3.5 w-3.5" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-emerald-700" />
              )}
            </button>

            <button
              onClick={toggleLang}
              className="flex h-8 items-center gap-1 rounded-xl bg-emerald-500 px-2.5 text-xs font-bold whitespace-nowrap text-emerald-950 shadow-sm transition hover:bg-emerald-400 active:scale-95 sm:px-3"
            >
              <Globe className="h-3.5 w-3.5 shrink-0" />
              <span>{lang === "bn" ? "English" : "বাংলা"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Bottom Navigation Strip (< md) */}
        <nav className="mt-2 grid grid-cols-4 gap-1.5 md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-center gap-1 rounded-lg border py-1.5 text-[11px] font-semibold transition ${
                  isActive
                    ? "border-emerald-500/70 bg-emerald-500/20 text-white shadow-sm"
                    : "border-emerald-800/60 bg-emerald-950/50 text-emerald-200"
                }`}
              >
                <Icon className={`h-3 w-3 shrink-0 ${item.color}`} />
                <span className="truncate">{lang === "bn" ? item.bn : item.en}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}