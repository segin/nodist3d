# nodist3d Project Context

## Current Status
- **Test Stability**: achieved 100% pass rate for critical suites (Primitives, Accessibility, Benchmark).
- **Architecture**: stabilized Three.js mocks using class-based structures in `jest.setup.cjs`.
- **Logic**: refactored `main.js` and `PrimitiveFactory.js` for asynchronous operations and parameter alignment.

## Working Notes
- **Recent Success**: Resolved the `TypeError` and `ReferenceError` avalanche by standardizing global mocks. 
- **Next Steps**: Monitor for regressions during further feature development (e.g., Physics, CSG).

## Ideas
- Integrate `cannon-es` more deeply for object interaction.
- Implement Boolean operations using `three-bvh-csg`.
- Add a material library/palette for easier styling.
