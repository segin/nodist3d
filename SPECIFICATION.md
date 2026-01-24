# Comprehensive Development Specification for nodist3d

This specification document aggregates and massively expands upon all roadmap items, todo lists, testing requirements, and code improvement suggestions found in `README.md`, `SUGGESTIONS.md`, and `TESTING_TODO.md`. It serves as the granular master plan for the continued development of **nodist3d**.

---

## Phase 1: Architecture, Refactoring & Code Quality

This phase focuses on solidifying the codebase foundation, ensuring maintainability, scalability, and robustness before adding complex new features.

### 1.1. Module System & Dependency Management
**Goal**: Transition to a fully modular, decoupled architecture using modern standards.

*   **1.1.1. Standardize on ES Modules**
    *   *Context*: The project currently mixes CommonJS (`require`) and ES Modules (`import`), which causes tooling friction.
    *   **Action Items**:
        *   [x] **Update `package.json`**: Add `"type": "module"` property to the root object.
        *   [x] **Refactor Backend (`src/backend/server.js`)**:
            *   [x] Replace `const express = require('express')` with `import express from 'express'`.
            *   [x] Replace all `require` calls with static `import` statements where possible.
            *   [x] For conditional imports, use `await import()`.
            *   [x] Replace `__dirname` (undefined in ESM) with `import { fileURLToPath } from 'url'; import { dirname } from 'path'; const __dirname = dirname(fileURLToPath(import.meta.url));`.
        *   [x] **Refactor Frontend Imports**:
            *   [x] Audit all frontend files (`src/frontend/**/*.js`).
            *   [x] Ensure all local imports include the `.js` extension (e.g., `import { x } from './utils.js'`), which is mandatory for browser-native ESM.
            *   [x] Verify that `three` and other dependencies are imported via their ESM entry points or mapped correctly if using an import map.
    *   **Verification & Testing**:
        *   [x] Run `npm start` and ensure the server boots without "require is not defined" errors.
        *   [x] Open the browser application and check the console for "Module not found" errors.
        *   [x] Run `npm test` (after updating test config) to ensure the test runner handles ESM correctly.

*   **1.1.2. Implement Dependency Injection (DI) Container**
    *   *Context*: Managers currently access each other via global variables or direct instantiation, leading to tight coupling and making unit testing difficult.
    *   **Action Items**:
        *   [x] **Create `ServiceContainer` class**:
            *   [x] Implement a `services` Map to store instances.
            *   [x] Implement `register(name, instance)`: Throws if name already exists.
            *   [x] Implement `get(name)`: Throws error if service not found (fail fast).
        *   [x] **Refactor Manager Classes**:
            *   [x] **ObjectManager**: Constructor should accept `scene`, `eventBus`, `physicsManager`. Remove internal `new` calls.
            *   [x] **SceneManager**: Constructor should accept `renderer`, `camera`, `inputManager`.
            *   [x] **InputManager**: Constructor should accept `domElement`.
        *   [x] **Update Entry Point (`main.js`)**:
            *   [x] Create a single instance of `ServiceContainer`.
            *   [x] Instantiate `EventBus` first and register it.
            *   [x] Instantiate other managers in dependency order, passing the container or specific services.
    *   **Verification & Testing**:
        *   [x] **Unit Test**: Create `ServiceContainer.test.js`. verify `register` stores and `get` retrieves. Verify error on missing service.
        *   [x] **Integration Test**: Verify that `ObjectManager` can successfully emit events via the injected `EventBus`.

*   **1.1.3. Centralized State Management**
    *   *Context*: Application state (e.g., "is user dragging?", "current color") is scattered across DOM elements and Manager instance properties.
    *   **Action Items**:
        *   [x] **Create `StateManager` class**:
            *   [x] Define initial state schema: `{ selection: [], toolMode: 'select', clipboard: null, isDragging: false, sceneDirty: false }`.
            *   [x] use `Proxy` or a simple setter pattern to detect changes.
        *   [x] **Implement State Accessors**:
            *   [x] `getState()`: Returns a read-only copy (frozen) of the state.
            *   [x] `setState(partialState)`: Merges updates and notifies listeners.
            *   [x] `subscribe(key, callback)`: specific listener for property changes.
        *   [x] **Refactor Consumers**:
            *   [x] **ObjectManager**: When selecting, call `stateManager.setState({ selection: [obj] })` instead of setting `this.selected`.
            *   [x] **PropertiesPanel**: Subscribe to `selection` changes to auto-update the UI.
    *   **Verification & Testing**:
        *   [x] **Unit Test**: Test `setState` merges correctly and fires callbacks.
        *   [x] **Unit Test**: Test that subscribers to irrelevant keys are *not* fired.
        *   [x] **Integration**: Change selection in 3D view -> Verify Properties Panel updates.

### 1.2. Code Quality & Standards
**Goal**: Enforce consistent coding standards, documentation, and type safety to prevent regression.

*   **1.2.1. Linting and Formatting Setup**
    *   **Action Items**:
        *   [x] **Install Tools**: `npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-promise eslint-plugin-unicorn`.
        *   [x] **Configure ESLint (`eslint.config.mjs`)**:
            *   [x] `env`: `{ browser: true, node: true, es2022: true }`.
            *   [x] `rules`: Enforce `eqeqeq`, `no-var`, `prefer-const`, `no-console` (warn), `promise/always-return`.
        *   [x] **Configure Prettier (`.prettierrc`)**:
            *   [x] `{ "semi": true, "singleQuote": true, "tabWidth": 2, "printWidth": 100 }`.
        *   [x] **Setup Husky**:
            *   [x] `npx husky install`.
            *   [x] Add `pre-commit` hook: `npx lint-staged`.
            *   [x] Configure `lint-staged` in package.json to run `eslint --fix` on `*.js` files.
    *   **Verification & Testing**:
        *   [x] Deliberately introduce a lint error (e.g., `var x = 1;`). Verify commit fails.
        *   [x] Run `npm run lint`. Verify it catches issues.

*   **1.2.2. Documentation & Type Safety**
    *   **Action Items**:
        *   [ ] **JSDoc Implementation**:
            *   [ ] Go through every file in `src/`.
            *   [ ] Add `/** ... */` blocks to every class, method, and exported function.
            *   [ ] Explicitly define `@param {Type} name` and `@returns {Type}`.
        *   [ ] **TypeScript Migration (Phase 1)**:
            *   [ ] Create `tsconfig.json` with `{ "allowJs": true, "checkJs": true, "noEmit": true }`.
            *   [ ] Add `// @ts-check` to the top of `main.js` and `ObjectManager.js`.
            *   [ ] Fix all resulting type errors (mostly by adding JSDoc).
            *   [ ] Create `src/types.d.ts` to define global interfaces like `SceneObject`, `SerializedScene`, `ManagerInterface`.
    *   **Verification & Testing**:
        *   [ ] Run `npx tsc`. Expect zero errors in checked files.

### 1.3. Error Handling & Logging
**Goal**: Improve application stability and provide visibility into runtime issues.

*   **1.3.1. Centralized Logging**
    *   **Action Items**:
        *   [ ] **Create `Logger` utility (`src/utils/Logger.js`)**:
            *   [ ] Implement levels: `DEBUG`, `INFO`, `WARN`, `ERROR`.
            *   [ ] Method `log(level, message, meta)`.
            *   [ ] Include timestamp ISO string in every log.
            *   [ ] In `production` mode (env var), suppress `DEBUG` logs.
        *   [ ] **Replace console calls**:
            *   [ ] `grep` for `console.log` and replace with `Logger.info`.
            *   [ ] `grep` for `console.error` and replace with `Logger.error`.
    *   **Verification & Testing**:
        *   [ ] Run app. Verify logs appear with timestamps.
        *   [ ] Set `NODE_ENV=production`. Verify debug logs disappear.

*   **1.3.2. Robust Error Boundaries**
    *   **Action Items**:
        *   [ ] **Global Error Handler**:
            *   [ ] Add `window.addEventListener('error', ...)` to catch unhandled exceptions.
            *   [ ] Add `window.addEventListener('unhandledrejection', ...)` for Promises.
            *   [ ] Log these to `Logger.error`.
        *   [ ] **Operation Wrappers**:
            *   [ ] Wrap `JSON.parse` in a utility `safeJSONParse(str, fallback)`. Use this in SceneStorage.
            *   [ ] Wrap `localStorage.setItem` in `try...catch` to handle quota limits.
        *   [ ] **UI Feedback**:
            *   [ ] Create `ToastManager`.
            *   [ ] When an error occurs (e.g., "Save Failed"), spawn a red toast notification instead of crashing or staying silent.
    *   **Verification & Testing**:
        *   [ ] **Manual Test**: Disconnect network, try to save (if cloud save exists). Check for toast.
        *   [ ] **Manual Test**: Manually corrupt `localStorage` entry, try to load. Check for safe failure.

---

## Phase 2: Comprehensive Testing Suite

This phase specifically implements the 150+ test cases defined in `TESTING_TODO.md`.

### 2.1. Unit Testing Framework Setup
*   **Action Items**:
    *   [ ] **Jest Config**: Ensure `jest.config.js` is set up for ESM (`transform: {}`) and JSDOM.
    *   [ ] **Mocking Strategy**:
        *   [ ] Create `__mocks__/three.js`. Mock `Mesh`, `Scene`, `WebGLRenderer`, `Camera`.
        *   [ ] Ensure mocks record calls (e.g., `scene.add = jest.fn()`) so we can verify interactions.

### 2.2. Implementing Test Categories
Each category below corresponds to a specific file or feature set.

*   **2.2.1. ObjectManager Tests (Detailed)**
    *   **Action Items**: Write tests for:
        *   [ ] `addPrimitive(type)`: Verifies correct geometry/material creation.
        *   [ ] `duplicate(obj)`: Verifies deep cloning of properties, unique name generation, and position offset.
        *   [ ] `delete(obj)`: Verifies removal from scene, disposal of resources (geometry/material), and event emission.
        *   [ ] `updateProperty(obj, prop, val)`: Verifies `object.position.x` updates correctly.
    *   **Verification**: Run `npm test src/tests/ObjectManager.test.js`.

*   **2.2.2. History/Undo-Redo Tests (Detailed)**
    *   **Action Items**: Write tests for:
        *   [ ] `undo()` with empty stack (no-op).
        *   [ ] `addState()` pushes to stack and clears redo stack.
        *   [ ] `undo()` restores previous JSON state.
        *   [ ] `redo()` restores next JSON state.
        *   [ ] Circular buffer limit (ensure stack doesn't grow infinitely).
    *   **Verification**: Run `npm test src/tests/History.test.js`.

*   **2.2.3. GroupManager Tests (Detailed)**
    *   **Action Items**: Write tests for:
        *   [ ] `groupObjects([a, b])`: Creates new `Group`, adds a/b, centers group pivot.
        *   [ ] `ungroup(group)`: Removes group, re-adds children to scene, preserves world transforms.
        *   [ ] Nested grouping (Group C contains Group A).
    *   **Verification**: Run `npm test src/tests/GroupManager.test.js`.

*   **2.2.4. Integration Tests**
    *   **Action Items**: Write tests for:
        *   [ ] **Full Flow**: Add Cube -> Move Cube -> Undo -> Cube moves back.
        *   [ ] **Save/Load**: Add Sphere -> Save to JSON string -> Clear Scene -> Load JSON -> Sphere exists.
    *   **Verification**: Run `npm test src/tests/Integration.test.js`.

---

## Phase 3: Core Feature Implementation

Refining and expanding the 3D capabilities.

### 3.1. Advanced Camera Controls
*   **Goal**: Provide professional-grade navigation.
*   **Action Items**:
    *   [ ] **Enhance OrbitControls**:
        *   [ ] Enable `damping` (inertia) for smooth movement.
        *   [ ] Add UI config for `dampingFactor`.
    *   [ ] **Implement View Cube**:
        *   [ ] Create a clickable interactive cube in the corner.
        *   [ ] On click 'Front', tween camera to `(0, 0, z)`.
        *   [ ] On click 'Top', tween camera to `(0, y, 0)`.
    *   [ ] **Focus Selection**:
        *   [ ] Implement hotkey 'F'.
        *   [ ] Calculate bounding box of selection.
        *   [ ] Tween camera to fit bounding box on screen.
*   **Verification & Testing**:
    *   [ ] **Manual**: Click "Front" on view cube. Verify camera aligns perfectly.
    *   [ ] **Unit**: Test `calculateBoundingBox` returns correct dimensions for a group of objects.

### 3.2. Material Editing System
*   **Goal**: Allow users to create realistic surfaces.
*   **Action Items**:
    *   [ ] **Texture Loading UI**:
        *   [ ] Add `<input type="file">` for Map, NormalMap, RoughnessMap.
        *   [ ] On file select, read as DataURL, load `THREE.Texture`, apply to material.
    *   [ ] **Material Parameters**:
        *   [ ] Add sliders for `roughness`, `metalness`.
        *   [ ] Add toggle for `wireframe`.
        *   [ ] Add color picker for `emissive` color.
*   **Verification & Testing**:
    *   [ ] **Unit**: Test `loadTexture` handles invalid file types gracefully.
    *   [ ] **Integration**: Load a normal map. Check `material.normalMap` is not null.

### 3.3. Complex Primitives & Geometry
*   **Goal**: Expand modeling capabilities beyond basic shapes.
*   **Action Items**:
    *   [ ] **ExtrudeGeometry**:
        *   [ ] Create a "Sketch Mode" canvas overlay.
        *   [ ] Allow user to draw a polygon (click points).
        *   [ ] Generate `THREE.Shape` from points.
        *   [ ] Apply `THREE.ExtrudeGeometry` with user-defined depth.
    *   [ ] **Constructive Solid Geometry (CSG)**:
        *   [ ] Install `three-csg-ts`.
        *   [ ] Create `BooleanManager`.
        *   [ ] Implement `subtract(objA, objB)`: Return `Mesh` that is A minus B.
        *   [ ] Implement `union(objA, objB)`: Return combined mesh.
*   **Verification & Testing**:
    *   [ ] **Unit**: Test CSG subtract of two overlapping cubes. Verify vertex count of result is < sum of parts.
    *   [ ] **Manual**: Draw a triangle in sketch mode, extrude it. Verify 3D prism appears.

### 3.4. Physics Engine Integration
*   **Goal**: Enable dynamic simulations.
*   **Action Items**:
    *   [ ] **Integrate Cannon-es**:
        *   [ ] `npm install cannon-es`.
        *   [ ] Initialize `canonn.World` in `PhysicsManager`.
    *   [ ] **Body Mapping**:
        *   [ ] Maintain a Map: `UUID -> Cannon.Body`.
        *   [ ] On `scene.update`: Copy position/quaternion from Body to Mesh.
    *   [ ] **UI Controls**:
        *   [ ] Add "Play/Pause" simulation buttons.
        *   [ ] Add "Reset" button to restore initial positions.
*   **Verification & Testing**:
    *   [ ] **Unit**: Test `update` loop copies coordinates correctly.
    *   [ ] **Manual**: Lift a cube, press Play. Verify it falls.

### 3.5. Shader Editor
*   **Goal**: Allow low-level visual customization.
*   **Action Items**:
    *   [ ] **UI Integration**:
        *   [ ] Use `codemirror` or `monaco-editor` for syntax highlighting.
        *   [ ] Create a floating panel with "Vertex Shader" and "Fragment Shader" tabs.
    *   [ ] **Hot Reloading**:
        *   [ ] On 'Ctrl+S' or auto-save:
        *   [ ] Compile string to `THREE.ShaderMaterial`.
        *   [ ] Catch compilation errors (`gl.getShaderInfoLog`) and display line numbers in editor.
*   **Verification & Testing**:
    *   [ ] **Manual**: Type a syntax error. Verify red error message appears in UI.
    *   [ ] **Manual**: Change color to `vec4(1.0, 0.0, 0.0, 1.0)`. Verify object turns red.

---

## Phase 4: UI/UX & Mobile Optimization

Enhancing the user interface for usability and accessibility.

### 4.1. Responsive Layout & Mobile First
*   **Action Items**:
    *   [ ] **CSS Grid Layout**:
        *   [ ] Define grid areas: `header`, `viewport`, `sidebar`, `footer`.
        *   [ ] On mobile: Stack sidebar below viewport or make it a slide-out drawer.
    *   [ ] **Touch Gestures**:
        *   [ ] Detect "Pinch" event on canvas -> Update Camera Zoom.
        *   [ ] Detect "Two-finger Pan" -> Pan Camera.
        *   [ ] Detect "Long Press" -> Open Context Menu.
    *   [ ] **Tap Targets**:
        *   [ ] Ensure all buttons have `min-height: 44px` and `min-width: 44px`.
        *   [ ] Add `padding` to small icons.
*   **Verification & Testing**:
    *   [ ] **Manual (Device)**: Load on iPhone/Android. Verify buttons are clickable without zooming.
    *   [ ] **Manual**: Pinch to zoom. Verify it works smoothly.

### 4.2. Scene Graph & Property Panel Improvements
*   **Action Items**:
    *   [ ] **Draggable Hierarchy**:
        *   [ ] Implement HTML5 Drag and Drop API for the Scene Graph list.
        *   [ ] On drop: Call `ObjectManager.reparent(child, newParent)`.
    *   [ ] **Scrubbable Inputs**:
        *   [ ] Implement a custom Input component.
        *   [ ] On `mousedown` on label: Lock pointer.
        *   [ ] On `mousemove`: Update numeric value based on delta X.
*   **Verification & Testing**:
    *   [ ] **Unit**: Test `reparent` logic updates both Three.js scene graph and internal lists.
    *   [ ] **Manual**: Drag a Sphere into a Box in the list. Move Box. Verify Sphere moves with it.

### 4.3. Visual Feedback
*   **Action Items**:
    *   [ ] **Selection Halo**:
        *   [ ] Setup `EffectComposer`, `RenderPass`, `OutlinePass`.
        *   [ ] When object selected, add to `OutlinePass.selectedObjects`.
    *   [ ] **Grid/Axis Customization**:
        *   [ ] Add UI toggle for "Show Grid", "Show Axes".
        *   [ ] Allow changing Grid size and density.
*   **Verification & Testing**:
    *   [ ] **Manual**: Select object. Verify glowing outline appears.

---

## Phase 5: Backend, Security & DevOps

Hardening the server and deployment pipeline.

### 5.1. Server Security
*   **Action Items**:
    *   [ ] **Helmet Middleware**:
        *   [ ] `npm install helmet`.
        *   [ ] `app.use(helmet())`.
        *   [ ] Configure CSP to allow blob: and data: URIs (needed for Three.js/WebWorkers).
    *   [ ] **Rate Limiting**:
        *   [ ] `npm install express-rate-limit`.
        *   [ ] Limit JSON upload endpoint to 10 requests/minute/IP.
    *   [ ] **Sanitization**:
        *   [ ] Sanitize filenames in `SceneStorage` to prevent directory traversal (`../`).
*   **Verification & Testing**:
    *   [ ] **Security Scan**: Run `npm audit`.
    *   [ ] **Manual**: Try to upload a file named `../../etc/passwd`. Verify rejection.

### 5.2. Build & Deployment
*   **Action Items**:
    *   [ ] **Vite Integration**:
        *   [ ] `npm install vite`.
        *   [ ] Move `index.html` to root.
        *   [ ] Update entry script references.
        *   [ ] Create `vite.config.js`.
    *   [ ] **Dockerization**:
        *   [ ] Write `Dockerfile`: Multi-stage build (Build frontend -> Serve with Nginx or Node).
        *   [ ] Write `docker-compose.yml`: Service for app, volume for persistence.
    *   [ ] **GitHub Actions**:
        *   [ ] Workflow `test.yml`: Runs `npm install`, `npm test`, `npm run lint`.
        *   [ ] Workflow `deploy.yml`: Builds Docker image and pushes to registry (optional).
*   **Verification & Testing**:
    *   [ ] **Manual**: Run `docker-compose up`. Verify app accessible at `localhost:3000`.
    *   [ ] **Manual**: Push a commit. Check GitHub Actions tab for green checkmark.

---

## Phase 6: Advanced Features (Future Roadmap)

Items from the "Roadmap" section in README.

### 6.1. Cloud Integration
*   **Action Items**:
    *   [ ] **Google Drive API**:
        *   [ ] Register GCP Project.
        *   [ ] Implement `GoogleAuth` client in frontend.
        *   [ ] Map `.nodist3d` MIME type to app.
*   **Verification**:
    *   [ ] **Manual**: "Save to Drive" button opens Google Picker.

### 6.2. Collaborative Editing
*   **Action Items**:
    *   [ ] **WebSocket Rooms**:
        *   [ ] Implement `socket.io` rooms.
        *   [ ] Broadcast `OBJECT_MOVED` events to room.
    *   [ ] **Interpolation**:
        *   [ ] Other users' cursors should interpolate smoothly between updates.
*   **Verification**:
    *   [ ] **Manual**: Open two browser windows. Move object in one. Watch it move in other.

### 6.3. Performance Optimization
*   **Action Items**:
    *   [ ] **InstancedMesh System**:
        *   [ ] Scan scene for identical geometries/materials.
        *   [ ] Auto-convert to `InstancedMesh` rendering.
    *   [ ] **Texture Compression**:
        *   [ ] Use `basis_universal` transcoder.
        *   [ ] Convert uploaded PNGs to `.ktx2` in WebWorker.
*   **Verification**:
    *   [ ] **Benchmark**: Create scene with 10,000 cubes. Measure FPS before/after InstancedMesh.
