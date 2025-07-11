--- Context from: ../.gemini/GEMINI.md ---
## Gemini Added Memories
- Always perform a `git push` after each and every `git commit`.
- To test frontend code in a Node.js environment, I can use a virtual DOM library like JSDOM or Happy DOM. This allows running tests with `npm test` without a browser. I should configure the testing framework (e.g., Jest) to use one of these environments.
- Always `git commit` and `git push` after each and every change.
- When implementing test cases, it is a requirement to implement only one at a time. You must only check off one completed test unit per `git commit` and `git push`.
--- End of Context from: ../.gemini/GEMINI.md ---

--- Context from: GEMINI.md ---
Create a web-based 3D modeling program using Node.js to host the backend and WebGL to render everything in the browser. Include support for all the basic 3D primitives, including cubes, spheres, triangles, and any other shapes you can think of. Come up with a list of 3D primitives to include in the default set. Your list of primitives is too short. Create a Git repository in this directory if one does not exist - use the Unix `find` command to check. Meticulously add each of these items to a central `README.md` document which you will first create blank, commit, and then commit after adding all check boxes. Each primitive object shall be a new check box in the list. Make sure to optimize the application interface for mobile. Make sure the node.js webserver listens on localhost for a browser to connect to in order to show the frontend interface. Make sure to optimize the code. Use a custom zip file format with JSON data inside for persistent local storage. Create a `CONTEXT.md` file that you store all of your working context, ideas, and progress in, but treat it as a cache - once you're done with something in those working notes, clear it out. Commit changes to `CONTEXT.md` to the Git repository. Check for the existence of `gh` using Termux `pkg` commands. Take note of all install `pkg` and `npm` packages before getting started. Create a GitHub repository `nodist3d` and push each commit there as it happens. Explain that the name is Node.js + -ist + 3D. Create a suite of unit tests and a full test harness and test the full codebase. Make sure there is an interface button on the user controls of the web frontend to easily enter and leave full screen mode. Save this original prompt as `PROMPT.md`, commit it, and then never change it.

---
*Directive: This file, `GEMINI.md`, must be updated with the latest status of the work after each significant change.*
*Directive: If the user requests that I add or remember any directives, they should be saved to this project's `GEMINI.md`.*
*Directive: Always update the contents of the `GEMINI.js` file with the current subtask you are working on. Ensure that if you are completely interrupted and reset, you are able to adequately restore your working state as to be able to resume your work without significant interruption.*
*Directive: After every `git commit`, the immediate next action should be a `git push` with the sole exception of the commit failing - in that case, resolve the commit failure, and then `git push`.*
*Directive: When implementing test cases, it is a requirement to implement only one at a time. You must only check off one completed test unit per `git commit` and `git push`.*
*Directive: Scan the codebase and suggest 500 possible improvements. Combine them with suggestions file. Make the whole thing a checklist. Implement only one item at a time, then make `git commit` and `git push` before moving on to the next item.*

## Working Context, Ideas, and Progress for nodist3d

### Current Focus:
- Running tests to verify changes.

### Completed Tasks:
- Optimized font loading in `ObjectManager.js` by loading the font once in the constructor and removing duplicate `addLathe`, `addExtrude`, and `addText` functions.
- Refactored `main.js` to use an `App` class for better organization and moved UI setup into dedicated methods.
- Implemented Web Workers for offloading heavy computations (scene serialization/deserialization).
- Implemented Level of Detail (LOD) for complex scenes.
- Implemented the Factory Pattern for 3D primitives using `PrimitiveFactory.js`.
- Created `src/frontend/EventBus.js`.
- Modified `main.js` to instantiate `EventBus` and pass it to relevant managers, and updated `eventBus.emit` to `eventBus.publish`.
- Refactored `Pointer.js` to publish `selectionChange` events via `EventBus` and removed redundant `THREE.EventDispatcher` inheritance.
- Modified `main.js` to subscribe to `selectionChange` events using `eventBus.subscribe`.
- Refactored `History.js` to subscribe to relevant events for state saving using `eventBus.subscribe`.
- Modified `ObjectManager.js` to publish events using `eventBus.publish`.
- Modified `LightManager.js` to publish events using `eventBus.publish`.
- Modified `GroupManager.js` to publish events using `eventBus.publish`.
- Updated `README.md` to mark Event Bus as complete.
- Removed `super()` call from `src/frontend/Pointer.js`.
- Modified `main.js` to use the singleton `EventBus` instance.
- Rewrote `jest.config.cjs` to fix syntax errors.
- Fixed `tests/History.test.js` to use the singleton `EventBus` instance.
- Fixed `tests/GroupManager.test.js` to use the singleton `EventBus` instance.
- Fixed `tests/ObjectManager.test.js` to use the singleton `EventBus` instance.
- Fixed `tests/PhysicsManager.test.js` to use the singleton `EventBus` instance.
- Fixed `tests/ShaderEditor.test.js` to use the singleton `EventBus` instance and updated `main.js` to pass `eventBus` to `ShaderEditor`, and improved mocks in `ShaderEditor.test.js`.
        - Fixed `tests/ObjectManager.test.js` to explicitly import THREE components.
        - Fixed `tests/ShaderEditor.test.js` to explicitly import THREE components.
        - Fixed `tests/PhysicsManager.test.js` syntax error.
        - Fixed `src/frontend/SceneGraph.js` to use `eventBus.publish` and `eventBus.subscribe`, and refined `document.createElement` mock in `tests/SceneGraph.test.js`.

### New Memory:
- When `replace` tool fails due to multiple matches or complex replacements, rebuild the full file content into a temporary file and then move it to replace the original. No need to `git add` if the filename is the same.

### Next Steps:
- Run tests to verify changes.
- Prioritize next roadmap features based on the `README.md`.
- Continue implementing features from the `README.md` checklist.
- Regularly update `GEMINI.md` with progress.
- Ensure all changes are tested and committed individually.
- Push all commits to the remote repository.