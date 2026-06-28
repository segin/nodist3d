## 2026-02-05 - Accessibility in Scene Graph
**Learning:** Scene graph list items need `role="button"` and `tabindex="0"` for keyboard accessibility, plus `keydown` handlers. Icon-only buttons (visibility/delete) need dynamic `aria-label` updates.
**Action:** Always verify keyboard navigation for interactive list items.

## 2026-02-06 - User Feedback & Notifications
**Learning:** System alerts (`alert()`) are blocking and disruptive. `console.log` is invisible to end-users.
**Action:** Replaced critical user feedback (save/load status) with a non-blocking `ToastManager` system.
**Accessibility:** Implemented `role="status"` for info/success and `role="alert"` with `aria-live="assertive"` for errors to ensure screen readers announce critical issues immediately.
## 2024-06-10 - Keyboard Navigation Fixes for Menus and Controls
**Learning:** The `.menu-item` elements in the global menubar didn't have focus states or accessibility keyboard navigation hooks so they were inaccessible. Focus outlines for generic interactive elements were also missing in `globals.css`
**Action:** Adding `tabIndex={0}` to interactive non-button wrappers and using `:focus-within` on dropdown containers handles keyboard accessibility with CSS only instead of complex JS state. Always use `:focus-visible` rather than `:focus` to prevent outline rings on mouse clicks.
