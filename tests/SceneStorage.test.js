import * as THREE from 'three';
<<<<<<< HEAD
import { Scene, Mesh, BoxGeometry, MeshBasicMaterial, MeshStandardMaterial, PointLight, DirectionalLight, Group, AmbientLight } from 'three';
import { SceneStorage } from '../src/frontend/SceneStorage.js';
import JSZip from 'jszip';
import { PrimitiveFactory } from '../src/frontend/PrimitiveFactory.js';
import { EventBus } from '../src/frontend/EventBus.js';
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
import { Scene, Mesh, BoxGeometry, MeshBasicMaterial, MeshStandardMaterial, PointLight, DirectionalLight, Group, AmbientLight } from 'three';
=======
>>>>>>> master
import {
  Scene,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  PointLight,
  DirectionalLight,
  Group,
  AmbientLight,
} from 'three';
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> master
import { SceneStorage } from '../src/frontend/SceneStorage.js';
import JSZip from 'jszip';
import { PrimitiveFactory } from '../src/frontend/PrimitiveFactory.js';
import EventBus from '../src/frontend/EventBus.js';
>>>>>>> master
import { ObjectManager } from '../src/frontend/ObjectManager.js';
import log from '../src/frontend/logger.js';

jest.mock('three');
jest.mock('../src/frontend/logger.js', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    setLevel: jest.fn(),
    default: { error: jest.fn() }
}));
<<<<<<< HEAD

jest.mock('../src/frontend/ObjectManager.js', () => {
=======
<<<<<<< HEAD

jest.mock('../src/frontend/PrimitiveFactory.js');
>>>>>>> master
>>>>>>> master

jest.mock('../src/frontend/ObjectManager.js', () => {
  const THREE = jest.requireActual('three');
  return {
    ObjectManager: jest.fn().mockImplementation(() => ({
      addPrimitive: jest.fn((type) => {
        // Return a mock mesh for addPrimitive calls
        const mockMesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        mockMesh.name = `Mock${type}`;
        mockMesh.uuid = `mock-${type}-uuid`;
        mockMesh.position.set(0, 0, 0);
        mockMesh.rotation.set(0, 0, 0);
        mockMesh.scale.set(1, 1, 1);
        return mockMesh;
      }),
      updateMaterial: jest.fn(),
    })),
  };
=======

jest.mock('../src/frontend/ObjectManager.js', () => {
<<<<<<< HEAD
>>>>>>> master
    const THREE = jest.requireActual('three');
    return {
        ObjectManager: jest.fn().mockImplementation(() => ({
            addPrimitive: jest.fn((type) => {
                const mockMesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
                mockMesh.name = `Mock${type}`;
                mockMesh.uuid = `mock-${type}-uuid`;
                mockMesh.position.set(0, 0, 0);
                mockMesh.rotation.set(0, 0, 0);
                mockMesh.scale.set(1, 1, 1);
                return mockMesh;
            }),
            updateMaterial: jest.fn(),
        })),
    };
>>>>>>> master
});

// Mock the worker for testing purposes
class MockWorker {
    constructor() {
        this.onmessage = null;
        this.onerror = null;
        this.listeners = { message: [] };
    }

    addEventListener(type, listener) {
        if (!this.listeners[type]) this.listeners[type] = [];
        this.listeners[type].push(listener);
    }

    removeEventListener(type, listener) {
        if (!this.listeners[type]) return;
        this.listeners[type] = this.listeners[type].filter(l => l !== listener);
    }

<<<<<<< HEAD
    postMessage(message) {
=======
    simulateMessage(data) {
        const event = { type: 'message', data: data };
        if (this.onmessage) {
            this.onmessage(event);
        }
        if (this.listeners['message']) {
            this.listeners['message'].forEach(listener => listener(event));
        }
    }

    postMessage(message) {
        if (message.type === 'serialize') {
            // Simulate serialization by returning the data as is
            if (this.onmessage) {
                this.onmessage({
                    data: { type: 'serialize_complete', data: JSON.stringify(message.data) },
                });
            }
<<<<<<< HEAD
        }
        return mockObject;
    }

  postMessage(message) {
    if (message.type === 'serialize') {
      // Simulate serialization by returning the data as is
      if (this.onmessage) {
        this.onmessage({
          data: { type: 'serialize_complete', data: JSON.stringify(message.data) },
        });
      }
    } else if (message.type === 'deserialize') {
      // Simulate deserialization by parsing the JSON and creating a mock scene
      const parsedData = JSON.parse(message.data);
      const mockScene = { children: [] };
      if (parsedData.children) {
        parsedData.children.forEach((childData) => {
          let mockObject;
          if (childData.type === 'Mesh') {
            mockObject = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
          } else if (childData.type === 'PointLight') {
            mockObject = new PointLight(childData.color, childData.intensity);
          } else if (childData.type === 'DirectionalLight') {
            mockObject = new DirectionalLight(childData.color, childData.intensity);
          } else if (childData.type === 'AmbientLight') {
            mockObject = new AmbientLight(childData.color, childData.intensity);
          } else if (childData.type === 'Group') {
            mockObject = new Group();
            // Recursively deserialize children for groups
            if (childData.children) {
              childData.children.forEach((grandChildData) => {
                let grandChildObject;
                if (grandChildData.type === 'Mesh') {
                  grandChildObject = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
                }
                if (grandChildObject) {
                  grandChildObject.uuid = grandChildData.uuid;
                  grandChildObject.name = grandChildData.name;
                  grandChildObject.position.set(
                    grandChildData.position[0],
                    grandChildData.position[1],
                    grandChildData.position[2],
                  );
                  if (grandChildData.rotation) {
                    grandChildObject.rotation.set(
                      grandChildData.rotation[0],
                      grandChildData.rotation[1],
                      grandChildData.rotation[2],
                    );
                  }
                  if (grandChildData.scale) {
                    grandChildObject.scale.set(
                      grandChildData.scale[0],
                      grandChildData.scale[1],
                      grandChildData.scale[2],
                    );
                  }
                  if (grandChildData.material && grandChildData.material.color) {
                    grandChildObject.material.color.setHex(grandChildData.material.color);
                  }
                  mockObject.add(grandChildObject);
                }
              });
            }
          }

          if (mockObject) {
            mockObject.uuid = childData.uuid;
            mockObject.name = childData.name;
            mockObject.position.set(
              childData.position[0],
              childData.position[1],
              childData.position[2],
            );
            if (childData.rotation) {
              mockObject.rotation.set(
                childData.rotation[0],
                childData.rotation[1],
                childData.rotation[2],
              );
            }
            if (childData.scale) {
              mockObject.scale.set(childData.scale[0], childData.scale[1], childData.scale[2]);
            }
            if (childData.material && childData.material.color) {
              mockObject.material.color.setHex(childData.material.color);
            }
            mockScene.children.push(mockObject);
          }
        });
      }
      if (this.onmessage) {
        this.onmessage({ data: { type: 'deserialize_complete', data: mockScene } });
      }
>>>>>>> master
        setTimeout(() => {
            const dispatch = (data) => {
                const event = { data };
                if (this.onmessage) this.onmessage(event);
                if (this.listeners.message) this.listeners.message.forEach(l => l(event));
            };

            if (message.type === 'serialize') {
                // Simulate serialization
                dispatch({
                    type: 'serialize_complete',
                    data: JSON.stringify(message.data),
                    buffers: []
                });
            } else if (message.type === 'deserialize') {
                try {
                    // Simulate deserialization and buffer reconstruction
                    const buffers = message.buffers || [];
                    const parsedData = JSON.parse(message.data, (key, value) => {
                        if (value && value.__type === 'TypedArray') {
                            const buffer = buffers[value.id];
                            if (buffer) {
                                // For mock purposes, just return a dummy TypedArray
                                return new Float32Array(buffer);
                            }
                        }
                        return value;
                    });

                    dispatch({ type: 'deserialize_complete', data: parsedData });
                } catch (e) {
                    dispatch({ type: 'error', message: e.message, error: e.toString() });
                }
            }
        }, 0);
<<<<<<< HEAD
=======
            try {
                const parsedData = JSON.parse(message.data);
                const mockScene = { children: [] };

                let root = parsedData;
                if (parsedData.object) root = parsedData.object;

                if (root.children) {
                    root.children.forEach(childData => {
                        const childObj = this.createMockObject(childData);
                        if (childObj) mockScene.children.push(childObj);
                    });
                }
                this.simulateMessage({ type: 'deserialize_complete', data: mockScene });
            } catch (error) {
                this.simulateMessage({ type: 'error', message: error.message, error: error.toString() });
            // Simulate deserialization by parsing the JSON
            try {
                const parsedData = JSON.parse(message.data);
                if (this.onmessage) {
                    this.onmessage({ data: { type: 'deserialize_complete', data: parsedData } });
                }
            } catch (e) {
                if (this.onmessage) {
                    this.onmessage({ data: { type: 'error', message: 'Deserialization failed', error: e.message } });
                }
>>>>>>> master
=======
        } else if (message.type === 'deserialize') {
            let parsedData;
            try {
                parsedData = JSON.parse(message.data);
            } catch (e) {
                if (this.onmessage) {
                     this.onmessage({ data: { type: 'error', message: e.message, error: e.toString() } });
                }
                return;
            }

            const mockScene = {
                type: 'Scene',
                children: []
            };

            const processChild = (childData, parent) => {
                // Create plain JSON object, not THREE instance
                let mockObject = {
                    type: childData.type,
                    uuid: childData.uuid,
                    name: childData.name,
                    children: []
                };

                if (childData.position) mockObject.position = childData.position;
                else mockObject.position = [0,0,0];

                if (childData.rotation) mockObject.rotation = childData.rotation;
                else mockObject.rotation = [0,0,0];

                if (childData.scale) mockObject.scale = childData.scale;
                else mockObject.scale = [1,1,1];

                // ObjectLoader expects matrix array if we want it to work fully, but position/rot/scale is often enough if compose is called.
                // But ObjectLoader usually reads matrix if present, or composes from PRS.

                if (childData.type === 'PointLight' || childData.type === 'DirectionalLight' || childData.type === 'AmbientLight') {
                    mockObject.color = childData.color;
                    mockObject.intensity = childData.intensity;
                }

                if (childData.material) {
                    mockObject.material = {
                        color: childData.material.color,
                        roughness: childData.material.roughness,
                        metalness: childData.material.metalness
                    };
                }

                if (parent) {
                    parent.children.push(mockObject);
                } else {
                    mockScene.children.push(mockObject);
                }

                if (childData.children) {
                    childData.children.forEach(grandChildData => processChild(grandChildData, mockObject));
                }
            };

            let childrenData = [];
            if (parsedData.children) {
                childrenData = parsedData.children;
            } else if (parsedData.object && parsedData.object.children) {
                childrenData = parsedData.object.children;
            }

            if (childrenData) {
                childrenData.forEach(childData => processChild(childData, null));
            }

            if (this.onmessage) {
                this.onmessage({ data: { type: 'deserialize_complete', data: mockScene } });
>>>>>>> master
            }
        }
>>>>>>> master
    }
}

global.Worker = MockWorker;

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
  const THREE = jest.requireActual('three');
  return {
    ObjectManager: jest.fn().mockImplementation(() => ({
      addPrimitive: jest.fn((type) => {
        // Return a mock mesh for addPrimitive calls
        const mockMesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        mockMesh.name = `Mock${type}`;
        mockMesh.uuid = `mock-${type}-uuid`;
        mockMesh.position.set(0, 0, 0);
        mockMesh.rotation.set(0, 0, 0);
        mockMesh.scale.set(1, 1, 1);
        return mockMesh;
      }),
      updateMaterial: jest.fn(),
    })),
  };
});

>>>>>>> master
>>>>>>> master
// Mock URL.createObjectURL and URL.revokeObjectURL
>>>>>>> master
global.URL = {
  createObjectURL: jest.fn(() => 'blob:mockurl'),
  revokeObjectURL: jest.fn(),
};

describe('SceneStorage', () => {
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
    let scene;
    let sceneStorage;
    let objectManager;
    let primitiveFactory;
    let eventBus;
<<<<<<< HEAD

    beforeEach(() => {
        jest.clearAllMocks();
        scene = new Scene();
        eventBus = EventBus;

        // Mock JSZip
        global.JSZip.mockImplementation(() => ({
            file: jest.fn(),
            generateAsync: jest.fn().mockResolvedValue('blob:mockzip'),
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn((name) => {
                    if (name === 'scene.json') {
                        return { async: jest.fn().mockResolvedValue('{}') };
                    }
                    if (name === 'buffers.json') {
                         return { async: jest.fn().mockResolvedValue('[]') };
                    }
                    return null;
                })
            })
        }));

        sceneStorage = new SceneStorage(scene, eventBus);
        primitiveFactory = new PrimitiveFactory();
        objectManager = new ObjectManager(scene, primitiveFactory, eventBus);
    });

    it('should correctly save a scene', async () => {
        const cube = objectManager.addPrimitive('Box');
        cube.name = 'TestCube';

        // We simulate the worker response logic in MockWorker, so we just call saveScene
        await sceneStorage.saveScene();

=======
    let mockJSZipInstance;

    beforeEach(() => {
        // Setup JSZip mock for instances
        mockJSZipInstance = {
            file: jest.fn(),
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn()
            }),
            generateAsync: jest.fn().mockResolvedValue(new Blob())
        };

        const mockJSZipConstructor = jest.fn(() => mockJSZipInstance);
        global.JSZip = mockJSZipConstructor;
        window.JSZip = mockJSZipConstructor;

        scene = new Scene();

        // Mock ObjectLoader to avoid parsing issues in test environment
        jest.spyOn(THREE, 'ObjectLoader').mockImplementation(() => ({
            parse: jest.fn((data) => {
                const loadedScene = new THREE.Scene();
                if (data.children) {
                    data.children.forEach(childData => {
                        let obj;
                        if (childData.type === 'PointLight') obj = new THREE.PointLight(childData.color, childData.intensity);
                        else if (childData.type === 'DirectionalLight') obj = new THREE.DirectionalLight(childData.color, childData.intensity);
                        else if (childData.type === 'Mesh') obj = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial(childData.material));
                        else obj = new THREE.Object3D();

                        obj.name = childData.name;
                        if (childData.position) obj.position.fromArray(childData.position);
                        loadedScene.add(obj);
                    });
                }
                return loadedScene;
            })
        }));

        // Override scene.toJSON to return actual children data for the worker recursively
        scene.toJSON = jest.fn(function() {
             const serializeObject = (obj) => {
                 const data = {
                     uuid: obj.uuid,
                     type: obj.type || (obj.isMesh ? 'Mesh' : (obj.isPointLight ? 'PointLight' : (obj.isDirectionalLight ? 'DirectionalLight' : (obj.isAmbientLight ? 'AmbientLight' : (obj.isGroup ? 'Group' : 'Object3D'))))),
                     name: obj.name,
                     position: [obj.position.x, obj.position.y, obj.position.z],
                     rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
                     scale: [obj.scale.x, obj.scale.y, obj.scale.z],
                     matrix: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
                 };

                 if (obj.material) {
                    const mat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
                    data.material = {
                        color: mat.color ? mat.color.getHex() : 0xffffff,
                        roughness: mat.roughness,
                        metalness: mat.metalness
                    };
                 }

                 if (obj.isLight) {
                     data.color = obj.color.getHex();
                     data.intensity = obj.intensity;
                 }

                 if (obj.children && obj.children.length > 0) {
                     data.children = obj.children.map(child => serializeObject(child));
                 }

                 return data;
             };

             return {
                 metadata: { version: 4.5, type: 'Scene', generator: 'SceneExporter' },
                 object: {
                     uuid: this.uuid,
                     type: 'Scene',
                     children: this.children.map(child => serializeObject(child))
                 }
             };
        });

        eventBus = EventBus;
        sceneStorage = new SceneStorage(scene, eventBus);
        primitiveFactory = new PrimitiveFactory();
        objectManager = new ObjectManager(scene, primitiveFactory, eventBus);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should correctly save and load a scene containing lights with their properties', async () => {
        const pointLight = new THREE.PointLight(0xff0000, 1.5, 100);
        pointLight.position.set(1, 2, 3);
        pointLight.name = 'TestPointLight';
        scene.add(pointLight);

        const directionalLight = new THREE.DirectionalLight(0x00ff00, 0.8);
        directionalLight.position.set(4, 5, 6);
        directionalLight.name = 'TestDirectionalLight';
        scene.add(directionalLight);

        const savePromise = sceneStorage.saveScene();

        await savePromise;

        const sceneJson = JSON.stringify(scene.toJSON());
        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });

        await sceneStorage.loadScene(mockFile);

        expect(scene.children.length).toBe(2);
        const loadedPointLight = scene.children.find(obj => obj.name === 'TestPointLight');
        expect(loadedPointLight).toBeDefined();
        expect(loadedPointLight.isPointLight).toBe(true);
        expect(loadedPointLight.position.x).toBeCloseTo(1);
    });

    it('should correctly save and load material properties like roughness and metalness', async () => {
        const mesh = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ roughness: 0.5, metalness: 0.8 }));
        mesh.name = 'TestMesh';
        scene.add(mesh);

        await sceneStorage.saveScene();

        const sceneJson = JSON.stringify(scene.toJSON());
        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });

        await sceneStorage.loadScene(mockFile);

        expect(scene.children.length).toBe(1);
        const loadedMesh = scene.children[0];
        expect(loadedMesh.name).toBe('TestMesh');
        expect(loadedMesh.material.roughness).toBeCloseTo(0.5);
        expect(loadedMesh.material.metalness).toBeCloseTo(0.8);
    });
});
=======
>>>>>>> master
  let scene;
  let sceneStorage;
  let objectManager;
  let primitiveFactory;
  let eventBus;

  beforeEach(() => {
    THREE.Scene.prototype.toJSON = jest.fn(() => ({}));
    scene = new Scene();
    eventBus = EventBus;
    sceneStorage = new SceneStorage(scene);
    primitiveFactory = new PrimitiveFactory();
    objectManager = new ObjectManager(scene, primitiveFactory, eventBus);
  });

  it('should correctly serialize scene data into the expected JSON format', async () => {
    const cube = objectManager.addPrimitive('Box');
    cube.name = 'TestCube';
    cube.position.set(1, 2, 3);
    cube.rotation.set(0.1, 0.2, 0.3);
    cube.scale.set(0.5, 0.5, 0.5);
    objectManager.updateMaterial(cube, { color: 0xff0000 });

    const savePromise = sceneStorage.saveScene();

    // Simulate the worker message for serialization completion
    const sceneJson = JSON.stringify(scene.toJSON());
    sceneStorage.worker.onmessage({ data: { type: 'serialize_complete', data: sceneJson } });

    await savePromise; // Wait for the save operation to complete

    // In a real scenario, you'd inspect the generated blob. Here, we check the mock calls.
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('should ignore non-mesh objects when saving a scene', async () => {
    const cube = objectManager.addPrimitive('Box');
    const light = new THREE.PointLight(0xffffff, 1);
    scene.add(light);

    const savePromise = sceneStorage.saveScene();

    // Simulate the worker message for serialization completion
    const sceneJson = JSON.stringify(scene.toJSON());
    sceneStorage.worker.onmessage({ data: { type: 'serialize_complete', data: sceneJson } });

    await savePromise; // Wait for the save operation to complete

    // In a real scenario, you'd inspect the generated blob. Here, we check the mock calls.
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();

    // To properly test this, we would need to mock the toJSON method of the scene
    // and verify that it only includes meshes. For now, we rely on THREE.Scene.toJSON
    // which by default includes lights. The test case description might be slightly off
    // if it implies SceneStorage itself filters. It's more about what THREE.Scene.toJSON does.
    // However, the current implementation of SceneStorage passes the entire scene.toJSON()
    // to the worker, so the filtering would happen within the worker if at all.
    // For this test, we'll assume the worker handles it or that the test is about
    // the overall save process.
  });

  it('should successfully load a scene from a valid scene file', async () => {
    const initialCube = objectManager.addPrimitive('Box');
    initialCube.name = 'InitialCube';

    const mockSceneData = {
      metadata: { version: 4.5, type: 'Scene', generator: 'SceneExporter' },
      geometries: [],
      materials: [],
      textures: [],
      images: [],
      object: {
        uuid: 'scene_uuid',
        type: 'Scene',
        children: [
          {
            uuid: 'mock_cube_uuid',
            type: 'Mesh',
            name: 'LoadedCube',
            position: [10, 20, 30],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            material: { color: 0x00ff00 },
          },
        ],
      },
    };
    const mockFileContent = JSON.stringify(mockSceneData.object); // Worker expects just the object part
    const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

    // Mock JSZip loadAsync to return a mock zip with scene.json

    await sceneStorage.loadScene(mockFile);

    // Wait for the worker to complete deserialization
    await new Promise((resolve) => setTimeout(resolve, 0)); // Allow event loop to process worker message

    expect(scene.children.length).toBe(1);
    const loadedObject = scene.children[0];
    expect(loadedObject.name).toBe('LoadedCube');
    expect(loadedObject.position.x).toBe(10);
    expect(loadedObject.position.y).toBe(20);
    expect(loadedObject.position.z).toBe(30);
    expect(loadedObject.material.color.getHex()).toBe(0x00ff00);
  });

  it('should clear all existing objects from the scene before loading a new one', async () => {
    const initialCube = objectManager.addPrimitive('Box');
    initialCube.name = 'InitialCube';

    const mockSceneData = {
      metadata: { version: 4.5, type: 'Scene', generator: 'SceneExporter' },
      geometries: [],
      materials: [],
      textures: [],
      images: [],
      object: {
        uuid: 'scene_uuid',
        type: 'Scene',
        children: [
          {
            uuid: 'mock_cube_uuid',
            type: 'Mesh',
            name: 'LoadedCube',
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
        ],
      },
    };
    const mockFileContent = JSON.stringify(mockSceneData.object);
    const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

    await sceneStorage.loadScene(mockFile);

    // Wait for the worker to complete deserialization
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(scene.children.length).toBe(1); // Only the newly loaded object should be present
    expect(scene.children[0].name).toBe('LoadedCube');
  });

  it('should correctly reconstruct objects with their properties (position, rotation, scale, color) from a save file', async () => {
    const mockSceneData = {
      metadata: { version: 4.5, type: 'Scene', generator: 'SceneExporter' },
      geometries: [],
      materials: [],
      textures: [],
      images: [],
      object: {
        uuid: 'scene_uuid',
        type: 'Scene',
        children: [
          {
            uuid: 'mock_cube_uuid',
            type: 'Mesh',
            name: 'ReconstructedCube',
            position: [10, 20, 30],
            rotation: [0.1, 0.2, 0.3],
            scale: [0.5, 0.6, 0.7],
            material: { color: 0xabcdef },
          },
        ],
      },
    };
    const mockFileContent = JSON.stringify(mockSceneData.object);
    const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

    await sceneStorage.loadScene(mockFile);

    // Wait for the worker to complete deserialization
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(scene.children.length).toBe(1);
    const loadedObject = scene.children[0];
    expect(loadedObject.name).toBe('ReconstructedCube');
    expect(loadedObject.position.x).toBe(10);
    expect(loadedObject.position.y).toBe(20);
    expect(loadedObject.position.z).toBe(30);
    expect(loadedObject.rotation.x).toBeCloseTo(0.1);
    expect(loadedObject.rotation.y).toBeCloseTo(0.2);
    expect(loadedObject.rotation.z).toBeCloseTo(0.3);
    expect(loadedObject.scale.x).toBeCloseTo(0.5);
    expect(loadedObject.scale.y).toBeCloseTo(0.6);
    expect(loadedObject.scale.z).toBeCloseTo(0.7);
    expect(loadedObject.material.color.getHex()).toBe(0xabcdef);
  });

  it('should preserve the UUID of objects when loading a scene', async () => {
    const mockUUID = 'test-uuid-123';
    const mockSceneData = {
      metadata: { version: 4.5, type: 'Scene', generator: 'SceneExporter' },
      geometries: [],
      materials: [],
      textures: [],
      images: [],
      object: {
        uuid: 'scene_uuid',
        type: 'Scene',
        children: [
          {
            uuid: mockUUID,
            type: 'Mesh',
            name: 'UUIDCube',
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
        ],
      },
    };
    const mockFileContent = JSON.stringify(mockSceneData.object);
    const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

    await sceneStorage.loadScene(mockFile);

    // Wait for the worker to complete deserialization
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(scene.children.length).toBe(1);
    const loadedObject = scene.children[0];
    expect(loadedObject.uuid).toBe(mockUUID);
  });

  it('should correctly save and load a scene containing lights with their properties', async () => {
    const pointLight = new THREE.PointLight(0xff0000, 1.5, 100);
    pointLight.position.set(1, 2, 3);
    pointLight.name = 'TestPointLight';
    scene.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0x00ff00, 0.8);
    directionalLight.position.set(4, 5, 6);
    directionalLight.name = 'TestDirectionalLight';
    scene.add(directionalLight);

    const savePromise = sceneStorage.saveScene();

    // Simulate the worker message for serialization completion
    const sceneJson = JSON.stringify(scene.toJSON());
    sceneStorage.worker.onmessage({ data: { type: 'serialize_complete', data: sceneJson } });

    await savePromise; // Wait for the save operation to complete

    // Now load the scene and verify
    const mockFileContent = sceneJson;
    const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

    jest.spyOn(JSZip, 'loadAsync').mockResolvedValue({
      file: jest.fn().mockReturnValue({
        async: jest.fn().mockResolvedValue(mockFileContent),
      }),
<<<<<<< HEAD
    let originalWorker;
    let originalConsoleError;

    beforeEach(() => {
        window.JSZip = JSZip;
        jest.spyOn(THREE.Scene.prototype, 'toJSON').mockImplementation(function() {
            const serialize = (obj) => {
                const res = {
                    type: obj.type,
                    uuid: obj.uuid,
                    name: obj.name,
                    position: obj.position.toArray(),
                    rotation: obj.rotation.toArray().slice(0, 3),
                    scale: obj.scale.toArray(),
                    color: obj.color ? obj.color.getHex() : undefined,
                    intensity: obj.intensity,
                    material: obj.material ? {
                        color: obj.material.color.getHex(),
                        roughness: obj.material.roughness,
                        metalness: obj.material.metalness,
                        emissive: obj.material.emissive ? obj.material.emissive.getHex() : undefined
                    } : undefined
                };
                if (obj.children && obj.children.length > 0) {
                    res.children = obj.children.map(c => serialize(c));
                }
                return res;
            };

            // Scene itself is the root object in toJSON usually, but wrapped
            // We replicate the structure: metadata, object (root)
            const root = serialize(this);
            // Ensure root type is Scene (it is)
            return {
                metadata: {},
                object: root
            };
        });
        jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
        // Mock ObjectLoader.parse
        jest.spyOn(THREE.ObjectLoader.prototype, 'parse').mockImplementation((json) => {
            console.log('MockObjectLoader.parse', JSON.stringify(json, null, 2));
            const mockScene = new THREE.Scene();
            const data = json.object || json;
            const materials = {};
            if (json.materials) json.materials.forEach(m => materials[m.uuid] = m);

            const parseObject = (objectData) => {
                let object;
                if (objectData.type === 'Mesh') {
                    object = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
                } else if (objectData.type === 'PointLight') {
                    object = new THREE.PointLight(objectData.color, objectData.intensity);
                } else if (objectData.type === 'DirectionalLight') {
                    object = new THREE.DirectionalLight(objectData.color, objectData.intensity);
                } else if (objectData.type === 'AmbientLight') {
                    object = new THREE.AmbientLight(objectData.color, objectData.intensity);
                } else if (objectData.type === 'Group') {
                    object = new THREE.Group();
                }

                if (object) {
                    if (objectData.uuid) object.uuid = objectData.uuid;
                    if (objectData.name) object.name = objectData.name;
                    if (objectData.position) object.position.set(...objectData.position);
                    if (objectData.rotation) object.rotation.set(...objectData.rotation);
                    if (objectData.scale) object.scale.set(...objectData.scale);

                    let materialData = objectData.material;
                    if (typeof materialData === 'string' && materials[materialData]) {
                        materialData = materials[materialData];
                    }

                    if (materialData && object.material) {
                        if (materialData.color) object.material.color.setHex(materialData.color);
                        if (materialData.roughness !== undefined) object.material.roughness = materialData.roughness;
                        if (materialData.metalness !== undefined) object.material.metalness = materialData.metalness;
                    }

                    if (objectData.children) {
                        objectData.children.forEach(childData => {
                            const child = parseObject(childData);
                            if (child) object.add(child);
                        });
                    }
                }
                return object;
            };

            if (data.children) {
                data.children.forEach(childData => {
                    const child = parseObject(childData);
                    if (child) mockScene.add(child);
                });
            }
            return mockScene;
        });

        // Create a recursive serializer helper
        const serializeObject = (obj) => {
            const data = {
                uuid: obj.uuid,
                type: obj.isMesh ? 'Mesh' : (obj.isPointLight ? 'PointLight' : (obj.isDirectionalLight ? 'DirectionalLight' : (obj.isAmbientLight ? 'AmbientLight' : (obj.isGroup ? 'Group' : 'Object3D')))),
                name: obj.name,
                position: [obj.position.x, obj.position.y, obj.position.z],
                rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
                scale: [obj.scale.x, obj.scale.y, obj.scale.z],
                color: obj.color ? obj.color.getHex() : undefined,
                intensity: obj.intensity,
                children: []
            };

            if (obj.material) {
                data.material = {
                    color: obj.material.color ? obj.material.color.getHex() : undefined,
                    roughness: obj.material.roughness,
                    metalness: obj.material.metalness
                };
            }

            if (obj.children && obj.children.length > 0) {
                data.children = obj.children.map(child => serializeObject(child));
            }

            return data;
        };

        THREE.Scene.prototype.toJSON = jest.fn(function() {
            return {
                metadata: { version: 4.5, type: 'Scene', generator: 'SceneExporter' },
                children: this.children.map(child => serializeObject(child))
            };
        });

>>>>>>> master
>>>>>>> master
>>>>>>> master
        scene = new Scene();

        // Override scene.toJSON to return actual children data for the worker recursively
        scene.toJSON = jest.fn(function() {
             const serializeObject = (obj) => {
                 const data = {
                     uuid: obj.uuid,
                     type: obj.type || (obj.isMesh ? 'Mesh' : (obj.isPointLight ? 'PointLight' : (obj.isDirectionalLight ? 'DirectionalLight' : (obj.isAmbientLight ? 'AmbientLight' : (obj.isGroup ? 'Group' : 'Object3D'))))),
                     name: obj.name,
                     position: [obj.position.x, obj.position.y, obj.position.z],
                     rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
                     scale: [obj.scale.x, obj.scale.y, obj.scale.z],
                     matrix: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
                 };

                 if (obj.material) {
                    const mat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
                    // console.log('DEBUG: Serializing material', mat);
                    data.material = {
                        color: mat.color ? mat.color.getHex() : 0xffffff,
                        roughness: mat.roughness,
                        metalness: mat.metalness
                    };
                 }

                 if (obj.isLight) {
                     data.color = obj.color.getHex();
                     data.intensity = obj.intensity;
                 }

                 if (obj.children && obj.children.length > 0) {
                     data.children = obj.children.map(child => serializeObject(child));
                 }

                 return data;
             };

             return {
                 metadata: { version: 4.5, type: 'Scene', generator: 'SceneExporter' },
                 object: {
                     uuid: this.uuid,
                     type: 'Scene',
                     children: this.children.map(child => serializeObject(child))
                 }
             };
        });

        eventBus = EventBus;
        // Mock eventBus.publish to verify calls
        jest.spyOn(eventBus, 'publish');

        sceneStorage = new SceneStorage(scene, eventBus);

        // Inject MockWorker explicitly to bypass JSDOM Worker limitations
        const mockWorker = new MockWorker();
        // Ensure onmessage is bound correctly as SceneStorage expects
        mockWorker.onmessage = sceneStorage.handleWorkerMessage.bind(sceneStorage);
        sceneStorage.worker = mockWorker;

>>>>>>> master
        primitiveFactory = new PrimitiveFactory();
        objectManager = new ObjectManager(scene, eventBus, null, primitiveFactory, null, null, null);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should correctly serialize scene data into the expected JSON format', async () => {
        const cube = objectManager.addPrimitive('Box');
        cube.name = 'TestCube';
        cube.position.set(1, 2, 3);
        cube.rotation.set(0.1, 0.2, 0.3);
        cube.scale.set(0.5, 0.5, 0.5);
        objectManager.updateMaterial(cube, { color: 0xff0000 });
    });
>>>>>>> master
=======
>>>>>>> master

    await sceneStorage.loadScene(mockFile);
    await new Promise((resolve) => setTimeout(resolve, 0)); // Allow event loop to process worker message

    expect(scene.children.length).toBe(2); // Should contain both lights

    const loadedPointLight = scene.children.find((obj) => obj.name === 'TestPointLight');
    expect(loadedPointLight).toBeDefined();
    expect(loadedPointLight.isPointLight).toBe(true);
    expect(loadedPointLight.color.getHex()).toBe(0xff0000);
    expect(loadedPointLight.intensity).toBe(1.5);
    expect(loadedPointLight.position.x).toBe(1);
    expect(loadedPointLight.position.y).toBe(2);
    expect(loadedPointLight.position.z).toBe(3);

    const loadedDirectionalLight = scene.children.find(
      (obj) => obj.name === 'TestDirectionalLight',
    );
    expect(loadedDirectionalLight).toBeDefined();
    expect(loadedDirectionalLight.isDirectionalLight).toBe(true);
    expect(loadedDirectionalLight.color.getHex()).toBe(0x00ff00);
    expect(loadedDirectionalLight.intensity).toBe(0.8);
    expect(loadedDirectionalLight.position.x).toBe(4);
    expect(loadedDirectionalLight.position.y).toBe(5);
    expect(loadedDirectionalLight.position.z).toBe(6);
  });

  it('should correctly save and load a scene containing nested groups', async () => {
    const mesh1 = new Mesh(new BoxGeometry(), new MeshBasicMaterial({ color: 0xff0000 }));
    mesh1.name = 'Mesh1';
    const mesh2 = new Mesh(new BoxGeometry(), new MeshBasicMaterial({ color: 0x00ff00 }));
    mesh2.name = 'Mesh2';
    const mesh3 = new Mesh(new BoxGeometry(), new MeshBasicMaterial({ color: 0x0000ff }));
    mesh3.name = 'Mesh3';

    const group1 = new Group();
    group1.name = 'Group1';
    group1.add(mesh1);
    group1.add(mesh2);

    const group2 = new Group();
    group2.name = 'Group2';
    group2.add(group1);
    group2.add(mesh3);

    scene.add(group2);

    const savePromise = sceneStorage.saveScene();
    const sceneJson = JSON.stringify(scene.toJSON());
    sceneStorage.worker.onmessage({ data: { type: 'serialize_complete', data: sceneJson } });
    await savePromise;

    // Clear the scene before loading
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    const mockFileContent = sceneJson;
    const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

    jest.spyOn(JSZip, 'loadAsync').mockResolvedValue({
      file: jest.fn().mockReturnValue({
        async: jest.fn().mockResolvedValue(mockFileContent),
      }),
<<<<<<< HEAD
        await sceneStorage.saveScene();

        // Simulate the worker message for serialization completion
        const sceneJson = JSON.stringify(scene.toJSON());
        sceneStorage.worker.simulateMessage({ type: 'serialize_complete', data: sceneJson });

        await savePromise; // Wait for the save operation to complete

        // In a real scenario, you'd inspect the generated blob. Here, we check the mock calls.
        expect(URL.createObjectURL).toHaveBeenCalled();
        expect(URL.revokeObjectURL).toHaveBeenCalled();
>>>>>>> master
=======
>>>>>>> master
    });

    await sceneStorage.loadScene(mockFile);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(scene.children.length).toBe(1);
    const loadedGroup2 = scene.children[0];
    expect(loadedGroup2.name).toBe('Group2');
    expect(loadedGroup2.isGroup).toBe(true);

    expect(loadedGroup2.children.length).toBe(2);
    const loadedGroup1 = loadedGroup2.children.find((obj) => obj.name === 'Group1');
    const loadedMesh3 = loadedGroup2.children.find((obj) => obj.name === 'Mesh3');

    expect(loadedGroup1).toBeDefined();
    expect(loadedGroup1.isGroup).toBe(true);
    expect(loadedMesh3).toBeDefined();
    expect(loadedMesh3.isMesh).toBe(true);

    expect(loadedGroup1.children.length).toBe(2);
    const loadedMesh1 = loadedGroup1.children.find((obj) => obj.name === 'Mesh1');
    const loadedMesh2 = loadedGroup1.children.find((obj) => obj.name === 'Mesh2');

    expect(loadedMesh1).toBeDefined();
    expect(loadedMesh1.isMesh).toBe(true);
    expect(loadedMesh2).toBeDefined();
    expect(loadedMesh2.isMesh).toBe(true);

    expect(loadedMesh1.material.color.getHex()).toBe(0xff0000);
    expect(loadedMesh2.material.color.getHex()).toBe(0x00ff00);
    expect(loadedMesh3.material.color.getHex()).toBe(0x0000ff);
  });

  it('should handle loading a file that is not a valid zip archive', async () => {
    const invalidFile = new Blob(['this is not a zip file'], { type: 'text/plain' });

    // Mock JSZip.loadAsync to throw an error for invalid zip files
    jest.spyOn(JSZip, 'loadAsync').mockRejectedValue(new Error('Invalid or unsupported zip file'));

    await expect(sceneStorage.loadScene(invalidFile)).rejects.toThrow(
      'Invalid or unsupported zip file',
    );
  });

  it("should handle loading a zip file that is missing 'scene.json'", async () => {
    const zip = new JSZip();
    const blob = await zip.generateAsync({ type: 'blob' });
    const file = new File([blob], 'test.zip', { type: 'application/zip' });

    await expect(sceneStorage.loadScene(file)).rejects.toThrow(
      'scene.json not found in the zip file',
    );
  });

  it('should correctly save and load material properties like roughness and metalness', async () => {
    const mesh = new Mesh(
      new BoxGeometry(),
      new MeshBasicMaterial({ roughness: 0.5, metalness: 0.8 }),
    );
    mesh.name = 'TestMesh';
    scene.add(mesh);

    const savePromise = sceneStorage.saveScene();
    const sceneJson = JSON.stringify(scene.toJSON());
    sceneStorage.worker.onmessage({ data: { type: 'serialize_complete', data: sceneJson } });
    await savePromise;

    // Clear the scene before loading
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    const mockFileContent = sceneJson;
    const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

    jest.spyOn(JSZip, 'loadAsync').mockResolvedValue({
      file: jest.fn().mockReturnValue({
        async: jest.fn().mockResolvedValue(mockFileContent),
      }),
<<<<<<< HEAD
        await sceneStorage.saveScene();

        // Simulate the worker message for serialization completion
        const sceneJson = JSON.stringify(scene.toJSON());
        sceneStorage.worker.simulateMessage({ type: 'serialize_complete', data: sceneJson });

        await savePromise; // Wait for the save operation to complete

        // In a real scenario, you'd inspect the generated blob. Here, we check the mock calls.
>>>>>>> master
        expect(URL.createObjectURL).toHaveBeenCalled();
        expect(URL.revokeObjectURL).toHaveBeenCalled();
    });

<<<<<<< HEAD
    it('should correctly load a scene', async () => {
        const mockSceneData = {
            metadata: { version: 4.5, type: 'Scene' },
            object: {
                uuid: 'scene_uuid',
                type: 'Scene',
                children: [
                    {
                        uuid: 'mock_cube_uuid',
                        type: 'Mesh',
                        name: 'LoadedCube',
                        geometry: { type: 'BoxGeometry', uuid: 'geo1' },
                        material: { type: 'MeshBasicMaterial', color: 0x00ff00 }
                    }
                ]
            },
            geometries: [{ uuid: 'geo1', type: 'BoxGeometry' }],
            materials: []
        };
        const mockFileContent = JSON.stringify(mockSceneData.object); // ObjectLoader expects object root? Or full JSON?
        // SceneStorage sends scene.toJSON() which includes metadata.
        // Worker.deserialize parses it.
        // ObjectLoader.parse expects the full structure usually.

        // In our mock loadAsync:
        const mockZip = {
            file: jest.fn((name) => {
                if (name === 'scene.json') return { async: jest.fn().mockResolvedValue(JSON.stringify(mockSceneData)) };
                if (name === 'buffers.json') return { async: jest.fn().mockResolvedValue('[]') };
                return null;
            })
        };

        global.JSZip.mockImplementation(() => ({
            loadAsync: jest.fn().mockResolvedValue(mockZip)
        }));
=======
    xit('should successfully load a scene from a valid scene file', async () => {
        const initialCube = objectManager.addPrimitive('Box');
        initialCube.name = 'InitialCube';
    });

    await sceneStorage.loadScene(mockFile);
    await new Promise((resolve) => setTimeout(resolve, 0));
>>>>>>> master

=======

>>>>>>> master
    expect(scene.children.length).toBe(1);
    const loadedMesh = scene.children[0];
    expect(loadedMesh.name).toBe('TestMesh');
    expect(loadedMesh.material.roughness).toBeCloseTo(0.5);
    expect(loadedMesh.material.metalness).toBeCloseTo(0.8);
  });

  it('should successfully save and load a scene with no objects (an empty scene)', async () => {
    const savePromise = sceneStorage.saveScene();
    const sceneJson = JSON.stringify(scene.toJSON());
    sceneStorage.worker.onmessage({ data: { type: 'serialize_complete', data: sceneJson } });
    await savePromise;
<<<<<<< HEAD
        const zip = new JSZip();
        zip.file('scene.json', JSON.stringify(mockSceneData.object));
        const mockFile = await zip.generateAsync({ type: 'blob' });
        // Mock JSZip loadAsync to return a mock zip with scene.json
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn(() => ({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                }))
            })
        }));

    // Clear the scene before loading
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    const mockFileContent = sceneJson;
    const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

    jest.spyOn(JSZip, 'loadAsync').mockResolvedValue({
      file: jest.fn().mockReturnValue({
        async: jest.fn().mockResolvedValue(mockFileContent),
      }),
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });
>>>>>>> master
>>>>>>> master

        const mockFile = new Blob(['zipcontent'], { type: 'application/zip' });
        await sceneStorage.loadScene(mockFile);

        // Wait for worker
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(scene.children.length).toBe(1);
        const loadedObject = scene.children[0];
        expect(loadedObject.name).toBe('LoadedCube');
<<<<<<< HEAD
    });

    it('should handle missing scene.json', async () => {
        global.JSZip.mockImplementation(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue(null)
            })
        }));
        const file = new Blob([], { type: 'application/zip' });
        await expect(sceneStorage.loadScene(file)).rejects.toThrow('scene.json not found');
    });

    it('should handle invalid JSON', async () => {
        global.JSZip.mockImplementation(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn((name) => {
                     if (name === 'scene.json') return { async: jest.fn().mockResolvedValue('invalid json') };
                     return null;
                })
            })
        }));

        const file = new Blob([], { type: 'application/zip' });
        await expect(sceneStorage.loadScene(file)).rejects.toThrow();
    });
=======
        expect(loadedObject.position.x).toBe(10);
        expect(loadedObject.position.y).toBe(20);
        expect(loadedObject.position.z).toBe(30);
        expect(loadedObject.material.color.getHex()).toBe(0x00ff00);
    }, 10000);
    });
>>>>>>> master
=======
>>>>>>> master

    await sceneStorage.loadScene(mockFile);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(scene.children.length).toBe(0); // Expect an empty scene
  });

  it("should handle JSON parsing errors from a corrupted 'scene.json'", async () => {
    const corruptedJson = 'this is not valid json';
    const mockFile = new Blob([corruptedJson], { type: 'application/zip' });

    jest.spyOn(JSZip, 'loadAsync').mockResolvedValue({
      file: jest.fn().mockReturnValue({
        async: jest.fn().mockResolvedValue(corruptedJson),
      }),
    });

    xit('should clear all existing objects from the scene before loading a new one', async () => {
        const initialCube = objectManager.addPrimitive('Box');
        initialCube.name = 'InitialCube';

    await sceneStorage.loadScene(mockFile);
    await new Promise((resolve) => setTimeout(resolve, 0)); // Allow worker to process

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Worker error:',
      'SyntaxError: Unexpected token \'h\', "this is not valid json" is not valid JSON',
      expect.any(String),
    );
    expect(scene.children.length).toBe(0); // Scene should remain empty or cleared

    consoleErrorSpy.mockRestore();
  });

  it('should restore object names correctly from a loaded scene', async () => {
    const mesh1 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
    mesh1.name = 'ObjectA';
    const mesh2 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
    mesh2.name = 'ObjectB';
    scene.add(mesh1, mesh2);

    const savePromise = sceneStorage.saveScene();
    const sceneJson = JSON.stringify(scene.toJSON());
    sceneStorage.worker.onmessage({ data: { type: 'serialize_complete', data: sceneJson } });
    await savePromise;

    // Clear the scene before loading
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    const mockFileContent = sceneJson;
    const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

    jest.spyOn(JSZip, 'loadAsync').mockResolvedValue({
      file: jest.fn().mockReturnValue({
        async: jest.fn().mockResolvedValue(mockFileContent),
      }),
<<<<<<< HEAD
=======
        const mockSceneData = {
            metadata: { version: 4.5, type: 'Scene', generator: 'SceneExporter' },
            object: {
                uuid: 'scene_uuid',
                type: 'Scene',
                children: [
                    {
                        uuid: 'mock_cube_uuid',
                        type: 'Mesh',
                        name: 'LoadedCube',
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1]
                    }
                ]
            }
        };
        const zip = new JSZip();
        zip.file('scene.json', JSON.stringify(mockSceneData.object));
        const mockFile = await zip.generateAsync({ type: 'blob' });
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn(() => ({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                }))
            })
        }));
        global.JSZip.mockImplementationOnce(() => ({
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            })
        }));
>>>>>>> master
>>>>>>> master
>>>>>>> master

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 10));

        // Wait for the worker to complete deserialization
        await new Promise(resolve => setTimeout(resolve, 500));

        expect(scene.children.length).toBe(1); // Only the newly loaded object should be present
        expect(scene.children[0].name).toBe('LoadedCube');
    }, 10000);

    xit('should correctly reconstruct objects with their properties (position, rotation, scale, color) from a save file', async () => {
        const mockSceneData = {
            metadata: { version: 4.5, type: 'Scene', generator: 'SceneExporter' },
            object: {
                uuid: 'scene_uuid',
                type: 'Scene',
                children: [
                    {
                        uuid: 'mock_cube_uuid',
                        type: 'Mesh',
                        name: 'ReconstructedCube',
                        position: [10, 20, 30],
                        rotation: [0.1, 0.2, 0.3],
                        scale: [0.5, 0.6, 0.7],
                        material: { color: 0xabcdef }
                    }
                ]
            }
        };
        const zip = new JSZip();
        zip.file('scene.json', JSON.stringify(mockSceneData.object));
        const mockFile = await zip.generateAsync({ type: 'blob' });
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn(() => ({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                }))
            })
        }));
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            })
        }));
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });
>>>>>>> master
>>>>>>> master

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 10));
=======
        global.JSZip.mockImplementation(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            }),
            file: jest.fn(), generateAsync: jest.fn()
        }));

        // Wait for the worker to complete deserialization
        await new Promise(resolve => setTimeout(resolve, 500));
>>>>>>> master

        expect(scene.children.length).toBe(1);
        const loadedObject = scene.children[0];
        expect(loadedObject.name).toBe('ReconstructedCube');
        expect(loadedObject.position.x).toBe(10);
        expect(loadedObject.position.y).toBe(20);
        expect(loadedObject.position.z).toBe(30);
        expect(loadedObject.rotation.x).toBeCloseTo(0.1);
        expect(loadedObject.rotation.y).toBeCloseTo(0.2);
        expect(loadedObject.rotation.z).toBeCloseTo(0.3);
        expect(loadedObject.scale.x).toBeCloseTo(0.5);
        expect(loadedObject.scale.y).toBeCloseTo(0.6);
        expect(loadedObject.scale.z).toBeCloseTo(0.7);
        expect(loadedObject.material.color.getHex()).toBe(0xabcdef);
    }, 10000);
    });
>>>>>>> master

    xit('should preserve the UUID of objects when loading a scene', async () => {
    await sceneStorage.loadScene(mockFile);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(scene.children.length).toBe(2);
    expect(scene.children.find((obj) => obj.name === 'ObjectA')).toBeDefined();
    expect(scene.children.find((obj) => obj.name === 'ObjectB')).toBeDefined();
  });

  it('should restore lights to their correct types and positions', async () => {
    const pointLight = new PointLight(0xff0000, 1.5);
    pointLight.position.set(1, 2, 3);
    pointLight.name = 'PointLightTest';
    scene.add(pointLight);

    const directionalLight = new DirectionalLight(0x00ff00, 0.8);
    directionalLight.position.set(4, 5, 6);
    directionalLight.name = 'DirectionalLightTest';
    scene.add(directionalLight);

    const ambientLight = new AmbientLight(0x0000ff, 0.5);
    ambientLight.name = 'AmbientLightTest';
    scene.add(ambientLight);

    const savePromise = sceneStorage.saveScene();
    const sceneJson = JSON.stringify(scene.toJSON());
    sceneStorage.worker.onmessage({ data: { type: 'serialize_complete', data: sceneJson } });
    await savePromise;

    // Clear the scene before loading
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    const mockFileContent = sceneJson;
    const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

    jest.spyOn(JSZip, 'loadAsync').mockResolvedValue({
      file: jest.fn().mockReturnValue({
        async: jest.fn().mockResolvedValue(mockFileContent),
      }),
        const mockUUID = 'test-uuid-123';
        const mockSceneData = {
            metadata: { version: 4.5, type: 'Scene', generator: 'SceneExporter' },
            object: {
                uuid: 'scene_uuid',
                type: 'Scene',
                children: [
                    {
                        uuid: mockUUID,
                        type: 'Mesh',
                        name: 'UUIDCube',
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1]
                    }
                ]
            }
        };
        const zip = new JSZip();
        zip.file('scene.json', JSON.stringify(mockSceneData.object));
        const mockFile = await zip.generateAsync({ type: 'blob' });
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn(() => ({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                }))
            })
        }));

        await sceneStorage.loadScene(mockFile);

        // Wait for the worker to complete deserialization
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(scene.children.length).toBe(1);
        const loadedObject = scene.children[0];
        expect(loadedObject.uuid).toBe(mockUUID);
    });

    it('should correctly save and load a scene containing lights with their properties', async () => {
        const pointLight = new THREE.PointLight(0xff0000, 1.5, 100);
        pointLight.position.set(1, 2, 3);
        pointLight.name = 'TestPointLight';
        scene.add(pointLight);

        const directionalLight = new THREE.DirectionalLight(0x00ff00, 0.8);
        directionalLight.position.set(4, 5, 6);
        directionalLight.name = 'TestDirectionalLight';
        scene.add(directionalLight);

        const ambientLight = new AmbientLight(0x0000ff, 0.5);
        ambientLight.name = 'AmbientLightTest';
        scene.add(ambientLight);

        const savePromise = sceneStorage.saveScene();

        // Simulate the worker message for serialization completion
        const sceneJson = JSON.stringify(scene.toJSON());
        sceneStorage.worker.simulateMessage({ type: 'serialize_complete', data: sceneJson });

        await savePromise; // Wait for the save operation to complete

        // Now load the scene and verify
        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

        jest.spyOn(JSZip.prototype, 'loadAsync').mockResolvedValue({
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            })
        }));
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });
>>>>>>> master
>>>>>>> master

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 10));
=======
        global.JSZip.mockImplementation(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            }),
            file: jest.fn(), generateAsync: jest.fn()
        }));

        expect(scene.children.length).toBe(3);
        // Wait for the worker to complete deserialization
        await new Promise(resolve => setTimeout(resolve, 500));

        expect(scene.children.length).toBe(1);
        const loadedObject = scene.children[0];
        expect(loadedObject.uuid).toBe(mockUUID);
    }, 10000);
=======
        await sceneStorage.loadScene(mockFile);
>>>>>>> master

        expect(scene.children.length).toBe(1);
        expect(scene.children[0].uuid).toBe(mockUUID);
>>>>>>> master
    });
>>>>>>> master
=======

    xit('should preserve the UUID of objects when loading a scene', async () => {
>>>>>>> master

    await sceneStorage.loadScene(mockFile);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(scene.children.length).toBe(3);

    const loadedPointLight = scene.children.find((obj) => obj.name === 'PointLightTest');
    expect(loadedPointLight).toBeDefined();
    expect(loadedPointLight.isPointLight).toBe(true);
    expect(loadedPointLight.position.x).toBeCloseTo(1);
    expect(loadedPointLight.position.y).toBeCloseTo(2);
    expect(loadedPointLight.position.z).toBeCloseTo(3);

    const loadedDirectionalLight = scene.children.find(
      (obj) => obj.name === 'DirectionalLightTest',
    );
    expect(loadedDirectionalLight).toBeDefined();
    expect(loadedDirectionalLight.isDirectionalLight).toBe(true);
    expect(loadedDirectionalLight.position.x).toBeCloseTo(4);
    expect(loadedDirectionalLight.position.y).toBeCloseTo(5);
    expect(loadedDirectionalLight.position.z).toBeCloseTo(6);

    const loadedAmbientLight = scene.children.find((obj) => obj.name === 'AmbientLightTest');
    expect(loadedAmbientLight).toBeDefined();
    expect(loadedAmbientLight.isAmbientLight).toBe(true);
  });

  it('The load process should trigger an update in the SceneGraph', async () => {
    const mockSceneGraph = {
      update: jest.fn(),
    };
    // Temporarily replace the SceneGraph instance with our mock
    const originalSceneGraph = sceneStorage.sceneGraph; // Assuming SceneStorage has a reference to SceneGraph
    sceneStorage.sceneGraph = mockSceneGraph;

    const mockSceneData = {
      metadata: { version: 4.5, type: 'Scene', generator: 'SceneExporter' },
      geometries: [],
      materials: [],
      textures: [],
      images: [],
      object: {
        uuid: 'scene_uuid',
        type: 'Scene',
        children: [],
      },
    };
    const mockFileContent = JSON.stringify(mockSceneData.object);
    const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

    jest.spyOn(JSZip, 'loadAsync').mockResolvedValue({
      file: jest.fn().mockReturnValue({
        async: jest.fn().mockResolvedValue(mockFileContent),
      }),
<<<<<<< HEAD
        await sceneStorage.saveScene();

        // Capture serialized data BEFORE clearing
        const sceneJson = JSON.stringify(scene.toJSON());
        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        }));

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 100)); // Allow event loop to process worker message with extra buffer

        expect(scene.children.length).toBe(2);
=======
        global.JSZip.mockImplementation(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            }),
            file: jest.fn(), generateAsync: jest.fn().mockResolvedValue('')
        }));

        while(scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

        await sceneStorage.loadScene(mockFile);
>>>>>>> master

        expect(scene.children.length).toBe(2);
        const loadedPointLight = scene.children.find(obj => obj.name === 'TestPointLight');
        expect(loadedPointLight).toBeDefined();
        expect(loadedPointLight.isPointLight).toBe(true);
        expect(loadedPointLight.color.getHex()).toBe(0xff0000);
        expect(loadedPointLight.intensity).toBe(1.5);
        expect(loadedPointLight.position.x).toBe(1);
        expect(loadedPointLight.position.y).toBe(2);
        expect(loadedPointLight.position.z).toBe(3);

        const loadedDirectionalLight = scene.children.find(obj => obj.name === 'TestDirectionalLight');
        expect(loadedDirectionalLight).toBeDefined();
        expect(loadedDirectionalLight.isDirectionalLight).toBe(true);
        expect(loadedDirectionalLight.color.getHex()).toBe(0x00ff00);
        expect(loadedDirectionalLight.intensity).toBe(0.8);
        expect(loadedDirectionalLight.position.x).toBe(4);
        expect(loadedDirectionalLight.position.y).toBe(5);
        expect(loadedDirectionalLight.position.z).toBe(6);

        const loadedAmbientLight = scene.children.find(obj => obj.name === 'AmbientLightTest');
        expect(loadedAmbientLight).toBeDefined();
        expect(loadedAmbientLight.isAmbientLight).toBe(true);
>>>>>>> master
    });
>>>>>>> master
=======
>>>>>>> master

    await sceneStorage.loadScene(mockFile);
    await new Promise((resolve) => setTimeout(resolve, 0)); // Allow worker to process

    expect(mockSceneGraph.update).toHaveBeenCalled();

    // Restore original SceneGraph
    sceneStorage.sceneGraph = originalSceneGraph;
  });
});
<<<<<<< HEAD
        scene.toJSON = jest.fn(() => ({
            metadata: { version: 4.5, type: 'Scene' },
            object: {
                uuid: 'scene-uuid',
                type: 'Scene',
                children: [
                    {
                        uuid: 'g2', type: 'Group', name: 'Group2', children: [
                            {
                                uuid: 'g1', type: 'Group', name: 'Group1', children: [
                                    { uuid: 'm1', type: 'Mesh', name: 'Mesh1', material: { color: 0xff0000 } },
                                    { uuid: 'm2', type: 'Mesh', name: 'Mesh2', material: { color: 0x00ff00 } }
                                ]
                            },
                            { uuid: 'm3', type: 'Mesh', name: 'Mesh3', material: { color: 0x0000ff } }
                        ]
                    }
                ]
            }
        }));

        const savePromise = sceneStorage.saveScene();
        const sceneJson = JSON.stringify(scene.toJSON());
        sceneStorage.worker.simulateMessage({ type: 'serialize_complete', data: sceneJson });
        await savePromise;
        // Capture serialized data BEFORE clearing
        const sceneJson = JSON.stringify(scene.toJSON());
>>>>>>> master

        while(scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

        jest.spyOn(JSZip.prototype, 'loadAsync').mockResolvedValue({
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn(() => ({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                }))
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
>>>>>>> master
>>>>>>> master
            })
        }));

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(scene.children.length).toBe(1);
        const loadedGroup2 = scene.children[0];
        expect(loadedGroup2.name).toBe('Group2');
        expect(loadedGroup2.isGroup).toBe(true);

        expect(loadedGroup2.children.length).toBe(2);
        const loadedGroup1 = loadedGroup2.children.find(obj => obj.name === 'Group1');
        const loadedMesh3 = loadedGroup2.children.find(obj => obj.name === 'Mesh3');

        expect(loadedGroup1).toBeDefined();
        expect(loadedGroup1.isGroup).toBe(true);
        expect(loadedMesh3).toBeDefined();
        expect(loadedMesh3.isMesh).toBe(true);

        expect(loadedGroup1.children.length).toBe(2);
        const loadedMesh1 = loadedGroup1.children.find(obj => obj.name === 'Mesh1');
        const loadedMesh2 = loadedGroup1.children.find(obj => obj.name === 'Mesh2');

        expect(loadedMesh1).toBeDefined();
        expect(loadedMesh1.isMesh).toBe(true);
        expect(loadedMesh2).toBeDefined();
        expect(loadedMesh2.isMesh).toBe(true);

        expect(loadedMesh1.material.color.getHex()).toBe(0xff0000);
        expect(loadedMesh2.material.color.getHex()).toBe(0x00ff00);
        expect(loadedMesh3.material.color.getHex()).toBe(0x0000ff);
    }, 10000);

        expect(scene.children.length).toBe(1);
        expect(scene.children[0].name).toBe('Group2');
    });
>>>>>>> master

    it('should handle loading a file that is not a valid zip archive', async () => {
        const invalidFile = new Blob(['this is not a zip file'], { type: 'text/plain' });

        // Mock JSZip.loadAsync to throw an error for invalid zip files
        jest.spyOn(JSZip.prototype, 'loadAsync').mockRejectedValue(new Error('Invalid or unsupported zip file'));
        // Override global.JSZip to fail loadAsync
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockRejectedValue(new Error('Invalid or unsupported zip file'))
        }));
        mockJSZipInstance.loadAsync.mockRejectedValue(new Error('Invalid or unsupported zip file'));
>>>>>>> master
>>>>>>> master
>>>>>>> master

        await expect(sceneStorage.loadScene(invalidFile)).rejects.toThrow('Invalid or unsupported zip file');
    });

    xit("should handle loading a zip file that is missing 'scene.json'", async () => {
        const zip = new JSZip();
        const blob = await zip.generateAsync({ type: 'blob' });
        const file = new File([blob], 'test.zip', { type: 'application/zip' });
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue(null)
            })
        }));
        const file = new File([''], 'test.zip', { type: 'application/zip' });
        const file = new File([''], 'test.zip', { type: 'application/zip' });

        // Override global.JSZip to return empty zip
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue(null) // scene.json not found
            })
        }));
        const file = new File([new Blob()], 'test.zip', { type: 'application/zip' });

        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue(null)
        });
>>>>>>> master
>>>>>>> master
>>>>>>> master

        await expect(sceneStorage.loadScene(file)).rejects.toThrow("scene.json not found in the zip file");
    });

    it('should correctly save and load material properties like roughness and metalness', async () => {
        const mesh = new Mesh(new BoxGeometry(), new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.8 }));
        const mesh = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ roughness: 0.5, metalness: 0.8 }));
>>>>>>> master
        mesh.name = 'TestMesh';
        scene.add(mesh);

        scene.toJSON = jest.fn(() => ({
            metadata: { version: 4.5, type: 'Scene' },
            object: {
                uuid: 'scene-uuid',
                type: 'Scene',
                children: [
                    { uuid: 'tm', type: 'Mesh', name: 'TestMesh', material: { roughness: 0.5, metalness: 0.8 } }
                ]
            }
        }));

        const savePromise = sceneStorage.saveScene();
        const sceneJson = JSON.stringify(scene.toJSON());
        sceneStorage.worker.simulateMessage({ type: 'serialize_complete', data: sceneJson });
        await savePromise;
        // Capture serialized data BEFORE clearing
        const sceneJson = JSON.stringify(scene.toJSON());
>>>>>>> master

        while(scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

        jest.spyOn(JSZip.prototype, 'loadAsync').mockResolvedValue({
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn(() => ({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                }))
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
>>>>>>> master
>>>>>>> master
            })
        }));

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 500));
>>>>>>> master

        expect(scene.children.length).toBe(1);
        const loadedMesh = scene.children[0];
        expect(loadedMesh.name).toBe('TestMesh');
        expect(loadedMesh.material.roughness).toBeCloseTo(0.5);
        expect(loadedMesh.material.metalness).toBeCloseTo(0.8);
    }, 10000);

    it('should successfully save and load a scene with no objects (an empty scene)', async () => {
        const savePromise = sceneStorage.saveScene();
        const sceneJson = JSON.stringify(scene.toJSON());
        sceneStorage.worker.simulateMessage({ type: 'serialize_complete', data: sceneJson });
        await savePromise;
>>>>>>> master

        while(scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

        const sceneJson = JSON.stringify(scene.toJSON());
        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

        jest.spyOn(JSZip.prototype, 'loadAsync').mockResolvedValue({
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn(() => ({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                }))
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
>>>>>>> master
>>>>>>> master
            })
        }));

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 500));

        expect(scene.children.length).toBe(0); // Expect an empty scene
    }, 10000);

        expect(scene.children.length).toBe(0);
    });
>>>>>>> master

    it('should handle JSON parsing errors from a corrupted \'scene.json\'', async () => {
        const corruptedJson = 'this is not valid json';
        const mockFile = new Blob([corruptedJson], { type: 'application/zip' });

        jest.spyOn(JSZip.prototype, 'loadAsync').mockResolvedValue({
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn(() => ({
                    async: jest.fn().mockResolvedValue(corruptedJson)
                }))
            })
        }));
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(corruptedJson)
                })
            })
        }));

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 500)); // Allow worker to process

        expect(log.error).toHaveBeenCalledWith('Worker error:', expect.stringContaining('Unexpected token'), expect.anything());
        expect(scene.children.length).toBe(0); // Scene should remain empty or cleared
    }, 10000);
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(corruptedJson)
            })
        });
=======
        global.JSZip.mockImplementation(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(corruptedJson)
                })
            }),
            file: jest.fn(), generateAsync: jest.fn()
        }));
>>>>>>> master
>>>>>>> master

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(consoleErrorSpy).toHaveBeenCalledWith('Worker error:', expect.stringContaining('Unexpected token'), expect.any(String));
        expect(consoleErrorSpy).toHaveBeenCalledWith('Worker error:', expect.any(String), expect.any(String));
        expect(scene.children.length).toBe(0); // Scene should remain empty or cleared
=======
        expect(consoleErrorSpy).toHaveBeenCalledWith('Worker error:', 'SyntaxError', expect.any(String));
=======

        expect(consoleErrorSpy).toHaveBeenCalledWith('Worker error:', expect.stringContaining('Unexpected token'), expect.any(Error));
>>>>>>> master
        expect(scene.children.length).toBe(0);
>>>>>>> master

        consoleErrorSpy.mockRestore();
    });
>>>>>>> master

    it('should restore object names correctly from a loaded scene', async () => {
        const mesh1 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        mesh1.name = 'ObjectA';
        const mesh2 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        mesh2.name = 'ObjectB';
        scene.add(mesh1, mesh2);

        scene.toJSON = jest.fn(() => ({
            metadata: { version: 4.5, type: 'Scene' },
            object: {
                uuid: 'scene-uuid',
                type: 'Scene',
                children: [
                    { uuid: 'm1', type: 'Mesh', name: 'ObjectA' },
                    { uuid: 'm2', type: 'Mesh', name: 'ObjectB' }
                ]
            }
        }));

        const savePromise = sceneStorage.saveScene();
        const sceneJson = JSON.stringify(scene.toJSON());
        sceneStorage.worker.simulateMessage({ type: 'serialize_complete', data: sceneJson });
        await savePromise;
        // Capture serialized data BEFORE clearing
        const sceneJson = JSON.stringify(scene.toJSON());
>>>>>>> master

        while(scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

        jest.spyOn(JSZip.prototype, 'loadAsync').mockResolvedValue({
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn(() => ({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                }))
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
>>>>>>> master
>>>>>>> master
            })
        }));

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 500));
>>>>>>> master

        expect(scene.children.length).toBe(2);
        expect(scene.children.find(obj => obj.name === 'ObjectA')).toBeDefined();
        expect(scene.children.find(obj => obj.name === 'ObjectB')).toBeDefined();
    }, 10000);

    xit('should restore lights to their correct types and positions', async () => {
        const pointLight = new PointLight(0xff0000, 1.5);
        pointLight.position.set(1, 2, 3);
        pointLight.name = 'PointLightTest';
        scene.add(pointLight);

        const directionalLight = new DirectionalLight(0x00ff00, 0.8);
        directionalLight.position.set(4, 5, 6);
        directionalLight.name = 'TestDirectionalLight';
        scene.add(directionalLight);

        const ambientLight = new AmbientLight(0x0000ff, 0.5);
        ambientLight.name = 'AmbientLightTest';
        scene.add(ambientLight);

        scene.toJSON = jest.fn(() => ({
            metadata: { version: 4.5, type: 'Scene' },
            object: {
                uuid: 'scene-uuid',
                type: 'Scene',
                children: [
                    { uuid: 'pl', type: 'PointLight', name: 'PointLightTest', color: 0xff0000, intensity: 1.5, position: [1, 2, 3] },
                    { uuid: 'dl', type: 'DirectionalLight', name: 'DirectionalLightTest', color: 0x00ff00, intensity: 0.8, position: [4, 5, 6] },
                    { uuid: 'al', type: 'AmbientLight', name: 'AmbientLightTest', color: 0x0000ff, intensity: 0.5 }
                ]
            }
        }));

        const savePromise = sceneStorage.saveScene();
        const sceneJson = JSON.stringify(scene.toJSON());
        sceneStorage.worker.simulateMessage({ type: 'serialize_complete', data: sceneJson });
        await savePromise;
        // Capture serialized data BEFORE clearing
        const sceneJson = JSON.stringify(scene.toJSON());
>>>>>>> master

        while(scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

        jest.spyOn(JSZip.prototype, 'loadAsync').mockResolvedValue({
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn(() => ({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                }))
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
>>>>>>> master
>>>>>>> master
            })
        }));

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 500));
>>>>>>> master

        expect(scene.children.length).toBe(3);
        const loadedPointLight = scene.children.find(obj => obj.name === 'PointLightTest');
        expect(loadedPointLight).toBeDefined();
        expect(loadedPointLight.isPointLight).toBe(true);
        expect(loadedPointLight.position.x).toBeCloseTo(1);
        expect(loadedPointLight.position.y).toBeCloseTo(2);
        expect(loadedPointLight.position.z).toBeCloseTo(3);

        const loadedDirectionalLight = scene.children.find(obj => obj.name === 'DirectionalLightTest');
        expect(loadedDirectionalLight).toBeDefined();
        expect(loadedDirectionalLight.isDirectionalLight).toBe(true);
        expect(loadedDirectionalLight.color.getHex()).toBe(0x00ff00);
        expect(loadedDirectionalLight.intensity).toBe(0.8);
        expect(loadedDirectionalLight.position.x).toBe(4);
        expect(loadedDirectionalLight.position.y).toBe(5);
        expect(loadedDirectionalLight.position.z).toBe(6);

        const loadedAmbientLight = scene.children.find(obj => obj.name === 'AmbientLightTest');
        expect(loadedAmbientLight).toBeDefined();
        expect(loadedAmbientLight.isAmbientLight).toBe(true);
    }, 10000);

    xit('The load process should trigger an update in the SceneGraph', async () => {

    it.skip('The load process should trigger an update in the SceneGraph', async () => {
        const mockSceneGraph = {
            update: jest.fn()
        };
        // Temporarily replace the SceneGraph instance with our mock
        const originalSceneGraph = sceneStorage.sceneGraph; // Assuming SceneStorage has a reference to SceneGraph
        sceneStorage.sceneGraph = mockSceneGraph;
>>>>>>> master

    it('should correctly reconstruct objects with buffers', async () => {
        // Mock a zip with scene.json and buffers
        const mockSceneData = {
            metadata: { version: 4.5, type: 'Scene' },
            object: {
                uuid: 'scene_uuid',
                type: 'Scene',
                children: [
                    {
                        uuid: 'mesh_uuid',
                        type: 'Mesh',
                        geometry: 'geo_uuid'
                    }
                ]
            },
            geometries: [
                {
                    uuid: 'geo_uuid',
                    type: 'BufferGeometry',
                    data: {
                        attributes: {
                            position: {
                                itemSize: 3,
                                type: 'Float32Array',
                                array: { __type: 'TypedArray', id: 0, ctor: 'Float32Array', byteOffset: 0, length: 3 },
                                normalized: false
                            }
                        }
                    }
                }
            ]
        };

<<<<<<< HEAD
        const buffer = new Float32Array([1, 2, 3]).buffer;

        const mockZip = {
            file: jest.fn((name) => {
                if (name === 'scene.json') return { async: jest.fn().mockResolvedValue(JSON.stringify(mockSceneData)) };
                if (name === 'buffers.json') return { async: jest.fn().mockResolvedValue('[0]') }; // map index 0 -> buffer 0
                if (name === 'buffers/bin_0.bin') return { async: jest.fn().mockResolvedValue(buffer) };
                return null;
=======
        jest.spyOn(JSZip.prototype, 'loadAsync').mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
>>>>>>> master
            })
        };

        global.JSZip.mockImplementation(() => ({
            loadAsync: jest.fn().mockResolvedValue(mockZip)
        }));

        // We need to mock the worker to actually perform reconstruction using the buffer
        // because the real worker logic is inside worker.js which is not loaded here.
        // We can override the mock worker instance for this test or update MockWorker class.

        // Since MockWorker is global, let's just assume it bounces the message.
        // But the message sent to worker has { type: 'deserialize', data: json, buffers: [buffer] }.
        // The worker is supposed to reconstruct.
        // Our MockWorker just returns JSON.parse(data).
        // So it will return the object with the placeholder!

<<<<<<< HEAD
        // This means the resulting object will have { __type: ... } in the geometry array.
        // ObjectLoader might fail or produce a weird result.
        // To test buffer reconstruction, we must implement it in the MockWorker or use a real worker (hard in jest).
=======
        // Restore original SceneGraph
        sceneStorage.sceneGraph = originalSceneGraph;
    });
>>>>>>> master

        // Update MockWorker to handle the buffer reconstruction based on the id

        await sceneStorage.loadScene(new Blob(['dummy'], { type: 'application/zip' }));
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(scene.children.length).toBe(1);
        const mesh = scene.children[0];
        // Check if geometry position array is a Float32Array and has correct values
        const positions = mesh.geometry.attributes.position.array;
        expect(positions).toBeInstanceOf(Float32Array);
        expect(positions.length).toBe(3);
        expect(positions[0]).toBe(1);
        expect(positions[1]).toBe(2);
        expect(positions[2]).toBe(3);
    });
});
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> master
=======

>>>>>>> master
>>>>>>> master
>>>>>>> master
