
import { CSG } from 'three-csg-ts';
import { PrimitiveFactory } from './PrimitiveFactory.js';

export class ObjectManager {
    constructor(scene, primitiveFactory, eventBus) {
        this.scene = scene;
        this.primitiveFactory = primitiveFactory;
        this.eventBus = eventBus;
    }

    async addPrimitive(type, options = {}) {
        const meshResult = this.primitiveFactory.createPrimitive(type, options);
        
        let mesh;
        if (meshResult instanceof Promise) {
            mesh = await meshResult;
        } else {
            mesh = meshResult;
        }

        if (mesh) {
            this.scene.add(mesh);
            this.eventBus.publish('objectAdded', mesh);
        }
        return mesh;
    }

    performCSG(objectA, objectB, operation) {
        const bspA = CSG.fromMesh(objectA);
        const bspB = CSG.fromMesh(objectB);

        let resultBsp;
        switch (operation) {
            case 'union':
                resultBsp = bspA.union(bspB);
                break;
            case 'subtract':
                resultBsp = bspA.subtract(bspB);
                break;
            case 'intersect':
                resultBsp = bspA.intersect(bspB);
                break;
            default:
                console.warn('Unknown CSG operation:', operation);
                return null;
        }

        const resultMesh = CSG.toMesh(resultBsp, objectA.matrix);
        resultMesh.material = objectA.material;

        this.scene.remove(objectA);
        this.scene.remove(objectB);
        this.scene.add(resultMesh);

        this.eventBus.publish('objectAdded', resultMesh);
        this.eventBus.publish('objectRemoved', objectA);
        this.eventBus.publish('objectRemoved', objectB);

        return resultMesh;
    }

    updateMaterial(object, newMaterialProperties) {
        if (object && object.material) {
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach(material => {
                for (const prop in newMaterialProperties) {
                    if (material[prop] !== undefined) {
                        if (prop === 'color') {
                            material.color.set(newMaterialProperties[prop]);
                        } else {
                            material[prop] = newMaterialProperties[prop];
                        }
                    }
                }
                material.needsUpdate = true;
            });
        }
    }

    addTexture(object, file, type = 'map') {
        if (!object.material) return;

        const loader = new global.THREE.TextureLoader();
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
            global.URL.revokeObjectURL(url); // Clean up the object URL
        });
    }

    deleteObject(object) {
        if (object) {
            if (object.isGroup) {
                // Recursively delete children
                object.children.slice().forEach(child => this.deleteObject(child));
            }
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
            this.eventBus.publish('objectRemoved', object);
        }
    }

    updatePrimitive(object, parameters) {
        if (object && object.geometry) {
            const newGeometry = this.primitiveFactory.createPrimitive(object.geometry.type, parameters);
            if (newGeometry) {
                object.geometry.dispose();
                object.geometry = newGeometry;
            }
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

        // Add a small offset to the position to avoid z-fighting
        newObject.position.addScalar(0.5);

        // Add the new object to the scene
        this.scene.add(newObject);

        return newObject;
    }
}
