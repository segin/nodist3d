## 2024-05-23 - Scene Graph Accessibility & Layout
**Learning:** Hardcoded absolute positioning (e.g., `top: 10px; right: 10px`) often conflicts with default library positions (like `dat.gui` default top-right), causing UI overlap.
**Action:** Always verify UI component positioning against known 3rd-party overlays. Prefer flex/grid layouts or explicit non-overlapping zones (e.g., Left vs Right sidebar).

## 2024-05-23 - Dynamic List Focus Management
**Learning:** Re-rendering a list (via `innerHTML = ''`) destroys the active element, killing keyboard focus.
**Action:** When updating dynamic lists, always capture `document.activeElement`, check if it's within the container, and restore focus to the corresponding new element (by ID or UUID) after render.

## 2024-05-23 - ESM/UMD Browser Compatibility
**Learning:** Libraries like `loglevel` may fail in native ESM environments (`import * as log from ...`) if they are UMD builds without explicit exports.
**Action:** Use global script tags and `window` access for legacy UMD libraries in non-bundled environments to ensure reliability.
