## 2025-02-19 - Scene Graph & dat.gui Overlap
**Learning:** The default `dat.gui` panel occupies the top-right corner (`top: 0, right: 0` or similar). Any custom UI placed at `top: 10px; right: 10px` (like the Scene Graph was) will be overlaid by `dat.gui`, intercepting clicks.
**Action:** Always position custom persistent UI panels (like Scene Graph) on the left side (e.g., `top: 80px; left: 10px`) or ensure they are explicitly positioned below `dat.gui` with sufficient margin.

## 2025-02-19 - Inline Styles vs CSS
**Learning:** The application heavily utilized inline styles in `main.js` which overrode `style.css` rules, breaking mobile responsiveness and accessibility styling (focus states).
**Action:** Refactor inline styles to CSS classes (`.icon-btn`, `#scene-graph li`) to allow for proper cascading, media queries, and pseudo-states (`:focus-visible`).
