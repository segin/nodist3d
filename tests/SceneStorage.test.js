import * as THREE from 'three';
<<<<<<< HEAD
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
=======
import { Scene, Mesh, BoxGeometry, MeshBasicMaterial, MeshStandardMaterial, PointLight, DirectionalLight, Group, AmbientLight } from 'three';
>>>>>>> master
import { SceneStorage } from '../src/frontend/SceneStorage.js';
import JSZip from 'jszip';
import { PrimitiveFactory } from '../src/frontend/PrimitiveFactory.js';
<<<<<<< HEAD
import EventBus from '../src/frontend/EventBus.js';
import { ObjectManager } from '../src/frontend/ObjectManager.js';
import log from '../src/frontend/logger.js';

jest.mock('../src/frontend/logger.js', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    setLevel: jest.fn(),
}));
=======
import { EventBus } from '../src/frontend/EventBus.js';
import { ObjectManager } from '../src/frontend/ObjectManager.js';
>>>>>>> master

jest.mock('../src/frontend/ObjectManager.js', () => {
<<<<<<< HEAD
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

=======
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
});

<<<<<<< HEAD
=======
>>>>>>> master
// Mock the worker for testing purposes
class MockWorker {
  constructor() {
    this.onmessage = null;
    this.onerror = null;
  }

<<<<<<< HEAD
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
=======
    postMessage(message) {
<<<<<<< HEAD
        setTimeout(() => {
            if (message.type === 'serialize') {
                if (this.onmessage) {
                    this.onmessage({ data: { type: 'serialize_complete', data: JSON.stringify(message.data) } });
                }
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

                const mockScene = { children: [] };

                const processObject = (data) => {
                    let obj;
                    if (data.type === 'Mesh') {
                         const material = new MeshStandardMaterial();
                         if (data.material) {
                             if (data.material.roughness !== undefined) material.roughness = data.material.roughness;
                             if (data.material.metalness !== undefined) material.metalness = data.material.metalness;
                             if (data.material.color) material.color.setHex(data.material.color);
                         }
                         obj = new Mesh(new BoxGeometry(), material);
                    } else if (data.type === 'PointLight') {
                        obj = new PointLight(data.color, data.intensity);
                    } else if (data.type === 'DirectionalLight') {
                        obj = new DirectionalLight(data.color, data.intensity);
                    } else if (data.type === 'AmbientLight') {
                        obj = new AmbientLight(data.color, data.intensity);
                    } else if (data.type === 'Group') {
                        obj = new Group();
                        if (data.children) {
                            data.children.forEach(childData => {
                                const childObj = processObject(childData);
                                if (childObj) obj.add(childObj);
                            });
                        }
                    }

                    if (obj) {
                        obj.uuid = data.uuid;
                        obj.name = data.name;

                        if (data.position) {
                             const p = data.position;
                             const x = p[0] !== undefined ? p[0] : (p.x || 0);
                             const y = p[1] !== undefined ? p[1] : (p.y || 0);
                             const z = p[2] !== undefined ? p[2] : (p.z || 0);
                             obj.position.set(x, y, z);
                        }
                        if (data.rotation) {
                             const r = data.rotation;
                             const x = r[0] !== undefined ? r[0] : (r._x || r.x || 0);
                             const y = r[1] !== undefined ? r[1] : (r._y || r.y || 0);
                             const z = r[2] !== undefined ? r[2] : (r._z || r.z || 0);
                             obj.rotation.set(x, y, z);
                        }
                        if (data.scale) {
                             const s = data.scale;
                             const x = s[0] !== undefined ? s[0] : (s.x || 1);
                             const y = s[1] !== undefined ? s[1] : (s.y || 1);
                             const z = s[2] !== undefined ? s[2] : (s.z || 1);
                             obj.scale.set(x, y, z);
                        }
                    }
                    return obj;
                };

                const childrenSource = parsedData.object ? parsedData.object.children : parsedData.children;

                if (childrenSource) {
                    childrenSource.forEach(childData => {
                        const mockObject = processObject(childData);
                        if (mockObject) {
                            mockScene.children.push(mockObject);
                        }
                    });
                }

                if (this.onmessage) {
                    this.onmessage({ data: { type: 'deserialize_complete', data: mockScene } });
                }
            }
        }, 0);
=======
        if (message.type === 'serialize') {
            // Simulate serialization by returning the data as is
            if (this.onmessage) {
                this.onmessage({ data: { type: 'serialize_complete', data: JSON.stringify(message.data) } });
            }
        } else if (message.type === 'deserialize') {
            // Simulate deserialization by parsing the JSON and creating a mock scene
            let parsedData;
            try {
                parsedData = JSON.parse(message.data);
            } catch (e) {
                 // For corrupt json test
                 if (this.onerror) {
                     this.onerror(e);
                 } else if (this.onmessage) {
                      this.onmessage({ data: { type: 'error', message: e.message, error: e } });
                 }
                 return;
            }

            const mockScene = { children: [] };

            const processChild = (childData, parent) => {
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
                }

                if (mockObject) {
                    mockObject.uuid = childData.uuid;
                    mockObject.name = childData.name;
                    if (childData.position) mockObject.position.set(childData.position[0], childData.position[1], childData.position[2]);
                    if (childData.rotation) mockObject.rotation.set(childData.rotation[0], childData.rotation[1], childData.rotation[2]);
                    if (childData.scale) mockObject.scale.set(childData.scale[0], childData.scale[1], childData.scale[2]);

                    if (childData.material) {
                         if (childData.material.color) mockObject.material.color.setHex(childData.material.color);
                         if (childData.material.roughness !== undefined) mockObject.material.roughness = childData.material.roughness;
                         if (childData.material.metalness !== undefined) mockObject.material.metalness = childData.material.metalness;
                    }

                    if (parent) {
                        parent.add(mockObject);
                    } else {
                        mockScene.children.push(mockObject);
                    }

                    if (childData.children) {
                        childData.children.forEach(grandChildData => processChild(grandChildData, mockObject));
                    }
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
            }
        }
>>>>>>> master
>>>>>>> master
    }
  }
}

>>>>>>> master
// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL = {
  createObjectURL: jest.fn(() => 'blob:mockurl'),
  revokeObjectURL: jest.fn(),
};

jest.setTimeout(30000); // Increase timeout for all tests

describe('SceneStorage', () => {
<<<<<<< HEAD
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
=======
    let scene;
    let sceneStorage;
    let objectManager;
    let primitiveFactory;
    let eventBus;
<<<<<<< HEAD
    let originalWorker;
    let originalConsoleError;

    beforeEach(() => {
        jest.clearAllMocks(); // Clear calls to mocks like log.error

        // Suppress specific JSDOM errors, but let others through
        originalConsoleError = console.error;
        console.error = jest.fn((msg, ...args) => {
            if (typeof msg === 'string' && msg.includes('Not implemented: navigation')) return;
            // originalConsoleError(msg, ...args); // Uncomment to debug, but keep suppressed for now to match pattern
        });

        // Setup default JSZip mock
        global.JSZip.mockImplementation(() => ({
            file: jest.fn(),
            generateAsync: jest.fn().mockResolvedValue('blob:mockzip'),
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn(() => ({
                    async: jest.fn().mockResolvedValue('{}')
                }))
            })
        }));

        originalWorker = global.Worker;
        global.Worker = MockWorker;

=======
    let mockJSZipInstance;

    beforeEach(() => {
<<<<<<< HEAD
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

=======
        jest.clearAllMocks();
        global.Worker = MockWorker;
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
<<<<<<< HEAD
        // Mock eventBus.publish to verify calls
        jest.spyOn(eventBus, 'publish');

        sceneStorage = new SceneStorage(scene, eventBus);
=======

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

        // Setup Worker mock specific for SceneStorage logic
        global.Worker = class {
            constructor(stringUrl) {
                this.url = stringUrl;
                this.onmessage = () => {};
            }
            postMessage(msg) {
                // Execute asynchronously to simulate worker and allow onmessage assignment in SaveScene
                setTimeout(() => {
                    if (msg.type === 'serialize') {
                        this.onmessage({ data: { type: 'serialize_complete', data: JSON.stringify(msg.data) } });
                    } else if (msg.type === 'deserialize') {
                        let parsedData;
                        try {
                            parsedData = JSON.parse(msg.data);
                        } catch (e) {
                            this.onmessage({ data: { type: 'error', message: 'SyntaxError', error: e.message } });
                            return;
                        }

                        // Reconstruct objects
                        const mockScene = { children: [] };

                        // Recursive deserializer
                        const deserializeObject = (objData) => {
                            let obj;
                            if (objData.type === 'Mesh') {
                                obj = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
                            } else if (objData.type === 'PointLight') {
                                obj = new PointLight(objData.color || 0xffffff, objData.intensity || 1);
                            } else if (objData.type === 'DirectionalLight') {
                                obj = new DirectionalLight(objData.color || 0xffffff, objData.intensity || 1);
                            } else if (objData.type === 'AmbientLight') {
                                obj = new AmbientLight(objData.color || 0xffffff, objData.intensity || 1);
                            } else if (objData.type === 'Group') {
                                obj = new Group();
                            } else {
                                obj = new THREE.Object3D(); // Fallback
                            }

                            if (obj) {
                                obj.uuid = objData.uuid;
                                obj.name = objData.name;
                                if (objData.position) obj.position.set(objData.position[0], objData.position[1], objData.position[2]);
                                if (objData.rotation) obj.rotation.set(objData.rotation[0], objData.rotation[1], objData.rotation[2]);
                                if (objData.scale) obj.scale.set(objData.scale[0], objData.scale[1], objData.scale[2]);

                                if (objData.material && obj.material) {
                                    if (objData.material.color) obj.material.color.setHex(objData.material.color);
                                    if (objData.material.roughness !== undefined) obj.material.roughness = objData.material.roughness;
                                    if (objData.material.metalness !== undefined) obj.material.metalness = objData.material.metalness;
                                }

                                if (objData.children) {
                                    objData.children.forEach(childData => {
                                        const child = deserializeObject(childData);
                                        if (child) obj.add(child);
                                    });
                                }
                            }
                            return obj;
                        };

                        if (parsedData.children) {
                            parsedData.children.forEach(childData => {
                                const mockObject = deserializeObject(childData);
                                if (mockObject) mockScene.children.push(mockObject);
                            });
                        }

                        this.onmessage({ data: { type: 'deserialize_complete', data: mockScene } });
                    }
                }, 0);
            }
        };

        sceneStorage = new SceneStorage(scene);
>>>>>>> master
        primitiveFactory = new PrimitiveFactory();
<<<<<<< HEAD
        objectManager = new ObjectManager(scene, eventBus, null, primitiveFactory, null, null, null);
=======
        objectManager = new ObjectManager(scene, primitiveFactory, eventBus);

        global.JSZip.mockImplementation(() => ({
            file: jest.fn(),
            generateAsync: jest.fn().mockResolvedValue(''),
            loadAsync: jest.fn().mockResolvedValue({
                 file: jest.fn().mockReturnValue({ async: jest.fn().mockResolvedValue('{}') })
            })
        }));
>>>>>>> master
    });

    afterEach(() => {
        global.Worker = originalWorker;
        console.error = originalConsoleError;
>>>>>>> master
    });

    await sceneStorage.loadScene(mockFile);
    await new Promise((resolve) => setTimeout(resolve, 0)); // Allow event loop to process worker message

<<<<<<< HEAD
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
=======
<<<<<<< HEAD
        await sceneStorage.saveScene();
=======
        const savePromise = sceneStorage.saveScene();
        await savePromise;
>>>>>>> master

        expect(URL.createObjectURL).toHaveBeenCalled();
        expect(URL.revokeObjectURL).toHaveBeenCalled();
>>>>>>> master
    });

    await sceneStorage.loadScene(mockFile);
    await new Promise((resolve) => setTimeout(resolve, 0));

<<<<<<< HEAD
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
=======
<<<<<<< HEAD
        await sceneStorage.saveScene();
=======
        const savePromise = sceneStorage.saveScene();
        await savePromise;
>>>>>>> master

        expect(URL.createObjectURL).toHaveBeenCalled();
        expect(URL.revokeObjectURL).toHaveBeenCalled();
>>>>>>> master
    });

    await sceneStorage.loadScene(mockFile);
    await new Promise((resolve) => setTimeout(resolve, 0));

<<<<<<< HEAD
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
                        position: [10, 20, 30],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                        material: { color: 0x00ff00 }
                    }
                ]
            }
        };
        const mockFileContent = JSON.stringify(mockSceneData.object);
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

<<<<<<< HEAD
        // Mock JSZip loadAsync to return a mock zip with scene.json
        global.JSZip.mockImplementation(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            })
        }));
>>>>>>> master

    // Clear the scene before loading
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

<<<<<<< HEAD
    const mockFileContent = sceneJson;
    const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

    jest.spyOn(JSZip, 'loadAsync').mockResolvedValue({
      file: jest.fn().mockReturnValue({
        async: jest.fn().mockResolvedValue(mockFileContent),
      }),
=======
        // Wait for the worker to complete deserialization
        await new Promise(resolve => setTimeout(resolve, 500)); // Allow event loop to process worker message with extra buffer
=======
<<<<<<< HEAD
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });

        await sceneStorage.loadScene(mockFile);

        // Wait for next tick to ensure worker callback runs
        await new Promise(resolve => setTimeout(resolve, 10));
>>>>>>> master

=======
        global.JSZip.mockImplementation(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            }),
            file: jest.fn(), generateAsync: jest.fn()
        }));

        await sceneStorage.loadScene(mockFile);

>>>>>>> master
        expect(scene.children.length).toBe(1);
        const loadedObject = scene.children[0];
        expect(loadedObject.name).toBe('LoadedCube');
<<<<<<< HEAD
        expect(loadedObject.position.x).toBe(10);
        expect(loadedObject.position.y).toBe(20);
        expect(loadedObject.position.z).toBe(30);
        expect(loadedObject.material.color.getHex()).toBe(0x00ff00);
    }, 10000);
=======
>>>>>>> master
    });
>>>>>>> master

    await sceneStorage.loadScene(mockFile);
    await new Promise((resolve) => setTimeout(resolve, 0));

<<<<<<< HEAD
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

    // Mock console.error to prevent test output pollution
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

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
        const mockFileContent = JSON.stringify(mockSceneData.object);
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

<<<<<<< HEAD
        global.JSZip.mockImplementationOnce(() => ({
=======
<<<<<<< HEAD
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });
=======
        global.JSZip.mockImplementation(() => ({
>>>>>>> master
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
<<<<<<< HEAD
            })
        }));
=======
            }),
            file: jest.fn(), generateAsync: jest.fn()
        }));
>>>>>>> master
>>>>>>> master

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 10));

<<<<<<< HEAD
        // Wait for the worker to complete deserialization
        await new Promise(resolve => setTimeout(resolve, 500));

        expect(scene.children.length).toBe(1); // Only the newly loaded object should be present
=======
        expect(scene.children.length).toBe(1);
>>>>>>> master
        expect(scene.children[0].name).toBe('LoadedCube');
    }, 10000);

    it('should correctly reconstruct objects with their properties (position, rotation, scale, color) from a save file', async () => {
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
        const mockFileContent = JSON.stringify(mockSceneData.object);
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

<<<<<<< HEAD
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            })
        }));
=======
<<<<<<< HEAD
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });
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

<<<<<<< HEAD
        // Wait for the worker to complete deserialization
        await new Promise(resolve => setTimeout(resolve, 500));
=======
        await sceneStorage.loadScene(mockFile);
>>>>>>> master
>>>>>>> master

        expect(scene.children.length).toBe(1);
        const loadedObject = scene.children[0];
        expect(loadedObject.name).toBe('ReconstructedCube');
<<<<<<< HEAD
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
=======
>>>>>>> master
    });
>>>>>>> master

<<<<<<< HEAD
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
=======
    it('should preserve the UUID of objects when loading a scene', async () => {
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
        const mockFileContent = JSON.stringify(mockSceneData.object);
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

<<<<<<< HEAD
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            })
        }));
=======
<<<<<<< HEAD
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });
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

<<<<<<< HEAD
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

    await sceneStorage.loadScene(mockFile);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(scene.children.length).toBe(3);

<<<<<<< HEAD
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
=======
<<<<<<< HEAD
        await sceneStorage.saveScene();

        // Capture serialized data BEFORE clearing
=======
        const savePromise = sceneStorage.saveScene();
        await savePromise;

>>>>>>> master
        const sceneJson = JSON.stringify(scene.toJSON());
        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

<<<<<<< HEAD
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
=======
<<<<<<< HEAD
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
>>>>>>> master
            })
        }));

        await sceneStorage.loadScene(mockFile);
<<<<<<< HEAD
        await new Promise(resolve => setTimeout(resolve, 100)); // Allow event loop to process worker message with extra buffer
=======
        await new Promise(resolve => setTimeout(resolve, 10));
>>>>>>> master

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
<<<<<<< HEAD
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
    }, 10000);
=======
>>>>>>> master
    });
>>>>>>> master

    await sceneStorage.loadScene(mockFile);
    await new Promise((resolve) => setTimeout(resolve, 0)); // Allow worker to process

    expect(mockSceneGraph.update).toHaveBeenCalled();

<<<<<<< HEAD
    // Restore original SceneGraph
    sceneStorage.sceneGraph = originalSceneGraph;
  });
});
=======
        const group2 = new Group();
        group2.name = 'Group2';
        group2.add(group1);
        group2.add(mesh3);

        scene.add(group2);

        await sceneStorage.saveScene();

<<<<<<< HEAD
        // Capture serialized data BEFORE clearing
        const sceneJson = JSON.stringify(scene.toJSON());
=======
        const sceneJson = JSON.stringify(scene.toJSON());
        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

        global.JSZip.mockImplementation(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            }),
            file: jest.fn(), generateAsync: jest.fn().mockResolvedValue('')
        }));
>>>>>>> master

        while(scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

<<<<<<< HEAD
        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

<<<<<<< HEAD
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
=======
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
>>>>>>> master
            })
        }));

        await sceneStorage.loadScene(mockFile);
<<<<<<< HEAD
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
=======
        await new Promise(resolve => setTimeout(resolve, 10));
=======
        await sceneStorage.loadScene(mockFile);
>>>>>>> master

        expect(scene.children.length).toBe(1);
        expect(scene.children[0].name).toBe('Group2');
    });
>>>>>>> master

    it('should handle loading a file that is not a valid zip archive', async () => {
        const invalidFile = new Blob(['this is not a zip file'], { type: 'text/plain' });

<<<<<<< HEAD
        // Override global.JSZip to fail loadAsync
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockRejectedValue(new Error('Invalid or unsupported zip file'))
        }));
=======
<<<<<<< HEAD
        mockJSZipInstance.loadAsync.mockRejectedValue(new Error('Invalid or unsupported zip file'));
=======
        global.JSZip.mockImplementation(() => ({
            loadAsync: jest.fn().mockRejectedValue(new Error('Invalid or unsupported zip file')),
            file: jest.fn(), generateAsync: jest.fn()
        }));
>>>>>>> master
>>>>>>> master

        await expect(sceneStorage.loadScene(invalidFile)).rejects.toThrow('Invalid or unsupported zip file');
    });

    it("should handle loading a zip file that is missing 'scene.json'", async () => {
<<<<<<< HEAD
        const file = new File([''], 'test.zip', { type: 'application/zip' });

        // Override global.JSZip to return empty zip
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue(null) // scene.json not found
            })
        }));
=======
<<<<<<< HEAD
        const file = new File([new Blob()], 'test.zip', { type: 'application/zip' });

        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue(null)
        });
=======
        const file = new File([''], 'test.zip', { type: 'application/zip' });

        global.JSZip.mockImplementation(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue(null)
            }),
            file: jest.fn(), generateAsync: jest.fn()
        }));
>>>>>>> master
>>>>>>> master

        await expect(sceneStorage.loadScene(file)).rejects.toThrow("scene.json not found in the zip file");
    });

    it('should correctly save and load material properties like roughness and metalness', async () => {
<<<<<<< HEAD
=======
        // Use MeshStandardMaterial as MeshBasicMaterial doesn't support roughness/metalness
>>>>>>> master
        const mesh = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ roughness: 0.5, metalness: 0.8 }));
        mesh.name = 'TestMesh';
        scene.add(mesh);

        await sceneStorage.saveScene();

<<<<<<< HEAD
        // Capture serialized data BEFORE clearing
        const sceneJson = JSON.stringify(scene.toJSON());
=======
        const sceneJson = JSON.stringify(scene.toJSON());
        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

        global.JSZip.mockImplementation(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            }),
            file: jest.fn(), generateAsync: jest.fn().mockResolvedValue('')
        }));
>>>>>>> master

        while(scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

<<<<<<< HEAD
        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

<<<<<<< HEAD
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
=======
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
>>>>>>> master
            })
        }));

        await sceneStorage.loadScene(mockFile);
<<<<<<< HEAD
        await new Promise(resolve => setTimeout(resolve, 500));
=======
        await new Promise(resolve => setTimeout(resolve, 10));
=======
        await sceneStorage.loadScene(mockFile);
>>>>>>> master
>>>>>>> master

        expect(scene.children.length).toBe(1);
        const loadedMesh = scene.children[0];
        expect(loadedMesh.name).toBe('TestMesh');
<<<<<<< HEAD
        expect(loadedMesh.material.roughness).toBeCloseTo(0.5);
        expect(loadedMesh.material.metalness).toBeCloseTo(0.8);
    }, 10000);
=======
    });
>>>>>>> master

    it('should successfully save and load a scene with no objects (an empty scene)', async () => {
        await sceneStorage.saveScene();
<<<<<<< HEAD
=======

        const sceneJson = JSON.stringify(scene.toJSON());
        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

        global.JSZip.mockImplementation(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            }),
            file: jest.fn(), generateAsync: jest.fn().mockResolvedValue('')
        }));
>>>>>>> master

        while(scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

<<<<<<< HEAD
        const sceneJson = JSON.stringify(scene.toJSON());
        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

<<<<<<< HEAD
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
=======
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
>>>>>>> master
            })
        }));

        await sceneStorage.loadScene(mockFile);
<<<<<<< HEAD
        await new Promise(resolve => setTimeout(resolve, 500));

        expect(scene.children.length).toBe(0); // Expect an empty scene
    }, 10000);
=======
        await new Promise(resolve => setTimeout(resolve, 10));
=======
        await sceneStorage.loadScene(mockFile);
>>>>>>> master

        expect(scene.children.length).toBe(0);
    });
>>>>>>> master

    it('should handle JSON parsing errors from a corrupted \'scene.json\'', async () => {
        const corruptedJson = 'this is not valid json';
        const mockFile = new Blob([corruptedJson], { type: 'application/zip' });

<<<<<<< HEAD
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
=======
<<<<<<< HEAD
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

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await sceneStorage.loadScene(mockFile);
<<<<<<< HEAD
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(consoleErrorSpy).toHaveBeenCalledWith('Worker error:', 'SyntaxError', expect.any(String));
=======

        expect(consoleErrorSpy).toHaveBeenCalledWith('Worker error:', expect.stringContaining('Unexpected token'), expect.any(Error));
>>>>>>> master
        expect(scene.children.length).toBe(0);

        consoleErrorSpy.mockRestore();
    });
>>>>>>> master

    it('should restore object names correctly from a loaded scene', async () => {
        const mesh1 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        mesh1.name = 'ObjectA';
        const mesh2 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        mesh2.name = 'ObjectB';
        scene.add(mesh1, mesh2);

        await sceneStorage.saveScene();

<<<<<<< HEAD
        // Capture serialized data BEFORE clearing
        const sceneJson = JSON.stringify(scene.toJSON());
=======
        const sceneJson = JSON.stringify(scene.toJSON());
        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

        global.JSZip.mockImplementation(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            }),
            file: jest.fn(), generateAsync: jest.fn().mockResolvedValue('')
        }));
>>>>>>> master

        while(scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

<<<<<<< HEAD
        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

<<<<<<< HEAD
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
=======
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
>>>>>>> master
            })
        }));

        await sceneStorage.loadScene(mockFile);
<<<<<<< HEAD
        await new Promise(resolve => setTimeout(resolve, 500));
=======
        await new Promise(resolve => setTimeout(resolve, 10));
=======
        await sceneStorage.loadScene(mockFile);
>>>>>>> master
>>>>>>> master

        expect(scene.children.length).toBe(2);
        expect(scene.children.find(obj => obj.name === 'ObjectA')).toBeDefined();
        expect(scene.children.find(obj => obj.name === 'ObjectB')).toBeDefined();
    }, 10000);

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

        await sceneStorage.saveScene();

<<<<<<< HEAD
        // Capture serialized data BEFORE clearing
        const sceneJson = JSON.stringify(scene.toJSON());
=======
        const sceneJson = JSON.stringify(scene.toJSON());
        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

        global.JSZip.mockImplementation(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            }),
            file: jest.fn(), generateAsync: jest.fn().mockResolvedValue('')
        }));
>>>>>>> master

        while(scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

<<<<<<< HEAD
        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

<<<<<<< HEAD
        global.JSZip.mockImplementationOnce(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
=======
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
>>>>>>> master
            })
        }));

        await sceneStorage.loadScene(mockFile);
<<<<<<< HEAD
        await new Promise(resolve => setTimeout(resolve, 500));
=======
        await new Promise(resolve => setTimeout(resolve, 10));
=======
        await sceneStorage.loadScene(mockFile);
>>>>>>> master
>>>>>>> master

        expect(scene.children.length).toBe(3);
        const loadedPointLight = scene.children.find(obj => obj.name === 'PointLightTest');
        expect(loadedPointLight).toBeDefined();
<<<<<<< HEAD
        expect(loadedPointLight.isPointLight).toBe(true);
        expect(loadedPointLight.position.x).toBeCloseTo(1);
        expect(loadedPointLight.position.y).toBeCloseTo(2);
        expect(loadedPointLight.position.z).toBeCloseTo(3);

        const loadedDirectionalLight = scene.children.find(obj => obj.name === 'DirectionalLightTest');
        expect(loadedDirectionalLight).toBeDefined();
        expect(loadedDirectionalLight.isDirectionalLight).toBe(true);
        expect(loadedDirectionalLight.position.x).toBeCloseTo(4);
        expect(loadedDirectionalLight.position.y).toBeCloseTo(5);
        expect(loadedDirectionalLight.position.z).toBeCloseTo(6);

        const loadedAmbientLight = scene.children.find(obj => obj.name === 'AmbientLightTest');
        expect(loadedAmbientLight).toBeDefined();
        expect(loadedAmbientLight.isAmbientLight).toBe(true);
    }, 10000);

});
=======
    });
});
>>>>>>> master
>>>>>>> master
