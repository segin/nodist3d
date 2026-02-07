/**
 * Tests for Scene Graph/Outliner functionality
 */
import { JSDOM } from 'jsdom';

// Mock THREE.js
jest.mock('three', () => ({
  Scene: jest.fn(() => ({
    add: jest.fn(),
    remove: jest.fn(),
  })),
  PerspectiveCamera: jest.fn(() => ({
    position: { set: jest.fn() },
    lookAt: jest.fn(),
  })),
  WebGLRenderer: jest.fn(() => ({
    setSize: jest.fn(),
    setPixelRatio: jest.fn(),
    shadowMap: {},
    domElement: { addEventListener: jest.fn() },
  })),
  Mesh: jest.fn(() => ({
    position: { x: 1, y: 2, z: 3, toFixed: jest.fn(() => '1.00') },
    name: 'TestMesh',
    geometry: { type: 'BoxGeometry' },
    visible: true,
    uuid: 'test-uuid-123',
  })),
  BoxGeometry: jest.fn(),
  MeshLambertMaterial: jest.fn(),
  AmbientLight: jest.fn(),
  DirectionalLight: jest.fn(() => ({ position: { set: jest.fn() }, shadow: { mapSize: {} } })),
  GridHelper: jest.fn(),
  AxesHelper: jest.fn(),
  Raycaster: jest.fn(() => ({ setFromCamera: jest.fn(), intersectObjects: jest.fn(() => []) })),
  Vector2: jest.fn(),
}));

// Mock dat.gui
jest.mock('dat.gui', () => ({
  GUI: jest.fn(() => ({
    addFolder: jest.fn(() => ({
      add: jest.fn(() => ({ name: jest.fn(() => ({ onChange: jest.fn() })) })),
      open: jest.fn(),
    })),
  })),
}));

// Mock controls
jest.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
  OrbitControls: jest.fn(() => ({ enableDamping: true, update: jest.fn() })),
}));

jest.mock('three/examples/jsm/controls/TransformControls.js', () => ({
  TransformControls: jest.fn(() => ({
    addEventListener: jest.fn(),
    setMode: jest.fn(),
    attach: jest.fn(),
    detach: jest.fn(),
  })),
}));

describe('Scene Graph/Outliner Functionality', () => {
  let dom, app;

        }
      }

      selectObject(object) {
        this.selectedObject = object;
        this.updateSceneGraph();
      }

      deleteObject(object) {
        const index = this.objects.indexOf(object);
        if (index > -1) {
          this.objects.splice(index, 1);
          this.scene.remove(object);
        }
        if (this.selectedObject === object) {
          this.selectedObject = null;
        }
        this.updateSceneGraph();
      }

      addTestObject(name = 'TestObject') {
        const THREE = require('three');
        const object = {
          name: name,
          position: {
            x: Math.random(),
            y: Math.random(),
            z: Math.random(),
            toFixed: (n) => '1.00',
          },
          geometry: { type: 'BoxGeometry' },
          visible: true,
          uuid: `test-uuid-${Date.now()}`,
        };
        this.objects.push(object);
        this.scene.add(object);
        this.updateSceneGraph();
        return object;
      }
    }

    app = new TestApp();
  });

  afterEach(() => {
    if (dom) {
      dom.window.close();
    }
  });

  describe('Scene Graph Setup', () => {
    it('should create scene graph panel with proper structure', () => {
      expect(app.sceneGraphPanel).toBeDefined();
      expect(app.objectsList).toBeDefined();
      expect(document.body.appendChild).toHaveBeenCalled();
    });

    it('should show empty message when no objects exist', () => {
      app.objects = [];
      app.updateSceneGraph();

      expect(app.objectsList.appendChild).toHaveBeenCalled();
    });
  });

  describe('Object Management', () => {
    it('should add objects to scene graph', () => {
      const obj1 = app.addTestObject('TestBox');
      const obj2 = app.addTestObject('TestSphere');

      expect(app.objects.length).toBe(2);
      expect(app.objects).toContain(obj1);
      expect(app.objects).toContain(obj2);
    });

    it('should display object information in scene graph', () => {
      const createElementSpy = jest.spyOn(document, 'createElement');
      app.addTestObject('DisplayTest');

      // Verify DOM elements were created for object display
      expect(createElementSpy).toHaveBeenCalledWith('li');
      expect(createElementSpy).toHaveBeenCalledWith('div');
      expect(createElementSpy).toHaveBeenCalledWith('span');
      expect(createElementSpy).toHaveBeenCalledWith('button');
    });

    it('should handle object selection through scene graph', () => {
      const obj = app.addTestObject('SelectableObject');
      const selectSpy = jest.spyOn(app, 'selectObject');

      // Simulate clicking on object in scene graph
      app.selectObject(obj);

      expect(selectSpy).toHaveBeenCalledWith(obj);
      expect(app.selectedObject).toBe(obj);
    });

    it('should handle object deletion through scene graph', () => {
      const obj1 = app.addTestObject('DeleteMe');
      const obj2 = app.addTestObject('KeepMe');

      expect(app.objects.length).toBe(2);

      app.deleteObject(obj1);

      expect(app.objects.length).toBe(1);
      expect(app.objects).not.toContain(obj1);
      expect(app.objects).toContain(obj2);
      expect(app.scene.remove).toHaveBeenCalledWith(obj1);
    });

    it('should clear selection when selected object is deleted', () => {
      const obj = app.addTestObject('WillBeDeleted');
      app.selectObject(obj);

      expect(app.selectedObject).toBe(obj);

      app.deleteObject(obj);

      expect(app.selectedObject).toBeNull();
    });

