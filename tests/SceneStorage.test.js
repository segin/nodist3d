import * as THREE from 'three';
import { Scene, Mesh, BoxGeometry, MeshBasicMaterial, MeshStandardMaterial, PointLight, DirectionalLight, Group, AmbientLight } from 'three';
import { SceneStorage } from '../src/frontend/SceneStorage.js';
import JSZip from 'jszip';
import { PrimitiveFactory } from '../src/frontend/PrimitiveFactory.js';
import EventBus from '../src/frontend/EventBus.js';
import { ObjectManager } from '../src/frontend/ObjectManager.js';
import log from '../src/frontend/logger.js';

jest.mock('three');
jest.mock('../src/frontend/logger.js', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    setLevel: jest.fn(),
}));

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

// Mock the worker for testing purposes
class MockWorker {
    constructor() {
        this.onmessage = null;
        this.onerror = null;
        this.listeners = {};
    }

    addEventListener(type, listener) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(listener);
    }

    removeEventListener(type, listener) {
        if (this.listeners[type]) {
            this.listeners[type] = this.listeners[type].filter(l => l !== listener);
        }
    }

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
            }
        }
    }
}

global.Worker = MockWorker;

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL = {
  createObjectURL: jest.fn(() => 'blob:mockurl'),
  revokeObjectURL: jest.fn(),
};

jest.setTimeout(30000); // Increase timeout for all tests

describe('SceneStorage', () => {
    let scene;
    let sceneStorage;
    let objectManager;
    let primitiveFactory;
    let eventBus;
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
