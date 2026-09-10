/**
 * Local fallback content, used whenever DATOCMS_TOKEN is not configured.
 * Shape matches the normalized objects returned by lib/datocms.js so
 * components never need to know which source they came from.
 */

export const KITS = [
  { id: "all", label: "All Kits" },
  { id: "ai-portals", label: "AI Portals" },
  { id: "utility-hooks", label: "Utility Hooks" },
  { id: "media-pranks", label: "Media / Pranks" },
];

export const mockStickers = [
  {
    id: "s1",
    slug: "nim-oracle",
    name: "NIM ORACLE",
    tagline: "Tap-to-chat with a Llama 3 runtime.",
    description:
      "A single tap opens a live NVIDIA NIM-backed chat session pinned to this physical sticker. Great for kiosks, business cards, and desk easter eggs.",
    kit: "ai-portals",
    role: "default",
    webhookUrl: "https://cyber-nfc-kit.vercel.app/ai/nim-oracle",
    accentColor: "#39ff88",
    previewImage: { url: "https://res.cloudinary.com/xs3nq3zj/image/upload/v1788998935/Untitled_design_12.png", alt: "NIM Oracle sticker art" },
    printAsset: { url: "https://res.cloudinary.com/demo/image/upload/fl_attachment/cyber-nfc-kit/nim-oracle-print.pdf", format: "pdf", filename: "nim-oracle-print.pdf" },
  },
  {
    id: "s2",
    slug: "polyglot-node",
    name: "POLYGLOT NODE",
    tagline: "Real-time translation, one tap away.",
    description:
      "Routes through the NVIDIA NIM Translator utility hook for instant, ultra-fast language translation. Ideal for hostel lockers, market stalls, and travel gear.",
    kit: "utility-hooks",
    role: "default",
    webhookUrl: "https://cyber-nfc-kit.vercel.app/ai/polyglot-node",
    accentColor: "#22d3ee",
    previewImage: { url: "https://res.cloudinary.com/xs3nq3zj/image/upload/v1788998929/Untitled_design_13.png", alt: "Polyglot Node sticker art" },
    printAsset: { url: "https://res.cloudinary.com/demo/image/upload/fl_attachment/cyber-nfc-kit/polyglot-node-print.pdf", format: "pdf", filename: "polyglot-node-print.pdf" },
  },
  {
    id: "s3",
    slug: "nebius-relay",
    name: "NEBIUS RELAY",
    tagline: "Swap-in cloud inference backend.",
    description:
      "Identical footprint to NIM ORACLE, but pre-wired to Nebius AI Studio for teams testing alternate model endpoints and pricing tiers.",
    kit: "ai-portals",
    role: "default",
    webhookUrl: "https://cyber-nfc-kit.vercel.app/ai/nebius-relay",
    accentColor: "#ff2fd1",
    previewImage: { url: "https://res.cloudinary.com/xs3nq3zj/image/upload/v1788998134/ChatGPT_Image_Sep_10_2026_01_50_20_AM.png", alt: "Nebius Relay sticker art" },
    printAsset: { url: "https://res.cloudinary.com/demo/image/upload/fl_attachment/cyber-nfc-kit/nebius-relay-print.pdf", format: "pdf", filename: "nebius-relay-print.pdf" },
  },
  {
    id: "s4",
    slug: "wifi-ghost",
    name: "WIFI GHOST",
    tagline: "Instant guest network handshake.",
    description:
      "Encodes WiFi credentials directly into the tag payload so guests connect with a single tap, no typing required.",
    kit: "utility-hooks",
    role: "default",
    webhookUrl: "https://cyber-nfc-kit.vercel.app/hooks/wifi-ghost",
    accentColor: "#ffb020",
    previewImage: { url: "https://res.cloudinary.com/xs3nq3zj/image/upload/v1788998351/ChatGPT_Image_Aug_20_2026_11_02_39_PM.png", alt: "WiFi Ghost sticker art" },
    printAsset: { url: "https://res.cloudinary.com/demo/image/upload/fl_attachment/cyber-nfc-kit/wifi-ghost-print.pdf", format: "pdf", filename: "wifi-ghost-print.pdf" },
  },
  {
    id: "s5",
    slug: "rickroll-node",
    name: "RICKROLL.NODE",
    tagline: "The classic. Reforged in NTAG213.",
    description:
      "A tribute sticker for the front door, the office fridge, or a friend's laptop. You already know what happens when this one gets tapped.",
    kit: "media-pranks",
    role: "default",
    webhookUrl: "https://cyber-nfc-kit.vercel.app/pranks/rickroll-node",
    accentColor: "#ff3b5c",
    previewImage: { url: "https://res.cloudinary.com/xs3nq3zj/image/upload/v1788998152/ChatGPT_Image_Sep_10_2026_01_49_02_AM.png", alt: "Rickroll Node sticker art" },
    printAsset: { url: "https://res.cloudinary.com/demo/image/upload/fl_attachment/cyber-nfc-kit/rickroll-node-print.pdf", format: "pdf", filename: "rickroll-node-print.pdf" },
  },
  {
    id: "s6",
    slug: "airhorn-trap",
    name: "AIRHORN TRAP",
    tagline: "Deploys maximum volume on contact.",
    description:
      "Opens a page that immediately plays an airhorn sample at full blast. Deploy responsibly (or don't).",
    kit: "media-pranks",
    role: "default",
    webhookUrl: "https://cyber-nfc-kit.vercel.app/pranks/airhorn-trap",
    accentColor: "#ff3b5c",
    previewImage: { url: "https://res.cloudinary.com/xs3nq3zj/image/upload/v1788998260/ChatGPT_Image_Aug_28_2026_06_45_19_AM.png", alt: "Airhorn Trap sticker art" },
    printAsset: { url: "https://res.cloudinary.com/demo/image/upload/fl_attachment/cyber-nfc-kit/airhorn-trap-print.pdf", format: "pdf", filename: "airhorn-trap-print.pdf" },
  },
  {
    id: "s7",
    slug: "vcard-beacon",
    name: "VCARD BEACON",
    tagline: "Tap to save contact, instantly.",
    description:
      "Encodes a vCard payload so a single tap adds your details straight to a phone's contacts app. No app install needed.",
    kit: "utility-hooks",
    role: "default",
    webhookUrl: "https://cyber-nfc-kit.vercel.app/hooks/vcard-beacon",
    accentColor: "#22d3ee",
    previewImage: { url: "https://res.cloudinary.com/xs3nq3zj/image/upload/v1788998295/ChatGPT_Image_Aug_30_2026_10_12_13_PM.png", alt: "vCard Beacon sticker art" },
    printAsset: { url: "https://res.cloudinary.com/demo/image/upload/fl_attachment/cyber-nfc-kit/vcard-beacon-print.pdf", format: "pdf", filename: "vcard-beacon-print.pdf" },
  },
  {
    id: "s8",
    slug: "codex-portal",
    name: "CODEX PORTAL",
    tagline: "A living README, always in sync.",
    description:
      "Points at a DatoCMS-managed page you can update anytime, so the sticker's content evolves without ever reprinting the physical tag.",
    kit: "ai-portals",
    role: "default",
    webhookUrl: "https://cyber-nfc-kit.vercel.app/ai/codex-portal",
    accentColor: "#39ff88",
    previewImage: { url: "https://res.cloudinary.com/xs3nq3zj/image/upload/v1788998884/Untitled_design_15.png", alt: "Codex Portal sticker art" },
    printAsset: { url: "https://res.cloudinary.com/demo/image/upload/fl_attachment/cyber-nfc-kit/codex-portal-print.pdf", format: "pdf", filename: "codex-portal-print.pdf" },
  },
  {
    id: "s9",
    slug: "network-scanner",
    name: "NETWORK SCANNER",
    tagline: "Live web intelligence recon node.",
    description:
      "Intercepts real-time grid data using Tavily Search, then pipelines the layout directly into NVIDIA NIM for raw terminal exploitation.",
    kit: "utility-hooks",
    role: "network_scanner", // AKTIVIRA LOKALNI TAVILY PIPELINE U API-JU
    webhookUrl: "https://vercel.app",
    accentColor: "#ff007f",
    previewImage: { url: "https://res.cloudinary.com/xs3nq3zj/image/upload/v1788998176/ChatGPT_Image_Sep_6_2026_09_14_38_PM.png", alt: "Network Scanner sticker art" },
    printAsset: { url: "https://cloudinary.com", format: "pdf", filename: "network-scanner-print.pdf" },
  },
];

export function normalizeSticker(raw) {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    tagline: raw.tagline,
    description: raw.description,
    kit: raw.kit,
    role: raw.role || "default", // OSIGURAVA DA SE ULOGA PROSLEĐUJE DOK SE STRANICA RENDERUJE
    webhookUrl: raw.webhookUrl,
    accentColor: raw.accentColor?.hex || raw.accentColor || "#39ff88",
    previewImage: raw.previewImage,
    printAsset: raw.printAsset,
  };
}

