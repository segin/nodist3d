import { Scene, WebGLRenderer, PerspectiveCamera, Mesh, BoxGeometry, ShaderMaterial } from 'three';
import { ShaderEditor } from '../src/frontend/ShaderEditor.js';

// Mock dat.gui
const mockGUI = {
    addFolder: jest.fn(() => ({
        add: jest.fn(),
        open: jest.fn(),
        removeFolder: jest.fn()
    })),
    add: jest.fn()
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
});