## 2026-02-02 - Scene Graph Accessibility & Layout
**Learning:** Overlapping UI panels (Scene Graph vs Dat.GUI) block interaction and fail accessibility checks. Manual inline styles in JS made this hard to spot until runtime verification.
**Action:** Always verify UI positioning prevents overlap, especially when using libraries with default positions (Dat.GUI). Use distinct screen areas for different control groups.
