// @ts-check
import * as THREE from 'three';
import { Events } from './constants.js';
import { PrimitiveFactory } from './PrimitiveFactory.js';

/**
 * Manages 3D objects in the scene.
 */
export class ObjectManager {
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
     */
    selectObject(object) {
        if (this.stateManager) {
            this.stateManager.setState({ selection: [object] });
        }
        this.eventBus.publish(Events.OBJECT_SELECTED, object);
    }

    /**
     * Deselects the current selection.
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
        if (object) {
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
        return this.objectFactory.duplicateObject(object);
    }

    /**
     * Updates object material properties.
     * @param {THREE.Object3D} object - The object to update.
     * @param {Object} properties - The properties to update.
     */
    updateMaterial(object, properties) {
        this.objectPropertyUpdater.updateMaterial(object, properties);
    }

    /**
     * Adds a texture to an object.
     * @param {THREE.Object3D} object - The object.
     * @param {File} file - The texture file.
     * @param {string} type - The texture type (map, normalMap, etc.).
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
    }
}
