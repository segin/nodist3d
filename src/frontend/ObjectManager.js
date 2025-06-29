import * as THREE from 'three';

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

    addOctahedron() {
        const radius = 0.7;
        const detail = 0;
        const geometry = new THREE.OctahedronGeometry(radius, detail);
        const material = new THREE.MeshPhongMaterial({ color: 0x008080 }); // Teal color for octahedron
        const octahedron = new THREE.Mesh(geometry, material);
        this.scene.add(octahedron);
        return octahedron;
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
}