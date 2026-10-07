# Hero reconstruction — reference notes (6 October 2026)

## Evidence and limits

The four supplied screenshots are the visual source of truth. The live Cerebrium homepage was read through the web tool and still exposes the hold interaction, three journey terms, headline and two actions. No browser backend is connected in this session; live motion, mobile views, and local rendered screenshots could not be inspected. The Awwwards intro URL could not be retrieved. Earlier descriptions in this document of a brain/neural-network hero were unsupported and have been replaced by these evidence-based notes.

Sources: https://cerebrium.ai/ and https://www.yellostack.com/ . Logo inspected directly: public/StackLogo.jpeg.

## Composition from supplied images

- A black, full-height scene with oversized sculptural ribbons extending beyond the viewport, shaded faces, grain and a restrained colored atmosphere.
- Navigation sits near the top edge. The headline occupies the bottom-left, with supporting copy and two rectangular actions at bottom-right.
- The hold affordance is a fine outlined circle above the headline. Two short horizontal marks sit inside it. Filling the perimeter communicates progress.
- During the journey the text and navigation disappear. The geometry becomes the full composition; intermittent bright white highlights convey travel.
- The last screenshot pulls back to reveal the whole brand object. Yellostack's equivalent must be the supplied three stacked, rounded square plates, not three horizontal bars.

## Implementation decisions

- Original solid ribbon geometry in yellow/gold, black atmosphere, white typography and white streaks; no reference-site assets or source copied.
- One shared progress value controls a 7.2-second hold, circle fill, word envelopes, scene travel and the final reveal. Frame delta makes duration independent of refresh rate. Early release smoothly rewinds; completion stays latched until Replay.
- Increasing travel speed, widening perspective during transit, and easing into the final camera position. No random camera shake.
- Discover, Strategize and Execute are taken from Yellostack's published process. Hero copy describes its actual design/development offering rather than Cerebrium's GPU infrastructure.
- Final object uses three rounded square plates with thickness and a diamond silhouette from perspective. Procedural studio lighting avoids external HDR downloads.
- The introductory curtain is short, nonblocking, and removed immediately for reduced motion. The first scroll transition reveals a connected editorial section with a reversible GSAP scroll animation.
- Mobile uses a dedicated hold target and retains page scrolling. Space/Enter support holding. Blur, pointer cancellation and tab visibility changes end the hold. Reduced motion uses a direct reveal. WebGL failures preserve content and provide a static logo fallback.
- Rendering pauses offscreen; DPR is capped at 1.5; streaks use one instanced draw; geometry and animation loops have cleanup.

## Verification

Validation passed: `node node_modules/typescript/bin/tsc --noEmit`; `node node_modules/next/dist/bin/next build` (all routes generated); local HTTP GET returned 200 and included the hero heading and hold control. Geist fonts and OFL licenses are hosted locally to remove the blocked build-time Google Fonts request. Visual parity and device performance remain unverified because no browser backend is available. Follow-up visual checks: idle composition at 1440x900 and 390x844; partial hold/release; complete hold and release; Replay; keyboard hold; mobile scrolling; reduced motion; WebGL failure; reverse scroll into hero.

Scope: hero, brand object, entry treatment, navigation integration and first scroll transition. Existing later sections are outside this pass.

## Sculpture refinement — second pass

User feedback identified washed-out surfaces, insufficient shape and a weak final logo. Replaced the former thin RoundedBox stack and unrelated ribbon tunnel with one sculpture-led scene.

- Model: a rounded-square outline with 0.38 corner radius, 0.24 body depth and a 0.065 five-segment bevel. Crease-aware normals keep broad faces flat while smoothing bevels. Face and sidewall materials are separate, with a restrained metallic edge trim.
- Lighting: shadow-casting key light, rim light and procedural studio reflection panels. No emissive plate surfaces. Lower exposure and a bloom threshold above ordinary surface values isolate glow to occasional white glints.
- Motion: one Catmull-Rom camera orbit around the model, eased departure/arrival, damped hold velocity, reversible release, slight layer separation and reassembly. White highlights move around plate perimeters; 24 instanced peripheral streaks appear only during transit.
- Framing: the final model is above the wordmark, with dedicated desktop/tablet/mobile spacing. Pointer movement reaches the scene through the hero overlay.
- Numerical verification of the actual geometry: 7,188 vertices per shared plate; all positions and normals finite; separate face/edge groups. Sampled 1,001 camera positions; minimum horizontal radius 3.855 units clears the plate envelope. Projected final bounds at 1440x900, 1920x1080, 768x1024 and 390x844 stay within the viewport and clear the wordmark.
- Existing local preview at http://localhost:3000 returns HTTP 200 with the hero and replay controls. Browser discovery still returns no connected backends; no visual or live interaction QA is claimed.

## Cursor and choreography refinement — third pass

- The hold control follows hero-relative pointer coordinates with GSAP quickTo easing. Pointer capture continues tracking a held drag; the ring and label stay within the section. It fades over links, leaves navigation/CTA behavior intact, and stops intercepting input after completion.
- Touch scrolling remains available outside the dedicated hold control. A primary touch can hold and drag the control; keyboard Space/Enter remain supported.
- A paused GSAP timeline coordinates the departing headline, three passing business terms, and final brand lockup. Hold progress scrubs it in either direction. ScrollTrigger now controls the hero's scroll-dependent camera framing.
- Framer Motion owns only the inner control's press/release spring. GSAP owns the outer cursor position, preventing transform contention.
- Added three original WebGL shader light trails with moving white heads and short gold tails. The drag steers camera azimuth with damping; the opening viewpoint is closer to the sculpture. Trails fade before the final reveal.
- Source-driven pointer checks pass: centered coordinates, edge clamping during capture, link hover, ignored non-held touch movement, and active touch dragging. Production build passes. Browser discovery returned an empty list, so live drag and visual QA remain unverified.
