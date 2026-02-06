<<<<<<< HEAD
## 2026-01-29 - Scene Graph & dat.gui Overlap
**Learning:** The default `dat.gui` panel occupies the top-right corner (`top: 0, right: 0` or similar). Any custom UI placed at `top: 10px; right: 10px` (like the Scene Graph was) will be overlaid by `dat.gui`, intercepting clicks.
**Action:** Always position custom persistent UI panels (like Scene Graph) on the left side (e.g., `top: 80px; left: 10px`) or ensure they are explicitly positioned below `dat.gui` with sufficient margin.

## 2026-01-29 - Inline Styles vs CSS
**Learning:** The application heavily utilized inline styles in `main.js` which overrode `style.css` rules, breaking mobile responsiveness and accessibility styling (focus states).
**Action:** Refactor inline styles to CSS classes (`.icon-btn`, `#scene-graph li`) to allow for proper cascading, media queries, and pseudo-states (`:focus-visible`).
=======
## 2026-01-28 - Dynamic UI Accessibility & Layout
**Learning:** Dynamic UI components (like the Scene Graph) generated in `main.js` were ignoring CSS classes and missing accessibility attributes (ARIA labels, titles), leading to hardcoded styles and poor a11y. Also, fixed positioning caused overlap with `dat.gui`.
**Action:** Always target existing DOM elements for containers, use CSS classes instead of inline styles, and explicitly add ARIA attributes when creating elements dynamically. Ensure overlay positions don't conflict with library-generated UI.
>>>>>>> master
