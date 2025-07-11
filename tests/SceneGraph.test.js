import { Scene, Mesh, BoxGeometry, PointLight, Group, Camera } from 'three';
import { SceneGraph } from '../src/frontend/SceneGraph.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { default as MockEventBus } from '../src/frontend/EventBus.js';

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
        eventBus = MockEventBus;
        sceneGraph = new SceneGraph(scene, uiElement, transformControls, updateGUI, eventBus);
    });

    it('should display all mesh and light objects from the scene in the UI', () => {
        const mesh = new Mesh(new BoxGeometry(), new THREE.MeshBasicMaterial());
        mesh.name = 'TestMesh';
        scene.add(mesh);

        const light = new PointLight();
        light.name = 'TestLight';
        scene.add(light);

        sceneGraph.update();

        expect(uiElement.innerHTML).toContain('TestMesh');
        expect(uiElement.innerHTML).toContain('TestLight');
    });

    it('should not display objects other than meshes and lights', () => {
        const group = new Group();
        group.name = 'TestGroup';
        scene.add(group);

        sceneGraph.update();

        expect(uiElement.innerHTML).not.toContain('TestGroup');
    });

    it('should correctly rename an object in the scene', () => {
        const mesh = new Mesh(new BoxGeometry(), new THREE.MeshBasicMaterial());
        mesh.name = 'OldName';
        scene.add(mesh);
        sceneGraph.update();

        const renameInput = uiElement.querySelector('input[type="text"]');
        renameInput.value = 'NewName';
        renameInput.dispatchEvent(new Event('change'));

        expect(mesh.name).toBe('NewName');
        expect(uiElement.innerHTML).toContain('NewName');
        expect(uiElement.innerHTML).not.toContain('OldName');
    });

    it('should attach the transform controls when an object is clicked in the scene graph', () => {
        const mesh = new Mesh(new BoxGeometry(), new THREE.MeshBasicMaterial());
        mesh.name = 'ClickableMesh';
        scene.add(mesh);
        sceneGraph.update();

        const nameSpan = uiElement.querySelector('span');
        nameSpan.click();

        expect(transformControls.attach).toHaveBeenCalledWith(mesh);
        expect(updateGUI).toHaveBeenCalledWith(mesh);
    });

    it('should delete an object from the scene when the delete button is clicked', () => {
        const mesh = new Mesh(new BoxGeometry(), new THREE.MeshBasicMaterial());
        mesh.name = 'DeletableMesh';
        scene.add(mesh);
        sceneGraph.update();

        const deleteButton = uiElement.querySelector('button');
        deleteButton.click();

        expect(scene.remove).toHaveBeenCalledWith(mesh);
        expect(transformControls.detach).toHaveBeenCalled();
        expect(updateGUI).toHaveBeenCalledWith(null);
    });
});