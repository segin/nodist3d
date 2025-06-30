
import * as THREE from 'three';
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { ExtrudeGeometry, LatheGeometry } from 'three';
import { CSG } from 'three-csg-ts';

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

    addLathe() {
        const points = [];
        for (let i = 0; i < 10; i++) {
            points.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.5 + 0.5, (i - 5) * 0.2));
        }
        const geometry = new THREE.LatheGeometry(points);
        return this._createMesh(geometry, 0x00ff80); // Spring Green for Lathe
    }

    addExtrude() {
        const shape = new THREE.Shape();
        const x = 0, y = 0;
        shape.moveTo(x + 0.5, y + 0.5);
        shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
        shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
        shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.5, x + 0.5, y + 1.9);
        shape.bezierCurveTo(x + 1.3, y + 1.5, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
        shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1, y);
        shape.bezierCurveTo(x + 0.85, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);

        const extrudeSettings = {
            steps: 2,
            depth: 0.2,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 1
        };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        return this._createMesh(geometry, 0xff6347); // Tomato for Extrude
    }

    addText(text = "nodist3d") {
        const loader = new FontLoader();
        return new Promise((resolve) => {
            loader.load('./node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
                const geometry = new TextGeometry(text, {
                    font: font,
                    size: 0.5,
                    height: 0.2,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5
                });
                geometry.center();
                resolve(this._createMesh(geometry, 0x00bfff)); // Deep Sky Blue for Text
            });
        });
    }

    addLathe() {
        const points = [];
        for (let i = 0; i < 10; i++) {
            points.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.5 + 0.5, (i - 5) * 0.2));
        }
        const geometry = new THREE.LatheGeometry(points);
        return this._createMesh(geometry, 0x00ff80); // Spring Green for Lathe
    }

    addExtrude() {
        const shape = new THREE.Shape();
        const x = 0, y = 0;
        shape.moveTo(x + 0.5, y + 0.5);
        shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
        shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
        shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.5, x + 0.5, y + 1.9);
        shape.bezierCurveTo(x + 1.3, y + 1.5, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
        shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1, y);
        shape.bezierCurveTo(x + 0.85, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);

        const extrudeSettings = {
            steps: 2,
            depth: 0.2,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 1
        };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        return this._createMesh(geometry, 0xff6347); // Tomato for Extrude
    }

    addText(text = "nodist3d") {
        const loader = new FontLoader();
        return new Promise((resolve) => {
            loader.load('./node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
                const geometry = new TextGeometry(text, {
                    font: font,
                    size: 0.5,
                    height: 0.2,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5
                });
                geometry.center();
                resolve(this._createMesh(geometry, 0x00bfff)); // Deep Sky Blue for Text
            });
        });
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

    addTexture(object, file, type = 'map') {
        const loader = new THREE.TextureLoader();
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
            URL.revokeObjectURL(url); // Clean up the object URL
        });
    }

    deleteObject(object) {
        if (object) {
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

        // Add the new object to the scene
        this.scene.add(newObject);

        return newObject;
    }

    performCSG(objectA, objectB, operation) {
        if (!objectA || !objectB || !objectA.geometry || !objectB.geometry) {
            console.error("Both objects must have geometry for CSG operations.");
            return null;
        }

        // Ensure objects are in world space for CSG operations
        objectA.updateMatrixWorld(true);
        objectB.updateMatrixWorld(true);

        const csgObjectA = CSG.fromMesh(objectA);
        const csgObjectB = CSG.fromMesh(objectB);

        let resultCsg;
        if (operation === 'union') {
            resultCsg = csgObjectA.union(csgObjectB);
        } else if (operation === 'subtract') {
            resultCsg = csgObjectA.subtract(csgObjectB);
        } else if (operation === 'intersect') {
            resultCsg = csgObjectA.intersect(csgObjectB);
        } else {
            console.error("Invalid CSG operation:", operation);
            return null;
        }

        const resultMesh = CSG.toMesh(resultCsg, objectA.matrixWorld);
        resultMesh.material = objectA.material.clone(); // Keep material of the first object
        resultMesh.name = `CSG_Result_${operation}`;

        // Remove original objects from the scene
        this.scene.remove(objectA);
        this.scene.remove(objectB);

        // Add the result mesh to the scene
        this.scene.add(resultMesh);

        return resultMesh;
    }
}
