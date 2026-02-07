// @ts-check
import * as THREE from 'three';

export class ObjectPropertyUpdater {
  constructor(primitiveFactory) {
    this.primitiveFactory = primitiveFactory;
  }

  updateMaterial(object, properties) {
    if (object && object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach(material => {
            for (const key in properties) {
                if (Object.prototype.hasOwnProperty.call(properties, key)) {
                    if (key === 'color') {
                        material.color.setHex(properties[key]);
                    } else {
                        material[key] = properties[key];
                    }
                }
            }
            material.needsUpdate = true;
        });
    }
  }

  addTexture(object, file, type = 'map') {
    if (!object.material) return;

    // Use window.THREE if available (browser), otherwise global.THREE (test)
    const THREE = window.THREE || global.THREE;
    const loader = new THREE.TextureLoader();
    const url = URL.createObjectURL(file);
    loader.load(
      url,
      (texture) => {
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
      },
    );
  }

  updatePrimitive(object, parameters) {
    if (object && object.geometry) {
      // Assuming createPrimitive returns a Mesh or Geometry.
      // If it returns a Mesh, we need .geometry.
      // But primitiveFactory.createPrimitive returns a Mesh usually.
      // Let's assume it handles geometry creation.
      // Wait, PrimitiveFactory.createPrimitive usually creates a Mesh.
      // We want to update the geometry.

      // Let's check PrimitiveFactory usage.
      // It returns a Mesh.

      const tempMesh = this.primitiveFactory.createPrimitive(object.geometry.type.replace('Geometry', ''), parameters);
      if (tempMesh && tempMesh.geometry) {
        object.geometry.dispose();
        object.geometry = tempMesh.geometry;
      }
    }
  }
}
