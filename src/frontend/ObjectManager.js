
import * as THREE from 'three';
import { PrimitiveFactory } from './PrimitiveFactory.js';

export class ObjectManager {
    constructor(scene, primitiveFactory) {
        this.scene = scene;
        this.primitiveFactory = primitiveFactory;
    }

    addPrimitive(type, options = {}) {
        const mesh = this.primitiveFactory.createPrimitive(type, options);
        if (mesh) {
            this.scene.add(mesh);
        }
        return mesh;
    }

    updateMaterial(object, newMaterialProperties) {
        if (object && object.material) {
            for (const prop in newMaterialProperties) {
                if (object.material[prop] !== undefined) {
                    if (prop === 'color') {
                        object.material.color.set(newMaterialProperties[prop]);
                    } else {
                        object.material[prop] = newMaterialProperties[prop];
                    }
                }
            }
            object.material.needsUpdate = true;
        }
    }

    addTexture(object, file, type = 'map') {
        const loader = new THREE.TextureLoader();
        const url = URL.createObjectURL(file);
        loader.load(url, (texture) => {
            if (type === 'map') {
                object.material.map = texture;
            } else if (type === 'normalMap') {
                object.material.normalMap = texture;
            } else if (type === 'roughnessMap') {
                object.material.roughnessMap = texture;
            }
            object.material.needsUpdate = true;
            URL.revokeObjectURL(url); // Clean up the object URL
        });
    }

    deleteObject(object) {
        if (object) {
            // Dispose of geometry and material to free up memory
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                // If it's an array of materials, dispose each one
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
            // Remove the object from the scene
            this.scene.remove(object);
        }
    }

    duplicateObject(object) {
        if (!object) return null;

        // Clone the object
        const newObject = object.clone();

        // If the object has a geometry, clone it
        if (object.geometry) {
            newObject.geometry = object.geometry.clone();
        }

        // If the object has a material, clone it
        if (object.material) {
            if (Array.isArray(object.material)) {
                newObject.material = object.material.map(material => material.clone());
            } else {
                newObject.material = object.material.clone();
            }
        }

        // Set a new name for the duplicated object
        newObject.name = object.name ? `${object.name}_copy` : `${object.uuid}_copy`;

        // Add the new object to the scene
        this.scene.add(newObject);

        return newObject;
    }
}
