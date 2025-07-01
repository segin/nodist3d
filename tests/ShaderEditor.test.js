import { Scene, WebGLRenderer, PerspectiveCamera, Mesh, BoxGeometry, ShaderMaterial, Color } from 'three';
import { ShaderEditor } from '../src/frontend/ShaderEditor.js';

// Mock dat.gui
jest.mock('dat.gui', () => ({
    GUI: jest.fn().mockImplementation(() => ({
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
    }))
}));




describe('ShaderEditor', () => {
    let scene;
    let renderer;
    let camera;
    let shaderEditor;
    let mockGUI;

    beforeEach(() => {
        // Re-import GUI after mocking
        const { GUI } = require('dat.gui');
        mockGUI = new GUI();

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

    it('Editing GLSL code in the GUI should update the material\'s `vertexShader` or `fragmentShader`', () => {
        shaderEditor.createShader();
        const material = shaderEditor.shaderMaterial;

        const newVertexShaderCode = 'void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 2.0); }';
        const newFragmentShaderCode = 'void main() { gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); }';

        // Simulate editing vertex shader
        const vertexShaderController = mockGUI.add.mock.results[0].value;
        vertexShaderController.listen.mock.results[0].value.onChange.mock.calls[0][0](newVertexShaderCode);
        expect(material.vertexShader).toBe(newVertexShaderCode);
        expect(material.needsUpdate).toBe(true);

        material.needsUpdate = false; // Reset for next test

        // Simulate editing fragment shader
        const fragmentShaderController = mockGUI.add.mock.results[1].value;
        fragmentShaderController.listen.mock.results[0].value.onChange.mock.calls[0][0](newFragmentShaderCode);
        expect(material.fragmentShader).toBe(newFragmentShaderCode);
        expect(material.needsUpdate).toBe(true);
    });

    it('Creating a new shader should dispose of the previous shader material if it exists', () => {
        shaderEditor.createShader();
        const firstShaderMaterial = shaderEditor.shaderMaterial;
        const disposeSpy = jest.spyOn(firstShaderMaterial, 'dispose');

        shaderEditor.createShader(); // Create a new shader

        expect(disposeSpy).toHaveBeenCalled();
    });
});