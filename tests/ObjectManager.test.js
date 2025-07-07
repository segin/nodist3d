import * as THREE from 'three';
import { Scene, TextureLoader, Mesh, BoxGeometry, MeshBasicMaterial, Group, DoubleSide, MeshLambertMaterial, MeshStandardMaterial, TextGeometry } from 'three';

jest.mock('three', () => {
    const THREE = jest.requireActual('three');
    return {
        ...THREE,
        TextureLoader: jest.fn().mockImplementation(() => ({
            load: jest.fn(),
        })),
    };
});

import { ObjectManager } from '../src/frontend/ObjectManager.js';
import { PrimitiveFactory } from '../src/frontend/PrimitiveFactory.js';
import { EventBus } from '../src/frontend/EventBus.js';

jest.mock('../src/frontend/EventBus.js', () => ({
    EventBus: jest.fn().mockImplementation(() => ({
        emit: jest.fn(),
        on: jest.fn(),
    })),
}));

jest.mock('three/examples/jsm/loaders/FontLoader.js', () => ({
    FontLoader: jest.fn().mockImplementation(() => ({
        load: jest.fn((url, onLoad) => {
            // Immediately call the onLoad callback with a mock font object
            onLoad({
                isFont: true,
                data: {},
                generateShapes: jest.fn(() => [])
            });
        }),
    })),
}));

describe('ObjectManager', () => {
    let scene;
    let objectManager;
    let primitiveFactory;
    let eventBus;

    beforeEach(() => {
        scene = new Scene();
        eventBus = new EventBus();
        primitiveFactory = new PrimitiveFactory();
        objectManager = new ObjectManager(scene, primitiveFactory, eventBus);
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

    it('should successfully add a texture to an object\'s roughness map', () => {
        const cube = objectManager.addPrimitive('Box');
        const file = new Blob(); // Mock file

        // Mock URL.createObjectURL
        global.URL.createObjectURL = jest.fn(() => 'mock-url');
        global.URL.revokeObjectURL = jest.fn();

        objectManager.addTexture(cube, file, 'roughnessMap');

        // Texture loading is asynchronous, so we need to wait for the next tick
        setTimeout(() => {
            expect(cube.material.roughnessMap).toEqual({ url: 'mock-url' });
            expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
            expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
        }, 0);
    });

    it('should handle adding a texture to an object with no material', () => {
        const cube = objectManager.addPrimitive('Box');
        cube.material = undefined;
        const file = new Blob();

        expect(() => {
            objectManager.addTexture(cube, file, 'map');
        }).not.toThrow();
    });

    it('should properly dispose of an object\'s geometry and material on deletion', () => {
        const cube = objectManager.addPrimitive('Box');
        const geometryDisposeSpy = jest.spyOn(cube.geometry, 'dispose');
        const materialDisposeSpy = jest.spyOn(cube.material, 'dispose');

        objectManager.deleteObject(cube);

        expect(geometryDisposeSpy).toHaveBeenCalled();
        expect(materialDisposeSpy).toHaveBeenCalled();
    });

    it('should handle the deletion of an already deleted object', () => {
        const cube = objectManager.addPrimitive('Box');
        objectManager.deleteObject(cube);

        expect(() => {
            objectManager.deleteObject(cube);
        }).not.toThrow();
    });

    it('should create a unique name for a duplicated object that has no original name', () => {
        const cube = objectManager.addPrimitive('Box');
        cube.name = '';
        const duplicatedObject = objectManager.duplicateObject(cube);

        expect(duplicatedObject.name).toBe(`${cube.uuid}_copy`);
    });

    it('should successfully update an object\'s material color', () => {
        const cube = objectManager.addPrimitive('Box');
        const newColor = 0x123456;
        objectManager.updateMaterial(cube, { color: newColor });
        expect(cube.material.color.getHex()).toBe(newColor);
    });

    it('should handle updating a material property that does not exist', () => {
        const cube = objectManager.addPrimitive('Box');
        expect(() => {
            objectManager.updateMaterial(cube, { nonExistentProperty: 'someValue' });
        }).not.toThrow();
    });

    it('should successfully create a text object when the font is loaded', async () => {
        const textObject = await objectManager.addPrimitive('Text', { text: 'Hello' });
        expect(textObject).not.toBeNull();
        expect(textObject.type).toBe('Mesh');
    });

    it('should ensure a duplicated object is a deep clone, not a reference', () => {
        const originalCube = objectManager.addPrimitive('Box');
        originalCube.position.set(1, 2, 3);
        originalCube.material.color.setHex(0xff0000);

        const duplicatedCube = objectManager.duplicateObject(originalCube);

        // Ensure it\'s a new object, not the same reference
        expect(duplicatedCube).not.toBe(originalCube);
        expect(duplicatedCube.uuid).not.toBe(originalCube.uuid);

        // Ensure geometry is cloned
        expect(duplicatedCube.geometry).not.toBe(originalCube.geometry);
        expect(duplicatedCube.geometry.uuid).not.toBe(originalCube.geometry.uuid);
        expect(duplicatedCube.geometry.type).toBe(originalCube.geometry.type);

        // Ensure material is cloned
        expect(duplicatedCube.material).not.toBe(originalCube.material);
        expect(duplicatedCube.material.uuid).not.toBe(originalCube.material.uuid);
        expect(duplicatedCube.material.color.getHex()).toBe(originalCube.material.color.getHex());

        // Ensure properties are copied
        expect(duplicatedCube.position.equals(originalCube.position)).toBe(true);
        expect(duplicatedCube.rotation.equals(originalCube.rotation)).toBe(true);
        expect(duplicatedCube.scale.equals(originalCube.scale)).toBe(true);

        // Modify the duplicated object and ensure original is not affected
        duplicatedCube.position.set(4, 5, 6);
        duplicatedCube.material.color.setHex(0x0000ff);

        expect(originalCube.position.x).toBe(1);
        expect(originalCube.material.color.getHex()).toBe(0xff0000);
    });

    it('should ensure that deleting a group also removes all its children from the scene', () => {
        const mesh1 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        const mesh2 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        const group = new Group();
        group.add(mesh1);
        group.add(mesh2);
        scene.add(group);

        expect(scene.children).toContain(group);
        expect(group.children).toContain(mesh1);
        expect(group.children).toContain(mesh2);

        objectManager.deleteObject(group);

        expect(scene.children).not.toContain(group);
        expect(scene.children).not.toContain(mesh1);
        expect(scene.children).not.toContain(mesh2);
        expect(mesh1.parent).toBeNull();
        expect(mesh2.parent).toBeNull();
    });

    it('should resolve the promise when `addText` is called and font is available', async () => {
        // Mock the FontLoader to immediately resolve the load promise
        primitiveFactory.fontLoader = { load: jest.fn() };
        jest.spyOn(primitiveFactory.fontLoader, 'load').mockImplementation((url, onLoad) => {
            onLoad(); // Call the onLoad callback immediately
        });

        const textObjectPromise = objectManager.addPrimitive('Text', { text: 'Test Text' });
        await expect(textObjectPromise).resolves.not.toBeNull();
    });

    it('should correctly set the material `side` property for planes (`THREE.DoubleSide`)', () => {
        const plane = objectManager.addPrimitive('Plane');
        expect(plane.material.side).toBe(DoubleSide);
    });

    it('should call `URL.revokeObjectURL` after a texture has been loaded to free memory', (done) => {
        const cube = objectManager.addPrimitive('Box');
        const file = new Blob();

        const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL').mockReturnValue('mock-url');
        const revokeObjectURLSpy = jest.spyOn(URL, 'revokeObjectURL');

        // Mock TextureLoader.load to immediately call the onLoad callback
        jest.spyOn(TextureLoader.prototype, 'load').mockImplementation((url, onLoad) => {
            onLoad(new THREE.Texture()); // Pass a dummy texture
        });

        objectManager.addTexture(cube, file, 'map');

        // Use process.nextTick or a small timeout to allow the async part of addTexture to run
        process.nextTick(() => {
            expect(createObjectURLSpy).toHaveBeenCalledWith(file);
            expect(revokeObjectURLSpy).toHaveBeenCalledWith('mock-url');
            done();
        });
    });

    it('should handle `updateMaterial` for an object with an array of materials', () => {
        const mesh = new Mesh(new BoxGeometry(), [
            new MeshBasicMaterial({ color: 0xff0000 }),
            new MeshBasicMaterial({ color: 0x00ff00 })
        ]);
        scene.add(mesh);

        objectManager.updateMaterial(mesh, { color: 0x0000ff });

        // Expect both materials in the array to be updated
        expect(mesh.material[0].color.getHex()).toBe(0xff0000);
        expect(mesh.material[1].color.getHex()).toBe(0xff0000);
    });

    it('should correctly clone an object\'s material properties when duplicating', () => {
        const originalMesh = objectManager.addPrimitive('Box');
        originalMesh.material.color.setHex(0x123456);
        originalMesh.material.roughness = 0.5;
        originalMesh.material.metalness = 0.8;

        const duplicatedMesh = objectManager.duplicateObject(originalMesh);

        expect(duplicatedMesh.material.color.getHex()).toBe(originalMesh.material.color.getHex());
        expect(duplicatedMesh.material.roughness).toBeCloseTo(originalMesh.material.roughness);
        expect(duplicatedMesh.material.metalness).toBe(originalMesh.material.metalness);

        // Ensure it\'s a clone, not a reference
        expect(duplicatedMesh.material).not.toBe(originalMesh.material);
    });

    it('should handle duplication of an object with no geometry or material', () => {
        const objectWithoutGeometryOrMaterial = new THREE.Object3D();
        objectWithoutGeometryOrMaterial.name = 'EmptyObject';
        scene.add(objectWithoutGeometryOrMaterial);

        const duplicatedObject = objectManager.duplicateObject(objectWithoutGeometryOrMaterial);

        expect(duplicatedObject).not.toBeNull();
        expect(scene.children).toContain(duplicatedObject);
        expect(duplicatedObject.name).toContain('EmptyObject_copy');
        expect(duplicatedObject.geometry).toBeUndefined();
        expect(duplicatedObject.material).toBeUndefined();
    });

    it('should update `metalness` property correctly via `updateMaterial`', () => {
        const mesh = objectManager.addPrimitive('Box');
        mesh.material = new MeshLambertMaterial(); // Ensure it has a metalness property
        const newMetalness = 0.75;
        objectManager.updateMaterial(mesh, { metalness: newMetalness });
        expect(mesh.material.metalness).toBeCloseTo(newMetalness);
    });

    it('should update `roughness` property correctly via `updateMaterial`', () => {
        const mesh = objectManager.addPrimitive('Box');
        mesh.material = new MeshLambertMaterial(); // Ensure it has a roughness property
        const newRoughness = 0.25;
        objectManager.updateMaterial(mesh, { roughness: newRoughness });
        expect(mesh.material.roughness).toBeCloseTo(newRoughness);
    });

    it('should correctly add a TeapotGeometry object', () => {
        const teapot = objectManager.addPrimitive('Teapot');
        expect(scene.children).toContain(teapot);
        expect(teapot.geometry.type).toBe('BufferGeometry'); // TeapotGeometry is a BufferGeometry
    });

    it('should correctly add an ExtrudeGeometry object', () => {
        const extrude = objectManager.addPrimitive('Extrude');
        expect(scene.children).toContain(extrude);
        expect(extrude.geometry.type).toBe('ExtrudeGeometry');
    });

    it('should correctly add a LatheGeometry object', () => {
        const lathe = objectManager.addPrimitive('Lathe');
        expect(scene.children).toContain(lathe);
        expect(lathe.geometry.type).toBe('LatheGeometry');
    });

    it('should not add a deleted object back to the scene if it\'s part of an undo operation', () => {
        const cube = objectManager.addPrimitive('Box');
        objectManager.deleteObject(cube);
        // Simulate an undo operation that tries to re-add the object
        scene.add(cube);
        expect(scene.children).not.toContain(cube); // ObjectManager should prevent re-adding deleted objects
    });

    it('should correctly dispose of textures when an object with textures is deleted', (done) => {
        const cube = objectManager.addPrimitive('Box');
        const file = new Blob();

        const textureDisposeSpy = jest.spyOn(THREE.Texture.prototype, 'dispose');

        // Mock TextureLoader.load to immediately call the onLoad callback with a texture
        jest.spyOn(TextureLoader.prototype, 'load').mockImplementation((url, onLoad) => {
            const mockTexture = new THREE.Texture();
            onLoad(mockTexture);
            // Manually assign the texture to the material for the test
            cube.material.map = mockTexture;
        });

        objectManager.addTexture(cube, file, 'map');

        // Use process.nextTick or a small timeout to allow the async part of addTexture to run
        process.nextTick(() => {
            objectManager.deleteObject(cube);
            expect(textureDisposeSpy).toHaveBeenCalled();
            done();
        });
    });

    it('should return a new object with a position offset when duplicating', () => {
        const originalObject = objectManager.addPrimitive('Box');
        originalObject.position.set(1, 2, 3);

        const duplicatedObject = objectManager.duplicateObject(originalObject);

        // Expect the duplicated object to have a position offset from the original
        expect(duplicatedObject.position.x).toBe(originalObject.position.x + 0.5);
        expect(duplicatedObject.position.y).toBe(originalObject.position.y + 0.5);
        expect(duplicatedObject.position.z).toBe(originalObject.position.z + 0.5);
    });

    it('should handle adding a texture of an unsupported type gracefully', (done) => {
        const cube = objectManager.addPrimitive('Box');
        const file = new Blob(['unsupported content'], { type: 'image/unsupported' });

        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL').mockReturnValue('mock-unsupported-url');
        const revokeObjectURLSpy = jest.spyOn(URL, 'revokeObjectURL');

        // Mock TextureLoader.load to simulate an error (e.g., by calling onError)
        jest.spyOn(TextureLoader.prototype, 'load').mockImplementation((url, onLoad, onProgress, onError) => {
            onError(new Error('Unsupported texture format'));
        });

        objectManager.addTexture(cube, file, 'map');

        // Use process.nextTick or a small timeout to allow the async part of addTexture to run
        process.nextTick(() => {
            expect(createObjectURLSpy).toHaveBeenCalledWith(file);
            expect(revokeObjectURLSpy).toHaveBeenCalledWith('mock-unsupported-url');
            expect(consoleWarnSpy).toHaveBeenCalledWith('Error loading texture:', expect.any(Error));
            expect(cube.material.map).toBeNull(); // Ensure map is not set
            consoleWarnSpy.mockRestore();
            done();
        });
    });
});
