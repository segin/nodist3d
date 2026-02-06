/**
 * Tests for Undo/Redo History functionality
 */
import { JSDOM } from 'jsdom';

// Mock THREE.js
jest.mock('three', () => {
<<<<<<< HEAD
  const mockVector3 = {
    x: 0,
    y: 0,
    z: 0,
    clone: jest.fn(() => ({ x: 0, y: 0, z: 0 })),
    copy: jest.fn(),
  };

  const mockColor = {
    clone: jest.fn(() => ({ r: 1, g: 0, b: 0 })),
    copy: jest.fn(),
  };

=======
<<<<<<< HEAD
    // Factory for Vector3 to ensure unique instances
    const createMockVector3 = (x = 0, y = 0, z = 0) => ({
        x, y, z,
        clone: jest.fn(function() { return createMockVector3(this.x, this.y, this.z); }),
        copy: jest.fn(function(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }),
        set: jest.fn(function(x, y, z) { this.x = x; this.y = y; this.z = z; return this; })
    });

    const createMockColor = (hex = 0xffffff) => ({
        getHex: jest.fn(() => hex),
        setHex: jest.fn((val) => { hex = val; }),
        clone: jest.fn(function() { return createMockColor(hex); }),
        copy: jest.fn(function(c) { hex = c.getHex(); return this; })
    });

    return {
        Scene: jest.fn(() => ({
            add: jest.fn(),
            remove: jest.fn()
        })),
        PerspectiveCamera: jest.fn(() => ({
            position: { set: jest.fn() },
            lookAt: jest.fn()
        })),
        WebGLRenderer: jest.fn(() => ({
            setSize: jest.fn(),
            setPixelRatio: jest.fn(),
            shadowMap: {},
            domElement: { addEventListener: jest.fn() }
        })),
        Mesh: jest.fn((geometry, material) => ({
            position: createMockVector3(),
            rotation: createMockVector3(),
            scale: createMockVector3(1, 1, 1),
            material: material || {
                color: createMockColor(),
                emissive: createMockColor(0x000000),
                dispose: jest.fn(),
                clone: jest.fn(() => ({ color: createMockColor(), emissive: createMockColor(), dispose: jest.fn() }))
            },
            geometry: geometry || {
                type: 'BoxGeometry',
                dispose: jest.fn(),
                clone: jest.fn()
            },
            name: 'TestMesh',
            visible: true,
            uuid: 'test-uuid-123',
            userData: { geometryParams: { width: 1, height: 1, depth: 1 } },
            castShadow: true,
            receiveShadow: true
        })),
        BoxGeometry: jest.fn(() => ({
            type: 'BoxGeometry',
            parameters: { width: 1, height: 1, depth: 1 },
            dispose: jest.fn(),
            clone: jest.fn()
        })),
        SphereGeometry: jest.fn(() => ({
            type: 'SphereGeometry',
            parameters: { radius: 0.5, widthSegments: 32, heightSegments: 32 },
            dispose: jest.fn(),
            clone: jest.fn()
        })),
        MeshLambertMaterial: jest.fn(() => ({
            color: createMockColor(),
            emissive: createMockColor(0x000000),
            dispose: jest.fn(),
            clone: jest.fn(() => ({ color: createMockColor(), emissive: createMockColor(), dispose: jest.fn() }))
        })),
        Vector3: jest.fn((x, y, z) => createMockVector3(x, y, z)),
        AmbientLight: jest.fn(),
        DirectionalLight: jest.fn(() => ({
            position: { set: jest.fn() },
            shadow: { mapSize: {} }
        })),
        GridHelper: jest.fn(),
        AxesHelper: jest.fn(),
        Raycaster: jest.fn(() => ({
            setFromCamera: jest.fn(),
            intersectObjects: jest.fn(() => [])
        })),
        Vector2: jest.fn(),
        DoubleSide: 'DoubleSide',
        FrontSide: 'FrontSide'
    };
=======
  const mockVector3 = {
    x: 0,
    y: 0,
    z: 0,
    clone: jest.fn(() => ({ x: 0, y: 0, z: 0 })),
    copy: jest.fn(),
  };

  const mockColor = {
    clone: jest.fn(() => ({ r: 1, g: 0, b: 0 })),
    copy: jest.fn(),
  };

>>>>>>> master
  return {
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
      position: mockVector3,
      rotation: mockVector3,
      scale: { x: 1, y: 1, z: 1, clone: jest.fn(() => ({ x: 1, y: 1, z: 1 })) },
      material: {
        color: mockColor,
        emissive: mockColor,
        dispose: jest.fn(),
      },
      geometry: {
        type: 'BoxGeometry',
        dispose: jest.fn(),
      },
      name: 'TestMesh',
      visible: true,
      uuid: 'test-uuid-123',
      userData: { geometryParams: { width: 1, height: 1, depth: 1 } },
      castShadow: true,
      receiveShadow: true,
    })),
    BoxGeometry: jest.fn(() => ({
      type: 'BoxGeometry',
      parameters: { width: 1, height: 1, depth: 1 },
    })),
    SphereGeometry: jest.fn(() => ({
      type: 'SphereGeometry',
      parameters: { radius: 0.5, widthSegments: 32, heightSegments: 32 },
    })),
    MeshLambertMaterial: jest.fn(() => ({
      color: mockColor,
      emissive: mockColor,
      dispose: jest.fn(),
    })),
    Vector3: jest.fn(() => mockVector3),
    AmbientLight: jest.fn(),
    DirectionalLight: jest.fn(() => ({
      position: { set: jest.fn() },
      shadow: { mapSize: {} },
    })),
    GridHelper: jest.fn(),
    AxesHelper: jest.fn(),
    Raycaster: jest.fn(() => ({
      setFromCamera: jest.fn(),
      intersectObjects: jest.fn(() => []),
    })),
    Vector2: jest.fn(),
    DoubleSide: 'DoubleSide',
    FrontSide: 'FrontSide',
  };
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> master
});

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
  OrbitControls: jest.fn(() => ({
    enableDamping: true,
    update: jest.fn(),
  })),
}));

jest.mock('three/examples/jsm/controls/TransformControls.js', () => ({
  TransformControls: jest.fn(() => ({
    addEventListener: jest.fn(),
    setMode: jest.fn(),
    attach: jest.fn(),
    detach: jest.fn(),
  })),
}));

describe('Undo/Redo History Functionality', () => {
  let dom, app;

  beforeEach(() => {
    // Setup DOM
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
    global.requestAnimationFrame = jest.fn();
    global.console.log = jest.fn(); // Suppress console.log
    global.Date.now = jest.fn(() => 1234567890);

    // Mock document methods
    jest.spyOn(document.body, 'appendChild').mockImplementation();
    jest.spyOn(window, 'addEventListener').mockImplementation();
    jest.spyOn(document, 'createElement').mockImplementation(() => ({
      style: {},
      appendChild: jest.fn(),
      textContent: '',
      innerHTML: '',
      set cssText(value) {},
    }));

    jest.clearAllMocks();

    // Create test app with history functionality
    class TestApp {
      constructor() {
        this.objects = [];
        this.selectedObject = null;
        this.scene = { add: jest.fn(), remove: jest.fn() };
        this.history = [];
        this.historyIndex = -1;
        this.maxHistorySize = 50;

        // Initialize with empty state
        this.saveState('Initial state');
      }

      saveState(description = 'Action') {
        const state = {
          description: description,
          timestamp: Date.now(),
          objects: this.objects.map((obj) => ({
            name: obj.name,
            type: obj.geometry.type,
            position: obj.position.clone(),
            rotation: obj.rotation.clone(),
            scale: obj.scale.clone(),
            material: {
              color: obj.material.color.clone(),
              emissive: obj.material.emissive.clone(),
            },
            geometryParams: obj.userData.geometryParams ? { ...obj.userData.geometryParams } : null,
            visible: obj.visible,
            uuid: obj.uuid,
          })),
          selectedObjectUuid: this.selectedObject ? this.selectedObject.uuid : null,
        };

        // Remove any future states if we're not at the end
        if (this.historyIndex < this.history.length - 1) {
          this.history.splice(this.historyIndex + 1);
        }

        // Add new state
        this.history.push(state);
        this.historyIndex++;

        // Limit history size
        if (this.history.length > this.maxHistorySize) {
          this.history.shift();
          this.historyIndex--;
        }
      }
<<<<<<< HEAD

      undo() {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.restoreState(this.history[this.historyIndex]);
          return true;
        }
        return false;
      }

      redo() {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.restoreState(this.history[this.historyIndex]);
          return true;
        }
        return false;
      }

      restoreState(state) {
        // Clear current scene
        this.objects.forEach((obj) => {
          this.scene.remove(obj);
          if (obj.geometry && obj.geometry.dispose) obj.geometry.dispose();
          if (obj.material && obj.material.dispose) obj.material.dispose();
        });
        this.objects.length = 0;

        // Restore objects
        state.objects.forEach((objData) => {
          const THREE = require('three');

          // Create geometry based on type
          let geometry;
          switch (objData.type) {
            case 'BoxGeometry':
              geometry = new THREE.BoxGeometry();
              break;
            case 'SphereGeometry':
              geometry = new THREE.SphereGeometry();
              break;
            default:
              geometry = new THREE.BoxGeometry();
          }

          // Create material
          const material = new THREE.MeshLambertMaterial();
          material.color.copy(objData.material.color);
          material.emissive.copy(objData.material.emissive);

          // Create mesh
          const mesh = new THREE.Mesh(geometry, material);
          mesh.name = objData.name;
          mesh.position.copy(objData.position);
          mesh.rotation.copy(objData.rotation);
          mesh.scale.copy(objData.scale);
          mesh.visible = objData.visible;
          mesh.uuid = objData.uuid;
          mesh.userData.geometryParams = objData.geometryParams;

          this.scene.add(mesh);
          this.objects.push(mesh);
        });

        // Restore selection
        this.selectedObject = null;
        if (state.selectedObjectUuid) {
          const selectedObj = this.objects.find((obj) => obj.uuid === state.selectedObjectUuid);
          if (selectedObj) {
            this.selectedObject = selectedObj;
          }
        }
      }

      addTestObject(name = 'TestObject') {
        const THREE = require('three');
        const mesh = new THREE.Mesh();
        mesh.name = name;
        mesh.uuid = `uuid-${name}-${Date.now()}`;

        this.objects.push(mesh);
        this.scene.add(mesh);
        this.selectedObject = mesh;
        this.saveState(`Add ${name}`);

        return mesh;
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
        this.saveState('Delete object');
      }
    }

    app = new TestApp();
  });

  afterEach(() => {
    if (dom) {
      dom.window.close();
    }
  });

  describe('History State Management', () => {
    it('should initialize with initial state', () => {
      expect(app.history.length).toBe(1);
      expect(app.historyIndex).toBe(0);
      expect(app.history[0].description).toBe('Initial state');
    });

    it('should save state with correct data structure', () => {
      const obj = app.addTestObject('StateTest');

      expect(app.history.length).toBe(3); // Initial + add object + selection
      const lastState = app.history[app.history.length - 1];
=======

      undo() {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.restoreState(this.history[this.historyIndex]);
          return true;
        }
        return false;
      }

      redo() {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.restoreState(this.history[this.historyIndex]);
          return true;
        }
        return false;
      }

      restoreState(state) {
        // Clear current scene
        this.objects.forEach((obj) => {
          this.scene.remove(obj);
          if (obj.geometry && obj.geometry.dispose) obj.geometry.dispose();
          if (obj.material && obj.material.dispose) obj.material.dispose();
        });
        this.objects.length = 0;

        // Restore objects
        state.objects.forEach((objData) => {
          const THREE = require('three');

          // Create geometry based on type
          let geometry;
          switch (objData.type) {
            case 'BoxGeometry':
              geometry = new THREE.BoxGeometry();
              break;
            case 'SphereGeometry':
              geometry = new THREE.SphereGeometry();
              break;
            default:
              geometry = new THREE.BoxGeometry();
          }

          // Create material
          const material = new THREE.MeshLambertMaterial();
          material.color.copy(objData.material.color);
          material.emissive.copy(objData.material.emissive);

          // Create mesh
          const mesh = new THREE.Mesh(geometry, material);
          mesh.name = objData.name;
          mesh.position.copy(objData.position);
          mesh.rotation.copy(objData.rotation);
          mesh.scale.copy(objData.scale);
          mesh.visible = objData.visible;
          mesh.uuid = objData.uuid;
          mesh.userData.geometryParams = objData.geometryParams;

          this.scene.add(mesh);
          this.objects.push(mesh);
        });

        // Restore selection
        this.selectedObject = null;
        if (state.selectedObjectUuid) {
          const selectedObj = this.objects.find((obj) => obj.uuid === state.selectedObjectUuid);
          if (selectedObj) {
            this.selectedObject = selectedObj;
          }
        }
      }

      addTestObject(name = 'TestObject') {
        const THREE = require('three');
        const mesh = new THREE.Mesh();
        mesh.name = name;
        mesh.uuid = `uuid-${name}-${Date.now()}`;

        this.objects.push(mesh);
        this.scene.add(mesh);
        this.selectedObject = mesh;
        this.saveState(`Add ${name}`);

        return mesh;
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
        this.saveState('Delete object');
      }
    }

    app = new TestApp();
  });

  afterEach(() => {
    if (dom) {
      dom.window.close();
    }
  });

  describe('History State Management', () => {
    it('should initialize with initial state', () => {
      expect(app.history.length).toBe(1);
      expect(app.historyIndex).toBe(0);
      expect(app.history[0].description).toBe('Initial state');
    });

    it('should save state with correct data structure', () => {
      const obj = app.addTestObject('StateTest');

<<<<<<< HEAD
        it('should save state with correct data structure', () => {
            const obj = app.addTestObject('StateTest');
            
            expect(app.history.length).toBe(2); // Initial + add object (which includes selection)
            const lastState = app.history[app.history.length - 1];
            
            expect(lastState).toHaveProperty('description');
            expect(lastState).toHaveProperty('timestamp');
            expect(lastState).toHaveProperty('objects');
            expect(lastState).toHaveProperty('selectedObjectUuid');
            expect(lastState.objects.length).toBe(1);
            expect(lastState.objects[0].name).toBe('StateTest');
        });
=======
      expect(app.history.length).toBe(3); // Initial + add object + selection
      const lastState = app.history[app.history.length - 1];
>>>>>>> master
>>>>>>> master

      expect(lastState).toHaveProperty('description');
      expect(lastState).toHaveProperty('timestamp');
      expect(lastState).toHaveProperty('objects');
      expect(lastState).toHaveProperty('selectedObjectUuid');
      expect(lastState.objects.length).toBe(1);
      expect(lastState.objects[0].name).toBe('StateTest');
    });

    it('should limit history size to maxHistorySize', () => {
      app.maxHistorySize = 3;

      // Add more states than the limit
      app.saveState('State 1');
      app.saveState('State 2');
      app.saveState('State 3');
      app.saveState('State 4');

<<<<<<< HEAD
      expect(app.history.length).toBe(3);
      expect(app.historyIndex).toBe(2);
=======
<<<<<<< HEAD
        it('should restore object selection state', () => {
            const obj = app.addTestObject('SelectionTest');
            expect(app.selectedObject).toBe(obj);
            
            // Clear selection and save state
            app.selectedObject = null;
            app.saveState('Clear selection');
            
            // Undo should restore selection
            app.undo();
            // Compare UUIDs because objects are recreated
            expect(app.selectedObject.uuid).toBe(obj.uuid);
        });

        it('should call dispose on geometry and material when restoring', () => {
            const obj = app.addTestObject('DisposeTest');
            const geometryDisposeSpy = jest.spyOn(obj.geometry, 'dispose');
            const materialDisposeSpy = jest.spyOn(obj.material, 'dispose');
            
            app.undo(); // This should trigger disposal
            
            expect(geometryDisposeSpy).toHaveBeenCalled();
            expect(materialDisposeSpy).toHaveBeenCalled();
        });
=======
      expect(app.history.length).toBe(3);
      expect(app.historyIndex).toBe(2);
>>>>>>> master
>>>>>>> master
    });

    it('should remove future states when new action is performed', () => {
      app.addTestObject('Object1');
      app.addTestObject('Object2');

      // Undo once
      app.undo();
      const historyLengthAfterUndo = app.history.length;

<<<<<<< HEAD
=======
<<<<<<< HEAD
        it('should restore correct state after multiple undo/redo operations', () => {
            // Initial state: 0 objects
            const obj1 = app.addTestObject('Redo1'); // Index 1, 1 object
            const obj2 = app.addTestObject('Redo2'); // Index 2, 2 objects
            
            expect(app.objects.length).toBe(2);
            
            // Undo twice
            app.undo(); // Index 1, 1 object
            app.undo(); // Index 0, 0 objects
            expect(app.objects.length).toBe(0);
            
            // Redo once
            app.redo(); // Index 1, 1 object
            expect(app.objects.length).toBe(1);
            expect(app.objects.some(obj => obj.name === 'Redo1')).toBe(true);
        });
=======
>>>>>>> master
      // Add new object (should remove future states)
      app.addTestObject('Object3');

      expect(app.history.length).toBeLessThanOrEqual(historyLengthAfterUndo + 1);
    });
  });

  describe('Undo Functionality', () => {
    it('should undo to previous state', () => {
      const initialObjectCount = app.objects.length;
      app.addTestObject('UndoTest');

      expect(app.objects.length).toBe(initialObjectCount + 1);

      const undoResult = app.undo();

      expect(undoResult).toBe(true);
      expect(app.objects.length).toBe(initialObjectCount);
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> master
    });

    it('should not undo when at initial state', () => {
      // Already at initial state
      const undoResult = app.undo();

      expect(undoResult).toBe(false);
      expect(app.historyIndex).toBe(0);
    });

    it('should restore object selection state', () => {
      const obj = app.addTestObject('SelectionTest');
      expect(app.selectedObject).toBe(obj);

      // Clear selection and save state
      app.selectedObject = null;
      app.saveState('Clear selection');

      // Undo should restore selection
      app.undo();
      expect(app.selectedObject).toBe(obj);
    });
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> master

    it('should call dispose on geometry and material when restoring', () => {
      const obj = app.addTestObject('DisposeTest');
      const geometryDisposeSpy = jest.spyOn(obj.geometry, 'dispose');
      const materialDisposeSpy = jest.spyOn(obj.material, 'dispose');

      app.undo(); // This should trigger disposal

      expect(geometryDisposeSpy).toHaveBeenCalled();
      expect(materialDisposeSpy).toHaveBeenCalled();
    });
  });

  describe('Redo Functionality', () => {
    it('should redo to next state', () => {
      app.addTestObject('RedoTest');
      const objectCountAfterAdd = app.objects.length;

      app.undo();
      expect(app.objects.length).toBeLessThan(objectCountAfterAdd);

      const redoResult = app.redo();

      expect(redoResult).toBe(true);
      expect(app.objects.length).toBe(objectCountAfterAdd);
    });

    it('should not redo when at latest state', () => {
      app.addTestObject('RedoLimitTest');

      // Already at latest state
      const redoResult = app.redo();

      expect(redoResult).toBe(false);
    });

    it('should restore correct state after multiple undo/redo operations', () => {
      const obj1 = app.addTestObject('Redo1');
      const obj2 = app.addTestObject('Redo2');

      expect(app.objects.length).toBe(2);

      // Undo twice
      app.undo();
      app.undo();
      expect(app.objects.length).toBe(1);

      // Redo once
      app.redo();
      expect(app.objects.length).toBe(2);
      expect(app.objects.some((obj) => obj.name === 'Redo1')).toBe(true);
    });
  });

  describe('State Restoration', () => {
    it('should restore object properties correctly', () => {
      const obj = app.addTestObject('PropertyTest');

      // Modify object properties
      obj.position.x = 5;
      obj.visible = false;
      app.saveState('Modified properties');

      // Undo to restore original properties
      app.undo();

      const restoredObj = app.objects.find((o) => o.name === 'PropertyTest');
      expect(restoredObj.position.x).toBe(0); // Original position
      expect(restoredObj.visible).toBe(true); // Original visibility
    });

    it('should handle objects with different geometry types', () => {
      const THREE = require('three');

      // Create object with sphere geometry
      const obj = app.addTestObject('SphereTest');
      obj.geometry.type = 'SphereGeometry';
      app.saveState('Sphere created');

      app.undo();
      app.redo();

      // Should restore with correct geometry type
      const restoredObj = app.objects.find((o) => o.name === 'SphereTest');
      expect(restoredObj.geometry.type).toBe('SphereGeometry');
    });

    it('should handle empty object arrays', () => {
      // Start with objects, then clear all
      app.addTestObject('TempObject');
      app.objects.length = 0;
      app.saveState('All objects removed');

      expect(() => {
        app.undo();
      }).not.toThrow();
    });
  });

  describe('Complex Workflow Scenarios', () => {
    it('should handle add, delete, undo, redo workflow', () => {
      // Add object
      const obj = app.addTestObject('WorkflowTest');
      expect(app.objects.length).toBe(1);

      // Delete object
      app.deleteObject(obj);
      expect(app.objects.length).toBe(0);

      // Undo delete
      app.undo();
      expect(app.objects.length).toBe(1);

      // Redo delete
      app.redo();
      expect(app.objects.length).toBe(0);
    });

    it('should maintain correct history index during complex operations', () => {
      const initialIndex = app.historyIndex;

      app.addTestObject('Index1');
      expect(app.historyIndex).toBe(initialIndex + 1);

      app.addTestObject('Index2');
      expect(app.historyIndex).toBe(initialIndex + 2);

      app.undo();
      expect(app.historyIndex).toBe(initialIndex + 1);

      app.undo();
      expect(app.historyIndex).toBe(initialIndex);

      app.redo();
      expect(app.historyIndex).toBe(initialIndex + 1);
    });
  });
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> master
});
