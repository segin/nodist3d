## 2026-02-04 - UI Overlay Conflicts
**Learning:** Custom UI panels positioned at `top: 10px; right: 10px` conflict with default `dat.gui` positioning, blocking interaction on mobile and desktop.
**Action:** Always check default positioning of third-party UI libraries when placing custom panels. Prefer left-side or distinct coordinates.

## 2026-02-04 - Dynamic List Accessibility
**Learning:** Dynamically created list items (`ul > li`) need explicit `tabindex="0"`, `role="button"`, and `keydown` handlers (Enter/Space) to match native button behavior.
**Action:** Encapsulate this logic in the item creation loop to ensure all future items inherit accessibility.
