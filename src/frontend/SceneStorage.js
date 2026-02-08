// @ts-check
// JSZip will be loaded globally from CDN
import * as THREE from 'three';
import log from './logger.js';

export class SceneStorage {
<<<<<<< HEAD
    /**
     * @param {THREE.Scene} scene
     * @param {any} eventBus
     */
    constructor(scene, eventBus) {
        this.eventBus = eventBus;
        this.scene = scene;
        this.worker = new Worker('./worker.js');
        this.boundHandleWorkerMessage = this.handleWorkerMessage.bind(this);
        this.worker.onmessage = this.boundHandleWorkerMessage;

        /** @type {((value: any) => void) | null} */
        this.loadPromiseResolve = null;
        /** @type {((value: any) => void) | null} */
        this.savePromiseResolve = null;
        /** @type {((reason?: any) => void) | null} */
        this.savePromiseReject = null;
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
            const originalOnMessage = this.worker.onmessage;

            // We temporarily override onmessage to handle the specific response for this save operation
            // However, since we are using a persistent worker with a shared handler, we should probably
            // just use the shared handler and store the promise callbacks.
            // But the current pattern in the code seemed to want to isolate it or use the shared handler.
            // Let's use the shared handler logic via promise resolvers stored on 'this'.

            this.savePromiseResolve = resolve;
            this.savePromiseReject = reject;

            // Send data to worker. We do NOT transfer buffers because that would detach them
            // from the main thread, breaking the live scene. Structured cloning (default)
            // copies the buffers, which is fast enough and safe.
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

    /**
     * @param {File} file
     */
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
                // Optimization: remove from the end to avoid O(N) shift in splice
                const object = this.scene.children.pop();

                // Manually handle removal to avoid O(N) indexOf search in scene.remove()
                if (object.parent) {
                    object.parent = null;
                    object.dispatchEvent({ type: 'removed' });
                    this.scene.dispatchEvent({ type: 'childremoved', child: object });
                }

                // @ts-ignore
                if (object.geometry) object.geometry.dispose();
                // @ts-ignore
                if (object.material) {
                    // @ts-ignore
                    if (Array.isArray(object.material)) {
                        // @ts-ignore
                        object.material.forEach(material => material.dispose());
                    } else {
                        // @ts-ignore
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

    /**
     * @param {MessageEvent} event
     */
    handleWorkerMessage(event) {
        if (event.data.type === 'deserialize_complete') {
            const data = event.data.data;
            const loader = new THREE.ObjectLoader();
            const loadedScene = loader.parse(data);

            // Add loaded objects back to the scene
            // Iterate backwards or use a while loop because scene.add removes the object from loadedScene.children
            while (loadedScene.children.length > 0) {
                this.scene.add(loadedScene.children[0]);
            }
            if (this.loadPromiseResolve) {
                this.loadPromiseResolve(loadedScene);
                this.loadPromiseResolve = null;
            }
        } else if (event.data.type === 'serialize_complete') {
            if (this.savePromiseResolve) {
                this.savePromiseResolve(event.data.data);
                this.savePromiseResolve = null;
                this.savePromiseReject = null;
            }
        } else if (event.data.type === 'error') {
            log.error('Worker error:', event.data.message, event.data.error);
            if (this.loadPromiseResolve) {
                this.loadPromiseResolve(null);
                this.loadPromiseResolve = null;
            }
            if (this.savePromiseReject) {
                this.savePromiseReject(new Error(event.data.message + ': ' + event.data.error));
                this.savePromiseResolve = null;
                this.savePromiseReject = null;
            }
=======
  constructor(scene, eventBus) {
    this.eventBus = eventBus;
    this.scene = scene;
    this.worker = new Worker('./worker.js');
    this.worker.onmessage = this.handleWorkerMessage.bind(this);
    this.loadPromiseResolve = null;
  }

  async saveScene() {
    const zip = new window.JSZip();

    // Serialize the scene using the worker
    const sceneJson = await new Promise((resolve, reject) => {
      this.worker.postMessage({ type: 'serialize', data: this.scene.toJSON() });
      this.worker.onmessage = (event) => {
        if (event.data.type === 'serialize_complete') {
          resolve(event.data.data);
        } else if (event.data.type === 'error') {
          reject(new Error(event.data.message + ': ' + event.data.error));
>>>>>>> master
        }
    }
}
