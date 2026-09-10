"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function StickerCard({ sticker, onOpen }) {
  return (
    <motion.button
      layoutId={`sticker-card-${sticker.id}`}
      onClick={() => onOpen(sticker)}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-cyber-border bg-cyber-panel text-left shadow-panel transition-colors hover:border-[--accent]"
      style={{ "--accent": sticker.accentColor }}
    >
      <motion.div
        layoutId={`sticker-image-${sticker.id}`}
        className="relative aspect-square w-full overflow-hidden bg-cyber-panel-2"
      >
        {sticker.previewImage?.url ? (
          <Image
            src={sticker.previewImage.url}
            alt={sticker.previewImage.alt || sticker.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-cyber-text-dim">
            NO ASSET
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            boxShadow: `inset 0 0 0 2px ${sticker.accentColor}, 0 0 30px ${sticker.accentColor}55`,
          }}
        />
        <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/50 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          <ArrowUpRight className="h-3.5 w-3.5 text-white" />
        </div>
      </motion.div>

      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <motion.p
          layoutId={`sticker-name-${sticker.id}`}
          className="font-display text-sm font-bold tracking-wider text-cyber-text"
        >
          {sticker.name}
        </motion.p>
        <p className="line-clamp-2 text-xs leading-snug text-cyber-text-dim">
          {sticker.tagline}
        </p>
      </div>

      <div
        className="h-0.5 w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${sticker.accentColor}, transparent)` }}
      />
    </motion.button>
  );
}
