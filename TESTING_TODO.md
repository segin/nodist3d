# Expanded Unit Test Suite for nodist3d

## Original 50 Tests

### ObjectManager.js Tests
- [X] 1. should return null when duplicating a non-existent object.
- [X] 2. should successfully add a texture to an object's material map.
- [X] 3. should successfully add a texture to an object's normal map.
- [X] 4. should successfully add a texture to an object's roughness map.
- [X] 5. should handle adding a texture to an object with no material.
- [X] 6. should properly dispose of an object's geometry and material on deletion.
- [X] 7. should handle the deletion of an already deleted object.
- [X] 8. should create a unique name for a duplicated object that has no original name.
- [X] 9. should successfully update an object's material color.
- [X] 10. should handle updating a material property that does not exist.
- [X] 11. should successfully create a text object when the font is loaded.
- [ ] 12. should handle a request to create a text object when the font has not yet loaded.

### LightManager.js Tests
- [X] 13. should add a PointLight to the scene.
- [X] 14. should add a DirectionalLight to the scene.
- [X] 15. should add an AmbientLight to the scene.
- [X] 16. should remove a specified light from the scene.
- [X] 17. should update a light's color property.
- [X] 18. should update a light's intensity property.
- [X] 19. should update a light's position property.
- [X] 20. should successfully change the type of an existing light.

### PhysicsManager.js Tests
- [X] 21. should add a box-shaped physics body to the world.
- [X] 22. should add a sphere-shaped physics body to the world.
- [X] 23. should add a cylinder-shaped physics body to the world.
- [X] 24. should return null when trying to add a physics body with an unsupported shape.
- [X] 25. should update the corresponding mesh position and quaternion after a physics world step.

### GroupManager.js Tests
- [X] 26. should successfully group two or more objects.
- [X] 27. should refuse to create a group with fewer than two objects.
- [X] 28. should correctly calculate the center of the grouped objects for the group's position.
- [X] 29. should successfully ungroup a group of objects.
- [X] 30. should place ungrouped objects back into the scene at the correct world positions.
- [X] 31. should handle a request to ungroup an object that is not a group.

### SceneStorage.js Tests
- [X] 32. should correctly serialize scene data into the expected JSON format.
- [X] 33. should ignore non-mesh objects when saving a scene.
- [X] 34. should successfully load a scene from a valid scene file.
- [X] 35. should clear all existing objects from the scene before loading a new one.
- [X] 36. should correctly reconstruct objects with their properties (position, rotation, scale, color) from a save file.
- [X] 37. should preserve the UUID of objects when loading a scene.

### History.js Tests
- [X] 38. should save the initial state of the scene.
- [X] 39. should successfully undo the last action.
- [X] 40. should successfully redo a previously undone action.
- [X] 41. should not allow redo if a new action has been performed after an undo.
- [X] 42. should handle an undo request when there is no history.
- [X] 43. should handle a redo request when at the most recent state.

### SceneGraph.js Tests
- [X] 44. should display all mesh and light objects from the scene in the UI.
- [X] 45. should not display objects other than meshes and lights.
- [X] 46. should correctly rename an object in the scene.
- [X] 47. should attach the transform controls when an object is clicked in the scene graph.
- [X] 48. should delete an object from the scene when the delete button is clicked.

### General/Integration Tests
- [X] 49. should ensure a duplicated object is a deep clone, not a reference.
- [X] 50. should ensure that deleting a group also removes all its children from the scene.

## Additional 100 Tests

### ObjectManager.js Extended Tests
- [X] 51. should resolve the promise when `addText` is called and font is available.
- [X] 52. should correctly set the material `side` property for planes (`THREE.DoubleSide`).
- [X] 53. should call `URL.revokeObjectURL` after a texture has been loaded to free memory.
- [X] 54. should handle `updateMaterial` for an object with an array of materials.
- [X] 55. should correctly clone an object's material properties when duplicating.
- [X] 56. should handle duplication of an object with no geometry or material.
- [X] 57. should update `metalness` property correctly via `updateMaterial`.
- [X] 58. should update `roughness` property correctly via `updateMaterial`.
- [X] 59. should correctly add a TeapotGeometry object.
- [X] 60. should correctly add an ExtrudeGeometry object.
- [X] 61. should correctly add a LatheGeometry object.
- [X] 62. should not add a deleted object back to the scene if it's part of an undo operation.
- [X] 63. should correctly dispose of textures when an object with textures is deleted.
- [X] 64. should return a new object with a position offset when duplicating.
- [X] 65. should handle adding a texture of an unsupported type gracefully.

### LightManager.js Extended Tests
- [X] 66. should assign a default name to a new light if no name is provided.
- [X] 67. should not throw an error when attempting to remove a light that is not in the scene.
- [X] 68. should preserve light properties (color, intensity) when changing light type.
- [X] 69. should handle updating a light with an invalid or non-existent property.
- [X] 70. should ensure ambient lights do not have a position property that can be updated.

### PhysicsManager.js Extended Tests
- [X] 71. should create a static body when mass is set to 0.
- [X] 72. should correctly scale the physics shape when the associated mesh is scaled.
- [X] 73. should correctly orient the physics shape when the associated mesh is rotated.
- [X] 74. should correctly remove a physics body from the world.
- [X] 75. should not affect other bodies when one is removed.
- [X] 76. should synchronize the physics body's position with its mesh's position upon creation.
- [X] 77. should handle meshes with geometries that have no size parameters (e.g., a custom BufferGeometry).
- [X] 78. should apply world gravity to dynamic bodies correctly over time.
- [X] 79. should allow adding the same mesh to the physics world multiple times without error.
- [X] 80. should ensure `update` method correctly steps the physics world with the provided `deltaTime`.

### GroupManager.js Extended Tests
- [X] 81. should allow grouping a group with another object.
- [X] 82. should correctly handle ungrouping a nested group, restoring all objects to the scene.
- [X] 83. should maintain the world-space transforms of objects when they are grouped.
- [X] 84. should return an empty array when trying to ungroup a non-group object.
- [X] 85. should correctly group objects that have different parents.
- [X] 86. `ungroupObjects` should return an array containing all the former children.
- [X] 87. Grouping should remove the original objects from the scene and add the new group.
- [X] 88. An empty group should be removable from the scene.
- [X] 89. Grouping objects with existing animations should continue to work.
- [X] 90. A group's name should be settable and reflected in the Scene Graph.

### SceneStorage.js Extended Tests
- [X] 91. should correctly save and load a scene containing lights with their properties.
- [X] 92. should correctly save and load a scene containing nested groups.
- [X] 93. should handle loading a file that is not a valid zip archive.
- [ ] 94. should handle loading a zip file that is missing 'scene.json'.
- [X] 95. should correctly save and load material properties like roughness and metalness.
- [X] 96. should successfully save and load a scene with no objects (an empty scene).
- [X] 97. should handle JSON parsing errors from a corrupted 'scene.json'.
- [X] 98. should restore object names correctly from a loaded scene.
- [X] 99. should restore lights to their correct types and positions.
- [X] 100. The load process should trigger an update in the SceneGraph.

### History.js Extended Tests
- [X] 101. should correctly undo/redo the creation of a group.
- [X] 102. should correctly undo/redo an ungrouping operation.
- [X] 103. `restoreState` should correctly dispose of old geometries and materials to prevent memory leaks.
- [X] 104. Saving a new state should clear the "redo" history.
- [X] 105. Restoring a state should correctly re-render the scene.
- [X] 106. Undo should detach transform controls from any selected object.
- [X] 107. `saveState` should not add a new state if it's identical to the current one.
- [X] 108. The history stack should handle a long series of actions correctly.
- [X] 109. Undo/redo should correctly restore object visibility states.
- [X] 110. Restoring a state should also restore the camera position and rotation if saved.

### Pointer.js Tests
- [X] 111. should dispatch a `selectionChange` event when an object is selected.
- [X] 112. should dispatch `selectionChange` with a `null` payload on deselection.
- [X] 113. should correctly apply an outline to a selected object.
- [X] 114. should correctly remove the outline from a deselected object.
- [X] 115. should remove the outline from a previous selection when a new object is selected.
- [X] 116. `isDragging` flag should be true on `pointerdown` and false on `pointerup`.
- [X] 117. Raycaster should be correctly updated with camera and pointer coordinates on move.
- [X] 118. Should not select an object if the pointer event started on a UI element.
- [X] 119. `removeOutline` should not throw an error if called when no outline exists.
- [X] 120. Raycasting should correctly identify the front-most object if multiple are overlapping.

### SceneManager.js Tests
- [X] 121. `onWindowResize` should update the renderer size and camera aspect ratio.
- [X] 122. `resetCamera` should restore the camera's initial position and target.
- [X] 123. OrbitControls `damping` should be enabled.
- [ ] 124. The scene should contain a GridHelper and an AxesHelper on initialization.
- [ ] 125. The renderer's DOM element should be the same as the canvas provided in the constructor.

### ShaderEditor.js Tests
- [ ] 126. `createShader` should add a mesh with a `ShaderMaterial` to the scene.
- [ ] 127. `initGUI` should create a "Shader Editor" folder in the GUI.
- [ ] 128. Updating a uniform value should set `needsUpdate` on the material to true.
- [ ] 129. Editing GLSL code in the GUI should update the material's `vertexShader` or `fragmentShader`.
- [ ] 130. Creating a new shader should dispose of the previous shader material if it exists.

### Integration Tests (main.js)
- [ ] 131. Clicking the "Translate" button should set `transformControls` mode to "translate".
- [ ] 132. Clicking the "Rotate" button should set `transformControls` mode to "rotate".
- [ ] 133. Clicking the "Scale" button should set `transformControls` mode to "scale".
- [ ] 134. Clicking the "Save as Image" button should trigger a PNG download.
- [ ] 135. Using the transform gizmo and releasing the mouse should create one new history state.
- [ ] 136. The dat.gui properties panel should be cleared when no object is selected.
- [ ] 137. Changing a property in the dat.gui panel should update the object in real-time.
- [ ] 138. The "Snap Translation" checkbox should toggle `transformControls.translationSnap`.
- [ ] 139. The "Snap Rotation" checkbox should toggle `transformControls.rotationSnap`.
- [ ] 140. The "Snap Scale" checkbox should toggle `transformControls.scaleSnap`.
- [ ] 141. Clicking the "Duplicate Selected" should create a new object and select it.
- [ ] 142. The "Add Point Light" button should add a new point light and update the scene graph.
- [ ] 143. Importing a GLTF file should correctly add its contents to the scene.
- [ ] 144. Exporting to GLTF should trigger a download with valid GLTF JSON content.
- [ ] 145. Deleting an object from the Scene Graph UI should remove it from the 3D scene.
- [ ] 146. Selecting an object in the Scene Graph should also select it in the 3D viewport.
- [ ] 147. Clicking the physics button should add a physics body to the selected object.
- [ ] 148. The "Reset View" button should correctly reset the camera controls.
- [ ] 149. Loading a scene file should correctly populate the Scene Graph UI.
- [ ] 150. After an undo operation, the UI panels should be cleared or updated to reflect no selection.
