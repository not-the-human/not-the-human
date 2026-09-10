"use client";

import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import Image from "next/image";

export default function Header({ nfcSupported }) {
  return (
    <header className="sticky top-0 z-40 border-b border-cyber-border/70 bg-cyber-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-2.5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          {/* Povećan kontejner (h-12 w-12 / 48px) sa prilagođenim magenta neonom */}
          <div className="flex h-12 w-12 sm:h-12 sm:w-12 items-center justify-center rounded-lg border border-none shrink-0">
            <Image
              src="/logo.svg"
              alt="NOT THE HUMAN Logo"
              width={54}
              height={54}
              className="h-full w-full object-contain filter drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]"
              priority
            />
          </div>

          <div className="leading-tight">
            <p className="font-display text-sm sm:text-base font-bold tracking-[0.22em] text-cyber-text text-glow-green">
              NOT THE HUMAN
            </p>
            <p className="text-[9px] uppercase tracking-[0.3em] text-cyber-text-dim">
              NFC sticker kit v1.0
            </p>
          </div>
        </motion.div>

        <div className="flex items-center gap-3">
          <span
            className={
              "hidden items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider sm:flex " +
              (nfcSupported
                ? "border-cyber-green/40 bg-cyber-green/10 text-cyber-green"
                : "border-cyber-red/40 bg-cyber-red/10 text-cyber-red")
            }
          >
            <Radio className="h-3 w-3" />
            {nfcSupported ? "WebNFC Ready" : "WebNFC Unavailable"}
          </span>
          <a
            href="#marketplace"
            className="rounded-md border border-cyber-blue/40 bg-cyber-blue/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyber-blue transition hover:bg-cyber-blue/20 hover:shadow-neon-blue"
          >
            AI Marketplace
          </a>
        </div>
      </div>
    </header>
  );
}