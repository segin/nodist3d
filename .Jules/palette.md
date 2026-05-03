## 2026-02-05 - Accessibility in Scene Graph
**Learning:** Scene graph list items need `role="button"` and `tabindex="0"` for keyboard accessibility, plus `keydown` handlers. Icon-only buttons (visibility/delete) need dynamic `aria-label` updates.
**Action:** Always verify keyboard navigation for interactive list items.

## 2026-02-06 - User Feedback & Notifications
**Learning:** System alerts (`alert()`) are blocking and disruptive. `console.log` is invisible to end-users.
**Action:** Replaced critical user feedback (save/load status) with a non-blocking `ToastManager` system.
**Accessibility:** Implemented `role="status"` for info/success and `role="alert"` with `aria-live="assertive"` for errors to ensure screen readers announce critical issues immediately.
## 2026-02-07 - Accessibility in Scene Graph (Update)\n**Learning:** When making interactive list items accessible, it is critical to use dynamic `aria-label` attributes for nested icon-only buttons (like delete or visibility toggles) so screen readers can announce exactly which item the action applies to.\n**Action:** Ensure that all generated interactive DOM elements within lists have context-aware `aria-labels`.
