## React Email — Key Learnings to Build Templates

### Components you can use

- **Html**: Email root wrapper; supports `lang`, `dir`.
- **Head**: Wraps head content; use with `Font`.
- **Font**: Load web fonts with safe fallbacks. Not all clients support web fonts; always set `fallbackFontFamily`.
- **Preview**: Inbox preheader text (aim for < ~90 chars).
- **Text**: Body copy with sensible defaults.
- **Heading**: Semantic headings (`h1`–`h6`).
- **Button**: Bulletproof CTA (actually an anchor tag). Use accessible labels.
- **Link**: Standard hyperlink.
- **Hr**: Visual divider.
- **Container**: Centers and constrains width.
- **Section**: Block-level wrapper; can contain rows/columns.
- **Row / Column**: Grid-like layout primitives for email-safe structure.
- **Tailwind**: Wrapper to enable Tailwind classes in templates; uses `pixelBasedPreset` (px scales).

### Composition patterns

- **Layout**: `Container` → `Section` → (`Row` → `Column`)+ for predictable, email‑safe grids.
- **Width**: Keep max content width around 600–700px inside `Container`.
- **Spacing**: Favor simple spacing; avoid complex CSS not broadly supported by email clients.
- **CTAs**: Prefer a single primary `Button`; any secondary actions as `Link`.
- **Typography**: Use `Heading` hierarchy and `Text` for readability.
- **Fonts**: Add a `Font` in `Head` with a robust fallback; expect web‑font fallbacks in many clients.
- **Images**: Always include alt text; prefer absolute URLs.

### Tailwind usage

- Wrap the email body with **Tailwind** and pass a `config` that includes `presets: [pixelBasedPreset]` to ensure px-based scales.
- Expect limitations in email clients; prefer utilities that compile to inline styles.
- Known limitations:
  - No contexts inside the `Tailwind` component (move providers above it).
  - No support for `@tailwindcss/typography` `prose` and other complex selectors.
  - Limited/spotty support for `hover:` and some utilities (e.g., `space-*`).

### Rendering utilities (@react-email/render)

- **render(jsx)**: Convert the React template to an HTML string.
- **pretty(html)**: Optional beautifier for debugging/inspection.
- **toPlainText(html)**: Generate a plain‑text version for deliverability.
- Note: If rendering in browsers, Safari/iOS may require `web-streams-polyfill`.

### AWS SES sending flow

1. Build your email UI with React Email components.
2. `render(<Template ... />)` to HTML string.
3. Create SES params (`Source`, `Destination.ToAddresses`, `Message.Body.Html.Data`, `Message.Subject.Data`), set `Charset: 'UTF-8'`.
4. Instantiate `SES({ region: process.env.AWS_REGION })` and `sendEmail(params)`.

- Operational tips:
  - Verify sender domain/email in SES; consider sandbox restrictions.
  - Track bounces/complaints separately; keep HTML lean.

### Accessibility and reliability

- **Preview**: Write a concise, meaningful preheader (`Preview`).
- **Contrast**: Ensure color contrast for text and buttons.
- **Tap targets**: Adequate padding on `Button` and `Link`.
- **Semantics**: Logical `Heading` structure; descriptive CTA text.
- **Fallbacks**: Provide safe fonts; expect web‑fonts to fail gracefully.
- **Plain text**: Always generate and send a plain‑text version of the email body.

### Client support notes

- Most components are tested across major clients (Gmail, Apple Mail, Outlook, Yahoo, HEY, Superhuman), but features vary.
- Avoid advanced CSS (complex selectors, `position`, `rem` without Tailwind preset) and rely on inline-able styles.

### Pre‑send checklist

- **Preheader present**: `Preview` under ~90 chars describes the email.
- **Layout stable**: Content contained within ~600–700px `Container`.
- **Primary CTA clear**: One prominent `Button`; secondary as `Link`.
- **Fonts/fallbacks**: `Font` configured with `fallbackFontFamily`.
- **Tailwind limits**: No context providers inside `Tailwind`; avoid `prose`, complex selectors.
- **Accessibility**: Contrast, alt text, focus/reading order.
- **Plain text**: `toPlainText` generated from rendered HTML.
- **SES readiness**: From domain/email verified; region set; subject/body UTF‑8.

### Minimal skeleton (conceptual)

1. Html + Head (+ Font)
2. Preview
3. Tailwind (optional) → Container → Section → Row/Column
4. Heading + Text + Button/Link + Hr as needed
5. Render to HTML + toPlainText; send via SES (or your ESP)

This document consolidates the essentials from the React Email docs in this repo to speed up designing, rendering, and sending robust, accessible email templates.

