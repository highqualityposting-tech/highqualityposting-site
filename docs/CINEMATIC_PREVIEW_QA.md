# Cinematic Preview v4 — verification record

Scope: the three public brand pages only; no production deployment or customer/business backend change.

- Baselines: studio d30c2f13b7c0664f9ce1a9605192d6e2f41aa1c4; posting 4e09de44972bbef4e1a39d97c40d918a2aafa903.
- Chromium layouts: 390, 430, 768, 1440, 1920 CSS px, all three pages. No page overflow, broken displayed images or uncaught JavaScript errors.
- Desktop/mobile full-page and section screenshots are saved under tmp/cinematic-v4/qa. Separate viewport captures verify sticky content that cannot be represented faithfully in a single full-page screenshot.
- All three openings: first visit, remembered revisit/reload, manual replay, skip, Escape, focus containment/restoration, reduced motion. Chapter navigation suppresses automatic playback.
- Interaction checks: 12,000 copies at 5 yen = 60,000 yen; 7 yen = 84,000 yen. Native gallery keyboard/mouse dragging. Desktop app display follows the selected actual screenshot.
- Service form: successful mocked POST /api/leads and disabled sent state; no real lead or email created.
- Content comparison: all original posting/app visible text, links, image sources, metadata and inline functional scripts retained. Service business.ts, LeadForm, layout metadata, packages and customer/backend code unchanged.
- Local build: next build --webpack passed; TypeScript and ESLint passed. API validation: 12 files / 142 tests passed.
- New asset source resolution: 1536 × 1024; actual screenshots use original files and object-fit:contain. No Canvas or rasterized text in the openings. Static Noto weights 400/500/600 (Serif 600), source hashes and subsets recorded in service-font-manifest.json.
- Physical iPhone/Instagram testing is not available in this environment. Browser engine/mobile viewport testing is not a claim of real-device certification.
- Full Reality Gate cloud/customer/payment/email operational certification is outside this Preview design task and has not been re-run.

Re-run browser checks with POSTING_URL, STUDIO_URL, POSTING_COOKIE and STUDIO_COOKIE (private header-file paths), optionally ENGINE=webkit and OUT=tmp/.... Cookies are never stored in source control.
