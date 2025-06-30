import { Scene, PerspectiveCamera, WebGLRenderer, Vector3 } from 'three';
import { SceneManager } from '../src/frontend/SceneManager.js';

describe('SceneManager', () => {
    let sceneManager;
    let mockCanvas;

    beforeEach(() => {
        mockCanvas = document.createElement('canvas');
        // Mock clientWidth and clientHeight for the canvas
        Object.defineProperty(mockCanvas, 'clientWidth', { writable: true, value: 800 });
        Object.defineProperty(mockCanvas, 'clientHeight', { writable: true, value: 600 });

        sceneManager = new SceneManager(mockCanvas);

        // Mock renderer.setSize and camera.updateProjectionMatrix
        jest.spyOn(sceneManager.renderer, 'setSize');
        jest.spyOn(sceneManager.camera, 'updateProjectionMatrix');
    });

    it('should update the renderer size and camera aspect ratio on window resize', () => {
        // Simulate a resize event
        mockCanvas.clientWidth = 1024;
        mockCanvas.clientHeight = 768;

        sceneManager.onWindowResize();

        expect(sceneManager.renderer.setSize).toHaveBeenCalledWith(1024, 768, false);
        expect(sceneManager.camera.aspect).toBe(1024 / 768);
        expect(sceneManager.camera.updateProjectionMatrix).toHaveBeenCalled();
    });

    it('should restore the camera\'s initial position and target', () => {
        const initialCameraPosition = sceneManager.initialCameraPosition.clone();
        const initialControlsTarget = sceneManager.initialControlsTarget.clone();

        // Change camera position and controls target
        sceneManager.camera.position.set(10, 10, 10);
        sceneManager.controls.target.set(5, 5, 5);

        sceneManager.resetCamera();

        expect(sceneManager.camera.position.x).toBeCloseTo(initialCameraPosition.x);
        expect(sceneManager.camera.position.y).toBeCloseTo(initialCameraPosition.y);
        expect(sceneManager.camera.position.z).toBeCloseTo(initialCameraPosition.z);
        expect(sceneManager.controls.target.x).toBeCloseTo(initialControlsTarget.x);
        expect(sceneManager.controls.target.y).toBeCloseTo(initialControlsTarget.y);
        expect(sceneManager.controls.target.z).toBeCloseTo(initialControlsTarget.z);
    });
});