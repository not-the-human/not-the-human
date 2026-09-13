"use client";

import { useState } from "react";
import {
  Cpu,
  Languages,
  Send,
  Server,
  Loader2,
  Radio,
  CheckCircle2,
  AlertTriangle,
  HardDriveDownload,
  Key,
  RefreshCcw,
} from "lucide-react";
import clsx from "clsx";

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

  try {
    const parsed = JSON.parse(content);
    if (parsed.type === "nfc_payload" && Array.isArray(parsed.records)) {
      return parsed;
    }
  } catch {}

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

  function handleResetTerminal() {
    setLog([]);
    setInput("");
    setNfcStatus(null);
    setWritingIndex(null);
    setBackend("nvidia");
  }

  async function handleTriggerNebiusCrypto(trenutniLog) {
    setBackend("nebius");
    const fiksnaKomanda = "dodaj kljuc";
    const userEntry = { role: "user", content: fiksnaKomanda };

    const noviLog = [...trenutniLog, userEntry];
    setLog(noviLog);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          backend: "nebius",
          mode: mode === "network_scanner" ? "chat" : mode,
          uloga: mode === "network_scanner" ? "network_scanner" : "default",
          targetLanguage,
          messages: noviLog,
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
                <button
                  onClick={() => setBackend("nvidia")}
                  className={clsx(
                    "flex items-center gap-2.5 rounded-md border px-3 py-2.5 text-left text-xs transition",
                    backend === "nvidia"
                      ? "border-cyber-green/50 bg-cyber-green/10 text-cyber-green"
                      : "border-cyber-border text-cyber-text-dim hover:border-cyber-border hover:text-cyber-text"
                  )}
                >
                  <Cpu className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    <span className="block font-semibold">NVIDIA NIM</span>
                    <span className="block text-[10px] opacity-70">Generate NFC Tag</span>
                  </span>
                </button>

                <button
                  onClick={() => handleTriggerNebiusCrypto(log)}
                  disabled={loading}
                  className={clsx(
                    "flex items-center gap-2.5 rounded-md border px-3 py-2.5 text-left text-xs transition disabled:opacity-50",
                    backend === "nebius"
                      ? "border-cyber-green/50 bg-cyber-green/10 text-cyber-green"
                      : "border-cyber-border text-cyber-text-dim hover:border-cyber-border hover:text-cyber-text"
                  )}
                >
                  <Key className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    <span className="block font-semibold">NEBIUS TOKEN</span>
                    <span className="block text-[10px] opacity-70">Add Security Key</span>
                  </span>
                </button>
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
                    <Languages className="h-3.5 w-3.5" />
                    <span>Translate</span>
                  </button>
                </div>

                <button
                  onClick={() => setMode("network_scanner")}
                  className={clsx(
                    "flex w-full items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition",
                    mode === "network_scanner"
                      ? "border-cyber-blue/50 bg-cyber-blue/10 text-cyber-blue shadow-neon-blue"
                      : "border-cyber-border text-cyber-text-dim"
                  )}
                >
                  <Radio className={clsx("h-3.5 w-3.5", mode === "network_scanner" && "animate-pulse")} />
                  <span>Network Scanner (Live Web)</span>
                </button>
              </div>
            </div>

            {mode === "translate" && (
              <div className="rounded-lg border border-cyber-border bg-cyber-panel p-4">
                <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.25em] text-cyber-text-dim">
                  Target Language
                </p>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full rounded-md border border-cyber-border bg-cyber-bg px-2.5 py-1.5 font-mono text-xs text-cyber-text outline-none focus:border-cyber-blue/50"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-cyber-bg text-cyber-text">
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="rounded-lg border border-cyber-border/80 bg-cyber-panel/60 p-3">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-cyber-text-dim">
                <HardDriveDownload className="h-3.5 w-3.5 text-cyber-green" />
                Chip Capability
              </p>
              <p className="mt-1 text-[11px] text-cyber-text-dim/80 leading-relaxed">
                NVIDIA dynamically generates standard NFC records while NEBIUS token contains SECURE/HMAC. 
                Synergy of speed of NVIDIA platform and enterprise security of Nebius in one functional NFC record!
              </p>
            </div>
            <div className="rounded-lg border border-cyber-border/80 bg-cyber-panel/60 p-3">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-cyber-text-dim">
                  <RefreshCcw className="h-3.5 w-3.5 text-cyber-green" />
                  Terminal Reset
                </p>
                <button
                  onClick={handleResetTerminal}
                  className="rounded border border-cyber-green/30 bg-cyber-green/10 px-2 py-0.5 text-[10px] font-mono font-bold text-cyber-green transition hover:bg-cyber-green/20 hover:border-cyber-green/60 active:scale-95"
                >
                  PURGE
                </button>
              </div>
              <p className="mt-1 text-[11px] text-cyber-text-dim/80 leading-relaxed">
                Clears memory buffer and history matrices for a clean NFC generation cycle.
              </p>
            </div>
          </div>

          {/* Terminal / Chat Area */}
          <div className="flex h-[600px] flex-col rounded-lg border border-cyber-border bg-cyber-panel overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cyber-border/80 bg-cyber-bg/70 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyber-red/80 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-cyber-yellow/80 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-cyber-green/80 inline-block" />
                <span className="ml-2 font-mono text-xs text-cyber-text-dim">
                  /API/CHAT - {backend.toUpperCase()} - {mode.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded border border-cyber-green/30 bg-cyber-green/10 px-2 py-0.5 text-[10px] font-mono text-cyber-green">
                <Radio className="h-3 w-3 animate-pulse" />
                <span>WEBNFC READY</span>
              </div>
            </div>

            {/* Logs Area */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4 font-mono text-xs scrollbar-thin scrollbar-thumb-cyber-border">
              {log.length === 0 && (
                <div className="flex h-full items-center justify-center text-center text-cyber-text-dim/60">
                  <p>&gt; awaiting input... try prompting: &quot;Pripremi navigaciju kolima do aerodroma&quot; ili &quot;Napravi vCard kontakt&quot;.</p>
                </div>
              )}

              {log.map((entry, idx) => {
                const nfcPayload = parseNfcPayload(entry.content);
                const bytes = nfcPayload ? calculateNdefBytes(nfcPayload.records) : 0;
                const bytesLeft = 144 - bytes;

                return (
                  <div key={idx} className="space-y-1">
                    <p className={clsx("font-semibold", entry.role === "user" ? "text-cyber-green" : "text-cyber-blue")}>
                      {entry.role === "user" ? "> user:" : `> core//node (${entry.backend || "system"}):`}
                    </p>

                    {!nfcPayload ? (
                      <p className="whitespace-pre-wrap rounded bg-cyber-bg/40 p-2.5 text-cyber-text leading-relaxed border border-cyber-border/40">
                        {entry.content}
                      </p>
                    ) : (
                      <div className="rounded border border-cyber-magenta/40 bg-cyber-bg/60 p-3 shadow-neon-magenta/10">
                        <div className="mb-2 flex items-center justify-between border-b border-cyber-border pb-2">
                          <span className="flex items-center gap-1.5 font-bold text-cyber-magenta">
                            <Radio className="h-3.5 w-3.5 animate-pulse" /> WebNFC Payload
                          </span>
                          <span className={clsx("text-[10px] font-mono font-bold", bytesLeft < 0 ? "text-cyber-red" : "text-cyber-text-dim")}>
                            {bytes} B | NTAG213 ({bytesLeft >= 0 ? `${bytesLeft}B left` : `${Math.abs(bytesLeft)}B OVERFLOW`})
                          </span>
                        </div>

                        <pre className="max-h-48 overflow-x-auto rounded bg-black/80 p-2.5 font-mono text-[11px] text-cyber-green scrollbar-thin">
                          {JSON.stringify(nfcPayload, null, 2)}
                        </pre>

                        <button
                          onClick={() => handleWriteNfc(nfcPayload.records, idx)}
                          disabled={writingIndex !== null || bytesLeft < 0}
                          className="mt-3 flex items-center gap-2 rounded bg-cyber-magenta px-3.5 py-1.5 font-sans text-xs font-bold text-black transition hover:bg-cyber-magenta/80 disabled:opacity-50"
                        >
                          {writingIndex === idx ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <HardDriveDownload className="h-3.5 w-3.5" />
                          )}
                          Write to NFC Tag
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center gap-2 text-cyber-blue font-mono text-xs">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Compiling grid matrices...</span>
                </div>
              )}
            </div>

            {/* Status Footer */}
            {nfcStatus && (
              <div
                className={clsx(
                  "border-t px-4 py-2 text-[11px] flex items-center gap-2 font-semibold font-mono",
                  nfcStatus.includes("Uspešno")
                    ? "bg-cyber-green/10 border-cyber-green/30 text-cyber-green"
                    : nfcStatus.includes("Prinesi")
                    ? "bg-cyber-blue/10 border-cyber-blue/30 text-cyber-blue animate-pulse"
                    : "bg-cyber-red/10 border-cyber-red/30 text-cyber-red"
                )}
              >
                {nfcStatus.includes("Uspešno") ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                ) : nfcStatus.includes("Prinesi") ? (
                  <Radio className="h-3.5 w-3.5 shrink-0 animate-pulse" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                )}
                <span>{nfcStatus}</span>
              </div>
            )}

            {/* Input Bar */}
            <div className="flex items-center gap-2 border-t border-cyber-border bg-cyber-bg/90 p-2.5">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={
                  mode === "translate"
                    ? "Unesi tekst za instant prevod..."
                    : "npr. Pripremi navigaciju kolima do aerodroma ili Wi-Fi stiker..."
                }
                disabled={loading}
                className="flex-1 bg-transparent px-3 py-1.5 font-mono text-xs text-cyber-text outline-none placeholder:text-cyber-text-dim/50 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="flex h-8 w-8 items-center justify-center rounded bg-cyber-green text-black transition hover:bg-cyber-green/80 disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}