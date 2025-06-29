import { Scene } from 'three';
import { ObjectManager } from '../src/frontend/ObjectManager.js';

describe('ObjectManager', () => {
    let scene;
    let objectManager;

    beforeEach(() => {
        scene = new Scene();
        objectManager = new ObjectManager(scene);
    });

    it('should add a cube to the scene', () => {
        const cube = objectManager.addCube();
        expect(scene.children.includes(cube)).toBe(true);
        expect(cube.type).toBe('Mesh');
        expect(cube.geometry.type).toBe('BoxGeometry');
    });

    it('should add a sphere to the scene', () => {
        const sphere = objectManager.addSphere();
        expect(scene.children.includes(sphere)).toBe(true);
        expect(sphere.type).toBe('Mesh');
        expect(sphere.geometry.type).toBe('SphereGeometry');
    });

    it('should add a cylinder to the scene', () => {
        const cylinder = objectManager.addCylinder();
        expect(scene.children.includes(cylinder)).toBe(true);
        expect(cylinder.type).toBe('Mesh');
        expect(cylinder.geometry.type).toBe('CylinderGeometry');
    });

    it('should add a cone to the scene', () => {
        const cone = objectManager.addCone();
        expect(scene.children.includes(cone)).toBe(true);
        expect(cone.type).toBe('Mesh');
        expect(cone.geometry.type).toBe('ConeGeometry');
    });

    it('should add a torus to the scene', () => {
        const torus = objectManager.addTorus();
        expect(scene.children.includes(torus)).toBe(true);
        expect(torus.type).toBe('Mesh');
        expect(torus.geometry.type).toBe('TorusGeometry');
    });

    it('should add a torus knot to the scene', () => {
        const torusKnot = objectManager.addTorusKnot();
        expect(scene.children.includes(torusKnot)).toBe(true);
        expect(torusKnot.type).toBe('Mesh');
        expect(torusKnot.geometry.type).toBe('TorusKnotGeometry');
    });

    it('should add a tetrahedron to the scene', () => {
        const tetrahedron = objectManager.addTetrahedron();
        expect(scene.children.includes(tetrahedron)).toBe(true);
        expect(tetrahedron.type).toBe('Mesh');
        expect(tetrahedron.geometry.type).toBe('IcosahedronGeometry'); // Tetrahedron is a type of IcosahedronGeometry with detail 0
    });

    it('should add an icosahedron to the scene', () => {
        const icosahedron = objectManager.addIcosahedron();
        expect(scene.children.includes(icosahedron)).toBe(true);
        expect(icosahedron.type).toBe('Mesh');
        expect(icosahedron.geometry.type).toBe('IcosahedronGeometry');
    });

    it('should add a dodecahedron to the scene', () => {
        const dodecahedron = objectManager.addDodecahedron();
        expect(scene.children.includes(dodecahedron)).toBe(true);
        expect(dodecahedron.type).toBe('Mesh');
        expect(dodecahedron.geometry.type).toBe('DodecahedronGeometry');
    });

    it('should add an octahedron to the scene', () => {
        const octahedron = objectManager.addOctahedron();
        expect(scene.children.includes(octahedron)).toBe(true);
        expect(octahedron.type).toBe('Mesh');
        expect(octahedron.geometry.type).toBe('OctahedronGeometry');
    });

    it('should add a plane to the scene', () => {
        const plane = objectManager.addPlane();
        expect(scene.children.includes(plane)).toBe(true);
        expect(plane.type).toBe('Mesh');
        expect(plane.geometry.type).toBe('PlaneGeometry');
    });

    it('should add a tube to the scene', () => {
        const tube = objectManager.addTube();
        expect(scene.children.includes(tube)).toBe(true);
        expect(tube.type).toBe('Mesh');
        expect(tube.geometry.type).toBe('TubeGeometry');
    });

    it('should add a teapot to the scene', () => {
        const teapot = objectManager.addTeapot();
        expect(scene.children.includes(teapot)).toBe(true);
        expect(teapot.type).toBe('Mesh');
        expect(teapot.geometry.type).toBe('BufferGeometry');
    });
});