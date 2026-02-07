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
    if (this.objectFactory) {
      return this.objectFactory.addPrimitive(type, options);
    }

    const object = this.primitiveFactory.createPrimitive(type, options);
    if (object) {
      this.scene.add(object);
      this.eventBus.publish(Events.OBJECT_ADDED, object);
    }
    return object;
  }

  duplicateObject(object) {
    if (this.objectFactory) {
        return this.objectFactory.duplicateObject(object);
    }
  }

  updateMaterial(object, properties) {
    if (this.objectPropertyUpdater) {
        this.objectPropertyUpdater.updateMaterial(object, properties);
    }
  }

  addTexture(object, file, type) {
    if (this.objectPropertyUpdater) {
        this.objectPropertyUpdater.addTexture(object, file, type);
    }
  }

  deleteObject(object) {
    if (object) {
      if (object.isGroup) {
        // Recursively delete children
        // Use backward iteration for performance/safety when removing
        for (let i = object.children.length - 1; i >= 0; i--) {
            this.deleteObject(object.children[i]);
        }
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
    }
  }
}
