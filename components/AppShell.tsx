"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  CalendarDays,
  Cloud,
  Download,
  Home,
  ListMusic,
  Menu,
  Moon,
  Music2,
  Settings,
  Sparkles,
  Sun,
  Users,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useWorshipStore } from "@/store/useWorshipStore";

const nav = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "songs", label: "Songs", icon: Music2 },
  { id: "setlists", label: "Setlists", icon: ListMusic },
  { id: "schedule", label: "Schedule", icon: CalendarDays },
  { id: "members", label: "Members", icon: Users },
  { id: "availability", label: "Availability", icon: Cloud },
  { id: "pdf", label: "PDF Studio", icon: Download },
  { id: "ai", label: "AI Assistant", icon: Bot },
  { id: "backup", label: "Backup", icon: Cloud },
  { id: "settings", label: "Settings", icon: Settings }
];

export function AppShell({ active, onNavigate, children }: { active: string; onNavigate: (id: string) => void; children: React.ReactNode }) {
  const { darkMode, toggleDarkMode, role, setRole } = useWorshipStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const sidebar = (
    <aside className="flex h-full flex-col gap-7 p-4">
      <div className="flex items-center gap-3 px-2">
        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[var(--line)] bg-white shadow-sm">
          <Image src="/agape-logo.jpeg" alt="Agape logo" fill className="object-cover" sizes="48px" priority />
        </div>
        <div>
          <p className="text-sm font-black uppercase leading-none tracking-normal">Agape</p>
          <p className="text-xs font-semibold text-[var(--muted)]">Worship Hub</p>
        </div>
      </div>

      <nav className="grid gap-2">
        {nav.map((item) => {
          const Icon = item.icon;
          const selected = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setOpen(false);
              }}
              className={`focus-ring group flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${
                selected
                  ? "bg-[var(--foreground)] text-[var(--background)] shadow-lg"
                  : "text-[var(--muted)] hover:bg-[var(--foreground)]/8 hover:text-[var(--foreground)]"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-[var(--line)] bg-[var(--foreground)] p-4 text-[var(--background)]">
        <Sparkles size={18} />
        <p className="mt-3 text-sm font-black">Sunday service in 5 days</p>
        <p className="mt-1 text-xs text-[var(--background)]/70">Team has 1 pending conflict to review.</p>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen thin-grid">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-4 px-3 py-3 md:px-5 md:py-5">
        <div className="premium-panel sticky top-5 hidden h-[calc(100vh-40px)] w-72 shrink-0 rounded-[28px] lg:block">{sidebar}</div>

        <main className="min-w-0 flex-1">
          <header className="premium-panel sticky top-3 z-30 mb-4 flex items-center justify-between gap-3 rounded-[24px] px-3 py-3 md:px-5">
            <button className="focus-ring rounded-full border border-[var(--line)] p-3 lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
              <Menu size={18} />
            </button>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase text-[var(--muted)]">Agape Worship Department</p>
              <h1 className="truncate text-xl font-black md:text-3xl">Agape Worship Hub</h1>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as typeof role)}
                className="focus-ring hidden rounded-full border border-[var(--line)] bg-transparent px-4 py-3 text-xs font-bold md:block"
                aria-label="Role"
              >
                <option>Admin</option>
                <option>Worship Leader</option>
                <option>Member Viewer</option>
              </select>
              <button className="focus-ring rounded-full border border-[var(--line)] p-3 transition hover:scale-105" onClick={toggleDarkMode} aria-label="Toggle dark mode">
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </header>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            {children}
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div className="fixed inset-0 z-50 bg-black/40 p-3 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="premium-panel h-full max-w-[340px] rounded-[28px]"
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
            >
              <button className="focus-ring absolute left-[295px] top-6 rounded-full bg-[var(--foreground)] p-3 text-[var(--background)]" onClick={() => setOpen(false)} aria-label="Close navigation">
                <X size={16} />
              </button>
              {sidebar}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
