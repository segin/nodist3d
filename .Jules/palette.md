## 2026-01-22 - Scene Graph Positioning & dat.gui
**Learning:** The custom Scene Graph panel at `top: 10px; right: 10px` completely overlapped the default `dat.gui` controls, making the application unusable. Also, `dat.gui` internal structures like `__folders` can be inconsistent (array vs object).
**Action:** Always check for UI overlaps when adding fixed-position elements. Use defensive programming when accessing internal APIs of libraries like `dat.gui`.
