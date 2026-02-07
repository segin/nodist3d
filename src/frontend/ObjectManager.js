import * as THREE from 'three';
import * as THREE from 'three';
import * as THREE from 'three';
>>>>>>> master
>>>>>>> master
>>>>>>> master
import { Events } from './constants.js';
import { PrimitiveFactory } from './PrimitiveFactory.js';

/**
 * Manages 3D objects in the scene.
 */
export class ObjectManager {
  constructor(
    scene,
    eventBus,
    physicsManager,
    primitiveFactory,
    objectFactory,
    objectPropertyUpdater,
    stateManager,
  ) {
    this.scene = scene;
    this.eventBus = eventBus;
    this.physicsManager = physicsManager;
    this.primitiveFactory = primitiveFactory;
    this.objectFactory = objectFactory;
    this.objectPropertyUpdater = objectPropertyUpdater;
    this.stateManager = stateManager;
  }

  selectObject(object) {
    if (this.stateManager) {
      this.stateManager.setState({ selection: [object] });
    }
    this.eventBus.publish(Events.OBJECT_SELECTED, object);
  }

  deselectObject() {
    if (this.stateManager) {
      this.stateManager.setState({ selection: [] });
    }
    this.eventBus.publish(Events.OBJECT_DESELECTED);
  }

  addPrimitive(type, options) {
    // Delegate to ObjectFactory if possible, but the original code used primitiveFactory directly.
    // ObjectFactory.addPrimitive has logic for handling async and publishing events.
    // Let's use ObjectFactory if available, otherwise fallback (or just use it directly).
    // Since we are injecting objectFactory, we should use it.
    // BUT, existing tests expect addPrimitive to return the object directly (or promise).
    if (this.objectFactory) {
      return this.objectFactory.addPrimitive(type, options);
    }

    // Fallback or legacy logic if objectFactory not provided (shouldn't happen with correct DI)
    const object = this.primitiveFactory.createPrimitive(type, options);
    if (object) {
      this.scene.add(object);
      this.eventBus.publish(Events.OBJECT_ADDED, object);
 * Manages objects in the scene.
 */
export class ObjectManager {
    /**
     * @param {THREE.Scene} scene
     * @param {any} eventBus
     * @param {any} physicsManager
     * @param {PrimitiveFactory} primitiveFactory
     * @param {any} objectFactory
     * @param {any} objectPropertyUpdater
     * @param {any} stateManager
>>>>>>> master
     */
    constructor(scene, eventBus, physicsManager, primitiveFactory, objectFactory, objectPropertyUpdater, stateManager) {
        this.scene = scene;
        this.eventBus = eventBus;
        this.physicsManager = physicsManager;
        this.primitiveFactory = primitiveFactory;
        this.objectFactory = objectFactory;
        this.objectPropertyUpdater = objectPropertyUpdater;
        this.stateManager = stateManager;
    }

    /**
     * Selects an object.
     * @param {THREE.Object3D} object - The object to select.
     * Selects an object.
     * @param {THREE.Object3D} object
>>>>>>> master
     */
    selectObject(object) {
        if (this.stateManager) {
            this.stateManager.setState({ selection: [object] });
        }
        this.eventBus.publish(Events.OBJECT_SELECTED, object);
>>>>>>> master
    }
    return object;
  }

  duplicateObject(object) {
    return this.objectFactory.duplicateObject(object);
  }

  updateMaterial(object, properties) {
    this.objectPropertyUpdater.updateMaterial(object, properties);
  }

  addTexture(object, file, type) {
    this.objectPropertyUpdater.addTexture(object, file, type);
  }

  deleteObject(object) {
    if (object) {
      if (object.isGroup) {
        // Recursively delete children
        object.children.slice().forEach((child) => this.deleteObject(child));
      }
      // Dispose of geometry and material to free up memory
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          // Dispose textures
          for (const key of [
            'map',
            'normalMap',
            'roughnessMap',
            'metalnessMap',
            'alphaMap',
            'aoMap',
          ]) {
            if (material[key] && material[key].dispose) {
              material[key].dispose();
            }
          }
          material.dispose();
        });
      }
      // Remove the object from its parent (scene or group)
      if (object.parent) {
        object.parent.remove(object);
      } else {
        this.scene.remove(object);
      }
      this.eventBus.publish(Events.OBJECT_REMOVED, object);
     * Deselects the current selection.
     * Deselects the currently selected object.
>>>>>>> master
     */
    deselectObject() {
        if (this.stateManager) {
            this.stateManager.setState({ selection: [] });
        }
        this.eventBus.publish(Events.OBJECT_DESELECTED);
    }

    /**
     * Adds a primitive object to the scene.
     * @param {string} type - The type of primitive.
     * @param {Object} options - Creation options.
     * @returns {Promise<THREE.Object3D>|THREE.Object3D|null} The created object or a promise resolving to it.
     * Adds a primitive to the scene.
     * @param {string} type
     * @param {any} options
     * @returns {any}
>>>>>>> master
     */
    addPrimitive(type, options) {
        // Delegate to ObjectFactory if possible, but the original code used primitiveFactory directly.
        // ObjectFactory.addPrimitive has logic for handling async and publishing events.
        // Let's use ObjectFactory if available, otherwise fallback (or just use it directly).
        // Since we are injecting objectFactory, we should use it.
        // BUT, existing tests expect addPrimitive to return the object directly (or promise).
        if (this.objectFactory) {
            return this.objectFactory.addPrimitive(type, options);
        }

        // Fallback or legacy logic if objectFactory not provided (shouldn't happen with correct DI)
        const object = this.primitiveFactory.createPrimitive(type, options);
        if (object && !(object instanceof Promise)) {
            this.scene.add(object);
            this.eventBus.publish(Events.OBJECT_ADDED, object);
        }
        return object;
    }

    /**
     * Duplicates an object.
     * @param {THREE.Object3D} object - The object to duplicate.
     * @returns {Promise<THREE.Object3D>|THREE.Object3D|null} The duplicated object.
     * Duplicates an object.
     * @param {THREE.Object3D} object
     * @returns {any}
>>>>>>> master
     */
    duplicateObject(object) {
        return this.objectFactory.duplicateObject(object);
    }

    /**
     * Updates object material properties.
     * @param {THREE.Object3D} object - The object to update.
     * @param {Object} properties - The properties to update.
     * Updates the material of an object.
     * @param {THREE.Object3D} object
     * @param {any} properties
>>>>>>> master
     */
    updateMaterial(object, properties) {
        this.objectPropertyUpdater.updateMaterial(object, properties);
    }

    /**
     * Adds a texture to an object.
     * @param {THREE.Object3D} object - The object.
     * @param {File} file - The texture file.
     * @param {string} type - The texture type (map, normalMap, etc.).
     * Adds a texture to an object.
     * @param {THREE.Object3D} object
     * @param {File} file
     * @param {string} type
>>>>>>> master
     */
    addTexture(object, file, type) {
        this.objectPropertyUpdater.addTexture(object, file, type);
    }

    /**
     * Deletes an object from the scene and disposes of its resources.
     * @param {THREE.Object3D} object - The object to delete.
     */
    deleteObject(object) {
        if (object) {
            if (/** @type {any} */(object).isGroup) {
     * Deletes an object from the scene.
     * @param {THREE.Object3D} object
     */
    deleteObject(object) {
        if (object) {
            if (/** @type {any} */(object).isGroup) {
>>>>>>> master
                // Recursively delete children
                object.children.slice().forEach(child => this.deleteObject(child));
            }
            // Dispose of geometry and material to free up memory
            if (/** @type {any} */(object).geometry) {
                /** @type {any} */(object).geometry.dispose();
            }
            if (/** @type {any} */(object).material) {
                const materials = Array.isArray(/** @type {any} */(object).material) ? /** @type {any} */(object).material : [/** @type {any} */(object).material];
            // @ts-ignore
            if (object.geometry) {
                // @ts-ignore
                object.geometry.dispose();
            }
            // @ts-ignore
            if (object.material) {
                // @ts-ignore
                const materials = Array.isArray(object.material) ? object.material : [object.material];
>>>>>>> master
                materials.forEach(material => {
                    // Dispose textures
                    for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'alphaMap', 'aoMap']) {
                        if (material[key] && material[key].dispose) {
                            material[key].dispose();
                        }
                    }
                    material.dispose();
                });
            }
            // Remove the object from its parent (scene or group)
            if (object.parent) {
                object.parent.remove(object);
            } else {
                this.scene.remove(object);
            }
            this.eventBus.publish(Events.OBJECT_REMOVED, object);
        }
>>>>>>> master
    }
  }
}
