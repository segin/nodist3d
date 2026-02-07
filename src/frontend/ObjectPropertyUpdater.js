// @ts-check
import * as THREE from 'three';

export class ObjectPropertyUpdater {
  constructor(primitiveFactory) {
    this.primitiveFactory = primitiveFactory;
  }

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
     * Adds a texture to the object.
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
                if (type === 'map') {
                    // @ts-ignore
                    object.material.map = texture;
                } else if (type === 'normalMap') {
                    // @ts-ignore
                    object.material.normalMap = texture;
                } else if (type === 'roughnessMap') {
                    // @ts-ignore
                    object.material.roughnessMap = texture;
                }
                // @ts-ignore
                object.material.needsUpdate = true;
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
            // @ts-ignore
            const newGeometry = this.primitiveFactory.createPrimitive(object.geometry.type, parameters);
            if (newGeometry) {
                // @ts-ignore
                object.geometry.dispose();
                // @ts-ignore
                object.geometry = newGeometry;
  updateMaterial(object, newMaterialProperties) {
    if (object && object.material) {
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        for (const prop in newMaterialProperties) {
          if (material[prop] !== undefined) {
            if (prop === 'color') {
              material.color.set(newMaterialProperties[prop]);
            } else {
              material[prop] = newMaterialProperties[prop];
>>>>>>> master
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
    loader.load(
      url,
      (texture) => {
        if (type === 'map') {
          object.material.map = texture;
        } else if (type === 'normalMap') {
          object.material.normalMap = texture;
        } else if (type === 'roughnessMap') {
          object.material.roughnessMap = texture;
        }
        object.material.needsUpdate = true;
        global.URL.revokeObjectURL(url); // Clean up the object URL
      },
      undefined,
      (error) => {
        console.warn('Error loading texture:', error);
        global.URL.revokeObjectURL(url);
      },
    );
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
}
