## 2026-01-26 - Scene Graph Accessibility & Positioning
**Learning:** `dat.gui` typically occupies the top-right corner (z-index ~1000). Placing other high-z-index panels (like Scene Graph) at `top: 10px; right: 10px` causes critical interaction blocking, not just visual overlap. Moving essential panels to the left (`top: 80px; left: 10px`) effectively separates controls and content list.
**Action:** Always check default positioning of third-party UI libraries before placing custom panels. Use `Object.values()` when iterating over `dat.gui` internals (`__folders`) as they can be objects.
