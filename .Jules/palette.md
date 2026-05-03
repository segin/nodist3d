## 2026-02-05 - Accessibility in Scene Graph
**Learning:** Scene graph list items need `role="button"` and `tabindex="0"` for keyboard accessibility, plus `keydown` handlers. Icon-only buttons (visibility/delete) need dynamic `aria-label` updates.
**Action:** Always verify keyboard navigation for interactive list items.

## 2026-02-06 - User Feedback & Notifications
**Learning:** System alerts (`alert()`) are blocking and disruptive. `console.log` is invisible to end-users.
**Action:** Replaced critical user feedback (save/load status) with a non-blocking `ToastManager` system.
**Accessibility:** Implemented `role="status"` for info/success and `role="alert"` with `aria-live="assertive"` for errors to ensure screen readers announce critical issues immediately.

## 2026-04-27 - Keyboard Accessibility in Scene Graph Items
**Learning:** Adding `tabindex="0"` and a keyboard event listener for `Enter` and `Space` to `<li>` elements makes them keyboard-accessible, but changing `role="listitem"` to `role="button"` removes their list semantics for screen readers. A better strict a11y pattern is inserting an actual `<button>` inside the `<li>` element instead of assigning `role="button"` to the `<li>` itself.
**Action:** When retrofitting list items for interactivity, consider inserting inner `<button>` elements rather than overriding the `<li>` role, if the design allows for it.
