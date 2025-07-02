import { ShaderEditor } from '../src/frontend/ShaderEditor.js';
import { Scene, WebGLRenderer, PerspectiveCamera, ShaderMaterial } from 'three';
import { EventBus } from '../src/frontend/EventBus.js';

<<<<<<< Updated upstream
// Mock 'dat.gui'
jest.mock('dat.gui', () => {
  const mockController = {
    name: jest.fn().mockReturnThis(),
    onChange: jest.fn().mockReturnThis(),
    listen: jest.fn().mockReturnThis(),
  };
  const mockFolder = {
    add: jest.fn(() => mockController),
    addColor: jest.fn(() => mockController),
    addFolder: jest.fn().mockReturnThis(),
    open: jest.fn(),
    removeFolder: jest.fn(),
  };
  return {
    GUI: jest.fn(() => ({
      addFolder: jest.fn(() => mockFolder),
      add: jest.fn(() => mockController),
    })),
  };
});




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
=======
// Mock 'dat.gui'
jest.mock('dat.gui', () => {
  const mockController = {
    name: jest.fn().mockReturnThis(),
    onChange: jest.fn().mockReturnThis(),
    listen: jest.fn().mockReturnThis(),
  };
  const mockFolder = {
    add: jest.fn(() => mockController),
    addColor: jest.fn(() => mockController),
    addFolder: jest.fn().mockReturnThis(),
    open: jest.fn(),
    removeFolder: jest.fn(),
  };
  return {
    GUI: jest.fn(() => ({
      addFolder: jest.fn(() => mockFolder),
      add: jest.fn(() => mockController),
    })),
  };
});

// Mock 'three'
jest.mock('three', () => {
    const originalThree = jest.requireActual('three');
    return {
        ...originalThree,
        WebGLRenderer: jest.fn().mockImplementation(() => {
            return {
                domElement: null,
                getContext: jest.fn(),
                setSize: jest.fn(),
                setPixelRatio: jest.fn(),
                render: jest.fn(),
            };
        }),
    };
});

jest.mock('../src/frontend/EventBus.js', () => ({
    EventBus: jest.fn().mockImplementation(() => ({
        emit: jest.fn(),
        on: jest.fn(),
        subscribe: jest.fn(),
        publish: jest.fn(),
    })),
}));

// Mock 'three'
jest.mock('three', () => {
    const originalThree = jest.requireActual('three');
    return {
        ...originalThree,
        WebGLRenderer: jest.fn().mockImplementation(() => {
            return {
                domElement: null,
                getContext: jest.fn(),
                setSize: jest.fn(),
                setPixelRatio: jest.fn(),
                render: jest.fn(),
            };
        }),
    };
});

jest.mock('../src/frontend/EventBus.js', () => ({
    EventBus: jest.fn().mockImplementation(() => ({
        emit: jest.fn(),
        on: jest.fn(),
        subscribe: jest.fn(),
        publish: jest.fn(),
    })),
}));

describe('ShaderEditor', () => {
  let gui;
  let renderer;
  let scene;
  let camera;
  let shaderEditor;
  let eventBus;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Import GUI and create a mock instance
    const { GUI } = require('dat.gui');
    gui = new GUI();
    
    renderer = new WebGLRenderer();
    scene = new Scene();
    camera = new PerspectiveCamera();
    eventBus = new EventBus();
    shaderEditor = new ShaderEditor(gui, renderer, scene, camera, eventBus);
  });

  it('should initialize and create the "Shader Editor" folder in the GUI', () => {
    expect(gui.addFolder).toHaveBeenCalledWith('Shader Editor');
    const editorFolder = gui.addFolder.mock.results[0].value;
    expect(editorFolder.add).toHaveBeenCalledWith(expect.any(Object), 'createShader');
  });

  describe('createShader', () => {
    it('should create a mesh with a ShaderMaterial and add it to the scene', () => {
      shaderEditor.createShader();

      expect(ShaderMaterial).toHaveBeenCalled();
      expect(scene.add).toHaveBeenCalled();
      const addedMesh = scene.add.mock.calls[0][0];
      expect(addedMesh.isMesh).toBe(true);
      expect(addedMesh.material).toBeInstanceOf(ShaderMaterial);
    });

  it('should initialize and create the "Shader Editor" folder in the GUI', () => {
    expect(gui.addFolder).toHaveBeenCalledWith('Shader Editor');
    const editorFolder = gui.addFolder.mock.results[0].value;
    expect(editorFolder.add).toHaveBeenCalledWith(expect.any(Object), 'createShader');
  });

  describe('createShader', () => {
    it('should create a mesh with a ShaderMaterial and add it to the scene', () => {
      shaderEditor.createShader();

      expect(ShaderMaterial).toHaveBeenCalled();
      expect(scene.add).toHaveBeenCalled();
      const addedMesh = scene.add.mock.calls[0][0];
      expect(addedMesh.isMesh).toBe(true);
      expect(addedMesh.material).toBeInstanceOf(ShaderMaterial);
>>>>>>> Stashed changes
    });

    it('should dispose of the old material and remove the mesh if a shader already exists', () => {
      shaderEditor.createShader();
      const firstMaterial = shaderEditor.shaderMaterial;
      const firstMesh = shaderEditor.shaderMesh;
      scene.remove = jest.fn(); // Mock scene.remove for this test

      shaderEditor.createShader();

      expect(firstMaterial.dispose).toHaveBeenCalled();
      expect(scene.remove).toHaveBeenCalledWith(firstMesh);
    });

    it('should create new shader controls', () => {
        shaderEditor.createShader();
        const editorFolder = gui.addFolder.mock.results[0].value;
        const uniformsFolder = editorFolder.addFolder.mock.results[0].value;
  
        // Check for color uniform
        expect(uniformsFolder.addColor).toHaveBeenCalledWith(expect.any(Object), 'value');
  
        // Check for float uniform
        expect(uniformsFolder.add).toHaveBeenCalledWith(expect.any(Object), 'value', 0, 1);
  
        // Check for shader code editors
        expect(editorFolder.add).toHaveBeenCalledWith(expect.any(Object), 'vertex');
        expect(editorFolder.add).toHaveBeenCalledWith(expect.any(Object), 'fragment');
      });
  });

  describe('GUI interactions', () => {
    it("should update shader code and set needsUpdate to true when changed in the GUI", () => {
        shaderEditor.createShader();
        const editorFolder = gui.addFolder.mock.results[0].value;
        const shaderCodeController = editorFolder.add.mock.results[1].value; // Assuming vertex shader is the second 'add' call
  
        const newVertexShader = 'void main() { gl_Position = vec4(0.0); }';
        const onChangeCallback = shaderCodeController.onChange.mock.calls[0][0];
        onChangeCallback(newVertexShader);
  
        expect(shaderEditor.shaderMaterial.vertexShader).toBe(newVertexShader);
        expect(shaderEditor.shaderMaterial.needsUpdate).toBe(true);
      });
  
      it("should update uniform value and set needsUpdate to true when changed in the GUI", () => {
        shaderEditor.createShader();
        const editorFolder = gui.addFolder.mock.results[0].value;
        const uniformsFolder = editorFolder.addFolder.mock.results[0].value;
        const colorController = uniformsFolder.addColor.mock.results[0].value;
  
        shaderEditor.shaderMaterial.needsUpdate = false; // Reset for test
  
        const onChangeCallback = colorController.onChange.mock.calls[0][0];
        onChangeCallback(); // Simulate the change
  
        expect(shaderEditor.shaderMaterial.needsUpdate).toBe(true);
      });
  });
});
