## 2026-02-05 - Accessibility in Scene Graph
**Learning:** Scene graph list items need `role="button"` and `tabindex="0"` for keyboard accessibility, plus `keydown` handlers. Icon-only buttons (visibility/delete) need dynamic `aria-label` updates.
**Action:** Always verify keyboard navigation for interactive list items.

## 2026-02-06 - User Feedback & Notifications
**Learning:** System alerts (`alert()`) are blocking and disruptive. `console.log` is invisible to end-users.
**Action:** Replaced critical user feedback (save/load status) with a non-blocking `ToastManager` system.
**Accessibility:** Implemented `role="status"` for info/success and `role="alert"` with `aria-live="assertive"` for errors to ensure screen readers announce critical issues immediately.
## 2026-03-09 - Accessibility in TimelineUI
**Learning:** Timeline interactive elements (`playPauseBtn`, `slider`, `addKeyframeBtn`, `recordBtn`) lacked `aria-label` attributes. Input elements like `type="range"` and buttons with dynamically changing text ("Play"/"Pause", "REC"/"STOP") need static or dynamic `aria-label`s to be screen-reader friendly.
**Action:** Always verify keyboard accessibility and dynamically updated `aria-label`s on buttons that toggle states.
