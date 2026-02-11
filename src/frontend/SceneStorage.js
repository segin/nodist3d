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

  /**
   * Handles messages from the Web Worker.
   * @param {MessageEvent} event
   */
  handleWorkerMessage(event) {
    const { type, data, message, error } = event.data;

    if (type === 'deserialize_complete') {
      const loader = new THREE.ObjectLoader();
      const loadedScene = loader.parse(data);
      
      if (this.loadPromiseResolve) {
        this.loadPromiseResolve(loadedScene);
        this.loadPromiseResolve = null;
      }
    } else if (type === 'serialize_complete') {
      if (this.savePromiseResolve) {
        this.savePromiseResolve(data);
        this.savePromiseResolve = null;
        this.savePromiseReject = null;
      }
    } else if (type === 'error') {
      log.error('Worker error:', message, error);
      if (this.loadPromiseResolve) {
        this.loadPromiseResolve(null);
        this.loadPromiseResolve = null;
      }
      if (this.savePromiseReject) {
        this.savePromiseReject(new Error(`${message}: ${error}`));
        this.savePromiseResolve = null;
        this.savePromiseReject = null;
      }
    }
  }

  /**
   * Saves the scene to a .nodist3d zip file.
   */
  async saveScene() {
    // @ts-ignore
    const JSZip = window.JSZip;
    if (!JSZip) {
      throw new Error('JSZip not loaded');
    }

    const zip = new JSZip();

    // Optimization: avoid standard Array conversion for TypedArrays
    const originalToJSON = THREE.BufferAttribute.prototype.toJSON;
    THREE.BufferAttribute.prototype.toJSON = function() {
      return {
        itemSize: this.itemSize,
        type: this.array.constructor.name,
        array: Array.from(this.array), // Still need array for standard ObjectLoader
        normalized: this.normalized
      };
    };

    let sceneData;
    try {
      sceneData = this.scene.toJSON();
    } finally {
      THREE.BufferAttribute.prototype.toJSON = originalToJSON;
    }

    const sceneJson = await new Promise((resolve, reject) => {
      this.savePromiseResolve = resolve;
      this.savePromiseReject = reject;
      this.worker.postMessage({ type: 'serialize', data: sceneData });
    });

    zip.file('scene.json', JSON.stringify(sceneJson));

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scene.nodist3d';
    a.click();
    URL.revokeObjectURL(url);
    this.eventBus.publish('scene_saved', { name: 'scene.nodist3d', size: content.size });
  }

  /**
   * Loads a scene from a .nodist3d zip file.
   * @param {File} file
   */
  async loadScene(file) {
    // @ts-ignore
    const JSZip = window.JSZip;
    if (!JSZip) {
      throw new Error('JSZip not loaded');
    }

    const zip = await JSZip.loadAsync(file);
    const sceneFile = zip.file('scene.json');
    if (!sceneFile) {
      throw new Error('Invalid .nodist3d file: missing scene.json');
    }

    const sceneJsonText = await sceneFile.async('text');
    const sceneJson = JSON.parse(sceneJsonText);

    const loadedScene = await new Promise((resolve, reject) => {
      this.loadPromiseResolve = resolve;
      this.worker.postMessage({ type: 'deserialize', data: sceneJson });
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (this.loadPromiseResolve === resolve) {
          this.loadPromiseResolve = null;
          reject(new Error('Scene loading timed out'));
        }
      }, 10000);
    });

    if (!loadedScene) {
      throw new Error('Failed to deserialize scene');
    }

    this.eventBus.publish('scene_loaded');

    // Clear existing objects in the main thread (handled by App.loadScene)
    return loadedScene;
  }
}
