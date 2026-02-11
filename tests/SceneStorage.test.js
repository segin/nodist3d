import * as THREE from 'three';
import { SceneStorage } from '../src/frontend/SceneStorage.js';
import JSZip from 'jszip';
import { PrimitiveFactory } from '../src/frontend/PrimitiveFactory.js';
import EventBus from '../src/frontend/EventBus.js';
import { ObjectManager } from '../src/frontend/ObjectManager.js';

// Mock Worker
class MockWorker {
    constructor() {
        this.onmessage = null;
        this.listeners = {};
    }

    addEventListener(type, listener) {
        if (!this.listeners[type]) this.listeners[type] = [];
        this.listeners[type].push(listener);
    }

    removeEventListener(type, listener) {
        if (this.listeners[type]) {
            this.listeners[type] = this.listeners[type].filter(l => l !== listener);
        }
    }

    postMessage(msg) {
        if (msg.type === 'serialize') {
            // Simulate serialization success
            // In real app, worker returns { data: jsonString, buffers: array }
            // We mock this
            setTimeout(() => {
                const response = {
                    type: 'serialize_complete',
                    data: {
                        data: JSON.stringify(msg.data),
                        buffers: [] // Mock empty buffers for simplicity in this test
                    }
                };
                if (this.onmessage) this.onmessage({ data: response });
                if (this.listeners['message']) this.listeners['message'].forEach(l => l({ data: response }));
            }, 0);
        } else if (msg.type === 'deserialize') {
            setTimeout(() => {
                const response = {
                    type: 'deserialize_complete',
                    data: JSON.parse(msg.data)
                };
                if (this.onmessage) this.onmessage({ data: response });
                if (this.listeners['message']) this.listeners['message'].forEach(l => l({ data: response }));
            }, 0);
        }
    }
}
global.Worker = MockWorker;

// Mock URL
global.URL.createObjectURL = jest.fn(() => 'blob:url');
global.URL.revokeObjectURL = jest.fn();

// Mock JSZip
jest.mock('jszip', () => {
    return jest.fn().mockImplementation(() => ({
        file: jest.fn(),
        generateAsync: jest.fn().mockResolvedValue(new Blob(['zip'], { type: 'application/zip' })),
        loadAsync: jest.fn().mockResolvedValue({
            file: jest.fn((name) => {
                if (name === 'scene.json') return { async: jest.fn().mockResolvedValue('{}') };
                if (name === 'buffers.json') return { async: jest.fn().mockResolvedValue('[]') };
                return null;
            })
        })
    }));
});

describe('SceneStorage', () => {
    let scene;
    let sceneStorage;
    let eventBus;

    beforeEach(() => {
        scene = new THREE.Scene();
        eventBus = EventBus;
        sceneStorage = new SceneStorage(scene, eventBus);
        // Ensure we are using the mock worker logic
        // sceneStorage.worker is already our MockWorker because global.Worker is mocked
    });

    it('should save a scene', async () => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        mesh.name = 'TestMesh';
        scene.add(mesh);

        await sceneStorage.saveScene();

        expect(URL.createObjectURL).toHaveBeenCalled();
        // Verify JSZip usage
        const zipInstance = JSZip.mock.instances[0];
        expect(zipInstance.file).toHaveBeenCalledWith('scene.json', expect.any(String));
        expect(zipInstance.file).toHaveBeenCalledWith('buffers.json', expect.any(String));
    });

    it('should load a scene', async () => {
        const file = new Blob(['zip'], { type: 'application/zip' });

        // Mock JSZip loadAsync for this specific test to return valid scene data
        const sceneData = {
            metadata: { version: 4.5, type: 'Scene' },
            object: {
                type: 'Scene',
                children: [
                    { type: 'Mesh', name: 'LoadedMesh', geometry: { type: 'BoxGeometry' } }
                ]
            }
        };

        const mockZip = {
            file: jest.fn((name) => {
                if (name === 'scene.json') return { async: jest.fn().mockResolvedValue(JSON.stringify(sceneData)) };
                if (name === 'buffers.json') return { async: jest.fn().mockResolvedValue('[]') };
                return null;
            })
        };

        // Reset the mock to return our specific zip
        JSZip.mockImplementation(() => ({
            loadAsync: jest.fn().mockResolvedValue(mockZip)
        }));

        const loadedScene = await sceneStorage.loadScene(file);

        expect(loadedScene).toBeDefined();
        expect(loadedScene.children.length).toBe(1);
        expect(loadedScene.children[0].name).toBe('LoadedMesh');
    });
});
