import * as THREE from 'three';

const vertices = new Float32Array([
	-1.0, -1.0,  1.0,
	 1.0, -1.0,  1.0,
	 1.0,  1.0,  1.0
]);

const geometryJson = {
    uuid: 'geometry-1',
    type: 'BufferGeometry',
    data: {
        attributes: {
            position: {
                itemSize: 3,
                type: 'Float32Array',
                array: [1, 2, 3], // Should be array for JSON but here we pass TypedArray?
                // Wait, standard ObjectLoader expects array.
                // If we pass TypedArray, does it work?
                array: vertices, // This is what we want to test.
                normalized: false
            }
        }
    }
};

const sceneJson = {
    metadata: { version: 4.5, type: 'Object', generator: 'Object3D.toJSON' },
    geometries: [geometryJson],
    object: {
        uuid: 'root-scene',
        type: 'Scene',
        children: [
            {
                uuid: 'child-mesh',
                type: 'Mesh',
                geometry: 'geometry-1'
            }
        ]
    }
};

const loader = new THREE.ObjectLoader();

try {
    const scene = loader.parse(sceneJson);
    const mesh = scene.children[0];
    const pos = mesh.geometry.attributes.position;

    if (pos.array instanceof Float32Array && pos.array.length === 9 && pos.array[0] === -1) {
        console.log("SUCCESS: ObjectLoader accepted TypedArray directly");
    } else {
        console.log("FAILURE: Unexpected type or content:", pos.array.constructor.name);
    }

} catch (e) {
    console.error("ERROR:", e);
}
