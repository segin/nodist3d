## Working Context, Ideas, and Progress for nodist3d

### Current Focus:
- Enhancing scene graph/outliner with object renaming and deletion.

### Completed Tasks:
- Implemented Box (Cube), Sphere, Cylinder, Cone, Torus, Torus Knot, Tetrahedron, Icosahedron, Dodecahedron, Octahedron, Plane, Tube, and Teapot primitives.
- Refactored frontend into `SceneManager.js`, `ObjectManager.js`, and `Pointer.js`.
- Integrated `TransformControls` for object manipulation.
- Updated `README.md` with comprehensive checklist and roadmap.
- Initial Git repository setup and continuous pushing to GitHub.
- Temporarily removed database dependency from `package.json` to resolve `npm install` issues.
- Added a property panel to adjust primitive parameters using `dat.gui`.
- Removed `frontend.test.js` due to `puppeteer` incompatibility on Termux.
- Implemented basic scene graph/outliner to list objects.
- Implemented unit tests and a full test harness, including Jest configuration for ES Modules and fixing the `TeapotGeometry` test.

### Next Steps:
- Implement object renaming and deletion in the scene graph.
- Implement custom zip file format with JSON data inside for persistent local storage.

### Ideas & Notes:
- Consider using dat.GUI or similar library for easier UI control generation.
- Explore WebGL performance optimizations for mobile devices.
- Research best practices for 3D model persistence in web applications.
- Investigate database build issue on Termux and re-integrate if possible.
- Research alternative frontend testing frameworks compatible with Termux/Android.
