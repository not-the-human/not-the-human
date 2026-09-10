"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Download, X } from "lucide-react";
import NfcWriteButton from "./NfcWriteButton";
import { cloudinaryDownloadUrl } from "@/lib/cloudinary";

export default function StickerModal({ sticker, onClose }) {
  const downloadUrl =
    sticker.printAsset?.url ||
    (sticker.printAsset?.filename
      ? cloudinaryDownloadUrl(sticker.printAsset.filename, sticker.printAsset.filename)
      : null);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        layoutId={`sticker-card-${sticker.id}`}
        onClick={(e) => e.stopPropagation()}
        className="glass-panel relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-cyber-border shadow-panel sm:flex-row"
        style={{ "--accent": sticker.accentColor }}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <motion.div
          layoutId={`sticker-image-${sticker.id}`}
          className="relative aspect-square w-full shrink-0 bg-cyber-panel-2 sm:w-64"
        >
          {sticker.previewImage?.url ? (
            <Image
              src={sticker.previewImage.url}
              alt={sticker.previewImage.alt || sticker.name}
              fill
              sizes="(max-width: 640px) 100vw, 256px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-cyber-text-dim">
              NO ASSET
            </div>
          )}
        </motion.div>

        <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
          <div>
            <span
              className="mb-2 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
              style={{ borderColor: `${sticker.accentColor}66`, color: sticker.accentColor }}
            >
              {sticker.kit.replace("-", " ")}
            </span>
            <motion.h2
              layoutId={`sticker-name-${sticker.id}`}
              className="font-display text-xl font-extrabold tracking-wide text-cyber-text"
            >
              {sticker.name}
            </motion.h2>
            <p className="mt-2 text-sm leading-relaxed text-cyber-text-dim">
              {sticker.description}
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <NfcWriteButton url={sticker.webhookUrl} accentColor={sticker.accentColor} />

            {downloadUrl && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-md border border-cyber-border bg-cyber-panel-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-cyber-text-dim transition hover:border-cyber-blue/50 hover:text-cyber-blue"
              >
                <Download className="h-3.5 w-3.5" />
                Download Print Assets
              </a>
            )}
          </div>

          <div className="mt-auto rounded-md border border-cyber-border/70 bg-black/30 p-2.5">
            <p className="truncate font-mono text-[11px] text-cyber-text-dim">
              target &rarr; <span className="text-cyber-green">{sticker.webhookUrl}</span>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
