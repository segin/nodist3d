## 2024-05-23 - [Scene Graph Accessibility]
**Learning:** Dynamic lists created via `innerHTML` or `createElement` loop need explicit `role="listbox"`, `role="option"`, and `tabindex="0"` to be keyboard accessible. Icon-only toggle buttons need dynamic `aria-label` updates.
**Action:** When implementing custom lists, always add keyboard event listeners (Enter/Space) and ensure state changes reflect in ARIA attributes.
