<<<<<<< HEAD
=======
// @ts-check
<<<<<<< HEAD
import * as THREE from 'three';
=======
<<<<<<< HEAD
import * as THREE from 'three';
=======

<<<<<<< HEAD
import * as THREE from 'three';
=======
// @ts-check
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
import { Events } from './constants.js';
import { PrimitiveFactory } from './PrimitiveFactory.js';

/**
<<<<<<< HEAD
 * Manages 3D objects in the scene.
 */
export class ObjectManager {
<<<<<<< HEAD
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
=======
    /**
     * Creates an instance of ObjectManager.
     * @param {THREE.Scene} scene - The Three.js scene.
     * @param {any} eventBus - The event bus.
     * @param {any} physicsManager - The physics manager.
     * @param {PrimitiveFactory} primitiveFactory - The primitive factory.
     * @param {any} objectFactory - The object factory.
     * @param {any} objectPropertyUpdater - The object property updater.
     * @param {any} stateManager - The state manager.
=======
<<<<<<< HEAD
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
=======
 * @typedef {typeof import('./EventBus.js').default} EventBus
 * @typedef {import('./PhysicsManager.js').PhysicsManager} PhysicsManager
 * @typedef {import('./ObjectFactory.js').ObjectFactory} ObjectFactory
 * @typedef {import('./ObjectPropertyUpdater.js').ObjectPropertyUpdater} ObjectPropertyUpdater
 * @typedef {import('./StateManager.js').StateManager} StateManager
 */

export class ObjectManager {
    /**
     * @param {THREE.Scene} scene
     * @param {EventBus} eventBus
     * @param {PhysicsManager} physicsManager
     * @param {PrimitiveFactory} primitiveFactory
     * @param {ObjectFactory} objectFactory
     * @param {ObjectPropertyUpdater} objectPropertyUpdater
     * @param {StateManager} stateManager
>>>>>>> master
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
<<<<<<< HEAD
     * Selects an object.
     * @param {THREE.Object3D} object - The object to select.
=======
<<<<<<< HEAD
     * Selects an object.
=======
>>>>>>> master
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

<<<<<<< HEAD
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
=======
    /**
<<<<<<< HEAD
     * Deselects the current selection.
=======
<<<<<<< HEAD
     * Deselects the currently selected object.
=======
     * @returns {void}
>>>>>>> master
>>>>>>> master
     */
    deselectObject() {
        if (this.stateManager) {
            this.stateManager.setState({ selection: [] });
        }
        this.eventBus.publish(Events.OBJECT_DESELECTED);
    }

    /**
<<<<<<< HEAD
     * Adds a primitive object to the scene.
     * @param {string} type - The type of primitive.
     * @param {Object} options - Creation options.
     * @returns {Promise<THREE.Object3D>|THREE.Object3D|null} The created object or a promise resolving to it.
=======
<<<<<<< HEAD
     * Adds a primitive to the scene.
     * @param {string} type
     * @param {any} options
     * @returns {any}
=======
     * @param {string} type
     * @param {object} [options]
     * @returns {Promise<THREE.Object3D> | THREE.Object3D | null}
>>>>>>> master
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
<<<<<<< HEAD
     * Duplicates an object.
     * @param {THREE.Object3D} object - The object to duplicate.
     * @returns {Promise<THREE.Object3D>|THREE.Object3D|null} The duplicated object.
=======
<<<<<<< HEAD
     * Duplicates an object.
     * @param {THREE.Object3D} object
     * @returns {any}
=======
     * @param {THREE.Object3D} object
     * @returns {THREE.Object3D}
>>>>>>> master
>>>>>>> master
     */
    duplicateObject(object) {
        return this.objectFactory.duplicateObject(object);
    }

    /**
<<<<<<< HEAD
     * Updates object material properties.
     * @param {THREE.Object3D} object - The object to update.
     * @param {Object} properties - The properties to update.
=======
<<<<<<< HEAD
     * Updates the material of an object.
     * @param {THREE.Object3D} object
     * @param {any} properties
=======
     * @param {THREE.Object3D} object
     * @param {object} properties
>>>>>>> master
>>>>>>> master
     */
    updateMaterial(object, properties) {
        this.objectPropertyUpdater.updateMaterial(object, properties);
    }

    /**
<<<<<<< HEAD
     * Adds a texture to an object.
     * @param {THREE.Object3D} object - The object.
     * @param {File} file - The texture file.
     * @param {string} type - The texture type (map, normalMap, etc.).
=======
<<<<<<< HEAD
     * Adds a texture to an object.
=======
>>>>>>> master
     * @param {THREE.Object3D} object
     * @param {File} file
     * @param {string} type
>>>>>>> master
     */
    addTexture(object, file, type) {
        this.objectPropertyUpdater.addTexture(object, file, type);
    }

    /**
<<<<<<< HEAD
     * Deletes an object from the scene and disposes of its resources.
     * @param {THREE.Object3D} object - The object to delete.
     */
    deleteObject(object) {
        if (object) {
            if (/** @type {any} */(object).isGroup) {
=======
<<<<<<< HEAD
     * Deletes an object from the scene.
=======
>>>>>>> master
     * @param {THREE.Object3D} object
     */
    deleteObject(object) {
        if (object) {
<<<<<<< HEAD
            if (/** @type {any} */(object).isGroup) {
=======
            if (object.children.length > 0) {
>>>>>>> master
>>>>>>> master
                // Recursively delete children
                object.children.slice().forEach(child => this.deleteObject(child));
            }
            // Dispose of geometry and material to free up memory
<<<<<<< HEAD
=======
<<<<<<< HEAD
            if (/** @type {any} */(object).geometry) {
                /** @type {any} */(object).geometry.dispose();
            }
            if (/** @type {any} */(object).material) {
                const materials = Array.isArray(/** @type {any} */(object).material) ? /** @type {any} */(object).material : [/** @type {any} */(object).material];
=======
>>>>>>> master
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
