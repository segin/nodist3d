# Palette's Journal

## 2024-05-22 - Accessibility in Dynamic Lists
**Learning:** Dynamically generated lists (like Scene Graph) often lack keyboard accessibility. Interactive `li` elements need `tabindex="0"` and `keydown` handlers for Enter/Space to be usable by keyboard users.
**Action:** When creating interactive lists in JS, always add `tabindex` and keyboard listeners immediately.
