export class ObjectPropertyUpdater {
    constructor(primitiveFactory) {
        this.primitiveFactory = primitiveFactory;
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
