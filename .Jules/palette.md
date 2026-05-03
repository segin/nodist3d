## 2026-02-05 - Accessibility in Scene Graph
**Learning:** Scene graph list items need `role="button"` and `tabindex="0"` for keyboard accessibility, plus `keydown` handlers. Icon-only buttons (visibility/delete) need dynamic `aria-label` updates.
**Action:** Always verify keyboard navigation for interactive list items.

## 2026-02-06 - User Feedback & Notifications
**Learning:** System alerts (`alert()`) are blocking and disruptive. `console.log` is invisible to end-users.
**Action:** Replaced critical user feedback (save/load status) with a non-blocking `ToastManager` system.
**Accessibility:** Implemented `role="status"` for info/success and `role="alert"` with `aria-live="assertive"` for errors to ensure screen readers announce critical issues immediately.
## 2024-04-18 - Added keyboard accessibility to scene graph items
**Learning:** List items (`<li>`) used as interactive selection targets often lack keyboard focus (`tabIndex`) and appropriate screen reader roles (`role="button"`) in this application. Furthermore, CSS focus indicators (`:focus-visible`) are necessary for keyboard navigation.
**Action:** When working on interactive lists, ensure list items are keyboard focusable, have appropriate ARIA attributes, handle 'Enter'/'Space' keydown events, and display clear focus indicators in CSS.
