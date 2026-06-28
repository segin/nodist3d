## 2026-02-05 - Accessibility in Scene Graph
**Learning:** Scene graph list items need `role="button"` and `tabindex="0"` for keyboard accessibility, plus `keydown` handlers. Icon-only buttons (visibility/delete) need dynamic `aria-label` updates.
**Action:** Always verify keyboard navigation for interactive list items.

## 2026-02-06 - User Feedback & Notifications
**Learning:** System alerts (`alert()`) are blocking and disruptive. `console.log` is invisible to end-users.
**Action:** Replaced critical user feedback (save/load status) with a non-blocking `ToastManager` system.
**Accessibility:** Implemented `role="status"` for info/success and `role="alert"` with `aria-live="assertive"` for errors to ensure screen readers announce critical issues immediately.
## 2024-06-11 - Accessibility on Dynamically Created Elements
**Learning:** In projects that dynamically create their UI via `document.createElement()`, common accessibility attributes like `aria-label`s are often missing or forgotten because the HTML is not declaratively visible in a template.
**Action:** When working on dynamically generated UIs, proactively check for missing `aria-label`s, `title`s, and proper roles on interactive elements like buttons and inputs.
