import { ShaderEditor } from '../src/frontend/ShaderEditor.js';
import EventBus from '../src/frontend/EventBus.js';
jest.mock('../src/frontend/EventBus.js', () => ({
  __esModule: true,
  default: {
    subscribe: jest.fn(),
    publish: jest.fn(),
  },
}));

// Mock THREE.js
jest.mock('three', () => ({
  ShaderMaterial: jest.fn(() => ({
    vertexShader: 'original vertex shader',
    fragmentShader: 'original fragment shader',
    uniforms: {
      uColor: { value: { r: 1, g: 0, b: 0 } },
      uTime: { value: 0 },
    },
    needsUpdate: false,
    dispose: jest.fn(),
  })),
  BufferGeometry: jest.fn(() => ({
    setAttribute: jest.fn(),
  })),
  Float32BufferAttribute: jest.fn(),
  Mesh: jest.fn(() => ({
    isMesh: true,
    material: {},
  })),
  PlaneGeometry: jest.fn(() => ({
    dispose: jest.fn(),
  })),
  WebGLRenderer: jest.fn(() => ({
    domElement: { addEventListener: jest.fn() },
  })),
  Scene: jest.fn(() => ({
    add: jest.fn(),
    remove: jest.fn(),
  })),
  PerspectiveCamera: jest.fn(() => ({
    aspect: 1,
    updateProjectionMatrix: jest.fn(),
  })),
}));

// Mock dat.gui with proper structure
const mockController = {
  name: jest.fn(() => ({ onChange: jest.fn() })),
  onChange: jest.fn(),
    })),
    WebGLRenderer: jest.fn(() => ({
        domElement: { addEventListener: jest.fn() }
    })),
    Scene: jest.fn(() => ({
        add: jest.fn(),
        remove: jest.fn()
    })),
    PerspectiveCamera: jest.fn(() => ({
        aspect: 1,
        updateProjectionMatrix: jest.fn()
    }))
}));

// Mock dat.gui with proper structure
const createMockController = () => ({
    name: jest.fn(function() { return this; }),
    onChange: jest.fn(function() { return this; }),
    listen: jest.fn(function() { return this; })
});
};
>>>>>>> master
>>>>>>> master

const mockFolder = {
  add: jest.fn(() => mockController),
  addFolder: jest.fn(() => mockFolder),
  addColor: jest.fn(() => mockController),
  open: jest.fn(),
  close: jest.fn(),
  remove: jest.fn(),
  removeFolder: jest.fn(),
  __controllers: [],
  __folders: [],
};

jest.mock('dat.gui', () => ({
  GUI: jest.fn(() => ({
    addFolder: jest.fn(() => mockFolder),
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

    const THREE = require('three');
    renderer = new THREE.WebGLRenderer();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();
    eventBus = EventBus;
    shaderEditor = new ShaderEditor(gui, renderer, scene, camera, eventBus);
  });

  it('should initialize and create the "Shader Editor" folder in the GUI', () => {
    expect(gui.addFolder).toHaveBeenCalledWith('Shader Editor');
    const editorFolder = gui.addFolder.mock.results[0].value;
    expect(editorFolder.add).toHaveBeenCalledWith(expect.any(Object), 'createShader');
  });

  describe('createShader', () => {
    it('should create a mesh with a ShaderMaterial and add it to the scene', () => {
      const THREE = require('three');
      shaderEditor.createShader();

      expect(THREE.ShaderMaterial).toHaveBeenCalled();
      expect(scene.add).toHaveBeenCalled();
      const addedMesh = scene.add.mock.calls[0][0];
      expect(addedMesh.isMesh).toBe(true);
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
    it('should update shader code and set needsUpdate to true when changed in the GUI', () => {
      shaderEditor.createShader();
      const editorFolder = gui.addFolder.mock.results[0].value;
      const shaderCodeController = editorFolder.add.mock.results[1].value; // Assuming vertex shader is the second 'add' call

      const newVertexShader = 'void main() { gl_Position = vec4(0.0); }';
      const onChangeCallback = shaderCodeController.onChange.mock.calls[0][0];
      onChangeCallback(newVertexShader);

      expect(shaderEditor.shaderMaterial.vertexShader).toBe(newVertexShader);
      expect(shaderEditor.shaderMaterial.needsUpdate).toBe(true);
    });

    it('should update uniform value and set needsUpdate to true when changed in the GUI', () => {
      shaderEditor.createShader();
      const editorFolder = gui.addFolder.mock.results[0].value;
      const uniformsFolder = editorFolder.addFolder.mock.results[0].value;
      const colorController = uniformsFolder.addColor.mock.results[0].value;

      shaderEditor.shaderMaterial.needsUpdate = false; // Reset for test

      const onChangeCallback = colorController.onChange.mock.calls[0][0];
      onChangeCallback(); // Simulate the change

      expect(shaderEditor.shaderMaterial.needsUpdate).toBe(true);
    });
>>>>>>> master
  
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
>>>>>>> master
  });
});
