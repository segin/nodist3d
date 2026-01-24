## 2024-03-21 - Scene Graph Accessibility
**Learning:** The scene graph is built using vanilla DOM manipulation within the main application logic rather than a separate component. This requires manually injecting accessibility attributes (`tabindex`, `role`, `aria-label`) and event listeners during element creation.
**Action:** When working on dynamic UI components in this codebase, always check `main.js` or `App` class for direct DOM manipulation and ensure accessibility attributes are added at creation time.
