// @ts-check
import * as THREE from 'three';

export class ObjectPropertyUpdater {
    /**
     * @param {import('./PrimitiveFactory.js').PrimitiveFactory} primitiveFactory
     */
    constructor(primitiveFactory) {
        this.primitiveFactory = primitiveFactory;
    }

    /**
     * Updates material properties.
     * @param {THREE.Object3D} object
     * @param {any} newMaterialProperties
     */
    updateMaterial(object, newMaterialProperties) {
        // @ts-ignore - material existence
        if (object && object.material) {
            // @ts-ignore
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

    /**
     * @param {THREE.Object3D} object
     * @param {File} file
     * @param {string} type
     */
    addTexture(object, file, type = 'map') {
        // @ts-ignore
        if (!object.material) return;

        const loader = new THREE.TextureLoader();
        const url = URL.createObjectURL(file);

        loader.load(
            url,
            (texture) => {
                // @ts-ignore
                const materials = Array.isArray(object.material) ? object.material : [object.material];
                materials.forEach(material => {
                    if (type === 'map') {
                        material.map = texture;
                    } else if (type === 'normalMap') {
                        material.normalMap = texture;
                    } else if (type === 'roughnessMap') {
                        material.roughnessMap = texture;
                    }
                    material.needsUpdate = true;
                });
                URL.revokeObjectURL(url); // Clean up the object URL
            },
            undefined,
            (error) => {
                console.warn('Error loading texture:', error);
                URL.revokeObjectURL(url);
            }
        );
    }

    /**
     * Updates primitive parameters.
     * @param {THREE.Object3D} object
     * @param {any} parameters
     */
    updatePrimitive(object, parameters) {
        // @ts-ignore
        if (object && object.geometry) {
            // We assume object.geometry.type contains 'Geometry' suffix e.g. 'BoxGeometry'
            // PrimitiveFactory expects 'Box'.
            // @ts-ignore
            const type = object.geometry.type.replace('Geometry', '');

            // This creates a new Mesh
            const tempMesh = this.primitiveFactory.createPrimitive(type, parameters);

            // @ts-ignore
            if (tempMesh && tempMesh.geometry) {
                // @ts-ignore
                object.geometry.dispose();
                // @ts-ignore
                object.geometry = tempMesh.geometry;
            }
        }
    }
}
