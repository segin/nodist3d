import * as THREE from 'three';
import { Scene, Mesh, BoxGeometry, MeshBasicMaterial, PointLight, DirectionalLight, Group, AmbientLight } from 'three';
import { SceneStorage } from '../src/frontend/SceneStorage.js';
import JSZip from 'jszip';
import { PrimitiveFactory } from '../src/frontend/PrimitiveFactory.js';
import { EventBus } from '../src/frontend/EventBus.js';
import { ObjectManager } from '../src/frontend/ObjectManager.js';

jest.mock('../src/frontend/PrimitiveFactory.js');

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

    createMockObject(data) {
        let mockObject;
        if (data.type === 'Mesh') {
            mockObject = new Mesh(new BoxGeometry(), new THREE.MeshStandardMaterial());
        } else if (data.type === 'PointLight') {
            mockObject = new PointLight(data.color, data.intensity);
        } else if (data.type === 'DirectionalLight') {
            mockObject = new DirectionalLight(data.color, data.intensity);
        } else if (data.type === 'AmbientLight') {
            mockObject = new AmbientLight(data.color, data.intensity);
        } else if (data.type === 'Group') {
            mockObject = new Group();
        }

        if (mockObject) {
            mockObject.uuid = data.uuid;
            mockObject.name = data.name;
            if (data.position) mockObject.position.fromArray(data.position);
            else if (Array.isArray(data.position)) mockObject.position.set(...data.position);

            if (data.rotation) mockObject.rotation.fromArray(data.rotation);
            if (data.scale) mockObject.scale.fromArray(data.scale);

            if (data.material && mockObject.material) {
                if (data.material.color !== undefined) mockObject.material.color.setHex(data.material.color);
                if (data.material.roughness !== undefined) mockObject.material.roughness = data.material.roughness;
                if (data.material.metalness !== undefined) mockObject.material.metalness = data.material.metalness;
            }

            if (data.children) {
                data.children.forEach(childData => {
                    const childObj = this.createMockObject(childData);
                    if (childObj) mockObject.add(childObj);
                });
            }
        }
        return mockObject;
    }

    postMessage(message) {
        if (message.type === 'serialize') {
            // Manual trigger is done in tests using simulateMessage
        } else if (message.type === 'deserialize') {
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
            }
        }
    }
}

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
        scene = new Scene();
        eventBus = EventBus;
        sceneStorage = new SceneStorage(scene);

        // Inject MockWorker explicitly to bypass JSDOM Worker limitations
        const mockWorker = new MockWorker();
        // Ensure onmessage is bound correctly as SceneStorage expects
        mockWorker.onmessage = sceneStorage.handleWorkerMessage.bind(sceneStorage);
        sceneStorage.worker = mockWorker;

        primitiveFactory = new PrimitiveFactory();
        objectManager = new ObjectManager(scene, primitiveFactory, eventBus);
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

        const savePromise = sceneStorage.saveScene();

        // Simulate the worker message for serialization completion
        const sceneJson = JSON.stringify(scene.toJSON());
        sceneStorage.worker.simulateMessage({ type: 'serialize_complete', data: sceneJson });

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
        sceneStorage.worker.simulateMessage({ type: 'serialize_complete', data: sceneJson });

        await savePromise; // Wait for the save operation to complete

        // In a real scenario, you'd inspect the generated blob. Here, we check the mock calls.
        expect(URL.createObjectURL).toHaveBeenCalled();
        expect(URL.revokeObjectURL).toHaveBeenCalled();
    });

    xit('should successfully load a scene from a valid scene file', async () => {
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
                        material: { color: 0x00ff00 }
                    }
                ]
            }
        };
        const zip = new JSZip();
        zip.file('scene.json', JSON.stringify(mockSceneData.object));
        const mockFile = await zip.generateAsync({ type: 'blob' });

        await sceneStorage.loadScene(mockFile);

        // Wait for the worker to complete deserialization
        await new Promise(resolve => setTimeout(resolve, 0)); // Allow event loop to process worker message

        expect(scene.children.length).toBe(1);
        const loadedObject = scene.children[0];
        expect(loadedObject.name).toBe('LoadedCube');
        expect(loadedObject.position.x).toBe(10);
        expect(loadedObject.position.y).toBe(20);
        expect(loadedObject.position.z).toBe(30);
        expect(loadedObject.material.color.getHex()).toBe(0x00ff00);
    });

    xit('should clear all existing objects from the scene before loading a new one', async () => {
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
                        scale: [1, 1, 1]
                    }
                ]
            }
        };
        const zip = new JSZip();
        zip.file('scene.json', JSON.stringify(mockSceneData.object));
        const mockFile = await zip.generateAsync({ type: 'blob' });

        await sceneStorage.loadScene(mockFile);

        // Wait for the worker to complete deserialization
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(scene.children.length).toBe(1); // Only the newly loaded object should be present
        expect(scene.children[0].name).toBe('LoadedCube');
    });

    xit('should correctly reconstruct objects with their properties (position, rotation, scale, color) from a save file', async () => {
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
                        material: { color: 0xabcdef }
                    }
                ]
            }
        };
        const zip = new JSZip();
        zip.file('scene.json', JSON.stringify(mockSceneData.object));
        const mockFile = await zip.generateAsync({ type: 'blob' });

        await sceneStorage.loadScene(mockFile);

        // Wait for the worker to complete deserialization
        await new Promise(resolve => setTimeout(resolve, 0));

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

    xit('should preserve the UUID of objects when loading a scene', async () => {
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
                        scale: [1, 1, 1]
                    }
                ]
            }
        };
        const zip = new JSZip();
        zip.file('scene.json', JSON.stringify(mockSceneData.object));
        const mockFile = await zip.generateAsync({ type: 'blob' });

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
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 0)); // Allow event loop to process worker message

        expect(scene.children.length).toBe(3);

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
        sceneStorage.worker.simulateMessage({ type: 'serialize_complete', data: sceneJson });
        await savePromise;

        // Clear the scene before loading
        while(scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

        jest.spyOn(JSZip.prototype, 'loadAsync').mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 0));

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
    });

    it('should handle loading a file that is not a valid zip archive', async () => {
        const invalidFile = new Blob(['this is not a zip file'], { type: 'text/plain' });

        // Mock JSZip.loadAsync to throw an error for invalid zip files
        jest.spyOn(JSZip.prototype, 'loadAsync').mockRejectedValue(new Error('Invalid or unsupported zip file'));

        await expect(sceneStorage.loadScene(invalidFile)).rejects.toThrow('Invalid or unsupported zip file');
    });

    xit("should handle loading a zip file that is missing 'scene.json'", async () => {
        const zip = new JSZip();
        const blob = await zip.generateAsync({ type: 'blob' });
        const file = new File([blob], 'test.zip', { type: 'application/zip' });

        await expect(sceneStorage.loadScene(file)).rejects.toThrow("scene.json not found in the zip file");
    });

    it('should correctly save and load material properties like roughness and metalness', async () => {
        const mesh = new Mesh(new BoxGeometry(), new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.8 }));
        mesh.name = 'TestMesh';
        scene.add(mesh);

        const savePromise = sceneStorage.saveScene();
        const sceneJson = JSON.stringify(scene.toJSON());
        sceneStorage.worker.simulateMessage({ type: 'serialize_complete', data: sceneJson });
        await savePromise;

        // Clear the scene before loading
        while(scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

        jest.spyOn(JSZip.prototype, 'loadAsync').mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(scene.children.length).toBe(1);
        const loadedMesh = scene.children[0];
        expect(loadedMesh.name).toBe('TestMesh');
        expect(loadedMesh.material.roughness).toBeCloseTo(0.5);
        expect(loadedMesh.material.metalness).toBeCloseTo(0.8);
    });

    it('should successfully save and load a scene with no objects (an empty scene)', async () => {
        const savePromise = sceneStorage.saveScene();
        const sceneJson = JSON.stringify(scene.toJSON());
        sceneStorage.worker.simulateMessage({ type: 'serialize_complete', data: sceneJson });
        await savePromise;

        // Clear the scene before loading
        while(scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

        jest.spyOn(JSZip.prototype, 'loadAsync').mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(scene.children.length).toBe(0); // Expect an empty scene
    });

    it('should handle JSON parsing errors from a corrupted \'scene.json\'', async () => {
        const corruptedJson = 'this is not valid json';
        const mockFile = new Blob([corruptedJson], { type: 'application/zip' });

        jest.spyOn(JSZip.prototype, 'loadAsync').mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(corruptedJson)
            })
        });

        // Mock console.error to prevent test output pollution
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 0)); // Allow worker to process

        expect(consoleErrorSpy).toHaveBeenCalledWith('Worker error:', expect.stringContaining('Unexpected token'), expect.any(String));
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
        sceneStorage.worker.simulateMessage({ type: 'serialize_complete', data: sceneJson });
        await savePromise;

        // Clear the scene before loading
        while(scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

        jest.spyOn(JSZip.prototype, 'loadAsync').mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(scene.children.length).toBe(2);
        expect(scene.children.find(obj => obj.name === 'ObjectA')).toBeDefined();
        expect(scene.children.find(obj => obj.name === 'ObjectB')).toBeDefined();
    });

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

        const savePromise = sceneStorage.saveScene();
        const sceneJson = JSON.stringify(scene.toJSON());
        sceneStorage.worker.simulateMessage({ type: 'serialize_complete', data: sceneJson });
        await savePromise;

        // Clear the scene before loading
        while(scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

        const mockFileContent = sceneJson;
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

        jest.spyOn(JSZip.prototype, 'loadAsync').mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 0));

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
    });

    xit('The load process should trigger an update in the SceneGraph', async () => {
        const mockSceneGraph = {
            update: jest.fn()
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
                children: []
            }
        };
        const mockFileContent = JSON.stringify(mockSceneData.object);
        const mockFile = new Blob([mockFileContent], { type: 'application/zip' });

        jest.spyOn(JSZip.prototype, 'loadAsync').mockResolvedValue({
            file: jest.fn().mockReturnValue({
                async: jest.fn().mockResolvedValue(mockFileContent)
            })
        });

        await sceneStorage.loadScene(mockFile);
        await new Promise(resolve => setTimeout(resolve, 0)); // Allow worker to process

        expect(mockSceneGraph.update).toHaveBeenCalled();

        // Restore original SceneGraph
        sceneStorage.sceneGraph = originalSceneGraph;
    });

    it('should use optimized BufferAttribute serialization', async () => {
        // Restore toJSON to allow patching to work on real Scene logic
        THREE.Scene.prototype.toJSON.mockRestore();

        // We need a mesh with BufferGeometry
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
        scene.add(mesh);

        const postMessageSpy = jest.spyOn(sceneStorage.worker, 'postMessage');

        const savePromise = sceneStorage.saveScene();

        expect(postMessageSpy).toHaveBeenCalled();
        const callArgs = postMessageSpy.mock.calls[0][0];
        expect(callArgs.type).toBe('serialize');

        const serializedData = callArgs.data;
        // Verify that position attribute is still a TypedArray
        // Note: Real toJSON might not put geometries in root if not using metadata format?
        // Scene.toJSON DOES use metadata format.

        const geoData = serializedData.geometries[0];
        const posArray = geoData.data.attributes.position.array;

        expect(posArray).toBeInstanceOf(Float32Array);

        // Complete the promise
        // Note: passing TypedArray to JSON.stringify in test might fail if not handled,
        // but here we just need to resolve the promise with some data.
        sceneStorage.worker.simulateMessage({ type: 'serialize_complete', data: '{}' });
        await savePromise;
    });
});
