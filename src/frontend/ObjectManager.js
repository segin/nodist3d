// @ts-check
import * as THREE from 'three';
import { Events } from './constants.js';
import { PrimitiveFactory } from './PrimitiveFactory.js';

/**
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
     * Adds a primitive to the scene.
     * @param {string} type
     * @param {any} options
     * @returns {any}
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
     * @param {THREE.Object3D} object
     * @returns {any}
     */
    duplicateObject(object) {
        return this.objectFactory.duplicateObject(object);
    }

    /**
     * Updates the material of an object.
     * @param {THREE.Object3D} object
     * @param {any} properties
     */
    updateMaterial(object, properties) {
        this.objectPropertyUpdater.updateMaterial(object, properties);
    }

    /**
     * Adds a texture to an object.
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
            if (/** @type {any} */(object).isGroup) {
                // Recursively delete children
                object.children.slice().forEach(child => this.deleteObject(child));
            }
            // Dispose of geometry and material to free up memory
            if (/** @type {any} */(object).geometry) {
                /** @type {any} */(object).geometry.dispose();
            }
            if (/** @type {any} */(object).material) {
                const materials = Array.isArray(/** @type {any} */(object).material) ? /** @type {any} */(object).material : [/** @type {any} */(object).material];
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
