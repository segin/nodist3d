## Working Context, Ideas, and Progress for nodist3d

### Current Focus:
- Implementing a scene graph/outliner.

### Completed Tasks:
- Implemented Box (Cube), Sphere, Cylinder, Cone, Torus, Torus Knot, Tetrahedron, Icosahedron, Dodecahedron, Octahedron, Plane, Tube, and Teapot primitives.
- Refactored frontend into `SceneManager.js`, `ObjectManager.js`, and `Pointer.js`.
- Integrated `TransformControls` for object manipulation.
- Updated `README.md` with comprehensive checklist and roadmap.
- Initial Git repository setup and continuous pushing to GitHub.
- Temporarily removed database dependency from `package.json` to resolve `npm install` issues.
- Added a property panel to adjust primitive parameters using `dat.gui`.

### Next Steps:
- Implement a scene graph/outliner.
- Implement unit tests and a full test harness.
- Implement custom zip file format with JSON data inside for persistent local storage.

### Ideas & Notes:
- Consider using dat.GUI or similar library for easier UI control generation.
- Explore WebGL performance optimizations for mobile devices.
- Research best practices for 3D model persistence in web applications.
- Investigate database build issue on Termux and re-integrate if possible.