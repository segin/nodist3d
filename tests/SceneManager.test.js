import { Scene, PerspectiveCamera, WebGLRenderer, Vector3, GridHelper, AxesHelper } from 'three';
jest.mock('three');
import { SceneManager } from '../src/frontend/SceneManager.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EventBus } from '../src/frontend/EventBus.js';

jest.mock('../src/frontend/EventBus.js', () => ({
    EventBus: jest.fn().mockImplementation(() => ({
        emit: jest.fn(),
        on: jest.fn(),
    })),
}));

jest.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
    OrbitControls: jest.fn().mockImplementation(() => ({
        target: {
            clone: jest.fn().mockReturnThis(),
            copy: jest.fn(),
            set: jest.fn()
        },
        update: jest.fn(),
        saveState: jest.fn(),
        reset: jest.fn()
    }))
}));

describe('SceneManager', () => {
    let sceneManager;
    let mockCanvas;
    let eventBus;

    beforeEach(() => {
        mockCanvas = {
            clientWidth: 800,
            clientHeight: 600,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            style: {},
        };
        jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas);

        eventBus = new EventBus();
        sceneManager = new SceneManager(mockCanvas, eventBus);
        sceneManager.initialControlsTarget = new Vector3(0, 0, 0);

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

    it("should restore the camera's initial position and target", () => {
        const initialCameraPosition = sceneManager.initialCameraPosition.clone();
        const initialControlsTarget = sceneManager.initialControlsTarget.clone();

        // Change camera position and controls target
        sceneManager.camera.position.set(10, 10, 10);
        sceneManager.controls.target.set(5, 5, 5);

        sceneManager.resetCamera();

        expect(sceneManager.camera.position.x).toBeCloseTo(initialCameraPosition.x);
        expect(sceneManager.camera.position.y).toBeCloseTo(initialCameraPosition.y);
        expect(sceneManager.camera.position.z).toBeCloseTo(initialCameraPosition.z);
        expect(sceneManager.controls.target.copy).toHaveBeenCalledWith(initialControlsTarget);
    });

    it('OrbitControls `damping` should be enabled', () => {
        expect(sceneManager.controls.enableDamping).toBe(true);
    });

    it('The scene should contain a GridHelper and an AxesHelper on initialization', () => {
        let hasGridHelper = false;
        let hasAxesHelper = false;

        sceneManager.scene.children.forEach(child => {
            if (child instanceof GridHelper) {
                hasGridHelper = true;
            }
            if (child instanceof AxesHelper) {
                hasAxesHelper = true;
            }
        });

        expect(hasGridHelper).toBe(true);
        expect(hasAxesHelper).toBe(true);
    });

    it("The renderer's DOM element should be the same as the canvas provided in the constructor", () => {
        expect(sceneManager.renderer.domElement).toStrictEqual(mockCanvas);
    });
});
