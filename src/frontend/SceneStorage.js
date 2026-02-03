// JSZip will be loaded globally from CDN
import * as THREE from 'three';
import log from './logger.js';

export class SceneStorage {
    constructor(scene, eventBus) {
        this.eventBus = eventBus;
        this.scene = scene;
        this.worker = new Worker('./worker.js');
        this.worker.onmessage = this.handleWorkerMessage.bind(this);
        this.loadPromiseResolve = null;
    }

    async saveScene() {
        const zip = new window.JSZip();
        
        // Optimization: Patch BufferAttribute.toJSON to return TypedArrays directly
        // This avoids converting large geometry data to normal Arrays on the main thread
        const originalToJSON = THREE.BufferAttribute.prototype.toJSON;
        THREE.BufferAttribute.prototype.toJSON = function() {
            return {
                itemSize: this.itemSize,
                type: this.array.constructor.name,
                array: this.array,
                normalized: this.normalized
            };
        };

        let sceneData;
        try {
            sceneData = this.scene.toJSON();
        } finally {
            THREE.BufferAttribute.prototype.toJSON = originalToJSON;
        }

        // Serialize the scene using the worker
        const sceneJson = await new Promise((resolve, reject) => {
            const handleMessage = (event) => {
                if (event.data.type === 'serialize_complete') {
                    this.worker.removeEventListener('message', handleMessage);
                    resolve(event.data.data);
                } else if (event.data.type === 'error') {
                    this.worker.removeEventListener('message', handleMessage);
                    reject(new Error(event.data.message + ': ' + event.data.error));
                }
            };

            this.worker.addEventListener('message', handleMessage);
            this.worker.postMessage({ type: 'serialize', data: sceneData });
        });

        zip.file('scene.json', sceneJson);

        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'scene.nodist3d';
        a.click();
        URL.revokeObjectURL(url);
    }

    async loadScene(file) {
        try {
            const zip = new window.JSZip();
            const loadedZip = await zip.loadAsync(file);
            const sceneJsonFile = loadedZip.file('scene.json');
            if (!sceneJsonFile) {
                throw new Error('scene.json not found in the zip file.');
            }
            const sceneJson = await sceneJsonFile.async('string');

            // Clear existing objects from the scene
            while(this.scene.children.length > 0){
                const object = this.scene.children[0];
                this.scene.remove(object);
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            }

            // Deserialize the scene using the worker
            return new Promise((resolve, reject) => {
                this.loadPromiseResolve = resolve; // Store resolve function for async worker response
                this.worker.postMessage({ type: 'deserialize', data: sceneJson });
                this.worker.onerror = (error) => reject(new Error('Worker error during deserialization: ' + error.message));
            });
        } catch (error) {
            log.error("Error loading scene:", error);
            return Promise.reject(error);
        }
    }

    handleWorkerMessage(event) {
        if (event.data.type === 'deserialize_complete') {
            const loadedScene = event.data.data;
            // Add loaded objects back to the scene
            loadedScene.children.forEach(object => {
                this.scene.add(object);
            });
            if (this.loadPromiseResolve) {
                this.loadPromiseResolve(loadedScene);
                this.loadPromiseResolve = null;
            }
        } else if (event.data.type === 'error') {
            log.error('Worker error:', event.data.message, event.data.error);
            if (this.loadPromiseResolve) {
                this.loadPromiseResolve(null); // Resolve with null or reject the promise
                this.loadPromiseResolve = null;
            }
        }
    }
}
