## 2026-02-05 - Accessibility in Scene Graph
**Learning:** Scene graph list items need `role="button"` and `tabindex="0"` for keyboard accessibility, plus `keydown` handlers. Icon-only buttons (visibility/delete) need dynamic `aria-label` updates.
**Action:** Always verify keyboard navigation for interactive list items.

## 2026-02-06 - User Feedback & Notifications
**Learning:** System alerts (`alert()`) are blocking and disruptive. `console.log` is invisible to end-users.
**Action:** Replaced critical user feedback (save/load status) with a non-blocking `ToastManager` system.
**Accessibility:** Implemented `role="status"` for info/success and `role="alert"` with `aria-live="assertive"` for errors to ensure screen readers announce critical issues immediately.

## 2026-05-08 - Accessibility in TimelineUI
**Learning:** Icon-only buttons or interactive elements like play/pause and record buttons need dynamic `aria-label` updates depending on their state. Also, standard sliders (`input[type="range"]`) might need clear `title` and `aria-label` descriptors so screen readers can correctly identify them. Adding `cursor: pointer` further improves desktop usability.
**Action:** Implemented dynamic state updates for `aria-label` and `title` in TimelineUI methods `togglePlay` and `toggleRecord`. Added clear descriptions to the slider component. Ensure all newly added UI elements with interaction have accessibility descriptors.
