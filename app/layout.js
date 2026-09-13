import "./globals.css";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-mono",
  display: "swap",
});

const STATIC_ICONS = {
  icon: [
    { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    { url: "/favicon.ico" },
  ],
  apple: [
    { url: "/apple-icon-57x57.png", sizes: "57x57" },
    { url: "/apple-icon-60x60.png", sizes: "60x60" },
    { url: "/apple-icon-72x72.png", sizes: "72x72" },
    { url: "/apple-icon-76x76.png", sizes: "76x76" },
    { url: "/apple-icon-114x114.png", sizes: "114x114" },
    { url: "/apple-icon-120x120.png", sizes: "120x120" },
    { url: "/apple-icon-144x144.png", sizes: "144x144" },
    { url: "/apple-icon-152x152.png", sizes: "152x152" },
    { url: "/apple-icon-180x180.png", sizes: "180x180" },
  ],
  other: [
    {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-icon-precomposed.png",
    },
  ],
};

const FALLBACK_METADATA = {
  title: "CyberNFC Free Sticker Kit | NOT THE HUMAN",
  description:
    "Programmable NFC sticker dashboard. Tap to flash AI portals, utility hooks, and pranks straight onto NTAG213/215 chips. Free CyberNFC sticker Kit under the subcultural brand NOT THE HUMAN, blending brutalist cyberpunk aesthetics with accessible physical computing.",
  manifest: "/manifest.json",
  icons: STATIC_ICONS,
  openGraph: {
    title: "CyberNFC Free Sticker Kit | NOT THE HUMAN",
    description:
      "Programmable NFC sticker dashboard. Tap to flash AI portals, utility hooks, and pranks straight onto NTAG213/215 chips.",
    siteName: "not_the_human",
    images: [
      {
        url: "/android-icon-192x192.png",
        width: 192,
        height: 192,
        alt: "NOT THE HUMAN - CyberNFC Kit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  keywords: [
    "NFC",
    "WebNFC",
    "NTAG213",
    "NTAG215",
    "cyberpunk",
    "stickers",
    "NVIDIA NIM",
    "Nebius",
    "Tavily",
    "AI",
    "vCard",
  ],
};

const DATO_SEO_QUERY = `
  query GlobalSeo {
    _site {
      globalSeo {
        siteName
        titleSuffix
        fallbackSeo {
          title
          description
          image {
            url
            width
            height
            alt
          }
          twitterCard
        }
      }
      favicon {
        url
      }
    }
  }
`;

export async function generateMetadata() {
  const token = process.env.DATOCMS_READONLY_TOKEN || process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN;

  if (!token) {
    return FALLBACK_METADATA;
  }

  try {
    const res = await fetch("https://graphql.datocms.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: DATO_SEO_QUERY }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("DatoCMS request failed");

    const { data } = await res.json();
    const seo = data?._site?.globalSeo;
    const datoFavicon = data?._site?.favicon?.url;

    if (!seo) return FALLBACK_METADATA;

    const baseTitle = seo.fallbackSeo?.title || "CyberNFC Free Sticker Kit";
    const suffix = seo.titleSuffix ? ` | ${seo.titleSuffix}` : "";
    const title = `${baseTitle}${suffix}`;
    const description = seo.fallbackSeo?.description || FALLBACK_METADATA.description;
    const ogImage = seo.fallbackSeo?.image?.url;

    return {
      title,
      description,
      manifest: "/manifest.json",
      keywords: FALLBACK_METADATA.keywords,
      icons: datoFavicon
        ? {
            icon: [{ url: datoFavicon }, ...STATIC_ICONS.icon],
            apple: STATIC_ICONS.apple,
            other: STATIC_ICONS.other,
          }
        : STATIC_ICONS,
      openGraph: {
        title,
        description,
        siteName: seo.siteName || "not_the_human",
        images: ogImage
          ? [
              {
                url: ogImage,
                width: seo.fallbackSeo.image?.width || 1200,
                height: seo.fallbackSeo.image?.height || 630,
                alt: seo.fallbackSeo.image?.alt || title,
              },
            ]
          : FALLBACK_METADATA.openGraph.images,
      },
      twitter: {
        card: seo.fallbackSeo?.twitterCard || "summary_large_image",
        title,
        description,
        images: ogImage ? [ogImage] : undefined,
      },
    };
  } catch {
    return FALLBACK_METADATA;
  }
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#05060a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <head>
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#05060a" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      </head>
      <body className="relative min-h-screen bg-cyber-black font-mono text-cyber-text antialiased">
        <div className="matrix-bg animate-matrix-scroll" aria-hidden="true" />
        <div className="scanline-overlay" aria-hidden="true" />
        <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}