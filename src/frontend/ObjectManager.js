<<<<<<< HEAD
// @ts-check
import * as THREE from 'three';
=======
<<<<<<< HEAD
// @ts-check
import * as THREE from 'three';
=======
<<<<<<< HEAD
import * as THREE from 'three';
import * as THREE from 'three';
import * as THREE from 'three';
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
<<<<<<< HEAD
// @ts-check
=======
>>>>>>> master
import * as THREE from 'three';
>>>>>>> master
>>>>>>> master
>>>>>>> master
import { Events } from './constants.js';

/**
 * Manages 3D objects in the scene.
 */
export class ObjectManager {
<<<<<<< HEAD
  /**
   * Creates an instance of ObjectManager.
   * @param {THREE.Scene} scene - The Three.js scene.
   * @param {any} eventBus - The event bus.
   * @param {any} physicsManager - The physics manager.
   * @param {PrimitiveFactory} primitiveFactory - The primitive factory.
   * @param {any} objectFactory - The object factory.
   * @param {any} objectPropertyUpdater - The object property updater.
   * @param {any} stateManager - The state manager.
   */
=======
<<<<<<< HEAD
  /**
   * @param {THREE.Scene} scene
   * @param {any} eventBus
   * @param {any} physicsManager
   * @param {PrimitiveFactory} primitiveFactory
   * @param {any} objectFactory
   * @param {any} objectPropertyUpdater
   * @param {any} stateManager
   */
=======
=======
 * @typedef {typeof import('./EventBus.js').default} EventBus
 * @typedef {import('./PhysicsManager.js').PhysicsManager} PhysicsManager
 * @typedef {import('./ObjectFactory.js').ObjectFactory} ObjectFactory
 * @typedef {import('./ObjectPropertyUpdater.js').ObjectPropertyUpdater} ObjectPropertyUpdater
 * @typedef {import('./StateManager.js').StateManager} StateManager
<<<<<<< HEAD
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
     * @param {THREE.Object3D} object
     */
    selectObject(object) {
        if (this.stateManager) {
            this.stateManager.setState({ selection: [object] });
        }
        this.eventBus.publish(Events.OBJECT_SELECTED, object);
=======
 * @typedef {import('./PrimitiveFactory.js').PrimitiveFactory} PrimitiveFactory
 */

/**
 * Manages 3D objects in the scene.
 */
export class ObjectManager {
  /**
   * @param {THREE.Scene} scene
   * @param {EventBus} eventBus
   * @param {any} physicsManager
   * @param {PrimitiveFactory} primitiveFactory
   * @param {ObjectFactory} objectFactory
   * @param {ObjectPropertyUpdater} objectPropertyUpdater
   * @param {StateManager} stateManager
   */
>>>>>>> master
>>>>>>> master
>>>>>>> master
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

  /**
<<<<<<< HEAD
   * Selects an object.
   * @param {THREE.Object3D} object - The object to select.
=======
<<<<<<< HEAD
   * Selects an object.
   * @param {THREE.Object3D} object - The object to select.
=======
   * @param {THREE.Object3D} object
>>>>>>> master
>>>>>>> master
   */
  selectObject(object) {
    if (this.stateManager) {
      this.stateManager.setState({ selection: [object] });
    }
    this.eventBus.publish(Events.OBJECT_SELECTED, object);
  }

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
   */
  addPrimitive(type, options) {
    // Delegate to ObjectFactory if possible
=======
<<<<<<< HEAD
   * Adds a primitive to the scene.
   * @param {string} type
   * @param {Object} options
   * @returns {Promise<THREE.Object3D>|THREE.Object3D|null}
=======
   * @param {string} type
   * @param {object} [options]
   * @returns {Promise<THREE.Object3D> | THREE.Object3D | null}
>>>>>>> master
   */
  addPrimitive(type, options) {
>>>>>>> master
    if (this.objectFactory) {
      return this.objectFactory.addPrimitive(type, options);
    }

<<<<<<< HEAD
    // Fallback or legacy logic
    const object = this.primitiveFactory.createPrimitive(type, options);
    if (object && !(object instanceof Promise)) {
      this.scene.add(object);
      this.eventBus.publish(Events.OBJECT_ADDED, object);
=======
    const object = this.primitiveFactory.createPrimitive(type, options);
<<<<<<< HEAD
    // If it returns a promise (e.g. Text), we handle it differently or return the promise.
    // The caller should handle promise.
    if (object && !(object instanceof Promise)) {
      this.scene.add(object);
      this.eventBus.publish(Events.OBJECT_ADDED, object);
=======
    if (object && !(object instanceof Promise)) {
      this.scene.add(object);
      this.eventBus.publish(Events.OBJECT_ADDED, object);
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
=======
>>>>>>> master
>>>>>>> master
    }

<<<<<<< HEAD
    /**
<<<<<<< HEAD
     * Selects an object.
     * @param {THREE.Object3D} object - The object to select.
     * Selects an object.
     * @param {THREE.Object3D} object
>>>>>>> master
=======
     * Deselects the currently selected object.
     * @returns {void}
>>>>>>> master
     */
    deselectObject() {
        if (this.stateManager) {
            this.stateManager.setState({ selection: [] });
        }
        this.eventBus.publish(Events.OBJECT_DESELECTED);
>>>>>>> master
>>>>>>> master
    }

<<<<<<< HEAD
  /**
   * Duplicates an object.
   * @param {THREE.Object3D} object - The object to duplicate.
   * @returns {Promise<THREE.Object3D>|THREE.Object3D|null} The duplicated object.
   */
=======
<<<<<<< HEAD
  /**
   * Duplicates an object.
   * @param {THREE.Object3D} object
   * @returns {Promise<THREE.Object3D>|THREE.Object3D|null}
   */
=======
<<<<<<< HEAD
=======
    /**
     * @param {string} type
     * @param {object} [options]
     * @returns {Promise<THREE.Object3D> | THREE.Object3D | null}
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
     * @param {THREE.Object3D} object
     * @returns {THREE.Object3D}
     */
    duplicateObject(object) {
        return this.objectFactory.duplicateObject(object);
    }

    /**
     * @param {THREE.Object3D} object
     * @param {object} properties
     */
    updateMaterial(object, properties) {
        this.objectPropertyUpdater.updateMaterial(object, properties);
    }

    /**
     * @param {THREE.Object3D} object
     * @param {File} file
     * @param {string} type
     */
    addTexture(object, file, type) {
        this.objectPropertyUpdater.addTexture(object, file, type);
    }

    /**
     * Deletes an object from the scene.
     * @param {THREE.Object3D} object
     */
    deleteObject(object) {
        if (object) {
            if (object.children.length > 0) {
                // Recursively delete children
                object.children.slice().forEach(child => this.deleteObject(child));
            }
            // Dispose of geometry and material to free up memory
            // @ts-ignore
            if (object.geometry) {
                // @ts-ignore
                object.geometry.dispose();
            }
            // @ts-ignore
            if (object.material) {
                // @ts-ignore
                const materials = Array.isArray(object.material) ? object.material : [object.material];
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
=======
  /**
   * @param {THREE.Object3D} object
   * @returns {THREE.Object3D}
   */
>>>>>>> master
>>>>>>> master
>>>>>>> master
  duplicateObject(object) {
    if (this.objectFactory) {
      return this.objectFactory.duplicateObject(object);
    }
  }

  /**
<<<<<<< HEAD
   * Updates object material properties.
   * @param {THREE.Object3D} object - The object to update.
   * @param {Object} properties - The properties to update.
=======
<<<<<<< HEAD
   * Updates object material properties.
   * @param {THREE.Object3D} object
   * @param {Object} properties
=======
   * @param {THREE.Object3D} object
   * @param {object} properties
>>>>>>> master
>>>>>>> master
   */
  updateMaterial(object, properties) {
    if (this.objectPropertyUpdater) {
      this.objectPropertyUpdater.updateMaterial(object, properties);
    }
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
    if (this.objectPropertyUpdater) {
      this.objectPropertyUpdater.addTexture(object, file, type);
    }
  }

  /**
   * Deletes an object from the scene and disposes of its resources.
<<<<<<< HEAD
   * @param {THREE.Object3D} object - The object to delete.
   */
  deleteObject(object) {
    if (object) {
      // @ts-ignore
      if (object.isGroup) {
        // Recursively delete children
=======
<<<<<<< HEAD
   * @param {THREE.Object3D} object
   */
  deleteObject(object) {
    if (object) {
      // Recursively delete children
      if (object.children && object.children.length > 0) {
>>>>>>> master
        object.children.slice().forEach((child) => this.deleteObject(child));
      }

      // Dispose of geometry
      // @ts-ignore
=======
   * @param {THREE.Object3D} object - The object to delete.
   */
  deleteObject(object) {
    if (object) {
      if (object.children && object.children.length > 0) {
        // Recursively delete children backwards to avoid array copy and index shifts
        for (let i = object.children.length - 1; i >= 0; i--) {
          this.deleteObject(object.children[i]);
        }
      }

      // Dispose of geometry and material to free up memory
<<<<<<< HEAD
      // @ts-ignore
=======
>>>>>>> master
>>>>>>> master
      if (object.geometry) {
        // @ts-ignore
        object.geometry.dispose();
      }
<<<<<<< HEAD
=======

      // Dispose of material(s)
>>>>>>> master
      // @ts-ignore
      if (object.material) {
        // @ts-ignore
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
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
=======
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
    }
}
