## 2026-01-28 - Dynamic UI Accessibility & Layout
**Learning:** Dynamic UI components (like the Scene Graph) generated in `main.js` were ignoring CSS classes and missing accessibility attributes (ARIA labels, titles), leading to hardcoded styles and poor a11y. Also, fixed positioning caused overlap with `dat.gui`.
**Action:** Always target existing DOM elements for containers, use CSS classes instead of inline styles, and explicitly add ARIA attributes when creating elements dynamically. Ensure overlay positions don't conflict with library-generated UI.
