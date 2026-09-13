import Link from "next/link";
import { Github, Terminal, Cpu, ShieldCheck, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-cyber-border/70 bg-cyber-black/90 py-10 font-mono text-xs text-cyber-text-dim backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          
          {/* Brand & Node telemetry */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyber-green animate-pulse" />
              <span className="font-display font-bold tracking-wider text-cyber-text">
                NOT THE HUMAN // CYBER-NFC
              </span>
              <span className="rounded border border-cyber-border bg-cyber-panel px-1.5 py-0.5 text-[10px] text-cyber-text-dim">
                v1.0.4-PROD
              </span>
            </div>
            <p className="text-[11px] text-cyber-text-dim/80">
              Autonomous Physical Computing Grid &amp; Dual-Backend WebNFC Compiler.
            </p>
          </div>

          {/* Core Links & GitHub */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded border border-cyber-border/60 bg-cyber-panel/50 px-2.5 py-1 text-[11px]">
              <Cpu className="h-3.5 w-3.5 text-cyber-green" />
              <span>NVIDIA NIM</span>
              <span className="text-cyber-border">/</span>
              <ShieldCheck className="h-3.5 w-3.5 text-cyber-blue" />
              <span>Nebius HMAC</span>
            </div>

            <a
              href="https://github.com/not-the-human/not-the-human"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded border border-cyber-border bg-cyber-panel px-3 py-1.5 text-cyber-text transition hover:border-cyber-green/60 hover:bg-cyber-green/10 hover:text-cyber-green"
            >
              <Github className="h-4 w-4" />
              <span className="font-semibold">GitHub Source</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="my-6 h-px w-full bg-cyber-border/40" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-3 text-[10px] sm:flex-row">
          <p className="flex items-center gap-1 text-cyber-text-dim/70">
            <Terminal className="h-3 w-3 text-cyber-green" />
            <span>ROOT PROTOCOL // ALL CHIPS TUNED FOR NTAG213 &amp; NTAG215</span>
          </p>

          <p className="text-cyber-text-dim/60">
            &copy; {new Date().getFullYear()} NOT THE HUMAN. Open-Source Grid.
          </p>
        </div>
      </div>
    </footer>
  );
}