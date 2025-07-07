import { App } from '../src/frontend/main.js';
import { Scene, WebGLRenderer, PerspectiveCamera, Mesh, BoxGeometry, MeshBasicMaterial } from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { EventBus } from '../src/frontend/EventBus.js';

jest.mock('../src/frontend/EventBus.js', () => ({
    EventBus: jest.fn().mockImplementation(() => ({
        emit: jest.fn(),
        on: jest.fn(),
        publish: jest.fn(),
    })),
}));

// Mock dat.gui
// Mock dat.gui
// Mock dat.gui
const mockGUI = {
    addFolder: jest.fn(() => ({
        add: jest.fn(() => ({
            name: jest.fn(),
            onChange: jest.fn()
        })),
        addColor: jest.fn(() => ({
            name: jest.fn(),
            onChange: jest.fn()
        })),
        open: jest.fn(),
        removeFolder: jest.fn()
    })),
    add: jest.fn(() => ({
        name: jest.fn(),
        listen: jest.fn(() => ({
            onChange: jest.fn()
        }))
    }))
};

describe('App Integration Tests', () => {
    let app;

    beforeAll(() => {
        // Mock necessary DOM elements and their methods
        document.body.innerHTML = `
            <canvas id="c"></canvas>
            <div id="ui"></div>
            <div id="scene-graph"></div>
        `;
    });

    beforeEach(() => {
        // Reset mocks before each test
        TransformControls.mockClear();
        mockGUI.addFolder.mockClear();
        mockGUI.add.mockClear();

        app = new App();
    });

// Mock TransformControls
jest.mock('three/examples/jsm/controls/TransformControls.js', () => ({
    TransformControls: jest.fn().mockImplementation(() => ({
        addEventListener: jest.fn(),
        setMode: jest.fn(),
        attach: jest.fn(),
        detach: jest.fn(),
        update: jest.fn(),
        object: undefined,
        translationSnap: null,
        rotationSnap: null,
        scaleSnap: null
    }))
}));
// Mock OrbitControls
jest.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
    OrbitControls: jest.fn().mockImplementation(() => ({
        enableDamping: false,
        dampingFactor: 0.25,
        screenSpacePanning: false,
        enableZoom: false,
        minDistance: 0,
        maxDistance: Infinity,
        maxPolarAngle: Math.PI,
        update: jest.fn(),
        target: { x: 0, y: 0, z: 0 }
    }))
}));

// Mock OBJLoader and GLTFLoader
jest.mock('three/examples/jsm/loaders/OBJLoader.js');
jest.mock('three/examples/jsm/loaders/GLTFLoader.js', () => ({
    GLTFLoader: jest.fn().mockImplementation(() => ({
        parse: jest.fn((data, path, onLoad) => {
            const mockGltf = { scene: { name: 'MockGLTFScene' } };
            onLoad(mockGltf);
        })
    }))
}));
jest.mock('three/examples/jsm/exporters/OBJExporter.js');
jest.mock('three/examples/jsm/exporters/GLTFExporter.js', () => ({
    GLTFExporter: jest.fn().mockImplementation(() => ({
        parse: jest.fn((scene, onCompleted, onError, options) => {
            onCompleted({ /* mock GLTF JSON data */ });
        })
    }))
}));

// Mock dat.gui constructor
jest.mock('dat.gui', () => ({
    GUI: jest.fn().mockImplementation(() => mockGUI)
}));

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL = {
    createObjectURL: jest.fn(() => 'blob:mockurl'),
    revokeObjectURL: jest.fn(),
};

    it('Clicking the "Translate" button should set `transformControls` mode to "translate" ', () => {
        const translateButton = document.querySelector('#ui button:nth-child(1)'); // Assuming it's the first button
        translateButton.click();
        expect(app.transformControls.setMode).toHaveBeenCalledWith('translate');
    });

    it('Clicking the "Rotate" button should set `transformControls` mode to "rotate" ', () => {
        const rotateButton = document.querySelector('#ui button:nth-child(2)'); // Assuming it's the second button
        rotateButton.click();
        expect(app.transformControls.setMode).toHaveBeenCalledWith('rotate');
    });

    it('Clicking the "Scale" button should set `transformControls` mode to "scale" ', () => {
        const scaleButton = document.querySelector('#ui button:nth-child(3)'); // Assuming it's the third button
        scaleButton.click();
        expect(app.transformControls.setMode).toHaveBeenCalledWith('scale');
    });

    it('Clicking the "Save as Image" button should trigger a PNG download', () => {
        const saveImageButton = Array.from(document.querySelectorAll('#ui button')).find(button => button.textContent === 'Save as Image');
        
        // Mock document.createElement('a') and its click method
        const mockAnchor = {
            href: '',
            download: '',
            click: jest.fn(),
        };
        jest.spyOn(document, 'createElement').mockReturnValue(mockAnchor);

        saveImageButton.click();

        expect(app.sceneManager.renderer.render).toHaveBeenCalledWith(app.sceneManager.scene, app.sceneManager.camera);
        expect(app.sceneManager.renderer.domElement.toDataURL).toHaveBeenCalledWith('image/png');
        expect(mockAnchor.download).toBe('nodist3d-scene.png');
        expect(mockAnchor.click).toHaveBeenCalled();
        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mockurl');
    });

    it('Using the transform gizmo and releasing the mouse should create one new history state', () => {
        const historySpy = jest.spyOn(app.history, 'saveState');

        // Simulate the 'dragging-changed' event with value: false
        const draggingChangedEvent = { value: false };
        app.transformControls.addEventListener.mock.calls.forEach(call => {
            if (call[0] === 'dragging-changed') {
                call[1](draggingChangedEvent);
            }
        });

        expect(historySpy).toHaveBeenCalled();
    });

    it('The dat.gui properties panel should be cleared when no object is selected', () => {
        const updateGUISpy = jest.spyOn(app, 'updateGUI');

        // Simulate selection change to null (deselection)
        app.eventBus.publish('selectionChange', null);

        expect(updateGUISpy).toHaveBeenCalledWith(null);
    });

    it('Changing a property in the dat.gui panel should update the object in real-time', () => {
        const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        mesh.name = 'TestMesh';
        app.sceneManager.scene.add(mesh);

        // Simulate selecting the object to populate the GUI
        app.pointer.selectedObject = mesh;
        app.updateGUI(mesh);

        // Simulate changing the position.x property in the GUI
        const positionXController = mockGUI.addFolder.mock.results[0].value.add.mock.results[0].value; // Assuming position.x is the first 'add' call
        const newXValue = 5;
        positionXController.onChange.mock.calls[0][0](newXValue); // Call the onChange handler with a new value

        expect(mesh.position.x).toBe(newXValue);
    });

    it('The "Snap Translation" checkbox should toggle `transformControls.translationSnap`', () => {
        const snapTranslationController = mockGUI.addFolder.mock.results[0].value.add.mock.results[0].value; // Assuming it's the first add call in snapFolder

        // Simulate checking the checkbox (value = true)
        snapTranslationController.onChange.mock.calls[0][0](true);
        expect(app.transformControls.translationSnap).toBe(0.1); // Default snap value

        // Simulate unchecking the checkbox (value = false)
        snapTranslationController.onChange.mock.calls[0][0](false);
        expect(app.transformControls.translationSnap).toBeNull();
    });

    it('The "Snap Rotation" checkbox should toggle `transformControls.rotationSnap`', () => {
        const snapRotationController = mockGUI.addFolder.mock.results[0].value.add.mock.results[2].value; // Assuming it's the third add call in snapFolder

        // Simulate checking the checkbox (value = true)
        snapRotationController.onChange.mock.calls[0][0](true);
        expect(app.transformControls.rotationSnap).toBe(Math.PI / 8); // Default snap value

        // Simulate unchecking the checkbox (value = false)
        snapRotationController.onChange.mock.calls[0][0](false);
        expect(app.transformControls.rotationSnap).toBeNull();
    });

    it('The "Snap Scale" checkbox should toggle `transformControls.scaleSnap`', () => {
        const snapScaleController = mockGUI.addFolder.mock.results[0].value.add.mock.results[4].value; // Assuming it's the fifth add call in snapFolder

        // Simulate checking the checkbox (value = true)
        snapScaleController.onChange.mock.calls[0][0](true);
        expect(app.transformControls.scaleSnap).toBe(0.1); // Default snap value

        // Simulate unchecking the checkbox (value = false)
        snapScaleController.onChange.mock.calls[0][0](false);
        expect(app.transformControls.scaleSnap).toBeNull();
    });

    it('Clicking the "Duplicate Selected" should create a new object and select it', () => {
        const initialObjectCount = app.sceneManager.scene.children.length;
        const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        mesh.name = 'OriginalMesh';
        app.sceneManager.scene.add(mesh);
        app.pointer.selectedObject = mesh;

        const duplicateButton = Array.from(document.querySelectorAll('#ui button')).find(button => button.textContent === 'Duplicate Selected');
        duplicateButton.click();

        expect(app.sceneManager.scene.children.length).toBe(initialObjectCount + 2); // Original + duplicated
        expect(app.transformControls.attach).toHaveBeenCalledWith(expect.any(Mesh));
        expect(app.pointer.selectedObject.name).toContain('OriginalMesh_copy');
        expect(app.pointer.outline).toBeDefined();
        expect(app.history.saveState).toHaveBeenCalled();
    });

    it('The "Add Point Light" button should add a new point light and update the scene graph', () => {
        const initialLightCount = app.sceneManager.scene.children.filter(child => child.isLight).length;
        const addPointLightButton = Array.from(document.querySelectorAll('#ui button')).find(button => button.textContent === 'Add Point Light');
        
        // Mock the addLight method to return a mock light
        const mockPointLight = { isLight: true, name: 'PointLight', uuid: 'mock-uuid' };
        jest.spyOn(app.lightManager, 'addLight').mockReturnValue(mockPointLight);
        jest.spyOn(app.sceneGraph, 'update');
        jest.spyOn(app.history, 'saveState');

        addPointLightButton.click();

        expect(app.lightManager.addLight).toHaveBeenCalledWith('PointLight', 0xffffff, 1, { x: 0, y: 0, z: 0 }, 'PointLight');
        expect(app.sceneManager.scene.children.filter(child => child.isLight).length).toBe(initialLightCount + 1);
        expect(app.transformControls.attach).toHaveBeenCalledWith(mockPointLight);
        expect(app.pointer.selectedObject).toBe(mockPointLight);
        expect(app.pointer.outline).toBeDefined();
        expect(app.sceneGraph.update).toHaveBeenCalled();
        expect(app.history.saveState).toHaveBeenCalled();
    });

    it('Importing a GLTF file should correctly add its contents to the scene', async () => {
        const initialObjectCount = app.sceneManager.scene.children.length;
        const importGltfInput = document.createElement('input');
        importGltfInput.type = 'file';
        importGltfInput.accept = '.gltf,.glb';
        importGltfInput.style.display = 'none';
        document.body.appendChild(importGltfInput);

        const importGltfButton = Array.from(document.querySelectorAll('#ui button')).find(button => button.textContent === 'Import GLTF');

        // Mock FileReader
        const mockFileReader = {
            readAsArrayBuffer: jest.fn(),
            onload: null,
        };
        jest.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader);

        // Simulate file selection
        const mockFile = new Blob(['mock gltf data'], { type: 'model/gltf+json' });
        Object.defineProperty(importGltfInput, 'files', {
            value: [mockFile],
            writable: false,
        });

        // Mock GLTFLoader.parse to immediately call the onLoad callback
        const mockGltfScene = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        mockGltfScene.name = 'LoadedGLTFScene';
        jest.spyOn(GLTFLoader.prototype, 'parse').mockImplementation((data, path, onLoad) => {
            onLoad({ scene: mockGltfScene });
        });

        jest.spyOn(app.sceneManager.scene, 'add');
        jest.spyOn(app.transformControls, 'attach');
        jest.spyOn(app.pointer, 'addOutline');
        jest.spyOn(app, 'updateGUI');
        jest.spyOn(app.sceneGraph, 'update');
        jest.spyOn(app.history, 'saveState');

        importGltfButton.click();

        // Manually trigger FileReader onload
        mockFileReader.onload({ target: { result: 'mock gltf data' } });

        expect(app.sceneManager.scene.add).toHaveBeenCalledWith(mockGltfScene);
        expect(app.transformControls.attach).toHaveBeenCalledWith(mockGltfScene);
        expect(app.pointer.selectedObject).toBe(mockGltfScene);
        expect(app.pointer.addOutline).toHaveBeenCalledWith(mockGltfScene);
        expect(app.updateGUI).toHaveBeenCalledWith(mockGltfScene);
        expect(app.sceneGraph.update).toHaveBeenCalled();
        expect(app.history.saveState).toHaveBeenCalled();

        document.body.removeChild(importGltfInput);
    });

    it('Exporting to GLTF should trigger a download with valid GLTF JSON content', () => {
        const exportGltfButton = Array.from(document.querySelectorAll('#ui button')).find(button => button.textContent === 'Export GLTF');

        // Mock document.createElement('a') and its click method
        const mockAnchor = {
            href: '',
            download: '',
            click: jest.fn(),
        };
        jest.spyOn(document, 'createElement').mockReturnValue(mockAnchor);

        // Mock GLTFExporter.parse
        const mockGltfData = { scenes: [{ nodes: [] }] };
        jest.spyOn(GLTFExporter.prototype, 'parse').mockImplementation((scene, onCompleted, onError, options) => {
            onCompleted(mockGltfData);
        });

        exportGltfButton.click();

        expect(GLTFExporter.prototype.parse).toHaveBeenCalledWith(
            app.sceneManager.scene,
            expect.any(Function),
            expect.any(Function),
            { binary: false }
        );
        expect(mockAnchor.download).toBe('scene.gltf');
        expect(mockAnchor.click).toHaveBeenCalled();
        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mockurl');
    });

    it('Deleting an object from the Scene Graph UI should remove it from the 3D scene', () => {
        const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        mesh.name = 'DeletableMesh';
        app.sceneManager.scene.add(mesh);

        // Simulate scene graph update to include the mesh
        app.sceneGraph.update();

        // Find the delete button for the mesh in the scene graph UI
        const sceneGraphElement = document.getElementById('scene-graph');
        const deleteButton = sceneGraphElement.querySelector('li button');

        // Mock necessary methods before clicking
        jest.spyOn(app.transformControls, 'detach');
        jest.spyOn(app.pointer, 'removeOutline');
        jest.spyOn(app.objectManager, 'deleteObject');
        jest.spyOn(app, 'updateGUI');
        jest.spyOn(app.sceneGraph, 'update');
        jest.spyOn(app.history, 'saveState');

        deleteButton.click();

        expect(app.objectManager.deleteObject).toHaveBeenCalledWith(mesh);
        expect(app.sceneManager.scene.children).not.toContain(mesh);
        expect(app.transformControls.detach).toHaveBeenCalled();
        expect(app.pointer.removeOutline).toHaveBeenCalled();
        expect(app.pointer.selectedObject).toBeNull();
        expect(app.updateGUI).toHaveBeenCalledWith(null);
        expect(app.sceneGraph.update).toHaveBeenCalled();
        expect(app.history.saveState).toHaveBeenCalled();
    });

    it('Selecting an object in the Scene Graph should also select it in the 3D viewport', () => {
        const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        mesh.name = 'SelectableMesh';
        app.sceneManager.scene.add(mesh);

        // Simulate scene graph update to include the mesh
        app.sceneGraph.update();

        // Find the name span for the mesh in the scene graph UI
        const sceneGraphElement = document.getElementById('scene-graph');
        const nameSpan = sceneGraphElement.querySelector('li span');

        // Mock necessary methods before clicking
        jest.spyOn(app.transformControls, 'attach');
        jest.spyOn(app.pointer, 'addOutline');
        jest.spyOn(app, 'updateGUI');

        nameSpan.click();

        expect(app.transformControls.attach).toHaveBeenCalledWith(mesh);
        expect(app.pointer.selectedObject).toBe(mesh);
        expect(app.pointer.addOutline).toHaveBeenCalledWith(mesh);
        expect(app.updateGUI).toHaveBeenCalledWith(mesh);
    });

    it('Clicking the physics button should add a physics body to the selected object', () => {
        const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        mesh.name = 'PhysicsMesh';
        app.sceneManager.scene.add(mesh);
        app.pointer.selectedObject = mesh;

        const physicsButton = Array.from(document.querySelectorAll('#ui button')).find(button => button.textContent === 'Add Physics Body');

        jest.spyOn(app.physicsManager, 'addBody');
        jest.spyOn(app.history, 'saveState');

        physicsButton.click();

        expect(app.physicsManager.addBody).toHaveBeenCalledWith(mesh, 1, 'box');
        expect(app.history.saveState).toHaveBeenCalled();
    });

    it('The "Reset View" button should correctly reset the camera controls', () => {
        const resetButton = Array.from(document.querySelectorAll('#ui button')).find(button => button.textContent === 'Reset View');

        jest.spyOn(app.sceneManager, 'resetCamera');
        jest.spyOn(app.history, 'saveState');

        resetButton.click();

        expect(app.sceneManager.resetCamera).toHaveBeenCalled();
        expect(app.history.saveState).toHaveBeenCalled();
    });

    it('Loading a scene file should correctly populate the Scene Graph UI', async () => {
        const loadInput = document.createElement('input');
        loadInput.type = 'file';
        loadInput.accept = '.nodist3d';
        loadInput.style.display = 'none';
        document.body.appendChild(loadInput);

        const loadButton = Array.from(document.querySelectorAll('#ui button')).find(button => button.textContent === 'Load Scene');

        // Mock SceneStorage.loadScene to return a mock loaded scene
        const mockLoadedScene = { children: [new Mesh(new BoxGeometry(), new MeshBasicMaterial())] };
        mockLoadedScene.children[0].name = 'LoadedMesh';
        jest.spyOn(app.sceneStorage, 'loadScene').mockResolvedValue(mockLoadedScene);

        jest.spyOn(app.transformControls, 'detach');
        jest.spyOn(app, 'updateGUI');
        jest.spyOn(app.sceneGraph, 'update');
        jest.spyOn(app.history, 'saveState');

        loadButton.click();

        // Simulate file selection (this will trigger the loadInput change event)
        const mockFile = new Blob(['mock scene data'], { type: 'application/zip' });
        Object.defineProperty(loadInput, 'files', {
            value: [mockFile],
            writable: false,
        });
        loadInput.dispatchEvent(new Event('change'));

        // Wait for async operations to complete
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(app.sceneStorage.loadScene).toHaveBeenCalled();
        expect(app.transformControls.detach).toHaveBeenCalled();
        expect(app.updateGUI).toHaveBeenCalledWith(null);
        expect(app.sceneGraph.update).toHaveBeenCalled();
        expect(app.history.saveState).toHaveBeenCalled();

        document.body.removeChild(loadInput);
    });

    it('After an undo operation, the UI panels should be cleared or updated to reflect no selection', () => {
        const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        mesh.name = 'TestMesh';
        app.sceneManager.scene.add(mesh);
        app.pointer.selectedObject = mesh;
        app.updateGUI(mesh);

        const undoButton = Array.from(document.querySelectorAll('#ui button')).find(button => button.textContent === 'Undo');

        jest.spyOn(app.transformControls, 'detach');
        jest.spyOn(app, 'updateGUI');

        undoButton.click();

        expect(app.transformControls.detach).toHaveBeenCalled();
        expect(app.updateGUI).toHaveBeenCalledWith(null);
    });
});
