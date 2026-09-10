"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Nfc, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { writeUrlToTag, isWebNfcSupported } from "@/lib/webnfc";

const STATES = {
  IDLE: "idle",
  WAITING: "waiting",
  SUCCESS: "success",
  ERROR: "error",
};

export default function NfcWriteButton({ url, accentColor = "#39ff88" }) {
  const [state, setState] = useState(STATES.IDLE);
  const [message, setMessage] = useState("");
  const supported = isWebNfcSupported();

  async function handleClick() {
    if (!supported) {
      setState(STATES.ERROR);
      setMessage("WebNFC needs Chrome for Android, served over HTTPS.");
      return;
    }

    setState(STATES.WAITING);
    setMessage("Hold a blank NTAG213/215 chip to the back of your device...");

    await writeUrlToTag(url, {
      onSuccess: () => {
        setState(STATES.SUCCESS);
        setMessage("Digital soul transferred. Tag is live.");
      },
      onError: (err) => {
        setState(STATES.ERROR);
        setMessage(err.message);
      },
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <motion.button
        onClick={handleClick}
        disabled={state === STATES.WAITING}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        style={{
          borderColor: `${accentColor}66`,
          boxShadow:
            state === STATES.WAITING
              ? `0 0 0 rgba(0,0,0,0)`
              : `0 0 24px ${accentColor}33`,
        }}
        className="clip-corner relative flex w-full items-center justify-center gap-3 overflow-hidden border bg-cyber-panel-2 px-5 py-3.5 font-display text-sm font-bold uppercase tracking-[0.2em] text-cyber-text transition disabled:cursor-wait disabled:opacity-80"
      >
        <span
          className="absolute inset-0 -z-10 opacity-10"
          style={{ background: `radial-gradient(circle at 30% 20%, ${accentColor}, transparent 60%)` }}
        />
        {state === STATES.WAITING ? (
          <Loader2 className="h-4 w-4 animate-spin" style={{ color: accentColor }} />
        ) : (
          <Nfc className="h-4 w-4" style={{ color: accentColor }} />
        )}
        <span style={{ color: accentColor }}>
          {state === STATES.WAITING ? "AWAITING TAP..." : "[ INITIALIZE DIGITAL SOUL ]"}
        </span>
      </motion.button>

      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key={state + message}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={
              "flex items-start gap-2 rounded-md border px-3 py-2 text-xs " +
              (state === STATES.SUCCESS
                ? "border-cyber-green/40 bg-cyber-green/10 text-cyber-green"
                : state === STATES.ERROR
                ? "border-cyber-red/40 bg-cyber-red/10 text-cyber-red"
                : "border-cyber-blue/40 bg-cyber-blue/10 text-cyber-blue")
            }
          >
            {state === STATES.SUCCESS && <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
            {state === STATES.ERROR && <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
            {state === STATES.WAITING && <Loader2 className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin" />}
            <span>{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
