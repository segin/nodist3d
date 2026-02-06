import * as THREE from 'three';
import { Scene, Mesh, BoxGeometry, MeshBasicMaterial, MeshStandardMaterial, PointLight, DirectionalLight, Group, AmbientLight } from 'three';
import { SceneStorage } from '../src/frontend/SceneStorage.js';
import JSZip from 'jszip';
import { PrimitiveFactory } from '../src/frontend/PrimitiveFactory.js';
import { EventBus } from '../src/frontend/EventBus.js';
import { ObjectManager } from '../src/frontend/ObjectManager.js';

jest.mock('../src/frontend/ObjectManager.js', () => {
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
// Mock the worker for testing purposes
class MockWorker {
    constructor() {
        this.onmessage = null;
        this.onerror = null;
    }

    postMessage(message) {
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
    }
}

>>>>>>> master
// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL = {
    createObjectURL: jest.fn(() => 'blob:mockurl'),
    revokeObjectURL: jest.fn(),
};

describe('SceneStorage', () => {
    let scene;
    let sceneStorage;
    let objectManager;
    let primitiveFactory;
    let eventBus;
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
        scene = new Scene();
        eventBus = EventBus;

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

    it('should correctly serialize scene data into the expected JSON format', async () => {
        const cube = objectManager.addPrimitive('Box');
        cube.name = 'TestCube';
        cube.position.set(1, 2, 3);
        cube.rotation.set(0.1, 0.2, 0.3);
        cube.scale.set(0.5, 0.5, 0.5);
        objectManager.updateMaterial(cube, { color: 0xff0000 });

<<<<<<< HEAD
        await sceneStorage.saveScene();
=======
        const savePromise = sceneStorage.saveScene();
        await savePromise;
>>>>>>> master

        expect(URL.createObjectURL).toHaveBeenCalled();
        expect(URL.revokeObjectURL).toHaveBeenCalled();
    });

    it('should ignore non-mesh objects when saving a scene', async () => {
        const cube = objectManager.addPrimitive('Box');
        const light = new THREE.PointLight(0xffffff, 1);
        scene.add(light);

<<<<<<< HEAD
        await sceneStorage.saveScene();
=======
        const savePromise = sceneStorage.saveScene();
        await savePromise;
>>>>>>> master

        expect(URL.createObjectURL).toHaveBeenCalled();
        expect(URL.revokeObjectURL).toHaveBeenCalled();
    });

    it('should successfully load a scene from a valid scene file', async () => {
        const initialCube = objectManager.addPrimitive('Box');
        initialCube.name = 'InitialCube';

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
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });

        await sceneStorage.loadScene(mockFile);

        // Wait for next tick to ensure worker callback runs
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

        await sceneStorage.loadScene(mockFile);

>>>>>>> master
        expect(scene.children.length).toBe(1);
        const loadedObject = scene.children[0];
        expect(loadedObject.name).toBe('LoadedCube');
    });

    it('should clear all existing objects from the scene before loading a new one', async () => {
        const initialCube = objectManager.addPrimitive('Box');
        initialCube.name = 'InitialCube';

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
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });
=======
        global.JSZip.mockImplementation(() => ({
            loadAsync: jest.fn().mockResolvedValue({
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(mockFileContent)
                })
            }),
            file: jest.fn(), generateAsync: jest.fn()
        }));
>>>>>>> master

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(scene.children.length).toBe(1);
        expect(scene.children[0].name).toBe('LoadedCube');
    });

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
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });

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

        await sceneStorage.loadScene(mockFile);
>>>>>>> master

        expect(scene.children.length).toBe(1);
        const loadedObject = scene.children[0];
        expect(loadedObject.name).toBe('ReconstructedCube');
    });

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
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });

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

        await sceneStorage.loadScene(mockFile);
>>>>>>> master

        expect(scene.children.length).toBe(1);
        expect(scene.children[0].uuid).toBe(mockUUID);
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
        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 10));

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

        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 10));
=======
        await sceneStorage.loadScene(mockFile);
>>>>>>> master

        expect(scene.children.length).toBe(1);
        expect(scene.children[0].name).toBe('Group2');
    });

    it('should handle loading a file that is not a valid zip archive', async () => {
        const invalidFile = new Blob(['this is not a zip file'], { type: 'text/plain' });

<<<<<<< HEAD
        mockJSZipInstance.loadAsync.mockRejectedValue(new Error('Invalid or unsupported zip file'));
=======
        global.JSZip.mockImplementation(() => ({
            loadAsync: jest.fn().mockRejectedValue(new Error('Invalid or unsupported zip file')),
            file: jest.fn(), generateAsync: jest.fn()
        }));
>>>>>>> master

        await expect(sceneStorage.loadScene(invalidFile)).rejects.toThrow('Invalid or unsupported zip file');
    });

    it("should handle loading a zip file that is missing 'scene.json'", async () => {
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

        await expect(sceneStorage.loadScene(file)).rejects.toThrow("scene.json not found in the zip file");
    });

    it('should correctly save and load material properties like roughness and metalness', async () => {
        // Use MeshStandardMaterial as MeshBasicMaterial doesn't support roughness/metalness
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

        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 10));
=======
        await sceneStorage.loadScene(mockFile);
>>>>>>> master

        expect(scene.children.length).toBe(1);
        const loadedMesh = scene.children[0];
        expect(loadedMesh.name).toBe('TestMesh');
    });

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

        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 10));
=======
        await sceneStorage.loadScene(mockFile);
>>>>>>> master

        expect(scene.children.length).toBe(0);
    });

    it('should handle JSON parsing errors from a corrupted \'scene.json\'', async () => {
        const corruptedJson = 'this is not valid json';
        const mockFile = new Blob([corruptedJson], { type: 'application/zip' });

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

        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 10));
=======
        await sceneStorage.loadScene(mockFile);
>>>>>>> master

        expect(scene.children.length).toBe(2);
        expect(scene.children.find(obj => obj.name === 'ObjectA')).toBeDefined();
        expect(scene.children.find(obj => obj.name === 'ObjectB')).toBeDefined();
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

        mockJSZipInstance.loadAsync.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 10));
=======
        await sceneStorage.loadScene(mockFile);
>>>>>>> master

        expect(scene.children.length).toBe(3);
        const loadedPointLight = scene.children.find(obj => obj.name === 'PointLightTest');
        expect(loadedPointLight).toBeDefined();
    });
});
