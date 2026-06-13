## 2026-02-05 - Accessibility in Scene Graph
**Learning:** Scene graph list items need `role="button"` and `tabindex="0"` for keyboard accessibility, plus `keydown` handlers. Icon-only buttons (visibility/delete) need dynamic `aria-label` updates.
**Action:** Always verify keyboard navigation for interactive list items.

## 2026-02-06 - User Feedback & Notifications
**Learning:** System alerts (`alert()`) are blocking and disruptive. `console.log` is invisible to end-users.
**Action:** Replaced critical user feedback (save/load status) with a non-blocking `ToastManager` system.
**Accessibility:** Implemented `role="status"` for info/success and `role="alert"` with `aria-live="assertive"` for errors to ensure screen readers announce critical issues immediately.

## 2026-02-08 - Accessibility of Interactive List Items
**Learning:** When adding keyboard navigation (`keydown` handlers for "Enter" and " ") to a parent element like an `li`, it is important to prevent child interactive controls from unintentionally triggering the parent action. This can be resolved by verifying `e.target === e.currentTarget` in the `keydown` handler. Also, making the parent `role="button"` while containing child buttons can be a nested interactive controls anti-pattern for some screen readers.
**Action:** Be mindful of event bubbling on interactive containers and consider alternatives to nesting buttons inside `role="button"`.
