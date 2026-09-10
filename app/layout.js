import "./globals.css";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "CYBER // NFC KIT",
  description:
    "Programmable NFC sticker dashboard. Tap to flash AI portals, utility hooks, and pranks straight onto NTAG213/215 chips.",
  keywords: [
    "NFC",
    "WebNFC",
    "NTAG213",
    "NTAG215",
    "cyberpunk",
    "stickers",
    "NVIDIA NIM",
    "Nebius",
  ],
  themeColor: "#05060a",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#05060a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="relative min-h-screen bg-cyber-black font-mono text-cyber-text antialiased">
        <div className="matrix-bg animate-matrix-scroll" aria-hidden="true" />
        <div className="scanline-overlay" aria-hidden="true" />
        <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
