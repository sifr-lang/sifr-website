# Sifr site design guidelines

Principles for styling, brand, and copy on `apps/sifr-site`. Use this when designing or building new pages, components, or blog content.

For concrete tokens, utilities, and component patterns, follow what is already implemented in `apps/sifr-site/src/styles/global.css` and the existing Astro/React components. Do not introduce parallel color systems, fonts, or layout conventions.

## Design intent

The site should feel like a modern developer product: precise, fast, and trustworthy.

- **Light and minimal.** A clean zinc-gray canvas with white foreground surfaces.
- **Cool accents.** Cyan and sky blue for links, highlights, and energetic moments; dark terminal panels for code.
- **Restrained decoration.** Subtle gradients and blur orbs add depth; never compete with content.
- **Single light theme.** No theme switcher or dark-mode variant on the marketing site.

Avoid boxed-in, generic SaaS layouts. Favor symmetric negative space and layouts that breathe.

## Brand identity

### Logo symbolism

The Sifr mark blends Python's organic curves with Rust's engineering precision:

- **Core body:** teal through deep blue — the product's technical core.
- **Head and tail:** amber through orange — warmth and energy at the edges.

These hues inform accent usage across the site. Orange appears sparingly (inline code in blog prose, logo accents). Sky and blue carry most interactive and highlight weight.

### Logo usage

- Use `/logo.webp` from the public assets. There is no shared SVG logo component yet.
- Header: logo plus the "Sifr" wordmark in the display typeface.
- Footer: smaller logo, no wordmark required.
- A subtle scale on hover is appropriate; avoid animated or flashy logo treatments.

## Typography

Three distinct roles — never collapse them:

| Role | Typeface | Use for |
|------|----------|---------|
| Body | Plus Jakarta Sans | Paragraphs, navigation, UI labels |
| Display | Space Grotesk | Headings, hero statements, section titles |
| Code | JetBrains Mono | Terminals, install commands, benchmarks, eyebrow labels |

### Hierarchy principles

- **Display type commands attention.** Headlines are bold, tight-tracked, and high-contrast. One hero statement per view.
- **Body type stays readable.** Secondary color, relaxed line height, generous measure on long copy.
- **Mono signals systems.** Anything that looks like input, output, metrics, or compiler feedback uses the code face.
- **Eyebrows are quiet labels.** Small, uppercase, mono — they categorize without shouting.
- **Gradient text is rare.** Reserve it for a single high-impact phrase in a headline, not body copy.

Do not substitute Inter or other body fonts; Plus Jakarta Sans is the shipped choice.

## Color

A high-contrast light theme built on zinc neutrals and sky blue accents.

| Role | Direction |
|------|-----------|
| Canvas | Ultra-light gray background |
| Surface | Pure white cards and panels |
| Primary text | Near-black for headlines and emphasis |
| Secondary text | Mid zinc for body and meta |
| Accent | Sky blue for links, active states, terminal highlights |
| Inverse | Dark zinc footer with light text |
| Code (inline) | Warm orange on light gray — distinct from link blue |

Brand tokens (`cryo-cyan`, `zero-blue`, `void-black`, etc.) live in `global.css`. Use them through the existing theme — do not invent new accent colors, warm grays, or purple tones.

Borders are soft and semi-transparent. Shadows are gentle; depth comes from border and shadow together, not heavy drop shadows.

## Copywriting

Sifr copy sounds like a careful engineer explaining a real system — not a marketer pitching a vision. Write to inform, not to impress.

### Voice

- **Literal and humble.** State what the product does, how it works, and what it avoids. Skip filler, hype, and superlative stacking.
- **Technically credible.** Every compiler, performance, and safety claim must reflect actual Sifr behavior. If it cannot be verified, do not publish it.
- **Direct.** Short sentences. Active voice. No throat-clearing openers ("In today's world…", "We're excited to…").
- **Human, not corporate.** Prefer plain language over brand-speak. Avoid generic "AI" phrasing and empty innovation language.

### Headlines

- One clear idea per headline. If it needs a comma and a clause, it is probably two ideas.
- Headlines do not end with a period.
- Sub-headlines support the headline; they do not repeat it or add a second pitch.
- Feature titles name the capability, not the feeling.
- Eyebrow labels categorize quietly — one or two words, not a sentence.

### Body copy

- Open with the concrete fact, then explain the implication.
- Name specific mechanisms (Rust compiler, native binaries, Result types) instead of vague benefits ("blazing fast", "rock solid").
- Use parallel structure in bullet lists — each item the same grammatical form and similar length.
- Keep paragraphs short. Break long explanations into scannable blocks.
- Emphasize one or two key terms per paragraph with weight, not decoration — do not bold entire sentences.

### Claims and metrics

- Performance copy describes *what is absent* (interpreter, GC, VM) as precisely as what is gained (native execution, low memory).
- Benchmarks and timings must be reproducible or clearly labeled as illustrative.
- Error-handling copy reflects Sifr's actual compiler rules — rejections are features, not bugs.
- Understate rather than overstate. Qualified, honest limits beat absolute promises.

### Tone devices

- Occasional dry wit is welcome when it clarifies rather than sells. It should never substitute for a real explanation.
- Italics mark asides or wry emphasis, not important facts readers must not miss.
- Questions in marketing copy are rare. Prefer statements.

### Calls to action

- Label buttons with what happens next — not vague verbs like "Learn More" or "Explore".
- One primary action per context. Secondary actions stay visually and verbally quieter.
- Do not manufacture urgency ("Act now", "Don't miss out").

### Blog and long-form

- Same voice as the marketing site, with room for depth.
- Titles promise a specific topic; the opening paragraph delivers on it immediately.
- Release notes and engineering posts lead with what changed and why it matters to the user.
- Code examples in prose should be minimal and purposeful — show the point, not the entire file.

### What to avoid

- Fictitious feature lists or roadmap items presented as shipped.
- Competitor bashing by name unless the comparison is factual and necessary.
- Stacked adjectives ("powerful, innovative, cutting-edge").
- Passive hedging that hides uncertainty ("may help improve", "designed to potentially").
- Marketing copy that reads like it could belong to any developer tool.

## Layout and spacing

- **Consistent content width** across header, main, and footer — match existing pages.
- **Generous section rhythm.** Major sections are clearly separated; inner groups stay tight.
- **Blog articles** use a readable single column; a sticky table-of-contents sidebar is optional on large screens.
- **Responsive collapse** must not clip or overflow UI boxes — grids and action rows stack cleanly on narrow viewports.

## UI patterns

### Header

Sticky, frosted bar on a light background with a subtle bottom border. Navigation is understated; the active page is weight-differentiated, not color-shouted. The primary call-to-action is a solid dark button.

### Footer

Dark inverse of the page — anchors the layout and holds secondary links. Section labels use the mono voice.

### Cards and panels

White surface, soft border, light shadow. Hover states deepen border and shadow slightly — not scale. Larger feature sections use more padding and rounder corners than list cards.

### Buttons

Three clear tiers:

| Tier | Character |
|------|-----------|
| Primary | Dark fill, light text — main actions |
| Secondary | Light sky fill, sky text, soft border — supporting actions |
| Icon / ghost | No fill, hover background — toolbar and nav affordances |

Copy actions inside dark contexts invert on hover toward the accent blue.

### Paired action controls

When a command snippet and a button sit side by side, they must share the same height and feel like a matched pair. The command area uses the code typeface; the button uses the secondary tier. Stack on mobile, align in a row when space allows.

### Terminals and code

Dark panels that read as real developer tools:

- Monospace throughout.
- macOS-style traffic-light title bar.
- Muted default text; green for success steps, sky for version/info lines, red for errors.
- Live build visualizers mimic a real CLI pipeline with predictable, readable timing — not random delays.
- Dynamic output must be announced to assistive technology.

Blog code blocks and inline code follow the shared `.blog-content` styles. Reuse existing code-tab and copy-button patterns rather than styling blocks ad hoc.

### Icons

Lucide stroke icons, consistent weight, sized to match adjacent text. Decorative icons are hidden from screen readers.

### Decorative elements

At most one or two ambient effects per view — a top gradient line, a soft background orb. All decorative layers are non-interactive and hidden from assistive technology.

## Blog content

Prose inherits display headings, sky links, sky-bordered blockquotes, and styled tables/images through the shared blog content styles.

Supported embed markers in Markdown:

- `[!code-tabs label1, label2]` before consecutive fenced code blocks
- `[!tweet https://…]` and `[!youtube https://…]`

## Accessibility

Non-negotiable on every page:

- Skip link to main content.
- Visible focus indicators on keyboard navigation.
- Screen-reader-only text where icons or external links need context.
- Respect `prefers-reduced-motion`.
- Live regions for dynamic terminal output.
- External links open in a new tab with appropriate rel attributes.

## Motion

- Transitions are quick and functional — color and shadow, not bounce.
- Card hovers change border and shadow; avoid scaling except a subtle logo hover.
- Status indicators pulse while active; success shifts from sky to green.
- Do not add long-running animations without a static fallback.

## Implementation rules

1. **Extend, don't fork.** Match `Header.astro`, `Footer.astro`, `Layout.astro`, and `HomeApp.tsx` before inventing new patterns.
2. **Shared styles belong in `global.css`.** Cross-page concerns (blog prose, code blocks, focus, scrollbars) live in `src/styles/global.css` — not duplicated inline.
3. **Zinc + sky + sparing orange.** Stay inside the established palette.
4. **Consistent corner radii.** Smaller on buttons, larger on cards and content blocks — follow existing components for the gradient.

## Checklist for new UI

- [ ] Typography uses the correct role (body, display, or code)
- [ ] Copy is literal, precise, and free of hype
- [ ] Colors stay within the zinc / sky / orange-inline-code palette
- [ ] Surfaces, borders, and shadows match existing card patterns
- [ ] Layout stacks cleanly on mobile without clipping
- [ ] Accessibility patterns preserved (skip link, focus, live regions)
- [ ] Decorative effects are minimal and non-interactive
- [ ] No theme switcher introduced
