"use client";

import { motion } from "framer-motion";
import { Boxes, Cpu, Ghost, LayoutGrid, Wrench } from "lucide-react";
import clsx from "clsx";

const ICONS = {
  all: LayoutGrid,
  "ai-portals": Cpu,
  "utility-hooks": Wrench,
  "media-pranks": Ghost,
};

export default function Sidebar({ kits, activeKit, onSelectKit, counts }) {
  return (
    <>
      {/* Desktop sticky sidebar */}
      <aside className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-64 shrink-0 flex-col border-r border-cyber-border/70 bg-cyber-panel/60 px-3 py-6 md:flex">
        <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.3em] text-cyber-text-dim">
          Filter Kits
        </p>
        <nav className="flex flex-col gap-1">
          {kits.map((kit) => {
            const Icon = ICONS[kit.id] || Boxes;
            const active = activeKit === kit.id;
            return (
              <button
                key={kit.id}
                onClick={() => onSelectKit(kit.id)}
                className={clsx(
                  "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-all",
                  active
                    ? "bg-cyber-green/10 text-cyber-green shadow-neon-green"
                    : "text-cyber-text-dim hover:bg-cyber-panel-2 hover:text-cyber-text"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active-pill"
                    className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-cyber-green"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                <span className="flex-1 truncate">{kit.label}</span>
                <span
                  className={clsx(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    active ? "bg-cyber-green/20 text-cyber-green" : "bg-cyber-panel-2 text-cyber-text-dim"
                  )}
                >
                  {counts[kit.id] ?? 0}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto rounded-lg border border-cyber-border/70 bg-cyber-panel-2/60 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyber-blue">
            Chip Compatibility
          </p>
          <p className="mt-2 text-xs leading-relaxed text-cyber-text-dim">
            All kits are pre-tuned for NTAG213 / NTAG215. 504 &amp; 888 byte
            payloads supported.
          </p>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-cyber-border/70 bg-cyber-black/90 backdrop-blur-md md:hidden">
        {kits.map((kit) => {
          const Icon = ICONS[kit.id] || Boxes;
          const active = activeKit === kit.id;
          return (
            <button
              key={kit.id}
              onClick={() => onSelectKit(kit.id)}
              className={clsx(
                "relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition-colors",
                active ? "text-cyber-green" : "text-cyber-text-dim"
              )}
            >
              {active && (
                <motion.span
                  layoutId="bottom-nav-active"
                  className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-cyber-green shadow-neon-green"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon className="h-4 w-4" strokeWidth={2.25} />
              <span className="max-w-[64px] truncate">{kit.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
