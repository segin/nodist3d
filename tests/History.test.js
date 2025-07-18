import * as THREE from 'three';
import { History } from '../src/frontend/History.js';
import EventBus from '../src/frontend/EventBus.js';



describe('History', () => {
    let scene;
    let historyManager;
    let eventBus;
    let mockTransformControls;
    let camera;

    beforeAll(() => {
        global.innerWidth = 800;
        global.innerHeight = 600;
    });

    beforeEach(() => {
        
        scene = new THREE.Scene();
        eventBus = EventBus;
        camera = new THREE.PerspectiveCamera(75, global.innerWidth / global.innerHeight, 0.1, 1000);
        historyManager = new History(eventBus);

        // Mock the scene's camera for testing camera state saving/restoring
        scene.camera = camera;

        mockTransformControls = {
            attach: jest.fn(),
            detach: jest.fn(),
            object: undefined
        };
        historyManager.setTransformControls(mockTransformControls);
    });

    it('should save the initial state of the scene', () => {
        historyManager.saveState();
        expect(historyManager.history.length).toBe(1);
        expect(historyManager.currentIndex).toBe(0);
    });

    it('should successfully undo the last action', () => {
        const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        scene.add(cube);
        historyManager.saveState(); // State 1: cube added

        scene.remove(cube);
        historyManager.saveState(); // State 2: cube removed

        historyManager.undo();
        expect(scene.children.length).toBe(1); // Should be back to state 1 with cube
        expect(scene.children[0].uuid).toBe(cube.uuid);
    });

    it('should successfully redo a previously undone action', () => {
        const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        scene.add(cube);
        historyManager.saveState(); // State 1: cube added

        scene.remove(cube);
        historyManager.saveState(); // State 2: cube removed

        historyManager.undo(); // Back to State 1
        historyManager.redo(); // Forward to State 2

        expect(scene.children.length).toBe(0); // Should be back to state 2 with no cube
    });

    it('should not allow redo if a new action has been performed after an undo', () => {
        const cube1 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        scene.add(cube1);
        historyManager.saveState(); // State 1: cube1

        const cube2 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        scene.add(cube2);
        historyManager.saveState(); // State 2: cube1, cube2

        historyManager.undo(); // Back to State 1: cube1

        const cube3 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
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
        const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        const mesh2 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        scene.add(mesh1, mesh2);
        historyManager.saveState(); // State 1: meshes added

        const group = new THREE.Group();
        group.add(mesh1);
        group.add(mesh2);
        scene.add(group);
        scene.remove(mesh1);
        scene.remove(mesh2);
        historyManager.saveState(); // State 2: group created

        // Undo: Should go back to meshes being in the scene, no group
        historyManager.undo();
        expect(scene.children.length).toBe(2);
        const uuids = scene.children.map(c => c.uuid);
        expect(uuids).toContain(mesh1.uuid);
        expect(uuids).toContain(mesh2.uuid);
        expect(uuids).not.toContain(group.uuid);

        // Redo: Should go back to group being in the scene, no individual meshes
        historyManager.redo();
        expect(scene.children.length).toBe(1);
        expect(scene.children[0].uuid).toBe(group.uuid);
    });

    it('should correctly undo/redo an ungrouping operation', () => {
        const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        const mesh2 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        const group = new THREE.Group();
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
        expect(scene.children[0].uuid).toBe(group.uuid);

        // Redo: Should go back to objects being ungrouped
        historyManager.redo();
        expect(scene.children.length).toBe(2);
        const uuids = scene.children.map(c => c.uuid);
        expect(uuids).toContain(mesh1.uuid);
        expect(uuids).toContain(mesh2.uuid);
        expect(uuids).not.toContain(group.uuid);
    });

    it('`restoreState` should correctly dispose of old geometries and materials to prevent memory leaks', () => {
        const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        const mesh2 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        scene.add(mesh1);
        historyManager.saveState(); // State 1: mesh1

        scene.add(mesh2);
        historyManager.saveState(); // State 2: mesh1, mesh2

        const disposeSpy1 = jest.spyOn(mesh2.geometry, 'dispose');
        const disposeSpy2 = jest.spyOn(mesh2.material, 'dispose');

        historyManager.undo(); // Go back to State 1

        expect(disposeSpy1).toHaveBeenCalled();
        expect(disposeSpy2).toHaveBeenCalled();
        expect(scene.children.length).toBe(1);
        expect(scene.children[0].uuid).toBe(mesh1.uuid);
    });

    it('Saving a new state should clear the "redo" history', () => {
        const cube1 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        scene.add(cube1);
        historyManager.saveState(); // State 1

        const cube2 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        scene.add(cube2);
        historyManager.saveState(); // State 2

        historyManager.undo(); // Back to State 1

        const cube3 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        scene.add(cube3);
        historyManager.saveState(); // State 3 (new action after undo)

        expect(historyManager.history.length).toBe(historyManager.currentIndex + 1); // Redo history should be cleared
    });

    it('Restoring a state should correctly re-render the scene', () => {
        const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        mesh1.name = 'Mesh1';
        scene.add(mesh1);
        historyManager.saveState(); // State 1: mesh1

        scene.remove(mesh1);
        const mesh2 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        mesh2.name = 'Mesh2';
        scene.add(mesh2);
        historyManager.saveState(); // State 2: mesh2

        historyManager.undo(); // Go back to State 1

        expect(scene.children.length).toBe(1);
        expect(scene.children[0].name).toBe('Mesh1');
    });

    it('Undo should detach transform controls from any selected object', () => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        scene.add(mesh);
        historyManager.saveState();

        mockTransformControls.object = mesh;

        historyManager.undo();

        expect(mockTransformControls.detach).toHaveBeenCalled();
    });

    it('should not add a new state if it\'s identical to the current one', () => {
        const initialHistoryLength = historyManager.history.length;
        historyManager.saveState(); // Save initial state
        historyManager.saveState(); // Save identical state

        expect(historyManager.history.length).toBe(initialHistoryLength + 1); // Only one new state should be added
    });

    it('The history stack should handle a long series of actions correctly', () => {
        const numActions = 100;
        historyManager.saveState();
        for (let i = 0; i < numActions; i++) {
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
            mesh.name = `Mesh${i}`;
            scene.add(mesh);
            historyManager.saveState();
        }

        expect(historyManager.history.length).toBe(numActions + 1); // Initial state + 100 actions
        expect(historyManager.currentIndex).toBe(numActions);

        // Test undoing multiple times
        for (let i = 0; i < 50; i++) {
            historyManager.undo();
        }
        expect(historyManager.currentIndex).toBe(numActions - 50);
        expect(scene.children.length).toBe(numActions - 50);

        // Test redoing multiple times
        for (let i = 0; i < 25; i++) {
            historyManager.redo();
        }
        expect(historyManager.currentIndex).toBe(numActions - 25);
        expect(scene.children.length).toBe(numActions - 25);
    });

    it('Undo/redo should correctly restore object visibility states', () => {
        const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        mesh1.name = 'Mesh1';
        scene.add(mesh1);
        historyManager.saveState(); // State 1: mesh1 visible

        mesh1.visible = false;
        historyManager.saveState(); // State 2: mesh1 invisible

        historyManager.undo(); // Go back to State 1
        expect(scene.children[0].visible).toBe(true);

        historyManager.redo(); // Go forward to State 2
        expect(scene.children[0].visible).toBe(false);
    });

    it('Restoring a state should also restore the camera position and rotation if saved', () => {
        const initialCameraPosition = camera.position.clone();
        const initialCameraQuaternion = camera.quaternion.clone();

        // Change camera position and rotation
        camera.position.set(10, 10, 10);
        camera.rotation.set(0.5, 0.5, 0.5);

        historyManager.saveState(); // Save state with new camera position

        // Change camera again
        camera.position.set(0, 0, 0);
        camera.rotation.set(0, 0, 0);

        historyManager.undo(); // Undo to the previous state

        expect(camera.position.x).toBeCloseTo(initialCameraPosition.x);
        expect(camera.position.y).toBeCloseTo(initialCameraPosition.y);
        expect(camera.position.z).toBeCloseTo(initialCameraPosition.z);
        expect(camera.quaternion.x).toBeCloseTo(initialCameraQuaternion.x);
        expect(camera.quaternion.y).toBeCloseTo(initialCameraQuaternion.y);
        expect(camera.quaternion.z).toBeCloseTo(initialCameraQuaternion.z);
        expect(camera.quaternion.w).toBeCloseTo(initialCameraQuaternion.w);
    });
});
