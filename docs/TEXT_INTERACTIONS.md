# Hero atmosphere and text interactions

Implemented in the existing local Next.js project using the installed Framer Motion and GSAP packages.

- Adapted the supplied decrypt effect for full-link hover, repeating scramble/reveal cycles, focus, fixed-width labels, stable accessible names, reduced motion and timer cleanup. Applied to desktop/mobile navigation, hero CTAs, replay, footer company links and contact actions.
- Integrated the supplied Tech Text canvas above the footer: off-white surface, large black Yello Stack lettering, black connecting strip, dashed glyph outlines, selection guides, specks and mouse dragging. Arrow keys explore the lettering. Touch scrolling is preserved. Added spring substeps, capture cancellation, reduced-motion preference handling and offscreen pausing.
- Added a faint hero grid, animated light paths, a capabilities line and a rotating Discover/Design/Develop detail. These fade during the hold journey. GSAP ScrollTrigger reveals the footer stage; Framer Motion handles its header and hero chapter transitions.
- Contact action now opens mailto:hello@yellostack.com instead of being an unhandled button. Footer section links also resolve from the careers page.

Validation: production build and TypeScript passed; isolated interaction checks passed for decrypt hover/repeat/reset/focus/cleanup/reduced-motion behavior; local homepage returned HTTP 200 with all new sections. No connected browser backend was available, so visual canvas rendering and live pointer interaction remain unverified.
