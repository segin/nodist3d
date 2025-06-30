import { Scene, Mesh, BoxGeometry, MeshBasicMaterial, Group } from 'three';
import { History } from '../src/frontend/History.js';
import { EventBus } from '../src/frontend/EventBus.js';

describe('History', () => {
    let scene;
    let historyManager;
    let eventBus;

    beforeEach(() => {
        scene = new Scene();
        eventBus = new EventBus();
        historyManager = new History(scene, eventBus);
    });

    it('should save the initial state of the scene', () => {
        historyManager.saveState();
        expect(historyManager.history.length).toBe(1);
        expect(historyManager.currentIndex).toBe(0);
    });

    it('should successfully undo the last action', () => {
        const cube = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        scene.add(cube);
        historyManager.saveState(); // State 1: cube added

        scene.remove(cube);
        historyManager.saveState(); // State 2: cube removed

        historyManager.undo();
        expect(scene.children.length).toBe(1); // Should be back to state 1 with cube
        expect(scene.children[0].uuid).toBe(cube.uuid);
    });

    it('should successfully redo a previously undone action', () => {
        const cube = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        scene.add(cube);
        historyManager.saveState(); // State 1: cube added

        scene.remove(cube);
        historyManager.saveState(); // State 2: cube removed

        historyManager.undo(); // Back to State 1
        historyManager.redo(); // Forward to State 2

        expect(scene.children.length).toBe(0); // Should be back to state 2 with no cube
    });

    it('should not allow redo if a new action has been performed after an undo', () => {
        const cube1 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        scene.add(cube1);
        historyManager.saveState(); // State 1: cube1

        const cube2 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        scene.add(cube2);
        historyManager.saveState(); // State 2: cube1, cube2

        historyManager.undo(); // Back to State 1: cube1

        const cube3 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        scene.add(cube3);
        historyManager.saveState(); // State 3: cube1, cube3 (redo history should be cleared)

        historyManager.redo(); // Should do nothing

        expect(scene.children.length).toBe(2);
        expect(scene.children[0].uuid).toBe(cube1.uuid);
        expect(scene.children[1].uuid).toBe(cube3.uuid);
    });

    it('should handle an undo request when there is no history', () => {
        historyManager.undo(); // Should do nothing
        expect(historyManager.history.length).toBe(0);
        expect(historyManager.currentIndex).toBe(-1);
    });

    it('should handle a redo request when at the most recent state', () => {
        historyManager.saveState(); // State 1
        historyManager.redo(); // Should do nothing
        expect(historyManager.history.length).toBe(1);
        expect(historyManager.currentIndex).toBe(0);
    });

    it('should correctly undo/redo the creation of a group', () => {
        const mesh1 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        const mesh2 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        scene.add(mesh1, mesh2);
        historyManager.saveState(); // State 1: meshes added

        const group = new Group();
        group.add(mesh1);
        group.add(mesh2);
        scene.add(group);
        scene.remove(mesh1);
        scene.remove(mesh2);
        historyManager.saveState(); // State 2: group created

        // Undo: Should go back to meshes being in the scene, no group
        historyManager.undo();
        expect(scene.children.length).toBe(2);
        expect(scene.children).toContain(mesh1);
        expect(scene.children).toContain(mesh2);
        expect(scene.children).not.toContain(group);

        // Redo: Should go back to group being in the scene, no individual meshes
        historyManager.redo();
        expect(scene.children.length).toBe(1);
        expect(scene.children).toContain(group);
        expect(scene.children).not.toContain(mesh1);
        expect(scene.children).not.toContain(mesh2);
    });

    it('should correctly undo/redo an ungrouping operation', () => {
        const mesh1 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        const mesh2 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        const group = new Group();
        group.add(mesh1);
        group.add(mesh2);
        scene.add(group);
        historyManager.saveState(); // State 1: group exists

        // Simulate ungrouping
        scene.remove(group);
        scene.add(mesh1);
        scene.add(mesh2);
        historyManager.saveState(); // State 2: objects ungrouped

        // Undo: Should go back to group being in the scene
        historyManager.undo();
        expect(scene.children.length).toBe(1);
        expect(scene.children).toContain(group);
        expect(scene.children).not.toContain(mesh1);
        expect(scene.children).not.toContain(mesh2);

        // Redo: Should go back to objects being ungrouped
        historyManager.redo();
        expect(scene.children.length).toBe(2);
        expect(scene.children).not.toContain(group);
        expect(scene.children).toContain(mesh1);
        expect(scene.children).toContain(mesh2);
    });

    it('`restoreState` should correctly dispose of old geometries and materials to prevent memory leaks', () => {
        const mesh1 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        const mesh2 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        scene.add(mesh1);
        historyManager.saveState(); // State 1: mesh1

        scene.add(mesh2);
        historyManager.saveState(); // State 2: mesh1, mesh2

        const disposeSpy1 = jest.spyOn(mesh1.geometry, 'dispose');
        const disposeSpy2 = jest.spyOn(mesh1.material, 'dispose');

        historyManager.undo(); // Go back to State 1

        expect(disposeSpy1).toHaveBeenCalled();
        expect(disposeSpy2).toHaveBeenCalled();
        expect(scene.children).toContain(mesh1);
        expect(scene.children).not.toContain(mesh2);
    });

    it('Saving a new state should clear the "redo" history', () => {
        const cube1 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        scene.add(cube1);
        historyManager.saveState(); // State 1

        const cube2 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        scene.add(cube2);
        historyManager.saveState(); // State 2

        historyManager.undo(); // Go back to State 1

        const cube3 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        scene.add(cube3);
        historyManager.saveState(); // State 3 (new action after undo)

        expect(historyManager.history.length).toBe(historyManager.currentIndex + 1); // Redo history should be cleared
    });
});