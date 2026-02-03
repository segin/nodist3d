## 2026-02-03 - Scene Graph Accessibility & Layout
**Learning:** `dat.gui` and custom UI panels positioned absolutely/fixed can easily overlap.
**Action:** Always check default positions of third-party UI libs when adding custom panels. Use `left`/`top` for custom panels if `dat.gui` uses `right`/`top`.

**Learning:** `style.cssText` in `main.js` makes components hard to style via CSS classes.
**Action:** Prefer `classList.add()` and external CSS over inline styles for better maintainability and mobile responsiveness.

**Learning:** ESM `importmap` fails with UMD modules lacking default exports (like `loglevel`).
**Action:** Use global script tags for UMD dependencies or ensure a proper ESM build is available.
