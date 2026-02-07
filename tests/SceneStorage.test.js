import * as THREE from 'three';
import { Scene, Mesh, BoxGeometry, MeshBasicMaterial, MeshStandardMaterial, PointLight, DirectionalLight, Group, AmbientLight } from 'three';
import { SceneStorage } from '../src/frontend/SceneStorage.js';
import JSZip from 'jszip';
import { PrimitiveFactory } from '../src/frontend/PrimitiveFactory.js';
import { EventBus } from '../src/frontend/EventBus.js';
import { ObjectManager } from '../src/frontend/ObjectManager.js';
import log from '../src/frontend/logger.js';

jest.mock('../src/frontend/logger.js', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    setLevel: jest.fn(),
    default: { error: jest.fn() }
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

    postMessage(message) {
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
    }
}

global.Worker = MockWorker;

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

        expect(URL.createObjectURL).toHaveBeenCalled();
        expect(URL.revokeObjectURL).toHaveBeenCalled();
    });

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

        const mockFile = new Blob(['zipcontent'], { type: 'application/zip' });
        await sceneStorage.loadScene(mockFile);

        // Wait for worker
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(scene.children.length).toBe(1);
        const loadedObject = scene.children[0];
        expect(loadedObject.name).toBe('LoadedCube');
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

        const buffer = new Float32Array([1, 2, 3]).buffer;

        const mockZip = {
            file: jest.fn((name) => {
                if (name === 'scene.json') return { async: jest.fn().mockResolvedValue(JSON.stringify(mockSceneData)) };
                if (name === 'buffers.json') return { async: jest.fn().mockResolvedValue('[0]') }; // map index 0 -> buffer 0
                if (name === 'buffers/bin_0.bin') return { async: jest.fn().mockResolvedValue(buffer) };
                return null;
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

        // This means the resulting object will have { __type: ... } in the geometry array.
        // ObjectLoader might fail or produce a weird result.
        // To test buffer reconstruction, we must implement it in the MockWorker or use a real worker (hard in jest).

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
