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
   * @param {any} properties
   */
  updateMaterial(object, properties) {
    if (object && object.material) {
      // @ts-ignore
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        for (const key in properties) {
          if (material[key] !== undefined) {
            if (key === 'color') {
              material.color.set(properties[key]);
            } else {
              material[key] = properties[key];
            }
          }
        }
        material.needsUpdate = true;
      });
    }
  }

  /**
   * Adds a texture to an object.
   * @param {THREE.Object3D} object
   * @param {File} file
   * @param {string} type
   */
  addTexture(object, file, type = 'map') {
    if (!object.material) return;

    const loader = new THREE.TextureLoader();
    const url = URL.createObjectURL(file);
    loader.load(
      url,
      (texture) => {
        // @ts-ignore
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
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
      },
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
      // Assuming createPrimitive returns a Mesh
      // We try to infer the type from geometry type (e.g. BoxGeometry -> Box)
      // This is a bit fragile but works for basic primitives
      // @ts-ignore
      const type = object.geometry.type.replace('Geometry', '');

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
