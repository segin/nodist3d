// @ts-check
import * as THREE from 'three';
import { Events } from './constants.js';

/**
 * Manages 3D objects in the scene.
 */
export class ObjectManager {
  /**
   * @param {THREE.Scene} scene
   * @param {any} eventBus
   * @param {any} physicsManager
   * @param {any} primitiveFactory
   * @param {any} objectFactory
   * @param {any} objectPropertyUpdater
   * @param {any} stateManager
   */
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
   * Selects an object.
   * @param {THREE.Object3D} object - The object to select.
   */
  selectObject(object) {
    if (this.stateManager) {
      this.stateManager.setState({ selection: [object] });
    }
    this.eventBus.publish(Events.OBJECT_SELECTED, object);
  }

  /**
   * Deselects the currently selected object.
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
   * @param {Object} [options] - Creation options.
   * @returns {Promise<THREE.Object3D>|THREE.Object3D|null} The created object or a promise resolving to it.
   */
  addPrimitive(type, options) {
    if (this.objectFactory) {
      return this.objectFactory.addPrimitive(type, options);
    }

    // Fallback logic
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
   */
  duplicateObject(object) {
    if (this.objectFactory) {
      return this.objectFactory.duplicateObject(object);
    }
    return null;
  }

  /**
   * Updates object material properties.
   * @param {THREE.Object3D} object - The object to update.
   * @param {Object} properties - The properties to update.
   */
  updateMaterial(object, properties) {
    if (this.objectPropertyUpdater) {
      this.objectPropertyUpdater.updateMaterial(object, properties);
    }
  }

  /**
   * Adds a texture to an object.
   * @param {THREE.Object3D} object - The object.
   * @param {File} file - The texture file.
   * @param {string} type - The texture type (map, normalMap, etc.).
   */
  addTexture(object, file, type) {
    if (this.objectPropertyUpdater) {
      this.objectPropertyUpdater.addTexture(object, file, type);
    }
  }

  /**
   * Deletes an object from the scene and disposes of its resources.
   * @param {THREE.Object3D} object - The object to delete.
   */
  deleteObject(object) {
    if (object) {
      if (object.children && object.children.length > 0) {
        // Recursively delete children backwards to avoid array copy and index shifts
        // Optimization verified against memory prompt
        for (let i = object.children.length - 1; i >= 0; i--) {
          this.deleteObject(object.children[i]);
        }
      }

      // Dispose of geometry
      // @ts-ignore
      if (object.geometry) {
        // @ts-ignore
        object.geometry.dispose();
      }

      // Dispose of material(s)
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
    }
  }
}
