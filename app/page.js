"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import StickerGrid from "@/components/StickerGrid";
import IntegrationsMarketplace from "@/components/IntegrationsMarketplace";
import Footer from "@/components/Footer";
import { KITS, mockStickers } from "@/data/mockStickers";
import { isWebNfcSupported } from "@/lib/webnfc";

export default function DashboardPage() {
  const [stickers, setStickers] = useState(mockStickers);
  const [activeKit, setActiveKit] = useState("all");
  const [activeSticker, setActiveSticker] = useState(null);
  const [nfcSupported, setNfcSupported] = useState(false);

  useEffect(() => {
    setNfcSupported(isWebNfcSupported());
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadFromCms() {
      try {
        const res = await fetch("/api/stickers", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data.stickers) && data.stickers.length > 0) {
          setStickers(data.stickers);
        }
      } catch {
        // DatoCMS not configured / offline
      }
    }

    loadFromCms();
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const c = { all: stickers.length };
    for (const kit of KITS) {
      if (kit.id === "all") continue;
      c[kit.id] = stickers.filter((s) => s.kit === kit.id).length;
    }
    return c;
  }, [stickers]);

  const visibleStickers = useMemo(() => {
    if (activeKit === "all") return stickers;
    return stickers.filter((s) => s.kit === activeKit);
  }, [stickers, activeKit]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header nfcSupported={nfcSupported} />

      {/* Glavni radni prostor: Sidebar + Main */}
      <div className="flex flex-1">
        <Sidebar
          kits={KITS}
          activeKit={activeKit}
          onSelectKit={setActiveKit}
          counts={counts}
        />

        <main className="flex-1 pb-24 md:pb-0">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border-b border-cyber-border/60 bg-grid-fade bg-scanlines px-4 py-10 sm:px-6 sm:py-14"
          >
            <p className="mb-3 inline-block rounded-full border border-cyber-green/40 bg-cyber-green/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-cyber-green">
              NTAG213 / NTAG215 &middot; WebNFC &middot; NDEFReader()
            </p>
            <h1 className="max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-tight text-cyber-text text-glow-green sm:text-4xl md:text-5xl">
              Flash your <span className="text-cyber-green">digital soul</span>{" "}
              onto physical stickers.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-cyber-text-dim sm:text-base">
              Browse the kit, tap a card to inspect the payload, then press
              <span className="mx-1 font-semibold text-cyber-green">
                [ INITIALIZE DIGITAL SOUL ]
              </span>
              to write it to an NTAG chip in a single contact.
            </p>
          </motion.section>

          <StickerGrid
            stickers={visibleStickers}
            activeSticker={activeSticker}
            onOpen={setActiveSticker}
            onClose={() => setActiveSticker(null)}
          />

          <IntegrationsMarketplace />
        </main>
      </div>

      {/* Footer se nalazi na samom dnu stranice preko cele širine */}
      <Footer />
    </div>
  );
}