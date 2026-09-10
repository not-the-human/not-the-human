"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  Languages,
  Send,
  Server,
  Loader2,
  Globe,
  Radio,
  CheckCircle2,
  AlertTriangle,
  HardDriveDownload,
} from "lucide-react";
import clsx from "clsx";

const BACKENDS = [
  { id: "nvidia", label: "NVIDIA NIM", desc: "Llama 3 runtime (default)" },
  { id: "nebius", label: "Nebius AI Studio", desc: "Alternative cloud compute" },
];

const LANGUAGES = [
  { code: "sr", label: "Serbian" },
  { code: "ru", label: "Russian" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
  { code: "fr", label: "French" },
  { code: "ja", label: "Japanese" },
  { code: "zh", label: "Chinese" },
  { code: "ar", label: "Arabic" },
  { code: "pt", label: "Portuguese" },
  { code: "tr", label: "Turkish" },
];

function calculateNdefBytes(records) {
  if (!Array.isArray(records)) return 0;
  const encoder = new TextEncoder();
  return records.reduce((total, rec) => {
    const dataBytes = encoder.encode(rec.data || "").length;
    const typeBytes = encoder.encode(rec.mimeType || rec.recordType || "").length;
    return total + dataBytes + typeBytes + 4; // ~4B NDEF record overhead
  }, 0);
}

function parseNfcPayload(content) {
  if (!content || typeof content !== "string") return null;

  // 1. Probaj direktan parse
  try {
    const parsed = JSON.parse(content);
    if (parsed.type === "nfc_payload" && Array.isArray(parsed.records)) {
      return parsed;
    }
  } catch {}

  // 2. Izdvoji sve JSON blokove koji počinju sa {"type":"nfc_payload"
  const matches = content.match(/\{"type"\s*:\s*"nfc_payload"[\s\S]*?\}\s*\]\s*\}/g);
  if (matches && matches.length > 0) {
    for (let i = matches.length - 1; i >= 0; i--) {
      try {
        const parsed = JSON.parse(matches[i]);
        if (Array.isArray(parsed.records) && parsed.records.length > 0) {
          return parsed;
        }
      } catch {}
    }
  }

  // 3. Fallback: segmentacija od starta payload-a do kraja niza
  try {
    const start = content.indexOf('{"type"');
    if (start !== -1) {
      const end = content.indexOf("}]}", start);
      if (end !== -1) {
        const candidate = content.slice(start, end + 3);
        const parsed = JSON.parse(candidate);
        if (parsed.type === "nfc_payload") return parsed;
      }
    }
  } catch {}

  return null;
}

export default function IntegrationsMarketplace() {
  const [backend, setBackend] = useState("nvidia");
  const [mode, setMode] = useState("chat");
  const [targetLanguage, setTargetLanguage] = useState("sr");
  const [input, setInput] = useState("");
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nfcStatus, setNfcStatus] = useState(null);
  const [writingIndex, setWritingIndex] = useState(null);

  async function handleWriteNfc(records, index) {
    if (typeof window === "undefined" || !("NDEFReader" in window)) {
      setNfcStatus("WebNFC nije podržan na ovom browseru (potreban Chrome na Android uređaju).");
      return;
    }

    try {
      setWritingIndex(index);
      setNfcStatus("Prinesi NFC stiker pozadini uređaja...");

      const ndef = new window.NDEFReader();
      await ndef.write({
        records: records.map((r) => {
          if (r.recordType === "url") {
            return { recordType: "url", data: r.data };
          }
          if (r.recordType === "mime") {
            return { recordType: "mime", mediaType: r.mimeType || "text/plain", data: r.data };
          }
          return { recordType: "text", data: r.data };
        }),
      });

      setNfcStatus("Uspešno upisano na stiker!");
      setTimeout(() => {
        setNfcStatus(null);
        setWritingIndex(null);
      }, 4000);
    } catch (err) {
      setNfcStatus(`Greška pri upisu: ${err.message || err}`);
      setWritingIndex(null);
    }
  }

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userEntry = { role: "user", content: input };
    setLog((prev) => [...prev, userEntry]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          backend,
          mode: mode === "network_scanner" ? "chat" : mode,
          uloga: mode === "network_scanner" ? "network_scanner" : "default",
          targetLanguage,
          messages: [...log, userEntry],
        }),
      });
      const data = await res.json();
      setLog((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || data.error || "No response from backend.",
          backend: data.backend,
        },
      ]);
    } catch (err) {
      setLog((prev) => [
        ...prev,
        { role: "assistant", content: `Request failed: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="marketplace" className="border-t border-cyber-border/70 bg-cyber-panel/40 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-cyber-magenta/40 bg-cyber-magenta/10 shadow-neon-magenta">
            <Server className="h-5 w-5 text-cyber-magenta" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold tracking-wide text-cyber-text">
              Advanced Integrations Marketplace
            </h2>
            <p className="text-xs text-cyber-text-dim">
              Route payloads through NVIDIA NIM / Nebius AI &amp; flash direct WebNFC records.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Controls */}
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-cyber-border bg-cyber-panel p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-cyber-text-dim">
                Inference Backend
              </p>
              <div className="flex flex-col gap-2">
                {BACKENDS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBackend(b.id)}
                    className={clsx(
                      "flex items-center gap-2.5 rounded-md border px-3 py-2.5 text-left text-xs transition",
                      backend === b.id
                        ? "border-cyber-green/50 bg-cyber-green/10 text-cyber-green"
                        : "border-cyber-border text-cyber-text-dim hover:border-cyber-border hover:text-cyber-text"
                    )}
                  >
                    <Cpu className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      <span className="block font-semibold">{b.label}</span>
                      <span className="block text-[10px] opacity-70">{b.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-cyber-border bg-cyber-panel p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-cyber-text-dim">
                Pipeline Mode
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setMode("chat")}
                    className={clsx(
                      "flex-1 rounded-md border px-3 py-2 text-xs font-semibold transition",
                      mode === "chat"
                        ? "border-cyber-blue/50 bg-cyber-blue/10 text-cyber-blue"
                        : "border-cyber-border text-cyber-text-dim"
                    )}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => setMode("translate")}
                    className={clsx(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition",
                      mode === "translate"
                        ? "border-cyber-blue/50 bg-cyber-blue/10 text-cyber-blue"
                        : "border-cyber-border text-cyber-text-dim"
                    )}
                  >
                    <Languages className="h-3.5 w-3.5" /> Translate
                  </button>
                </div>

                <button
                  onClick={() => setMode("network_scanner")}
                  className={clsx(
                    "w-full flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition",
                    mode === "network_scanner"
                      ? "border-cyber-magenta/50 bg-cyber-magenta/10 text-cyber-magenta"
                      : "border-cyber-border text-cyber-text-dim"
                  )}
                >
                  <Globe className="h-3.5 w-3.5" /> Network Scanner (Live Web)
                </button>
              </div>

              {mode === "translate" && (
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="mt-3 w-full rounded-md border border-cyber-border bg-cyber-panel-2 px-2.5 py-2 text-xs text-cyber-text focus:border-cyber-blue focus:outline-none"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Terminal chat */}
          <div className="flex flex-col rounded-lg border border-cyber-border bg-black/40">
            <div className="flex items-center justify-between border-b border-cyber-border/70 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-cyber-red/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-cyber-amber/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-cyber-green/70" />
                <span className="ml-3 font-mono text-[10px] uppercase tracking-widest text-cyber-text-dim">
                  /api/chat &mdash; {backend} &middot; {mode}
                </span>
              </div>
              <span className="font-mono text-[9px] text-cyber-text-dim uppercase tracking-wider hidden sm:inline">
                WebNFC Ready
              </span>
            </div>

            <div className="flex h-72 flex-col gap-3 overflow-y-auto px-4 py-4 sm:h-80">
              {log.length === 0 && (
                <p className="font-mono text-xs text-cyber-text-dim">
                  &gt; awaiting input... try prompting: &quot;Pripremi navigaciju kolima do aerodroma&quot; or &quot;Napravi vCard kontakt&quot;.
                </p>
              )}
              {log.map((entry, i) => {
                const nfcPayload = entry.role === "assistant" ? parseNfcPayload(entry.content) : null;
                const totalBytes = nfcPayload ? calculateNdefBytes(nfcPayload.records) : 0;
                const isOverNtag213 = totalBytes > 144;
                const isOverNtag215 = totalBytes > 504;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={clsx(
                      "max-w-[90%] rounded-md px-3 py-2.5 text-xs leading-relaxed",
                      entry.role === "user"
                        ? "self-end bg-cyber-green/10 text-cyber-green"
                        : "self-start bg-cyber-panel-2 text-cyber-text"
                    )}
                  >
                    {nfcPayload ? (
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyber-border/70 pb-2">
                          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-cyber-magenta">
                            <Radio className="h-3.5 w-3.5 animate-pulse" />
                            WEBNFC PAYLOAD
                          </div>

                          <div className="flex items-center gap-1.5 font-mono text-[10px]">
                            <span
                              className={clsx(
                                "px-1.5 py-0.5 rounded border font-semibold",
                                !isOverNtag213
                                  ? "border-cyber-green/60 bg-cyber-green/10 text-cyber-green"
                                  : !isOverNtag215
                                  ? "border-cyber-amber/60 bg-cyber-amber/10 text-cyber-amber"
                                  : "border-cyber-red/60 bg-cyber-red/10 text-cyber-red"
                              )}
                            >
                              {totalBytes} B
                            </span>
                            <span className="text-cyber-text-dim">
                              {!isOverNtag213
                                ? "NTAG213 (144B)"
                                : !isOverNtag215
                                ? "NTAG215 (504B)"
                                : "NTAG216 (888B)"}
                            </span>
                          </div>
                        </div>

                        <div className="rounded border border-cyber-border bg-black/60 p-2 font-mono text-[10px] text-cyber-text-dim">
                          <pre className="overflow-x-auto text-cyber-text whitespace-pre-wrap">
                            {JSON.stringify(nfcPayload.records, null, 2)}
                          </pre>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <button
                            onClick={() => handleWriteNfc(nfcPayload.records, i)}
                            disabled={writingIndex === i}
                            className="flex items-center gap-2 rounded border border-cyber-magenta/50 bg-cyber-magenta/20 px-3 py-1.5 font-mono text-xs font-semibold text-cyber-magenta transition hover:bg-cyber-magenta/30 disabled:opacity-50"
                          >
                            {writingIndex === i ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <HardDriveDownload className="h-3.5 w-3.5" />
                            )}
                            Write to NFC Tag
                          </button>

                          {writingIndex === i && nfcStatus && (
                            <span className="flex items-center gap-1 font-mono text-[10px] text-cyber-amber">
                              <AlertTriangle className="h-3 w-3" />
                              {nfcStatus}
                            </span>
                          )}

                          {writingIndex !== i && nfcStatus && (
                            <span className="flex items-center gap-1 font-mono text-[10px] text-cyber-green">
                              <CheckCircle2 className="h-3 w-3" />
                              {nfcStatus}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      entry.content
                    )}
                  </motion.div>
                );
              })}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-cyber-text-dim">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  routing through {backend}
                  {mode === "network_scanner" && " + capturing live network data..."}...
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-cyber-border/70 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                type="text"
                placeholder={
                  mode === "network_scanner"
                    ? "Ask something that requires live web search..."
                    : "npr. Pripremi navigaciju kolima do aerodroma ili Wi-Fi stiker..."
                }
                className="flex-1 bg-black/40 font-mono text-xs text-cyber-text placeholder-cyber-text-dim/50 border border-cyber-border rounded-md px-3 py-2 focus:outline-none focus:border-cyber-green/50"
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-cyber-green/40 bg-cyber-green/10 text-cyber-green transition hover:bg-cyber-green/20 disabled:opacity-50"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}