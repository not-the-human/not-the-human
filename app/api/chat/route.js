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
    label: "Nebius AI Studio",
    baseUrl: process.env.NEBIUS_BASE_URL || "https://api.studio.nebius.ai/v1",
    apiKey: process.env.NEBIUS_API_KEY,
    model: process.env.NEBIUS_MODEL || "meta-llama/Meta-Llama-3.1-70B-Instruct",
  },
};

const LANGUAGE_NAMES = {
  es: "Spanish",
  sr: "Serbian",
  ru: "Russian",
  hi: "Hindi",
  de: "German",
  fr: "French",
  ja: "Japanese",
  zh: "Mandarin Chinese",
  ar: "Arabic",
  pt: "Portuguese",
  it: "Italian",
  ko: "Korean",
  tr: "Turkish",
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
    `You are 'CYBER//NFC', a hardware WebNFC payload compiler.\n\n` +
    `CRITICAL INSTRUCTIONS:\n` +
    `1. When the user asks for an NFC action (driving route, map, contact, wifi, url, text), return a POPULATED, VALID JSON object.\n` +
    `2. Do NOT output placeholder syntax like | or "..." - insert the REAL, ACTUAL encoded values.\n` +
    `3. Output ONLY the raw JSON object. No markdown code blocks, no thinking process, no commentary before or after.\n\n` +
    `EXAMPLES OF POPULATED OUTPUT:\n\n` +
    `Example 1 (Driving/Maps):\n` +
    `{"type":"nfc_payload","records":[{"recordType":"url","data":"https://maps.google.com/?daddr=Belgrade+Airport&dirflg=d"}]}\n\n` +
    `Example 2 (Contact):\n` +
    `{"type":"nfc_payload","records":[{"recordType":"mime","mimeType":"text/vcard","data":"BEGIN:VCARD\\nVERSION:3.0\\nFN:Marko\\nTEL:+38160123456\\nEND:VCARD"}]}\n\n` +
    `Example 3 (Wi-Fi):\n` +
    `{"type":"nfc_payload","records":[{"recordType":"text","data":"WIFI:T:WPA;S:NetworkName;P:SecretPass;;"}]}\n\n` +
    `Example 4 (URL):\n` +
    `{"type":"nfc_payload","records":[{"recordType":"url","data":"https://github.com"}]}\n\n` +
    `Now compile the payload for the user's input. If the user is not asking for NFC actions, reply in 1-2 cyberpunk terminal sentences.`
  );
}

async function callChatCompletions({ baseUrl, apiKey, model, messages, jsonMode = false }) {
  const payload = {
    model,
    messages,
    temperature: 0.1,
    top_p: 0.7,
    max_tokens: 350,
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

  const config = BACKENDS[backend];
  if (!config || !config.apiKey) {
    return NextResponse.json({ error: "Backend unconfigured." }, { status: 503 });
  }

  const sanitizedHistory = messages
    .filter((m) => m && typeof m.content === "string")
    .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }))
    .slice(-12);

  const lastUserMessage = sanitizedHistory[sanitizedHistory.length - 1]?.content.toLowerCase() || "";
  const isNfcIntent = /nfc|ndef|tag|stiker|chip|čip|map|voznj|navigac|kontakt|vcard|wifi|wi-fi|upis|write/i.test(lastUserMessage);

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

  const payloadMessages = [
    { role: "system", content: buildSystemPrompt(mode, targetLanguage, uloga, internetZnanje) },
    ...sanitizedHistory,
  ];

  try {
    const rawReply = await callChatCompletions({
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      model: config.model,
      messages: payloadMessages,
      jsonMode: isNfcIntent && mode !== "translate",
    });

    let reply = rawReply ? rawReply.trim() : "";

    // Sečenje bilo kakvog viška teksta ili reasoning-a pre i posle JSON bloka
    if (isNfcIntent && mode !== "translate") {
      const start = reply.indexOf('{"type"');
      if (start !== -1) {
        const end = reply.indexOf("}]}", start);
        if (end !== -1) {
          reply = reply.substring(start, end + 3);
        } else {
          const lastBrace = reply.lastIndexOf("}");
          if (lastBrace !== -1) {
            reply = reply.substring(start, lastBrace + 1);
          }
        }
      }
    }

    return NextResponse.json({
      reply,
      backend,
      backendLabel: config.label,
      mode,
      model: config.model,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message, backend }, { status: 502 });
  }
}