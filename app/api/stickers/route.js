import { NextResponse } from "next/server";
import { getStickersFromDatoCMS } from "@/lib/datocms";
import { normalizeSticker } from "@/data/mockStickers";

export async function GET() {
  const raw = await getStickersFromDatoCMS({ tags: ["stickers"], revalidate: 60 });

  if (!raw) {
    // No DATOCMS_TOKEN configured, or the request failed - let the client
    // fall back to its bundled mock dataset instead of erroring out.
    return NextResponse.json({ stickers: [], source: "fallback" });
  }

  return NextResponse.json({
    stickers: raw.map(normalizeSticker),
    source: "datocms",
  });
}
