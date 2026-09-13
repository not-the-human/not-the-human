import { NextResponse } from "next/server";
import { tavily } from "@tavily/core";

export const runtime = "nodejs";

const BACKENDS = {
  nvidia: {
    label: "NVIDIA NIM",
    baseUrl: process.env.NVIDIA_NIM_BASE_URL || "https://integrate.api.nvidia.com/v1",
    apiKey: process.env.NVIDIA_NIM_KEY,
    model: process.env.NVIDIA_NIM_MODEL || "meta/llama3-70b-instruct",
  },
  nebius: {
    label: "Nebius AI Studio (Crypto Mode)",
    baseUrl: process.env.NEBIUS_BASE_URL || "https://api.studio.nebius.ai/v1",
    apiKey: process.env.NEBIUS_API_KEY,
    model: process.env.NEBIUS_MODEL || "meta-llama/Meta-Llama-3.1-70B-Instruct",
  },
};

const LANGUAGE_NAMES = {
  es: "Spanish", sr: "Serbian", ru: "Russian", hi: "Hindi", de: "German",
  fr: "French", ja: "Japanese", zh: "Mandarin Chinese", ar: "Arabic",
  pt: "Portuguese", it: "Italian", ko: "Korean", tr: "Turkish",
};

function buildSystemPrompt(mode, targetLanguage, uloga, internetZnanje = "") {
  if (mode === "translate") {
    const langName = LANGUAGE_NAMES[targetLanguage] || targetLanguage || "the requested language";
    return (
      `You are a real-time translation node. Translate the user's most recent message into ${langName}. ` +
      `Respond with ONLY the translation - no commentary.`
    );
  }

  if (uloga === "network_scanner") {
    return (
      `You are 'NETWORK//SCANNER', a cyber-reconnaissance AI agent. ` +
      `Analyze real-time data intercepted from the grid (via Tavily) and summarize it for the terminal. ` +
      `Keep replies concise (2-4 sentences).\n\n[INTERCEPTED LIVE DATA]:\n${internetZnanje || "No telemetry available."}`
    );
  }

  return (
    `You are 'CYBER//NFC', an autonomous hardware WebNFC payload compiler.\n\n` +
    `CRITICAL INSTRUCTIONS:\n` +
    `1. Dynamically parse the user's prompt and extract the EXACT requested target (destination for navigation, contact name and phone, Wi-Fi credentials, or website URL).\n` +
    `2. Never output placeholder tokens like "...", "|", or arbitrary fallback examples. Insert actual parameters derived directly from the prompt.\n` +
    `3. Navigation requests MUST format the target parameter cleanly: https://maps.google.com/?daddr=[Extracted+Destination]&dirflg=d\n` +
    `4. Return ONLY valid, parseable raw JSON matching the target schema. Strictly NO markdown fences, no conversational prose, no thinking traces.\n\n` +
    `SCHEMA:\n` +
    `{"type":"nfc_payload","records":[{"recordType":"url|text|mime","mimeType":"...","data":"..."}]}`
  );
}

async function callChatCompletions({ baseUrl, apiKey, model, messages, jsonMode = false }) {
  const payload = {
    model,
    messages,
    temperature: 0.1,
    top_p: 0.8,
    max_tokens: 600,
    stream: false,
  };

  if (jsonMode) {
    payload.response_format = { type: "json_object" };
  }

  let res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok && jsonMode && res.status === 400) {
    delete payload.response_format;
    res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upstream error (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const reply = data?.choices?.[0]?.message?.content;

  if (!reply) {
    throw new Error("Upstream response did not contain a completion.");
  }

  return reply;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const {
    backend = process.env.NEXT_PUBLIC_DEFAULT_AI_BACKEND || "nvidia",
    mode = "chat",
    messages = [],
    targetLanguage = "sr",
    uloga = "default",
  } = body || {};

  const sanitizedHistory = messages
    .filter((m) => m && typeof m.content === "string")
    .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }))
    .slice(-12);

  const lastUserMessage = sanitizedHistory[sanitizedHistory.length - 1]?.content.toLowerCase() || "";
  const isNfcIntent = /nfc|ndef|tag|stiker|chip|čip|map|voznj|navigac|kontakt|vcard|wifi|wi-fi|upis|write|kljuc|ključ|link|url|http/i.test(lastUserMessage);

  let internetZnanje = "";
  if (uloga === "network_scanner" && mode !== "translate") {
    try {
      if (process.env.TAVILY_API_KEY) {
        const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
        if (lastUserMessage) {
          const searchResult = await tvly.search(lastUserMessage, { searchDepth: "basic", maxResults: 3 });
          internetZnanje = searchResult.results.map((r) => `[Source: ${r.title}] ${r.content}`).join("\n");
        }
      }
    } catch {
      internetZnanje = "[RECONNAISSANCE FAULT: Network scanner link unavailable.]";
    }
  }

  try {
    // 1. NEBIUS REŽIM (Kripto-ključ): 100% dinamički nasleđuje BILO KOJI prethodni payload
    if (backend === "nebius" && isNfcIntent && mode !== "translate") {
      const nebiusConfig = BACKENDS["nebius"];
      if (!nebiusConfig || !nebiusConfig.apiKey) {
        return NextResponse.json({ error: "Nebius Enterprise backend unconfigured." }, { status: 503 });
      }

      const timeWindow = Math.floor(Date.now() / 30000);
      const compactToken = Buffer.from(timeWindow.toString() + "KEY").toString("hex").slice(0, 8);

      let targetRecords = null;

      // Tražimo unazad POSLEDNJI nfc_payload koji je asistent generisao
      for (let i = sanitizedHistory.length - 1; i >= 0; i--) {
        const msg = sanitizedHistory[i];
        if (msg.role === "assistant" && msg.content.includes("records")) {
          // Pokušaj 1: Direktno JSON parsiranje
          try {
            const start = msg.content.indexOf('{"type"');
            const end = msg.content.lastIndexOf("}");
            if (start !== -1 && end !== -1 && end > start) {
              const parsed = JSON.parse(msg.content.substring(start, end + 1));
              if (Array.isArray(parsed.records) && parsed.records.length > 0) {
                targetRecords = parsed.records.filter((r) => r.mimeType !== "application/json");
                break;
              }
            }
          } catch {}

          // Pokušaj 2: Regex ekstrakcija Google Maps rute ako je JSON bio omotan tekstom
          const urlMatch = msg.content.match(/https:\/\/maps\.google\.com\/\?daddr=[^"'\s\\]+/i);
          if (urlMatch) {
            targetRecords = [{ recordType: "url", data: urlMatch[0] }];
            break;
          }
        }
      }

      // Ako postoji prethodno generisani payload, zadržava se netaknut i dodaje se kripto-ključ
      if (targetRecords && targetRecords.length > 0) {
        targetRecords.push({
          recordType: "mime",
          mimeType: "application/json",
          data: JSON.stringify({ key: compactToken, auth: true }),
        });

        return NextResponse.json({
          reply: JSON.stringify({ type: "nfc_payload", records: targetRecords }, null, 2),
          backend: "nebius",
          backendLabel: "Nebius (Crypto Gatekeeper Mode)",
          mode,
          model: nebiusConfig.model,
        });
      }

      // Fallback samo ukoliko je korisnik kliknuo "Kripto-ključ" na prazan chat
      const fallbackPayload = {
        type: "nfc_payload",
        records: [
          { recordType: "url", data: "https://notthehuman.com" },
          { recordType: "mime", mimeType: "application/json", data: JSON.stringify({ key: compactToken, auth: true }) },
        ],
      };

      return NextResponse.json({
        reply: JSON.stringify(fallbackPayload, null, 2),
        backend: "nebius",
        backendLabel: "Nebius (Crypto Gatekeeper Mode)",
        mode,
        model: nebiusConfig.model,
      });
    }

    // 2. NVIDIA NIM / STANDARDNA RUTA
    const activeConfig = BACKENDS[backend] || BACKENDS["nvidia"];
    if (!activeConfig || !activeConfig.apiKey) {
      return NextResponse.json({ error: `${backend.toUpperCase()} backend unconfigured.` }, { status: 503 });
    }

    const payloadMessages = [
      { role: "system", content: buildSystemPrompt(mode, targetLanguage, uloga, internetZnanje) },
      ...sanitizedHistory,
    ];

    const rawReply = await callChatCompletions({
      baseUrl: activeConfig.baseUrl,
      apiKey: activeConfig.apiKey,
      model: activeConfig.model,
      messages: payloadMessages,
      jsonMode: isNfcIntent && mode !== "translate",
    });

    let reply = rawReply ? rawReply.trim() : "";

    if (isNfcIntent && mode !== "translate") {
      const start = reply.indexOf('{"type"');
      const end = reply.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        reply = reply.substring(start, end + 1);
      }
    }

    // Sigurnosna sanitizacija: ako model vrati placeholder ("..."), popunjava tačnu unetu lokaciju
    if (reply.includes('"..."') && isNfcIntent) {
      const rawInput = lastUserMessage
        .replace(/\b(pripremi|navigaciju|navigacija|voznju|kolima|autom|do|u|na|aerodrom|aerodroma|aerodromu|mapu|mapa|stiker|upisi|write)\b/gi, " ")
        .replace(/[^a-zA-Z0-9čćžšđČĆŽŠĐ\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const isAirport = /aerodrom/i.test(lastUserMessage);
      const targetQuery = isAirport ? `${rawInput} Airport`.trim() : rawInput;
      const encodedTarget = encodeURIComponent(targetQuery || "Target Destination").replace(/%20/g, "+");

      reply = JSON.stringify(
        {
          type: "nfc_payload",
          records: [
            {
              recordType: "url",
              data: `https://maps.google.com/?daddr=${encodedTarget}&dirflg=d`,
            },
          ],
        },
        null,
        2
      );
    }

    return NextResponse.json({
      reply,
      backend,
      backendLabel: activeConfig.label,
      mode,
      model: activeConfig.model,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message, backend }, { status: 502 });
  }
}