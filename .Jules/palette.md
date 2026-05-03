## 2026-02-05 - Accessibility in Scene Graph
**Learning:** Scene graph list items need `role="button"` and `tabindex="0"` for keyboard accessibility, plus `keydown` handlers. Icon-only buttons (visibility/delete) need dynamic `aria-label` updates.
**Action:** Always verify keyboard navigation for interactive list items.

## 2026-02-06 - User Feedback & Notifications
**Learning:** System alerts (`alert()`) are blocking and disruptive. `console.log` is invisible to end-users.
**Action:** Replaced critical user feedback (save/load status) with a non-blocking `ToastManager` system.
**Accessibility:** Implemented `role="status"` for info/success and `role="alert"` with `aria-live="assertive"` for errors to ensure screen readers announce critical issues immediately.
## 2026-05-01 - Added aria-labels to Timeline, ShaderEditor, and UIRenderer buttons\n**Learning:** The application heavily dynamically creates elements via `document.createElement` but many icon-only or abbreviated text buttons (like REC, Key+) lacked ARIA labels, making them inaccessible to screen readers. Adding `aria-label` makes them descriptive.\n**Action:** Whenever creating new UI buttons via `document.createElement`, especially those with only icons or abbreviated text, always remember to add an `aria-label` to describe its functionality clearly.
