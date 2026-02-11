import * as THREE from 'three';
import './__mocks__/three-dat.gui.js';
import { SceneStorage } from '../src/frontend/SceneStorage.js';
import EventBus from '../src/frontend/EventBus.js';

// Mock Worker
class MockWorker {
    constructor() {
        this.onmessage = null;
        this.postMessage = jest.fn((message) => {
            if (message.type === 'serialize') {
                // Simulate serialization
                this.onmessage({ data: { type: 'serialize_complete', data: message.data } });
            } else if (message.type === 'deserialize') {
                // Simulate deserialization
                this.onmessage({ data: { type: 'deserialize_complete', data: message.data } });
            }
        });
        this.terminate = jest.fn();
    }
}
global.Worker = MockWorker;

// Mock JSZip
class MockJSZip {
    constructor() {
        this.file = jest.fn().mockReturnThis();
        this.generateAsync = jest.fn().mockResolvedValue(new Blob());
    }
    static loadAsync = jest.fn().mockResolvedValue({
        file: jest.fn().mockReturnValue({
            async: jest.fn().mockResolvedValue('{"object":{"children":[]}}')
        })
    });
}
global.JSZip = MockJSZip;

describe('SceneStorage', () => {
    let scene;
    let sceneStorage;

    beforeEach(() => {
        scene = new THREE.Scene();
        sceneStorage = new SceneStorage(scene, EventBus);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should initialize correctly', () => {
        expect(sceneStorage).toBeDefined();
        expect(sceneStorage.worker).toBeDefined();
    });

    it('should save the scene', async () => {
        const publishSpy = jest.spyOn(EventBus, 'publish');
        const savePromise = sceneStorage.saveScene();
        
        await savePromise;
        
        expect(publishSpy).toHaveBeenCalledWith('scene_saved', expect.any(Object));
    });

    it('should load the scene', async () => {
        const mockFile = new Blob(['mock data'], { type: 'application/zip' });
        const publishSpy = jest.spyOn(EventBus, 'publish');
        
        await sceneStorage.loadScene(mockFile);
        
        expect(publishSpy).toHaveBeenCalledWith('scene_loaded');
    });
});
