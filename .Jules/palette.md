## 2026-01-20 - Accessibility and App Stability
**Learning:** The application relied on a UMD build of the `loglevel` library which fails in strict ESM environments (browser with `type="module"`) because `this` is undefined at the top level. This prevented the application from initializing.
**Action:** Replaced `loglevel` dependency with a lightweight console wrapper in `src/frontend/logger.js` to ensure the app runs reliably in all ESM environments without a bundler.

**Learning:** The Scene Graph panel is positioned at `top: 10px; right: 10px`, which directly overlaps with the default `dat.GUI` controls. This makes the UI cluttered and buttons hard to click.
**Action:** In the future, the Scene Graph should be moved (e.g., to the left side or a different container) to avoid conflict with `dat.GUI`. For now, tests handle this by moving the panel or forcing clicks.
