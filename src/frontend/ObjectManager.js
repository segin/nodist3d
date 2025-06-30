
import * as THREE from 'three';
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry.js';

export class ObjectManager {
    constructor(scene) {
        this.scene = scene;
    }

    _createMesh(geometry, color, side = THREE.FrontSide) {
        const material = new THREE.MeshPhongMaterial({ color, side });
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
        return mesh;
    }

    addCube() {
        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
        return this._createMesh(geometry, 0x44aa88);
    }

    addSphere() {
        const radius = 0.75;
        const widthSegments = 32;
        const heightSegments = 16;
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        return this._createMesh(geometry, 0xff0000); // Red color for sphere
    }

    addCylinder() {
        const radiusTop = 0.5;
        const radiusBottom = 0.5;
        const height = 1;
        const radialSegments = 32;
        const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
        return this._createMesh(geometry, 0x0000ff); // Blue color for cylinder
    }

    addCone() {
        const radius = 0.5;
        const height = 1;
        const radialSegments = 32;
        const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
        return this._createMesh(geometry, 0xffff00); // Yellow color for cone
    }

    addTorus() {
        const radius = 0.4;
        const tube = 0.2;
        const radialSegments = 16;
        const tubularSegments = 100;
        const geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
        return this._createMesh(geometry, 0x800080); // Purple color for torus
    }

    addTorusKnot() {
        const radius = 0.4;
        const tube = 0.1;
        const tubularSegments = 64;
        const radialSegments = 8;
        const p = 2;
        const q = 3;
        const geometry = new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q);
        return this._createMesh(geometry, 0xffa500); // Orange color for torus knot
    }

    addTetrahedron() {
        const radius = 0.7;
        const detail = 0; // 0 for tetrahedron
        const geometry = new THREE.IcosahedronGeometry(radius, detail);
        return this._createMesh(geometry, 0x00ff00); // Green color for tetrahedron
    }

    addIcosahedron() {
        const radius = 0.7;
        const detail = 0;
        const geometry = new THREE.IcosahedronGeometry(radius, detail);
        return this._createMesh(geometry, 0x00ffff); // Cyan color for icosahedron
    }

    addDodecahedron() {
        const radius = 0.7;
        const detail = 0;
        const geometry = new THREE.DodecahedronGeometry(radius, detail);
        return this._createMesh(geometry, 0xff00ff); // Magenta color for dodecahedron
    }

    addOctahedron() {
        const radius = 0.7;
        const detail = 0;
        const geometry = new THREE.OctahedronGeometry(radius, detail);
        return this._createMesh(geometry, 0x008080); // Teal color for octahedron
    }

    addPlane() {
        const width = 1;
        const height = 1;
        const geometry = new THREE.PlaneGeometry(width, height);
        return this._createMesh(geometry, 0x808080, THREE.DoubleSide); // Gray color for plane, DoubleSide to see from both sides
    }

    addTube() {
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-1, -1, 0),
            new THREE.Vector3(-0.5, 1, 0),
            new THREE.Vector3(0.5, -1, 0),
            new THREE.Vector3(1, 1, 0)
        ]);
        const tubularSegments = 20;
        const radius = 0.2;
        const radialSegments = 8;
        const closed = false;
        const geometry = new THREE.TubeGeometry(path, tubularSegments, radius, radialSegments, closed);
        return this._createMesh(geometry, 0xffc0cb); // Pink color for tube
    }

    addTeapot() {
        const size = 0.5;
        const segments = 10;
        const bottom = true;
        const lid = true;
        const body = true;
        const fitLid = false;
        const blinn = true;
        const geometry = new TeapotGeometry(size, segments, bottom, lid, body, fitLid, blinn);
        return this._createMesh(geometry, 0x800000); // Maroon color for teapot
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

    addTexture(object, texturePath) {
        const loader = new THREE.TextureLoader();
        loader.load(texturePath, (texture) => {
            object.material.map = texture;
            object.material.needsUpdate = true;
        });
    }
}
