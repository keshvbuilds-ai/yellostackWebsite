# AI & automation experience

Open `/artificial-intelligence` from Services → AI & automation.

The page contains an original procedural Three.js robot, seven selectable AI capabilities, a GSAP-pinned eye transition into computer vision, a visual inspection illustration and an industrial automation workflow. The reference is https://www.chaingpt.org/; its assets have not been copied. A live browser was unavailable, so its precise interaction behavior was not verified.

## Content editing

The existing AI page title and introduction remain editable in the CMS Pages panel. Search `ai.` in Headings & labels for the new hero, section and capability text. Search `ar:` for Arabic translations. Defaults are in `src/content/cms-copy.json`, `src/content/ai-solutions.ts` and `src/content/arabic.json`. Publish through the existing CMS workflow. The diagram labels are illustrative, not live analytics or performance claims.

## Model and scroll behavior

- `src/components/ai/IntelligenceScene.tsx` constructs the robot and eye locally. No paid model, external texture or model download is required.
- The robot follows pointer movement with damped head and eye motion. Touch scrolling remains available.
- `AIExperience.tsx` owns the scroll progress. The eye turns forward, its pupil enlarges, then a dark transition reveals the computer vision introduction. Scrolling backward reverses this sequence.
- Reduced motion removes the pinned zoom and displays the introduction in normal flow. A CSS illustration remains available if WebGL initialization fails.
- Rendering skips offscreen/hidden frames, caps pixel ratio and disposes geometry, materials, observers and triggers on unmount.
- Inner-page hero artwork is generated locally by `HeroArtwork.tsx`, with themes for mobile, commerce, software, enterprise systems, medical coding, design, company, contact and journal pages.

## Verification

TypeScript and CMS/locale regression checks passed. Production build and browser visual testing were unavailable in the current environment. Before release, check the following at 375px, 768px and 1440px, in English and Arabic:

1. Cursor tracking; links remain clickable over the hero.
2. All seven solution controls work with keyboard and touch.
3. Eye transition progresses smoothly forward and backward, including after resize.
4. Contact links, mobile menu, reduced motion and WebGL fallback work.
5. New CMS content publishes without changing route paths or media mappings.

## Full-screen neural journey

The eye canvas now occupies the entire pinned portal at desktop and mobile widths. Branching scleral vessels follow the eye surface. After the pupil transition, gold neural strands and travelling particles appear behind the arrival heading.

The Machine Learning section uses its own pinned, reversible scroll timeline: strands gather, a procedural two-hemisphere folded brain grows and rolls, then its folds separate into a connected node field as Knowledge Base appears. The model is an original stylised brain, not a medical anatomy asset. All progress comes from GSAP scrubbing, and the content remains readable without WebGL. Reduced motion presents both content blocks without pinning.

Edit new content using ai.ml.* and ai.kb.* in CMS Headings & labels. Arabic translations are included. TypeScript and CMS checks passed; final mobile and desktop visual inspection remains pending because a browser connection is unavailable.

### Revised neural depth and brain reveal

The neural passage now uses longitudinal, branching axon-like geometry extending along negative Z, with pulses travelling on those paths. Camera movement enters the tunnel during the eye arrival; the learning scene continues the depth movement. The brain has solid hemispheric volumes, a central fissure, surface folds, cerebellum and stem. It remains an original artistic anatomical approximation.

Learning timeline: 0–20% neural approach; 13–43% Machine Learning copy; 43–52% copy exit; 48–67% brain moves toward camera; 66–85% hemispheres split with fragments; 88–98% Knowledge Base appears centrally. The two text stages do not share a visibility interval. On small screens the content panels have bounded heights to avoid clipping; reduced motion displays both in normal flow. TypeScript passed. Runtime visual inspection remains pending.

### Document-scroll layout correction

LearningJourney now uses one sticky 3D background with Machine Learning and Knowledge Base content in normal document flow. The intermediate fracture space provides a text-free animation interval. There are no nested scrolling panels or clipped text. Brain progress follows the content landmarks and reverses with page scroll. Computer Vision and Industrial Automation precede the learning journey; the generic white inner-page wrapper is excluded on the AI route. Each of the three content areas has an original local illustration with scrubbed perspective motion and a CMS media override. TypeScript, CMS and locale checks pass. Browser verification of desktop/mobile scrolling is still pending.

### Continuous neural scene

A single sticky NeuralScene now spans the pupil arrival, Computer Vision, Industrial Automation, Machine Learning and Knowledge Base. A separate travel progress moves the same camera down the nerve tunnel while the learning progress controls brain approach, roll and fracture relative to that camera. Cortical signal paths remain attached to each hemisphere as it rotates and splits. Knowledge Base heading reveals from its centre with document scroll. Content uses translucent readability backgrounds rather than opaque section backgrounds. No nested scrollbars or duplicate neural canvases. TypeScript and CMS checks pass; the visual result still needs browser review.

### Burst and missing-content repair

Knowledge Base is no longer hidden by an animation-progress condition. Its heading and full content remain accessible in document flow when animation cannot run. Native scroll, resize and layout observations now update the learning progress; the renderer damps movement. The burst uses 72 fragments, with the solid hemispheres clearing earlier so fragments are visible. TypeScript, CMS/locale checks and nine viewport/content-height progress cases pass. Runtime visual verification remains pending.

### Stationary brain opening

Removed the brain’s forward Z movement and enlargement during the transition. After its entrance, it retains its depth relative to the travelling camera; the hemispheres and fragments spread outward instead. A decorative, aria-hidden Knowledge Base title opens from the centre during the crack, then fades before the accessible full solution section below. Reduced motion skips the decorative reveal. TypeScript and CMS checks pass; visual browser verification remains pending.
