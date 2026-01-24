## 2026-01-24 - Dynamic UI Accessibility
**Learning:** The Scene Graph UI is dynamically generated in `main.js` using vanilla JS DOM creation. These interactive elements (buttons, list items) were completely missing ARIA labels and keyboard navigation support.
**Action:** When working on UI in this codebase, check `main.js` for other dynamic UI generators (like properties panel) and ensure `aria-label`, `tabindex`, and keyboard event listeners are added during element creation.
