Create a web-based 3D modeling program using Node.js to host the backend and WebGL to render everything in the browser. Include support for all the basic 3D primitives, including cubes, spheres, triangles, and any other shapes you can think of. Come up with a list of 3D primitives to include in the default set. Your list of primitives is too short. Create a Git repository in this directory if one does not exist - use the Unix `find` command to check. Meticulously add each of these items to a central `README.md` document which you will first create blank, commit, and then commit after adding all check boxes. Each primitive object shall be a new check box in the list. Make sure to optimize the application interface for mobile. Make sure the node.js webserver listens on localhost for a browser to connect to in order to show the frontend interface. Make sure to optimize the code. Use a custom zip file format with JSON data inside for persistent local storage. Create a `CONTEXT.md` file that you store all of your working context, ideas, and progress in, but treat it as a cache - once you're done with something in those working notes, clear it out. Commit changes to `CONTEXT.md` to the Git repository. Check for the existence of `gh` using Termux `pkg` commands. Take note of all install `pkg` and `npm` packages before getting started. Create a GitHub repository `nodist3d` and push each commit there as it happens. Explain that the name is Node.js + -ist + 3D. Create a suite of unit tests and a full test harness and test the full codebase. Make sure there is an interface button on the user controls of the web frontend to easily enter and leave full screen mode. Save this original prompt as `PROMPT.md`, commit it, and then never change it.

---
*Directive: This file, `GEMINI.md`, must be updated with the latest status of the work after each significant change.*
*Directive: If the user requests that I add or remember any directives, they should be saved to this project's `GEMINI.md`.*
*Directive: Always update the contents of the `GEMINI.md` file with the current subtask you are working on. Ensure that if you are completely interrupted and reset, you are able to adequately restore your working state as to be able to resume your work without significant interruption.*
*Directive: After every `git commit`, the immediate next action should be a `git push` with the sole exception of the commit failing - in that case, resolve the commit failure, and then `git push`.*

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