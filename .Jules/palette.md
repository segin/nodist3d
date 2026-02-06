<<<<<<< HEAD
## 2026-02-03 - Scene Graph Accessibility & Layout
**Learning:** `dat.gui` and custom UI panels positioned absolutely/fixed can easily overlap.
**Action:** Always check default positions of third-party UI libs when adding custom panels. Use `left`/`top` for custom panels if `dat.gui` uses `right`/`top`.

**Learning:** `style.cssText` in `main.js` makes components hard to style via CSS classes.
**Action:** Prefer `classList.add()` and external CSS over inline styles for better maintainability and mobile responsiveness.

**Learning:** ESM `importmap` fails with UMD modules lacking default exports (like `loglevel`).
**Action:** Use global script tags for UMD dependencies or ensure a proper ESM build is available.
=======
<<<<<<< HEAD
## 2026-02-02 - Scene Graph Accessibility & Layout
**Learning:** Overlapping UI panels (Scene Graph vs Dat.GUI) block interaction and fail accessibility checks. Manual inline styles in JS made this hard to spot until runtime verification.
**Action:** Always verify UI positioning prevents overlap, especially when using libraries with default positions (Dat.GUI). Use distinct screen areas for different control groups.
=======
<<<<<<< HEAD
# Palette's Journal

## 2024-05-22 - Accessibility in Dynamic Lists
**Learning:** Dynamically generated lists (like Scene Graph) often lack keyboard accessibility. Interactive `li` elements need `tabindex="0"` and `keydown` handlers for Enter/Space to be usable by keyboard users.
**Action:** When creating interactive lists in JS, always add `tabindex` and keyboard listeners immediately.
=======
<<<<<<< HEAD
## 2026-01-20 - Accessibility and App Stability
**Learning:** The application relied on a UMD build of the `loglevel` library which fails in strict ESM environments (browser with `type="module"`) because `this` is undefined at the top level. This prevented the application from initializing.
**Action:** Replaced `loglevel` dependency with a lightweight console wrapper in `src/frontend/logger.js` to ensure the app runs reliably in all ESM environments without a bundler.

**Learning:** The Scene Graph panel is positioned at `top: 10px; right: 10px`, which directly overlaps with the default `dat.GUI` controls. This makes the UI cluttered and buttons hard to click.
**Action:** In the future, the Scene Graph should be moved (e.g., to the left side or a different container) to avoid conflict with `dat.GUI`. For now, tests handle this by moving the panel or forcing clicks.
=======
<<<<<<< HEAD
## 2024-05-23 - [Scene Graph Accessibility]
**Learning:** Dynamic lists created via `innerHTML` or `createElement` loop need explicit `role="listbox"`, `role="option"`, and `tabindex="0"` to be keyboard accessible. Icon-only toggle buttons need dynamic `aria-label` updates.
**Action:** When implementing custom lists, always add keyboard event listeners (Enter/Space) and ensure state changes reflect in ARIA attributes.
=======
<<<<<<< HEAD
## 2026-01-26 - Scene Graph Accessibility & Positioning
**Learning:** `dat.gui` typically occupies the top-right corner (z-index ~1000). Placing other high-z-index panels (like Scene Graph) at `top: 10px; right: 10px` causes critical interaction blocking, not just visual overlap. Moving essential panels to the left (`top: 80px; left: 10px`) effectively separates controls and content list.
**Action:** Always check default positioning of third-party UI libraries before placing custom panels. Use `Object.values()` when iterating over `dat.gui` internals (`__folders`) as they can be objects.
=======
<<<<<<< HEAD
## 2024-05-23 - Scene Graph Accessibility & Layout
**Learning:** Hardcoded absolute positioning (e.g., `top: 10px; right: 10px`) often conflicts with default library positions (like `dat.gui` default top-right), causing UI overlap.
**Action:** Always verify UI component positioning against known 3rd-party overlays. Prefer flex/grid layouts or explicit non-overlapping zones (e.g., Left vs Right sidebar).

## 2024-05-23 - Dynamic List Focus Management
**Learning:** Re-rendering a list (via `innerHTML = ''`) destroys the active element, killing keyboard focus.
**Action:** When updating dynamic lists, always capture `document.activeElement`, check if it's within the container, and restore focus to the corresponding new element (by ID or UUID) after render.

## 2024-05-23 - ESM/UMD Browser Compatibility
**Learning:** Libraries like `loglevel` may fail in native ESM environments (`import * as log from ...`) if they are UMD builds without explicit exports.
**Action:** Use global script tags and `window` access for legacy UMD libraries in non-bundled environments to ensure reliability.
=======
<<<<<<< HEAD
## 2024-03-21 - Scene Graph Accessibility
**Learning:** The scene graph is built using vanilla DOM manipulation within the main application logic rather than a separate component. This requires manually injecting accessibility attributes (`tabindex`, `role`, `aria-label`) and event listeners during element creation.
**Action:** When working on dynamic UI components in this codebase, always check `main.js` or `App` class for direct DOM manipulation and ensure accessibility attributes are added at creation time.
=======
<<<<<<< HEAD
## 2026-01-24 - Dynamic UI Accessibility
**Learning:** The Scene Graph UI is dynamically generated in `main.js` using vanilla JS DOM creation. These interactive elements (buttons, list items) were completely missing ARIA labels and keyboard navigation support.
**Action:** When working on UI in this codebase, check `main.js` for other dynamic UI generators (like properties panel) and ensure `aria-label`, `tabindex`, and keyboard event listeners are added during element creation.
=======
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
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
