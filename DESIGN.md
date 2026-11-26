# Bachs landing page: design system

How the landing page looks, moves and speaks, and the rules for adding to it. When something new does not fit these rules, change the new thing, not the rules. Values here are the ones the page already uses (`app/styles/landing-v3.css`), so reuse them instead of inventing near-copies.

## 1. The idea in one line

Black, white and Bachs purple, with a lot of space. Quiet chrome, one clear thing per section, and motion that tells you something happened without shouting.

## 2. Colour

The page is near-monochrome, but not just black and white. It is **black, white and Bachs purple**. Purple is the one colour that means "Bachs" or "act here". Everything else is a neutral.

### Core

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Ink | `--fg` | `#0b0c10` | Headings, body text, the standard button, dark sections |
| Paper | | `#ffffff` | Section and card surfaces |
| Page | `--bg` | `#f7f8fb` | The page behind sections |
| Muted text | `--muted` | `#5d606e` | Secondary text, descriptions |
| Faint text | | `#8a8c99` | Meta, labels, captions |
| Hairline | `--line` | `#e3e5ee` | Borders, dividers, the page's vertical rails |
| **Bachs purple** | `--accent` | `#5458f2` | The accent. See the rules below |
| Purple, lit | `--accent-hi` | `#6468ff` | Hover state of purple things |
| Purple, soft | | `#8f92f5` | Gentle hover tints (logos on hover, icons) |
| Purple, mist | | `#c9cbfb` / `#ebebfe` | Pale backgrounds of small purple things (badges, pills) |

Semantic colours only carry meaning, and are toned down: green `#15803d` on `#e7f7ee` for success ("+18%", "On time"), warm red `#c2410c` on `#fdecec` for a failed or expired state. Never use them for decoration.

### Rules for purple

- **One purple thing per view.** If a screen already has a purple button, nothing else around it is purple. When two purple things meet, the eye cannot tell which one matters (this is what went wrong with the black button and purple chat bubble in the MCP section).
- **Purple marks meaning, not decoration:** the special button, the number that matters in a stat, the active state, the brand moment inside a visual.
- **Prefer purple as a reveal.** Several elements are dark by default and turn purple on hover: the stats figures and their icons, the WordPress and Bachs marks. That keeps the page calm until someone points at something.
- Text in purple on white uses `#5458f2` or darker, never the soft tints, so it stays readable.

### Accent: Bachs warm

There is one warm accent, **Bachs warm `#ffa585`** (with peach `#ffd2b8`). It never appears on its own as a UI colour. It lives only inside gradients, as the warm edge of a purple one (the orb, the glow of the hero artwork, the holographic sheen on cards). It is what keeps the purple from feeling cold.

### Gradients

The gradient palette (`:root` tokens):

| Token | Value |
| --- | --- |
| `--g-blue` | `#4f53ee` |
| `--g-violet` | `#8e6cf5` |
| `--g-pink` | `#e58fcf` |
| `--g-warm` | `#ffa585` |
| `--g-peach` | `#ffd2b8` |

Rules:

- **Gradients belong to visuals, not to chrome.** Use them inside product art, the hero artwork, the silk backgrounds, the orb, card renders. Never on section backgrounds, borders, or regular buttons.
- **Stay within one family.** Purple into violet, or purple into warm. Not purple into green or blue into orange.
- **One gradient word at most per section** (like "currency" in "Rails for every currency"), and only on large display text. Never on body text.
- **The special button is the only control with a gradient** (see below).
- Purple data bars use a short tone shift of one colour, `#8f92f5` to `#5458f2`, not a rainbow.

## 3. Type

- **Manrope** for everything, at 400, 500 and 600. Hierarchy comes from size and colour, not heavy weights. No 700+.
- Headings at 500, tight tracking (−0.035em to −0.045em), line height around 1.08.
- **Headings are two lines at most.** If it wraps to three on desktop, shorten the words or widen the measure.
- Small text never gets negative tracking.
- Sentence case everywhere. No ALL-CAPS labels with wide tracking.
- Numbers use tabular figures and one format across the page (`₦4,218,400`, `$12,480.00`).
- Monospace (system mono) only for code and for technical meta (a command, an API call).

## 4. Space and layout

- **Whitespace is a feature.** Every section gets room to breathe. When in doubt, add space, remove an element.
- Content sits inside the rails: max width `--rail` (84rem), with the hairline vertical lines running down the page. Section edges use `--inset` (`clamp(20px, 4vw, 48px)`).
- Spacing sits on a 4px grid. Same thing, same size: cards in a row share padding, rows share height.
- Space inside a group is smaller than space between groups.
- Dark sections (like Developers) are rare. One per page is plenty.

## 5. Buttons

### The special button (rare)

The **Get started** button in the hero and the final call to action. It is the page's most precious element, so it appears **only in the hero and the closing section/footer**, never in the middle of the page.

- Fill: a vertical purple gradient, `#6d71f8 → #5458f2 → #464ae4 → #3d41d6`, with a faint white sheen band on top.
- Hover: the sheen sweeps across (background position 0% → 100%), the button brightens slightly (`brightness(1.1)`), a soft purple ring appears (`0 0 0 4px rgba(84,88,242,.12)`) with a soft purple glow below, and the chevron nudges 2px forward.
- Class: `.btn-main`.

If you are tempted to use it somewhere else, use the standard button.

### Standard button

Ink `#0b0c10` fill, white text, radius 4px (`--r-btn`). Hover lifts it to `#24252c`. Press moves it down 1px. Used for "Get started" in the nav, "Talk to sales" and most actions.

### Secondary and text buttons

Plain text with a chevron or arrow, ink or muted. On hover the text darkens and the arrow nudges toward where it goes: `→` moves right, `↗` moves up-right by 2px.

### Links that go somewhere

A link that leaves the page or opens a page ends in an arrow (`↗` for another page or site). On hover the arrow nudges 2px toward the top right and darkens. This tells people "this takes you somewhere" without saying it.

## 6. Product demos and visuals

The pictures inside cards (payment links, billing and subscriptions, the invoice, the currencies tile) are small product moments. They follow the same rules as real product screens.

- **One idea per demo.** The payment link card says one thing: someone paid you. The billing card says one thing: this customer is on a monthly plan. If you need a sentence to explain the demo, it is doing too much.
- **Easy to read at a glance, straight to the point.** No ambiguous icons, no mystery numbers, no fake UI that would confuse someone who has never used a payments product.
- **Enough white space.** A demo should never feel clunky or crowded. Fewer rows, bigger type, more air.
- **Real-looking data.** Plausible names, amounts in local currencies (₦, GH₵, KSh, $, £), real-looking dates. Never `123,456` or "Lorem".
- **Quiet chrome, one moment.** Neutral cards and text, and one place where colour or material lives (Amara's purple avatar, a purple bar, a card render).
- Shadows are soft and neutral, or absent. No borders and shadows together on the same small card.

## 7. Motion

Motion is subtle, unhurried and slightly elastic. It **emphasises**: it brings your eye to something that changed, then gets out of the way. You should notice that something happened, not that something animated. Nothing rushes, nothing happens in haste.

### The rule: the bigger the element, the slower it moves

Big things have weight. A small icon can snap; a whole card or a hero visual drifts.

| Size | Example on the page | Duration |
| --- | --- | --- |
| Tiny: colour, underline, icon tint | Link colour, logo tint, focus ring | 0.2–0.35s |
| Small: arrows, chevrons, logos, icons | Arrow nudge, logos spreading, stats icon turn | 0.3–0.6s |
| Medium: cards, bubbles, panels | Story card widening, chat bubble pop, notifications fanning out | 0.6–0.9s |
| Large: hero visuals, section artwork | Card art drifting, rails, bento visuals | 1.1–1.6s |
| Ambient: things that just live | Coins floating, logo marquee, silk background | 4.8s and slower, looping gently |

### Curves

Use the page's existing curves. Do not invent new ones.

| Name | Curve | When |
| --- | --- | --- |
| Settle (default) | `cubic-bezier(.2,.8,.2,1)` | Most things entering or moving: a strong ease-out that settles softly |
| Soft | `--ease`: `cubic-bezier(.22,1,.36,1)` | Gentle reveals and fades |
| **Elastic** | `cubic-bezier(.34,1.56,.64,1)` | Things that expand, spread or pop: logos spreading, the payment link stack fanning out, icons turning, a card lifting. A small overshoot, then rest |
| Stripe glide | `cubic-bezier(.165,.84,.44,1)` at 0.8s | Large cards changing size (the startup story cards) |

### The elastic vibe

Use the elastic curve when something **grows, opens, spreads or collapses** to show more. It overshoots a little and settles, like something with a bit of give. Keep the overshoot small; it should feel alive, not bouncy. Do not use it for colour changes, fades or text.

### Rules

- **Animate `transform` and `opacity`.** They are smooth on every device. Avoid animating width, height, margins and padding; when a size has to change, keep the change small (a few pixels) and on one element.
- **Never start from `scale(0)`.** Start from about `scale(.94)` plus `opacity: 0`.
- **Never `ease-in` on anything entering.** It delays the moment people are looking at.
- **No `transition: all`.** Name the properties.
- **Hover motion only on real pointers:** wrap hover movement in `@media (hover: hover) and (pointer: fine)` so phones do not get stuck hover states.
- **Respect reduced motion:** under `prefers-reduced-motion: reduce`, drop movement and loops, keep simple fades.
- **Stagger groups by 30–80ms**, so a list arrives as one movement instead of all at once.
- **Things that loop must be slow and calm**, and pause when off screen where possible.
- **Hover feedback stays small:** a 2–4px nudge, a 3–8% change in size at most, a colour reveal. Nothing jumps.

### Reference skill

These rules follow Emil Kowalski's animation philosophy. Install his skills so your agent builds motion the same way:

```bash
npx skills@latest add emilkowalski/skills
```

Source: [github.com/emilkowalski/skills](https://github.com/emilkowalski/skills). Use the `animate` skill when building motion, `review-animations` to check it, and `improve-animations` to audit a whole page.

## 8. Voice and copy

- Plain words a business owner understands on the first read. No jargon unless the section is for developers.
- Short sentences. Headings at most two lines.
- No exclamation marks, no hype words (seamless, supercharge, unlock), no emoji.
- Specific beats vague: "Most bank transfers arrive in seconds" beats "Lightning-fast payments".
- Quotes are real and credited. Never write words for a person or a customer.

## 9. Before you ship something new

- Does it use black, white and one purple moment, with gradients only inside visuals?
- Is the special button only in the hero or the closing section?
- Does every demo say one thing, with room to breathe?
- Do bigger things move slower than smaller things?
- Is the motion subtle enough that you notice the change, not the animation?
- Does it work with reduced motion and on a phone?
