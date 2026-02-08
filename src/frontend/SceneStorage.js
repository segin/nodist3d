// @ts-check
// JSZip will be loaded globally from CDN
import * as THREE from 'three';
import log from './logger.js';

export class SceneStorage {
  /**
   * @param {THREE.Scene} scene
   * @param {any} eventBus
   */
  constructor(scene, eventBus) {
    this.eventBus = eventBus;
    this.scene = scene;
    this.worker = new Worker('./worker.js');
    this.worker.onmessage = this.handleWorkerMessage.bind(this);
    this.loadPromiseResolve = null;
    this.savePromiseResolve = null;
    this.savePromiseReject = null;
  }

  async saveScene() {
    const zip = new window.JSZip();

<<<<<<< HEAD
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
    let serializationResult;
    try {
        serializationResult = await new Promise((resolve, reject) => {
=======
    // Serialize the scene using the worker
    const sceneJson = await new Promise((resolve, reject) => {
      this.worker.postMessage({ type: 'serialize', data: this.scene.toJSON() });
      this.worker.onmessage = (event) => {
        if (event.data.type === 'serialize_complete') {
          resolve(event.data.data);
        } else if (event.data.type === 'error') {
          reject(new Error(event.data.message + ': ' + event.data.error));
        this.worker.onmessage = this.handleWorkerMessage.bind(this);
=======
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

>>>>>>> master
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
<<<<<<< HEAD
        let sceneJson;
        try {
            sceneJson = await new Promise((resolve, reject) => {
                this.worker.postMessage({ type: 'serialize', data: this.scene.toJSON() });
                this.worker.onmessage = (event) => {
                    if (event.data.type === 'serialize_complete') {
                        resolve(event.data.data);
                    } else if (event.data.type === 'error') {
                        reject(new Error(event.data.message + ': ' + event.data.error));
                    }
                };
            });
        } finally {
            // Restore default message handler
            this.worker.onmessage = this.handleWorkerMessage.bind(this);
        }

        if (!sceneJson) {
             throw new Error('Serialization failed: Empty data received');
        }
>>>>>>> master
            const handleMessage = (event) => {
                if (event.data.type === 'serialize_complete') {
                    this.worker.removeEventListener('message', handleMessage);
                    resolve(event.data);
                } else if (event.data.type === 'error') {
                    this.worker.removeEventListener('message', handleMessage);
<<<<<<< HEAD
=======
            const originalOnMessage = this.worker.onmessage;
            this.savePromiseResolve = resolve;
            this.savePromiseReject = reject;
            this.worker.postMessage({ type: 'serialize', data: this.scene.toJSON() });
=======
            // OPTIMIZATION: Patch BufferAttribute.toJSON to return TypedArrays directly
            // instead of converting to standard Arrays (which is slow).
            const originalToJSON = THREE.BufferAttribute.prototype.toJSON;
            THREE.BufferAttribute.prototype.toJSON = function () {
                return {
                    itemSize: this.itemSize,
                    type: this.array.constructor.name,
                    array: this.array, // Keep as TypedArray
                    normalized: this.normalized
                };
            };

            let data;
            try {
                data = this.scene.toJSON();
            } finally {
                // Restore original toJSON
                THREE.BufferAttribute.prototype.toJSON = originalToJSON;
            }

            this.worker.onmessage = (event) => {
                if (event.data.type === 'serialize_complete') {
                    this.worker.onmessage = originalOnMessage;
                    resolve(event.data.data);
                } else if (event.data.type === 'error') {
                    this.worker.onmessage = originalOnMessage;
>>>>>>> master
>>>>>>> master
                    reject(new Error(event.data.message + ': ' + event.data.error));
                }
            };

<<<<<<< HEAD
            // We use addEventListener to not override the default onmessage handler completely
            // (though in this implementation we overwrite it in constructor anyway, but this is safer for future)
=======
>>>>>>> master
            this.worker.addEventListener('message', handleMessage);

            // Send data to worker. We rely on structured cloning to copy buffers efficiently.
            this.worker.postMessage({ type: 'serialize', data: sceneData });
<<<<<<< HEAD
        });
    } catch (error) {
        log.error("Worker serialization failed:", error);
        throw error;
=======
>>>>>>> master
=======
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
>>>>>>> master
        });

        zip.file('scene.json', sceneJson);

        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'scene.nodist3d';
        a.click();
        URL.revokeObjectURL(url);
>>>>>>> master
    }

    const { data: sceneJson, buffers } = serializationResult;

<<<<<<< HEAD
    // Process buffers to handle shared buffers and avoid duplication in ZIP
    // Identify unique buffers
    const uniqueBuffers = [...new Set(buffers)];
    const bufferMap = new Map(uniqueBuffers.map((b, i) => [b, i]));

    // Create a mapping array: original index -> unique buffer index
    const bufferMapping = buffers.map(b => bufferMap.get(b));

    // Add files to ZIP
    zip.file('scene.json', sceneJson);
    zip.file('buffers.json', JSON.stringify(bufferMapping));

    // Add unique binary buffers to ZIP
    uniqueBuffers.forEach((buffer, index) => {
        zip.file(`buffers/bin_${index}.bin`, buffer);
    });

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

      // Check for buffers
      let buffers = [];
      const mappingFile = loadedZip.file('buffers.json');
      if (mappingFile) {
          const mappingJson = await mappingFile.async('string');
          const bufferMapping = JSON.parse(mappingJson);

          // Load all unique binary files
          // We can infer count from mapping max index or just check files
          const uniqueBufferCount = Math.max(...bufferMapping, -1) + 1;
          const uniqueBuffers = await Promise.all(
              Array.from({ length: uniqueBufferCount }).map(async (_, i) => {
                  const binFile = loadedZip.file(`buffers/bin_${i}.bin`);
                  if (!binFile) throw new Error(`Buffer file bin_${i}.bin missing`);
                  return binFile.async('arraybuffer');
              })
          );

          // Reconstruct the buffers array for the worker
          buffers = bufferMapping.map(index => uniqueBuffers[index]);
      }

      // Clear existing objects from the scene
      while (this.scene.children.length > 0) {
        const object = this.scene.children[0];
        this.scene.remove(object);
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }

      // Deserialize the scene using the worker
      return new Promise((resolve, reject) => {
        const handleMessage = (event) => {
             if (event.data.type === 'deserialize_complete') {
                 this.worker.removeEventListener('message', handleMessage);

                 const loadedScene = event.data.data;
                 const loader = new THREE.ObjectLoader();
                 // Parse the reconstructed object into Three.js objects
                 const scene = loader.parse(loadedScene);

                 // Add loaded objects back to the scene
                 while (scene.children.length > 0) {
                     this.scene.add(scene.children[0]);
                 }
                 resolve(scene);

             } else if (event.data.type === 'error') {
                 this.worker.removeEventListener('message', handleMessage);
                 reject(new Error(event.data.message + ': ' + event.data.error));
             }
        };

        this.worker.addEventListener('message', handleMessage);

        // Transfer buffers to worker for reconstruction
        // Note: buffers array contains ArrayBuffers. We transfer unique ones.
        const uniqueTransferables = [...new Set(buffers)];

        this.worker.postMessage({
            type: 'deserialize',
            data: sceneJson,
            buffers: buffers
        }, uniqueTransferables);
      });

    } catch (error) {
      log.error('Error loading scene:', error);
      return Promise.reject(error);
    }
  }

  handleWorkerMessage(event) {
      // Default handler for other messages if any
      // Currently empty or logging
      if (event.data.type === 'error') {
          log.error('Worker error (default handler):', event.data.message);
      }
  }
=======
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
<<<<<<< HEAD
            while (loadedScene.children.length > 0) {
                this.scene.add(loadedScene.children[0]);
            }

=======
            // Iterate backwards or use a while loop because scene.add removes the object from loadedScene.children
            while (loadedScene.children.length > 0) {
                this.scene.add(loadedScene.children[0]);
            }
>>>>>>> master
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
>>>>>>> master
}
