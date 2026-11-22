# HQP — BEYOND THE ORDINARY
## Shared design contract (Preview v4)
- Chapter 01: BREAK THE STANDARD / posting. City, routes and verified distribution information.
- Chapter 02: CONTROL THE FIELD / app. Actual screenshots, large readable devices, workflow-led presentation.
- Chapter 03: CREATE THE EXPERIENCE / studio. Fictional architectural design demo, full-bleed photography and native typography.
- Black #030609; charcoal #0b1219; paper #ecf3f7; muted #a7bacb; blue #286ff0; ice #b5e1ff; gold #b7a27a only as a secondary legacy accent.
- Identical brand-system.css in both repositories. Three-chapter navigation at header/footer; no store, contact, SEO or customer-system URLs replaced.
- Japanese headings 600, body 400, labels 500, CTA 600. Static OFL Noto instances avoid WebKit variable-weight bugs. Font subsets cover all three pages; rebuild with scripts/build-service-fonts.py SOURCE_TTF_DIR POSTING_REPO after copy changes.
- Layout: max 1440px, gutter clamp(24px,6vw,100px), restrained 1px rules, section spacing 75px mobile / 110–120px desktop. Pricing remains directly visible.
- Motion: finite 8.7–10.4s openings plus 550–650ms fade, skip/Escape, keyboard focus trap and original inert/overflow restored. Native image/SVG rendering; no Canvas/WebGL or new animation library.
- First visit per chapter can auto-play; localStorage remembers playback. Reduced motion, Save-Data, anchor navigation and hqp-entry=chapter suppress automatic playback. Manual replay remains available except under reduced motion. Storage-disabled users cannot persist the seen flag.
- New chapter links use hqp-entry=chapter, so users are never forced through three long openings. Existing navigation/store/contact links are preserved.
- Scroll effects run only on scroll/resize in requestAnimationFrame for visible scenes. No scrolling interception. App desktop sticky display follows real feature panels; mobile retains native horizontal galleries and touch/keyboard operation.
- Preview aliases: hqp-posting-brand-preview.vercel.app and hqp-studio-brand-preview.vercel.app. These are Preview-only aliases; Vercel Authentication stays enabled. Authorized Vercel login is required; no public protection-bypass token is published.
## Asset provenance
- brand-city.webp: generated fictional Japanese residential city; all presentations label it as an illustrative generated scene, never as an actual delivery area.
- brand-basalt.webp: generated decorative basalt surface; no claims about real work.
- public/brand/yohaku-residence.webp: generated fictional coastal architecture for “余白 YŌHAKU”; explicitly labeled design demo and not client work.
- All three sources are 1536x1024 native PNGs. WebP encodings are q90 city, q93 basalt and q93 residence. No source enlargement or image text rasterization. Mobile demo photography uses intentional object-fit cropping; real app UI always uses contain / intrinsic aspect ratio.
- Existing HQP logo, screenshots, prices, claims, SEO and analytics remain the original assets/data.
- Design research: https://the-tawaraya.jp/ (composition, pauses and negative space only; no logo, copy, image or proprietary sequence reused).
## Scope of certification
Design Preview verification is separate from the repository Reality Gate for production business operations. No production deployment, real payment, email or customer-data mutation is part of this task.
- Mobile stone/city openings are capped at 340 CSS px high, keeping the crop within 1024 source pixels at DPR 3; app and studio openings retain their own portrait-oriented staging.
