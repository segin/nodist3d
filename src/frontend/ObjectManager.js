
import * as THREE from 'three';
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry.js';

export class ObjectManager {
    constructor(scene) {
        this.scene = scene;
    }

    addCube() {
        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
        const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
        return cube;
    }

    addSphere() {
        const radius = 0.75;
        const widthSegments = 32;
        const heightSegments = 16;
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000 }); // Red color for sphere
        const sphere = new THREE.Mesh(geometry, material);
        this.scene.add(sphere);
        return sphere;
    }

    addCylinder() {
        const radiusTop = 0.5;
        const radiusBottom = 0.5;
        const height = 1;
        const radialSegments = 32;
        const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
        const material = new THREE.MeshPhongMaterial({ color: 0x0000ff }); // Blue color for cylinder
        const cylinder = new THREE.Mesh(geometry, material);
        this.scene.add(cylinder);
        return cylinder;
    }

    addCone() {
        const radius = 0.5;
        const height = 1;
        const radialSegments = 32;
        const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
        const material = new THREE.MeshPhongMaterial({ color: 0xffff00 }); // Yellow color for cone
        const cone = new THREE.Mesh(geometry, material);
        this.scene.add(cone);
        return cone;
    }

    addTorus() {
        const radius = 0.4;
        const tube = 0.2;
        const radialSegments = 16;
        const tubularSegments = 100;
        const geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
        const material = new THREE.MeshPhongMaterial({ color: 0x800080 }); // Purple color for torus
        const torus = new THREE.Mesh(geometry, material);
        this.scene.add(torus);
        return torus;
    }

    addTorusKnot() {
        const radius = 0.4;
        const tube = 0.1;
        const tubularSegments = 64;
        const radialSegments = 8;
        const p = 2;
        const q = 3;
        const geometry = new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q);
        const material = new THREE.MeshPhongMaterial({ color: 0xffa500 }); // Orange color for torus knot
        const torusKnot = new THREE.Mesh(geometry, material);
        this.scene.add(torusKnot);
        return torusKnot;
    }

    addTetrahedron() {
        const radius = 0.7;
        const detail = 0; // 0 for tetrahedron
        const geometry = new THREE.IcosahedronGeometry(radius, detail);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // Green color for tetrahedron
        const tetrahedron = new THREE.Mesh(geometry, material);
        this.scene.add(tetrahedron);
        return tetrahedron;
    }

    addIcosahedron() {
        const radius = 0.7;
        const detail = 0;
        const geometry = new THREE.IcosahedronGeometry(radius, detail);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ffff }); // Cyan color for icosahedron
        const icosahedron = new THREE.Mesh(geometry, material);
        this.scene.add(icosahedron);
        return icosahedron;
    }

    addDodecahedron() {
        const radius = 0.7;
        const detail = 0;
        const geometry = new THREE.DodecahedronGeometry(radius, detail);
        const material = new THREE.MeshPhongMaterial({ color: 0xff00ff }); // Magenta color for dodecahedron
        const dodecahedron = new THREE.Mesh(geometry, material);
        this.scene.add(dodecahedron);
        return dodecahedron;
    }

    addOctahedron() {
        const radius = 0.7;
        const detail = 0;
        const geometry = new THREE.OctahedronGeometry(radius, detail);
        const material = new THREE.MeshPhongMaterial({ color: 0x008080 }); // Teal color for octahedron
        const octahedron = new THREE.Mesh(geometry, material);
        this.scene.add(octahedron);
        return octahedron;
    }

    addPlane() {
        const width = 1;
        const height = 1;
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshPhongMaterial({ color: 0x808080, side: THREE.DoubleSide }); // Gray color for plane, DoubleSide to see from both sides
        const plane = new THREE.Mesh(geometry, material);
        this.scene.add(plane);
        return plane;
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
        const material = new THREE.MeshPhongMaterial({ color: 0xffc0cb }); // Pink color for tube
        const tube = new THREE.Mesh(geometry, material);
        this.scene.add(tube);
        return tube;
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
        const material = new THREE.MeshPhongMaterial({ color: 0x800000 }); // Maroon color for teapot
        const teapot = new THREE.Mesh(geometry, material);
        this.scene.add(teapot);
        return teapot;
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
