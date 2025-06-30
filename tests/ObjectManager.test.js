import { Scene, TextureLoader } from 'three';
import { ObjectManager } from '../src/frontend/ObjectManager.js';
import { PrimitiveFactory } from '../src/frontend/PrimitiveFactory.js';

// Mock TextureLoader
jest.mock('three', () => {
    const originalThree = jest.requireActual('three');
    return {
        ...originalThree,
        TextureLoader: jest.fn().mockImplementation(() => {
            return {
                load: jest.fn((url, onLoad) => {
                    const texture = { url };
                    onLoad(texture);
                }),
            };
        }),
    };
});

// Mock FontLoader to prevent file loading errors in test environment
jest.mock('three/examples/jsm/loaders/FontLoader.js', () => {
    return {
        FontLoader: jest.fn().mockImplementation(() => {
            return {
                load: jest.fn((url, onLoad) => {
                    // Simulate immediate loading with a dummy font object
                    onLoad({}); 
                }),
            };
        }),
    };
});

describe('ObjectManager', () => {
    let scene;
    let objectManager;
    let primitiveFactory;

    beforeEach(() => {
        scene = new Scene();
        primitiveFactory = new PrimitiveFactory();
        objectManager = new ObjectManager(scene, primitiveFactory);
    });

    it('should add a cube to the scene', () => {
        const cube = objectManager.addPrimitive('Box');
        expect(scene.children.includes(cube)).toBe(true);
        expect(cube.type).toBe('Mesh');
        expect(cube.geometry.type).toBe('BoxGeometry');
    });

    it('should add a sphere to the scene', () => {
        const sphere = objectManager.addPrimitive('Sphere');
        expect(scene.children.includes(sphere)).toBe(true);
        expect(sphere.type).toBe('Mesh');
        expect(sphere.geometry.type).toBe('SphereGeometry');
    });

    it('should add a cylinder to the scene', () => {
        const cylinder = objectManager.addPrimitive('Cylinder');
        expect(scene.children.includes(cylinder)).toBe(true);
        expect(cylinder.type).toBe('Mesh');
        expect(cylinder.geometry.type).toBe('CylinderGeometry');
    });

    it('should add a cone to the scene', () => {
        const cone = objectManager.addPrimitive('Cone');
        expect(scene.children.includes(cone)).toBe(true);
        expect(cone.type).toBe('Mesh');
        expect(cone.geometry.type).toBe('ConeGeometry');
    });

    it('should add a torus to the scene', () => {
        const torus = objectManager.addPrimitive('Torus');
        expect(scene.children.includes(torus)).toBe(true);
        expect(torus.type).toBe('Mesh');
        expect(torus.geometry.type).toBe('TorusGeometry');
    });

    it('should add a torus knot to the scene', () => {
        const torusKnot = objectManager.addPrimitive('TorusKnot');
        expect(scene.children.includes(torusKnot)).toBe(true);
        expect(torusKnot.type).toBe('Mesh');
        expect(torusKnot.geometry.type).toBe('TorusKnotGeometry');
    });

    it('should add a tetrahedron to the scene', () => {
        const tetrahedron = objectManager.addPrimitive('Tetrahedron');
        expect(scene.children.includes(tetrahedron)).toBe(true);
        expect(tetrahedron.type).toBe('Mesh');
        expect(tetrahedron.geometry.type).toBe('IcosahedronGeometry'); // Tetrahedron is a type of IcosahedronGeometry with detail 0
    });

    it('should add an icosahedron to the scene', () => {
        const icosahedron = objectManager.addPrimitive('Icosahedron');
        expect(scene.children.includes(icosahedron)).toBe(true);
        expect(icosahedron.type).toBe('Mesh');
        expect(icosahedron.geometry.type).toBe('IcosahedronGeometry');
    });

    it('should add a dodecahedron to the scene', () => {
        const dodecahedron = objectManager.addPrimitive('Dodecahedron');
        expect(scene.children.includes(dodecahedron)).toBe(true);
        expect(dodecahedron.type).toBe('Mesh');
        expect(dodecahedron.geometry.type).toBe('DodecahedronGeometry');
    });

    it('should add an octahedron to the scene', () => {
        const octahedron = objectManager.addPrimitive('Octahedron');
        expect(scene.children.includes(octahedron)).toBe(true);
        expect(octahedron.type).toBe('Mesh');
        expect(octahedron.geometry.type).toBe('OctahedronGeometry');
    });

    it('should add a plane to the scene', () => {
        const plane = objectManager.addPrimitive('Plane');
        expect(scene.children.includes(plane)).toBe(true);
        expect(plane.type).toBe('Mesh');
        expect(plane.geometry.type).toBe('PlaneGeometry');
    });

    it('should add a tube to the scene', () => {
        const tube = objectManager.addPrimitive('Tube');
        expect(scene.children.includes(tube)).toBe(true);
        expect(tube.type).toBe('Mesh');
        expect(tube.geometry.type).toBe('TubeGeometry');
    });

    it('should add a teapot to the scene', () => {
        const teapot = objectManager.addPrimitive('Teapot');
        expect(scene.children.includes(teapot)).toBe(true);
        expect(teapot.type).toBe('Mesh');
        expect(teapot.geometry.type).toBe('BufferGeometry');
    });

    it('should return null when duplicating a non-existent object', () => {
        const duplicatedObject = objectManager.duplicateObject(null);
        expect(duplicatedObject).toBeNull();
    });

    it('should successfully add a texture to an object\'s material map', () => {
        const cube = objectManager.addPrimitive('Box');
        const file = new Blob(); // Mock file

        // Mock URL.createObjectURL
        global.URL.createObjectURL = jest.fn(() => 'mock-url');
        global.URL.revokeObjectURL = jest.fn();

        objectManager.addTexture(cube, file, 'map');

        // Texture loading is asynchronous, so we need to wait for the next tick
        setTimeout(() => {
            expect(cube.material.map).toEqual({ url: 'mock-url' });
            expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
            expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
        }, 0);
    });

    it('should successfully add a texture to an object\'s normal map', () => {
        const cube = objectManager.addPrimitive('Box');
        const file = new Blob(); // Mock file

        // Mock URL.createObjectURL
        global.URL.createObjectURL = jest.fn(() => 'mock-url');
        global.URL.revokeObjectURL = jest.fn();

        objectManager.addTexture(cube, file, 'normalMap');

        // Texture loading is asynchronous, so we need to wait for the next tick
        setTimeout(() => {
            expect(cube.material.normalMap).toEqual({ url: 'mock-url' });
            expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
            expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
        }, 0);
    });
});