import { Scene, WebGLRenderer, PerspectiveCamera, Mesh, BoxGeometry, ShaderMaterial, Color } from 'three';
import { ShaderEditor } from '../src/frontend/ShaderEditor.js';

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

describe('ShaderEditor', () => {
    let scene;
    let renderer;
    let camera;
    let shaderEditor;

    beforeEach(() => {
        scene = new Scene();
        renderer = new WebGLRenderer();
        camera = new PerspectiveCamera();
        shaderEditor = new ShaderEditor(mockGUI, renderer, scene, camera);
    });

    it('should add a mesh with a `ShaderMaterial` to the scene', () => {
        shaderEditor.createShader();
        expect(scene.children.length).toBeGreaterThan(0);
        const addedMesh = scene.children[0];
        expect(addedMesh).toBeInstanceOf(Mesh);
        expect(addedMesh.material).toBeInstanceOf(ShaderMaterial);
    });

    it('`initGUI` should create a "Shader Editor" folder in the GUI', () => {
        expect(mockGUI.addFolder).toHaveBeenCalledWith('Shader Editor');
    });

    it('Updating a uniform value should set `needsUpdate` on the material to true', () => {
        shaderEditor.createShader();
        const material = shaderEditor.shaderMaterial;
        material.needsUpdate = false; // Reset to false for testing

        // Simulate changing a color uniform
        const colorUniformController = mockGUI.addFolder.mock.results[0].value.addColor.mock.results[0].value;
        colorUniformController.onChange.mock.calls[0][0](); // Call the onChange handler
        expect(material.needsUpdate).toBe(true);

        material.needsUpdate = false; // Reset for next test

        // Simulate changing a float uniform
        const floatUniformController = mockGUI.addFolder.mock.results[0].value.add.mock.results[0].value;
        floatUniformController.listen.mock.results[0].value.onChange.mock.calls[0][0](); // Call the onChange handler
        expect(material.needsUpdate).toBe(true);
    });
});