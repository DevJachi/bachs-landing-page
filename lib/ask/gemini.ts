// The model, behind one small file. For the demo this calls Gemini with GEMINI_API_KEY from .env.local;
// moving to Claude later means replacing this file and nothing else.

const API = "https://generativelanguage.googleapis.com/v1beta";

export type Turn = { role: "user" | "assistant"; text: string };

let flash: string[] | null = null;

// Every Flash model this key can call, newest first.
async function flashModels(key: string): Promise<string[]> {
  if (flash) return flash;
  const r = await fetch(`${API}/models?pageSize=200`, { headers: { "x-goog-api-key": key }, cache: "no-store" });
  if (!r.ok) throw new Error(`Gemini model list failed (${r.status})`);
  const { models = [] } = (await r.json()) as { models?: { name: string; supportedGenerationMethods?: string[] }[] };
  const version = (id: string) => parseFloat((id.match(/gemini-(\d+(?:\.\d+)?)/) ?? [])[1] ?? "0");
  flash = models
    .filter((m) => (m.supportedGenerationMethods ?? []).includes("generateContent"))
    .map((m) => m.name.replace(/^models\//, ""))
    .filter((id) => /flash/.test(id) && !/(image|tts|audio|live|thinking|exp|preview|8b)/.test(id))
    .sort((a, b) => version(b) - version(a) || Number(/lite/.test(a)) - Number(/lite/.test(b)) || a.length - b.length);
  return flash;
}

// The model in GEMINI_MODEL first, then a Flash-Lite model (its own free quota, usually less busy), then the
// next Flash, then another Lite, so a busy or out-of-quota model does not end the demo.
async function candidates(key: string): Promise<string[]> {
  const pinned = process.env.GEMINI_MODEL?.trim().replace(/^models\//, "");
  const list = (await flashModels(key).catch(() => [] as string[])).filter((m) => m !== pinned);
  const lite = list.filter((m) => /lite/.test(m)), full = list.filter((m) => !/lite/.test(m));
  const order = [pinned, lite[0], full[0], lite[1]].filter((m): m is string => !!m);
  if (!order.length) throw new Error("No Gemini Flash model is available for this key. Set GEMINI_MODEL in .env.local.");
  return Array.from(new Set(order));
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function ask(system: string, turns: Turn[], schema: object): Promise<{ data: unknown; model: string }> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw Object.assign(new Error("GEMINI_API_KEY is not set"), { code: "no_key" });
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents: turns.map((t) => ({ role: t.role === "assistant" ? "model" : "user", parts: [{ text: t.text }] })),
    generationConfig: { responseMimeType: "application/json", responseSchema: schema, temperature: 0.2, maxOutputTokens: 2048 },
  });
  let last = "";
  for (const id of await candidates(key)) {
    for (let attempt = 0; attempt < 2; attempt++) {
      let r: Response;
      try {
        r = await fetch(`${API}/models/${id}:generateContent`, {
          method: "POST",
          headers: { "content-type": "application/json", "x-goog-api-key": key },
          cache: "no-store",
          body,
          signal: AbortSignal.timeout(20000), // a stuck model moves on to the next one instead of hanging the chat
        });
      } catch {
        last = `${id} took longer than 20s`;
        console.warn("[ask]", last);
        break;
      }
      if (r.ok) {
        const out = (await r.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
        const text = out.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
        return { data: JSON.parse(text), model: id };
      }
      last = `${id} returned ${r.status}: ${(await r.text()).slice(0, 200)}`;
      console.warn("[ask]", last);
      if (r.status === 400 || r.status === 401 || r.status === 403) throw Object.assign(new Error(last), { code: "upstream" });
      if (r.status === 404 || r.status === 429) break; // missing model or used-up quota: go straight to the next model
      if (attempt === 0 && r.status >= 500) await wait(1200); // busy: one short retry, then the next model
      else break;
    }
  }
  throw Object.assign(new Error(last || "Gemini failed"), { code: /\b429\b/.test(last) ? "rate_limited" : "upstream" });
}
