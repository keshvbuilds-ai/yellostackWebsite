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
