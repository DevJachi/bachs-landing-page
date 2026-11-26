import { NextResponse } from "next/server";
import { contextFor } from "@/lib/ask/docs";
import { ask, type Turn } from "@/lib/ask/gemini";
import { SYSTEM, SCHEMA, clean, type Answer } from "@/lib/ask/prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// A small per-visitor limit so a demo key cannot be drained: 8 questions a minute.
const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now(), recent = (hits.get(ip) ?? []).filter((t) => now - t < 60000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 8;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  let turns: Turn[];
  try {
    const body = (await req.json()) as { messages?: Turn[] };
    turns = (body.messages ?? [])
      .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.text === "string" && m.text.trim())
      .slice(-8)
      .map((m) => ({ role: m.role, text: m.text.slice(0, 1200) }));
    if (!turns.length || turns[turns.length - 1].role !== "user") throw new Error("bad request");
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  try {
    const docs = await contextFor(turns.map((t) => t.text).join(" "));
    const { data, model } = await ask(`${SYSTEM}\n\n${docs}`, turns, SCHEMA);
    return NextResponse.json({ answer: clean(data as Answer), model });
  } catch (e) {
    const code = (e as { code?: string }).code ?? "error";
    console.error("[ask]", (e as Error).message);
    return NextResponse.json({ error: code }, { status: code === "no_key" ? 503 : code === "rate_limited" ? 429 : 502 });
  }
}
