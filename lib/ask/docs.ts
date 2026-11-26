// The docs the assistant answers from. Mintlify regenerates llms.txt / llms-full.txt from docs.bachs.io on every
// docs deploy, so fetching them here (cached for a day) keeps answers in step with the docs without any upkeep.

const DOCS = "https://docs.bachs.io";
const DAY = 60 * 60 * 24;

export type Page = { title: string; url: string; text: string; terms: Map<string, number>; len: number; head: Set<string> };

// Pages a merchant question never needs: endpoint reference, webhook payloads, SDK and CLI detail.
const SKIP = /\/(api-reference|guides\/webhooks\/events|sdks\/|cli\/commands|changelog\/api|community\/|errors)/;
// Pages sent with every question: who Bachs is for, fees, currencies, ways to pay, payout timing.
const CORE = [/\/for-you\//, /\/concepts\/overview/, /payment-method-support/, /how-payouts-work/, /\/get-started$/];

let cache: { at: number; pages: Page[]; index: string; pricing: string; wordpress: string } | null = null;

const STOP = new Set("a an and are as at be by can do does for from how i if in is it me my of on or our so that the this to was we what when where which who why will with you your".split(" "));
function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
    .map((w) => (w.length > 4 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w)); // payouts -> payout
}

function htmlText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#8358;/g, "₦")
    .replace(/\s+/g, " ")
    .trim();
}

async function get(url: string): Promise<string> {
  const r = await fetch(url, { next: { revalidate: DAY } });
  if (!r.ok) throw new Error(`${url} returned ${r.status}`);
  return r.text();
}

export async function loadDocs() {
  if (cache && Date.now() - cache.at < DAY * 1000) return cache;
  const [full, index, pricingHtml, wordpressHtml] = await Promise.all([
    get(`${DOCS}/llms-full.txt`),
    get(`${DOCS}/llms.txt`),
    get("https://bachs.io/pricing").catch(() => ""),
    get("https://bachs.io/wordpress").catch(() => ""), // the WooCommerce plugin lives on bachs.io, not in the docs
  ]);
  const pages: Page[] = [];
  for (const part of full.split(/\n(?=# [^\n]+\nSource: )/).slice(1)) {
    const m = part.match(/^# ([^\n]+)\nSource: (\S+)/);
    if (!m || SKIP.test(m[2])) continue;
    const text = part.slice(m[0].length).trim();
    const terms = new Map<string, number>();
    const words = tokens(m[1] + " " + m[1] + " " + text); // the title counts twice
    for (const w of words) terms.set(w, (terms.get(w) ?? 0) + 1);
    const head = new Set(tokens(m[1] + " " + m[2].replace(DOCS, "").replace(/[\/-]/g, " ")));
    pages.push({ title: m[1], url: m[2], text, terms, len: words.length, head });
  }
  cache = { at: Date.now(), pages, index, pricing: htmlText(pricingHtml).slice(0, 12000), wordpress: htmlText(wordpressHtml).slice(0, 8000) };
  return cache;
}

// BM25 over the pages: plain keyword search, no embeddings or database needed at this size.
function rank(pages: Page[], query: string): Page[] {
  const q = Array.from(new Set(tokens(query)));
  if (!q.length) return [];
  const N = pages.length, avg = pages.reduce((s, p) => s + p.len, 0) / N;
  const df = new Map(q.map((t) => [t, pages.filter((p) => p.terms.has(t)).length]));
  return pages
    .map((p) => {
      let score = 0;
      for (const t of q) {
        const f = p.terms.get(t) ?? 0;
        if (!f) continue;
        const idf = Math.log(1 + (N - df.get(t)! + 0.5) / (df.get(t)! + 0.5));
        score += idf * ((f * 2.2) / (f + 1.2 * (0.25 + 0.75 * (p.len / avg))));
        if (p.head.has(t)) score += 2.5; // the page is about it, not just mentioning it
      }
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}

// The context for one question: the docs index (a map of every page), the core pages, pricing,
// and the pages that best match the conversation, kept under a character budget.
export async function contextFor(conversation: string, budget = 60000): Promise<string> {
  const { pages, index: fullIndex, pricing, wordpress } = await loadDocs();
  // The index without its descriptions: just the page names and links, about a quarter of the size.
  const index = fullIndex
    .split("\n")
    .map((l) => l.match(/^- \[([^\]]+)\]\((\S+)\)/))
    .filter((m): m is RegExpMatchArray => !!m && !SKIP.test(m[2]))
    .map((m) => `- ${m[1]}: ${m[2]}`)
    .join("\n");
  // The pages that match the question come first, then the core pages, until the budget runs out.
  const core = pages.filter((p) => CORE.some((r) => r.test(p.url)) && !/age-requirements/.test(p.url));
  const picked: Page[] = rank(pages, conversation).slice(0, 4);
  for (const p of core) if (!picked.includes(p)) picked.push(p);
  let used = index.length + pricing.length + wordpress.length;
  const blocks: string[] = [];
  for (const p of picked) {
    const body = p.text.slice(0, 7000);
    if (used + body.length > budget) break;
    used += body.length;
    blocks.push(`<page title="${p.title}" url="${p.url}">\n${body}\n</page>`);
  }
  return [
    `<docs_index>\n${index}\n</docs_index>`,
    pricing ? `<page title="Pricing" url="https://bachs.io/pricing">\n${pricing}\n</page>` : "",
    wordpress ? `<page title="WordPress plugin for WooCommerce" url="https://bachs.io/wordpress">\n${wordpress}\n</page>` : "",
    ...blocks,
  ].join("\n\n");
}
