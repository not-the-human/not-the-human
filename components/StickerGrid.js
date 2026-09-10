"use client";

import { AnimatePresence, motion } from "framer-motion";
import StickerCard from "./StickerCard";
import StickerModal from "./StickerModal";

export default function StickerGrid({ stickers, activeSticker, onOpen, onClose }) {
  return (
    <>
      <motion.div
        layout
        className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:gap-4 sm:p-6 lg:grid-cols-4 xl:grid-cols-5"
      >
        <AnimatePresence mode="popLayout">
          {stickers.map((sticker) => (
            <StickerCard key={sticker.id} sticker={sticker} onOpen={onOpen} />
          ))}
        </AnimatePresence>
      </motion.div>

      {stickers.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
          <p className="font-display text-sm uppercase tracking-widest text-cyber-text-dim">
            No stickers in this kit yet
          </p>
          <p className="text-xs text-cyber-text-dim">
            New drops sync automatically from DatoCMS.
          </p>
        </div>
      )}

      <AnimatePresence>
        {activeSticker && (
          <StickerModal sticker={activeSticker} onClose={onClose} />
        )}
      </AnimatePresence>
    </>
  );
}
