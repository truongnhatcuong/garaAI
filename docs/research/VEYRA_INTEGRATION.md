# VEYRA v1.0.0 / AutoCare Vietnamese adaptation

Source: https://github.com/amirmushichge/veyra-interactive-car/tree/v1.0.0
Commit: `5779ec0762559b84bd5da3b6ffccf76e747f7587`
Author: Amir Mušić. MIT license and media attribution remain in `public/veyra/`.

The unchanged reference checkout is `veyra-interactive-car/`, branch `my-veyra`.
Its running preview is http://127.0.0.1:5220/ and all 32 approved hashes pass.
The user subsequently requested Vietnamese copy and a background matching
AutoCare. Those presentation changes live in a separate `veyra-autocare/`
worktree, branch `autocare-vietnamese`, and are saved reproducibly as
`scripts/veyra-vietnamese.patch`. This is an adaptation of the pinned release,
not a claim of pixel-identical reproduction after customization.

The adaptation translates visible copy, image descriptions, status messages,
menu options and accessible controls. The document language is Vietnamese.
The full approved stylesheet is retained with appended theme overrides:
background #edf4ff, text #0b1930, muted text #52637e, white panels, and AutoCare
blue #0d3bb9 controls. The original blue studio inside the media is intentionally
retained: all 18 supplied images/videos are byte-for-byte unchanged.
The drive/battery player, timing, state guards, image plane, hotspot coordinates,
frame geometry and menu ownership remain unchanged. The appearance test changes
only its accessible-label selectors to match the Vietnamese UI.

`DiagnosticVehicle` embeds the adapted production bundle in an iframe. React 18,
Space Grotesk and reference CSS remain isolated from AutoCare React 19/Tailwind 4.
The delivery HTML uses relative bundle paths. `embed.js` reports scene height
and keeps the wordmark reset inside the frame. `embed.css` removes the stacked
layout viewport-height floor only inside the iframe; detail entry expands its
height without changing media width or height. The parent validates message
origin, sender and finite height before resizing.

Review: http://localhost:3000/ (homepage component), or
http://localhost:3000/veyra/index.html (standalone Vietnamese scene).
Use localhost for the existing Next dev server, whose origin restrictions block
hydration from 127.0.0.1. No unrelated process was stopped.

## Rebuilding from a fresh pinned checkout

Use Node 22+ and pnpm 10.15.1. Preserve the original lockfile. If using Corepack,
its project packageManager field selects the pinned pnpm version.

```sh
git clone --branch v1.0.0 https://github.com/amirmushichge/veyra-interactive-car.git
cd veyra-interactive-car
git switch -c my-veyra
pnpm install --frozen-lockfile
pnpm test
pnpm verify:reference
pnpm build
git worktree add ../veyra-autocare -b autocare-vietnamese v1.0.0
cd ../veyra-autocare
git apply ../scripts/veyra-vietnamese.patch
pnpm install --frozen-lockfile
pnpm test
pnpm build
cd ..
npm run veyra:sync
```

The sync script verifies every original reference hash, protected adaptation
files (including HoverVideo), and every copied media hash. It does not regenerate
the approved manifest. Vietnamese source/theme changes intentionally do not
match the original manifest; reference verification runs on the unchanged
upstream checkout. Both local worktrees are ignored in the host repository;
the patch, delivery artifacts, licenses and integration are retained.
Root TypeScript/ESLint exclude the separate Vite worktrees. No new application
library, paid generation, external upload, publication or Git push was used.

## Verification and limits

- Original release: unit checks, all 32 reference hashes and production build pass.
- Vietnamese adaptation: existing hover/appearance unit checks and four mocked
  generation-tool checks pass; production build passes. Mock checks made no paid
  request. All 18 delivered media hashes match the approved release.
- Host: ESLint, TypeScript and Next production build pass. Build logs a handled
  Prisma sitemap connection timeout; static generation completes successfully.
- Original browser checks cover appearance options, reset/reopen, pointer
  corridor, exclusive locks, forward/reverse playback and rapid hover switching,
  detail entry/return, annotations, keyboard and reduced motion. Screenshots at
  1440x900 and 390x844 were compared with supplied release references; measured
  mean absolute channel differences were 1.882 and 3.380 / 255, respectively.
  Rasterization/animation differences are recorded, not claimed pixel-identical.
- Vietnamese Chrome checks pass at 1440x900, 1280x720, 390x844, 1920x1080,
  768x1024 and 360x800. All paint/wheel choices and both details were exercised
  at the first three sizes. Tests verify translated labels, light background,
  no horizontal overflow, heading above media, annotation toggles with keyboard,
  stable media dimensions and Escape. Embedded desktop/phone resizing and
  emulated touch/reduced motion pass. No browser exceptions were recorded.
- Physical touch devices and iOS/Safari have not been tested.
- The upstream documented appearance-close focus race can leave focus on body;
  it is retained. A further upstream limitation was observed at short/stacked
  detail layouts: the detail-copy padding area intercepts pointer clicks on
  image annotations. Annotation keyboard Enter and the component list work.
  This translation/theme scope preserves that behavior; it requires a separate
  interaction fix if desired.

Screenshots are in `docs/design-references/veyra-v1.0.0/`. Measured reports are
`veyra-screenshot-comparison.json`, `veyra-embed-results.json` and
`veyra-vietnamese-results.json` beside this document.
