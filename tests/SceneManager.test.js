import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
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
});