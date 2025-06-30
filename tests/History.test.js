import { Scene, Mesh, BoxGeometry, MeshBasicMaterial } from 'three';
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
});