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
   * @param {THREE.Object3D} object
   */
  selectObject(object) {
    if (this.stateManager) {
      this.stateManager.setState({ selection: [object] });
    }
    this.eventBus.publish(Events.OBJECT_SELECTED, object);
  }

  /**
   * @returns {void}
   */
  deselectObject() {
    if (this.stateManager) {
      this.stateManager.setState({ selection: [] });
    }
    this.eventBus.publish(Events.OBJECT_DESELECTED);
  }

  /**
   * @param {string} type
   * @param {object} [options]
   * @returns {Promise<THREE.Object3D> | THREE.Object3D | null}
   */
  addPrimitive(type, options) {
    if (this.objectFactory) {
      return this.objectFactory.addPrimitive(type, options);
    }
    return this.primitiveFactory.createPrimitive(type, options);
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
          const textures = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'alphaMap', 'aoMap'];
          textures.forEach(key => {
            if (material[key] && material[key].dispose) {
              material[key].dispose();
            }
          });
          material.dispose();
        });
      }
      
      // Remove from physics if manager exists
      if (this.physicsManager && this.physicsManager.removeObject) {
        this.physicsManager.removeObject(object);
      }
      
      if (object.parent) {
        object.parent.remove(object);
      } else {
        this.scene.remove(object);
      }
      
      this.eventBus.publish(Events.OBJECT_REMOVED, object);
    }
  }
}
