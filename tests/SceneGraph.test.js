import { Scene, Mesh, BoxGeometry, PointLight, Group, Camera } from 'three';
import { SceneGraph } from '../src/frontend/SceneGraph.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import EventBus from '../src/frontend/EventBus.js';
import { Events } from '../src/frontend/constants.js';

describe('SceneGraph', () => {
    let scene;
    let uiElement;
    let transformControls;
    let updateGUI;
    let sceneGraph;
    let eventBus;

    beforeAll(() => {
        // Mock HTMLElement.prototype.style to ensure all elements have a style object
        Object.defineProperty(HTMLElement.prototype, 'style', {
            get: jest.fn(() => ({
                cursor: '',
                // Add other style properties as needed by the component
            })),
        });
    });

    beforeEach(() => {
        scene = new Scene();
        // Define a reusable mock element structure
        const createMockElement = () => ({
            innerHTML: '',
            style: { cursor: '' },
            value: '',
            dispatchEvent: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            appendChild: jest.fn(),
            removeChild: jest.fn(),
            click: jest.fn(),
            // Default querySelector and querySelectorAll for nested elements
            querySelector: jest.fn(() => createMockElement()),
            querySelectorAll: jest.fn(() => [createMockElement()]),
        });

        uiElement = createMockElement();

        // Mock document.createElement to return elements with a style property
        jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
            return createMockElement();
        });

        transformControls = new TransformControls(new Camera(), document.createElement('canvas'));
        updateGUI = jest.fn();
        eventBus = EventBus;
        // Correct constructor signature: scene, eventBus
        sceneGraph = new SceneGraph(scene, eventBus);

        // Mock eventBus.publish to verify calls since DOM updates are handled elsewhere
        jest.spyOn(eventBus, 'publish');
    });

    it('should publish update event when update is called', () => {
        const mesh = new Mesh(new BoxGeometry(), new THREE.MeshBasicMaterial());
        mesh.name = 'TestMesh';
        scene.add(mesh);

        sceneGraph.update();

        // SceneGraph no longer updates DOM directly, but publishes an event
        expect(eventBus.publish).toHaveBeenCalledWith(Events.SCENE_GRAPH_NEEDS_UPDATE, expect.any(Object));
    });
});