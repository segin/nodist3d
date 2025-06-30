## Working Context, Ideas, and Progress for nodist3d

### Current Focus:
- Implementing the Observer Pattern (Event Bus).

### Completed Tasks:
- Optimized font loading in `ObjectManager.js` by loading the font once in the constructor and removing duplicate `addLathe`, `addExtrude`, and `addText` functions.
- Refactored `main.js` to use an `App` class for better organization and moved UI setup into dedicated methods.
- Implemented Web Workers for offloading heavy computations (scene serialization/deserialization).
- Implemented Level of Detail (LOD) for complex scenes.
- Implemented the Factory Pattern for 3D primitives using `PrimitiveFactory.js`.

### New Memory:
- When `replace` tool fails due to multiple matches or complex replacements, rebuild the full file content into a temporary file and then move it to replace the original. No need to `git add` if the filename is the same.

### Next Steps:
- Create `src/frontend/EventBus.js`.
- Modify `main.js` to instantiate `EventBus` and pass it to relevant managers.
- Refactor `Pointer.js` to publish `selectionChange` events via `EventBus`.
- Modify `main.js` to subscribe to `selectionChange` events.
- Refactor `History.js` to subscribe to relevant events for state saving.
- Modify `ObjectManager`, `LightManager`, and `GroupManager` to publish events.
- Update `README.md` to mark Event Bus as complete.
- Run tests to verify changes.
- Prioritize next roadmap features based on the `README.md`.
