import JSZip from 'jszip';
import * as THREE from 'three'; // Import THREE to use ObjectLoader and other Three.js components

export class SceneStorage {
    constructor(scene, eventBus) {
        this.eventBus = eventBus;
        this.scene = scene;
        this.worker = new Worker('./src/frontend/worker.js');
        this.worker.onmessage = this.handleWorkerMessage.bind(this);
        this.loadPromiseResolve = null;
    }

    async saveScene() {
        const zip = new JSZip();
        
        // Serialize the scene using the worker
        const sceneJson = await new Promise((resolve, reject) => {
            this.worker.postMessage({ type: 'serialize', data: this.scene.toJSON() });
            this.worker.onmessage = (event) => {
                if (event.data.type === 'serialize_complete') {
                    resolve(event.data.data);
                } else if (event.data.type === 'error') {
                    reject(new Error(event.data.message + ': ' + event.data.error));
                }
            };
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
        const zip = new JSZip();
        const loadedZip = await zip.loadAsync(file);
        const sceneJson = await loadedZip.file('scene.json').async('string');

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
            console.error('Worker error:', event.data.message, event.data.error);
            if (this.loadPromiseResolve) {
                this.loadPromiseResolve(null); // Resolve with null or reject the promise
                this.loadPromiseResolve = null;
            }
        }
    }
}
