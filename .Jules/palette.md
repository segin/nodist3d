## 2026-02-05 - Accessibility in Scene Graph
**Learning:** Scene graph list items need `role="button"` and `tabindex="0"` for keyboard accessibility, plus `keydown` handlers. Icon-only buttons (visibility/delete) need dynamic `aria-label` updates.
**Action:** Always verify keyboard navigation for interactive list items.

## 2026-02-06 - User Feedback & Notifications
**Learning:** System alerts (`alert()`) are blocking and disruptive. `console.log` is invisible to end-users.
**Action:** Replaced critical user feedback (save/load status) with a non-blocking `ToastManager` system.
**Accessibility:** Implemented `role="status"` for info/success and `role="alert"` with `aria-live="assertive"` for errors to ensure screen readers announce critical issues immediately.
## 2023-10-27 - Added ARIA tabs to ShaderEditor
**Learning:** Custom UI components built with basic HTML elements (like `<div>` and `<button>` for tabs) need explicit ARIA roles (`tablist`, `tab`) and dynamic states (`aria-selected`) to be usable by screen readers. The `className` active state is visual only.
**Action:** When building or reviewing custom tabbed interfaces, ensure they follow the WAI-ARIA authoring practices for tabs.
