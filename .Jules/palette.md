## 2026-02-05 - Accessibility in Scene Graph
**Learning:** Scene graph list items need `role="button"` and `tabindex="0"` for keyboard accessibility, plus `keydown` handlers. Icon-only buttons (visibility/delete) need dynamic `aria-label` updates.
**Action:** Always verify keyboard navigation for interactive list items.

## 2026-02-06 - User Feedback & Notifications
**Learning:** System alerts (`alert()`) are blocking and disruptive. `console.log` is invisible to end-users.
**Action:** Replaced critical user feedback (save/load status) with a non-blocking `ToastManager` system.
**Accessibility:** Implemented `role="status"` for info/success and `role="alert"` with `aria-live="assertive"` for errors to ensure screen readers announce critical issues immediately.
## 2024-05-19 - ARIA Labels on Timeline Controls
**Learning:** Found dynamically generated buttons and a range input slider inside TimelineUI without proper ARIA descriptors. Because their visible text implies function but frequently changes state (e.g. Play -> Pause, REC -> STOP), hardcoding static labels is insufficient for screen readers.
**Action:** Always verify that elements whose content changes dynamically (such as toggle buttons) also update their `aria-label` attributes simultaneously in JavaScript state change handlers to keep assistive technologies in sync.
