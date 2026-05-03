## 2026-02-05 - Accessibility in Scene Graph
**Learning:** Scene graph list items need `role="button"` and `tabindex="0"` for keyboard accessibility, plus `keydown` handlers. Icon-only buttons (visibility/delete) need dynamic `aria-label` updates.
**Action:** Always verify keyboard navigation for interactive list items.

## 2026-02-06 - User Feedback & Notifications
**Learning:** System alerts (`alert()`) are blocking and disruptive. `console.log` is invisible to end-users.
**Action:** Replaced critical user feedback (save/load status) with a non-blocking `ToastManager` system.
**Accessibility:** Implemented `role="status"` for info/success and `role="alert"` with `aria-live="assertive"` for errors to ensure screen readers announce critical issues immediately.
## 2026-02-07 - Dynamic ARIA labels for Timelines\n**Learning:** Interactive controls like play/pause and record toggle buttons require their ARIA labels to be dynamically updated when their state changes (e.g., from 'Play animation' to 'Pause animation') to provide accurate feedback to screen readers.\n**Action:** Always ensure toggle buttons dynamically update their `aria-label` alongside their visual state or text content.
