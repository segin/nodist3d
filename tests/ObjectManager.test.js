import * as THREE from 'three';
import { ObjectManager } from '../src/frontend/ObjectManager.js';
import { PrimitiveFactory } from '../src/frontend/PrimitiveFactory.js';
import { ObjectFactory } from '../src/frontend/ObjectFactory.js';
import { ObjectPropertyUpdater } from '../src/frontend/ObjectPropertyUpdater.js';
import EventBus from '../src/frontend/EventBus.js';

// Mock FontLoader
jest.mock('three/examples/jsm/loaders/FontLoader.js', () => ({
  FontLoader: jest.fn().mockImplementation(() => ({
    load: jest.fn((url, onLoad) => {
      onLoad({
        isFont: true,
        data: {},
        generateShapes: jest.fn(() => []),
      });
    }),
  })),
}));

describe('ObjectManager', () => {
  let scene;
  let objectManager;
  let primitiveFactory;
  let objectFactory;
  let objectPropertyUpdater;
  let eventBus;

  beforeEach(() => {
    scene = new THREE.Scene();
    eventBus = EventBus;
    primitiveFactory = new PrimitiveFactory();

    // Mock createPrimitive
    jest.spyOn(primitiveFactory, 'createPrimitive').mockImplementation(function (type) {
      let geometry;
      switch (type) {
        case 'Box': geometry = new THREE.BoxGeometry(); break;
        case 'Sphere': geometry = new THREE.SphereGeometry(); break;
        case 'Cylinder': geometry = new THREE.CylinderGeometry(); break;
        case 'Cone': geometry = new THREE.ConeGeometry(); break;
        case 'Torus': geometry = new THREE.TorusGeometry(); break;
        case 'TorusKnot': geometry = new THREE.TorusKnotGeometry(); break;
        case 'Tetrahedron': geometry = new THREE.IcosahedronGeometry(); break;
        case 'Icosahedron': geometry = new THREE.IcosahedronGeometry(); break;
        case 'Dodecahedron': geometry = new THREE.DodecahedronGeometry(); break;
        case 'Octahedron': geometry = new THREE.OctahedronGeometry(); break;
        case 'Plane': geometry = new THREE.PlaneGeometry(); break;
        case 'Tube': geometry = new THREE.TubeGeometry(); break;
        case 'Teapot': geometry = new THREE.BufferGeometry(); break;
        case 'Extrude': geometry = new THREE.ExtrudeGeometry(); break;
        case 'Lathe': geometry = new THREE.LatheGeometry(); break;
        default: geometry = new THREE.BoxGeometry(); break;
      }
      const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
      mesh.name = type;
      return mesh;
    });

    objectFactory = new ObjectFactory(scene, primitiveFactory, eventBus);
    objectPropertyUpdater = new ObjectPropertyUpdater(primitiveFactory);

    objectManager = new ObjectManager(
      scene,
      eventBus,
      null,
      primitiveFactory,
      objectFactory,
      objectPropertyUpdater,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should add a cube to the scene', async () => {
    const cube = await objectManager.addPrimitive('Box');
    expect(scene.children).toContain(cube);
    expect(cube.type).toBe('Mesh');
    expect(cube.geometry.type).toBe('BoxGeometry');
  });

  it('should add a sphere to the scene', async () => {
    const sphere = await objectManager.addPrimitive('Sphere');
    expect(scene.children).toContain(sphere);
    expect(sphere.geometry.type).toBe('SphereGeometry');
  });

  it('should return null when duplicating a non-existent object', () => {
    const duplicatedObject = objectManager.duplicateObject(null);
    expect(duplicatedObject).toBeNull();
  });

  it("should successfully add a texture to an object's material map", (done) => {
    objectManager.addPrimitive('Box').then((cube) => {
      const file = new Blob();
      global.URL.createObjectURL = jest.fn(() => 'mock-url');
      global.URL.revokeObjectURL = jest.fn();

      // Mock TextureLoader behavior
      const mockLoader = {
          load: jest.fn((url, onLoad) => onLoad(new THREE.Texture()))
      };
      jest.spyOn(THREE, 'TextureLoader').mockImplementation(() => mockLoader);

      objectManager.addTexture(cube, file, 'map');

      setTimeout(() => {
        expect(cube.material.map).toBeDefined();
        expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
        expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
        done();
      }, 0);
    });
  });

  it("should successfully add a texture to an object's normal map", (done) => {
    objectManager.addPrimitive('Box').then((cube) => {
      const file = new Blob();
      global.URL.createObjectURL = jest.fn(() => 'mock-url');
      global.URL.revokeObjectURL = jest.fn();

      const mockLoader = {
          load: jest.fn((url, onLoad) => onLoad(new THREE.Texture()))
      };
      jest.spyOn(THREE, 'TextureLoader').mockImplementation(() => mockLoader);

      objectManager.addTexture(cube, file, 'normalMap');

      setTimeout(() => {
        expect(cube.material.normalMap).toBeDefined();
        done();
      }, 0);
    });
  });

  it("should successfully add a texture to an object's roughness map", (done) => {
    objectManager.addPrimitive('Box').then((cube) => {
      const file = new Blob();
      global.URL.createObjectURL = jest.fn(() => 'mock-url');
      global.URL.revokeObjectURL = jest.fn();

      const mockLoader = {
          load: jest.fn((url, onLoad) => onLoad(new THREE.Texture()))
      };
      jest.spyOn(THREE, 'TextureLoader').mockImplementation(() => mockLoader);

      objectManager.addTexture(cube, file, 'roughnessMap');

      setTimeout(() => {
        expect(cube.material.roughnessMap).toBeDefined();
        done();
      }, 0);
    });
  });

  it('should handle adding a texture to an object with no material', async () => {
    const cube = await objectManager.addPrimitive('Box');
    cube.material = undefined;
    const file = new Blob();

    expect(() => {
      objectManager.addTexture(cube, file, 'map');
    }).not.toThrow();
  });

  it("should properly dispose of an object's geometry and material on deletion", async () => {
    const cube = await objectManager.addPrimitive('Box');
    const geometryDisposeSpy = jest.spyOn(cube.geometry, 'dispose');
    const materialDisposeSpy = jest.spyOn(cube.material, 'dispose');

    objectManager.deleteObject(cube);

    expect(geometryDisposeSpy).toHaveBeenCalled();
    expect(materialDisposeSpy).toHaveBeenCalled();
  });

  it('should handle the deletion of an already deleted object', async () => {
    const cube = await objectManager.addPrimitive('Box');
    objectManager.deleteObject(cube);

    expect(() => {
      objectManager.deleteObject(cube);
    }).not.toThrow();
  });

  it("should successfully update an object's material color", async () => {
    const cube = await objectManager.addPrimitive('Box');
    const newColor = 0x123456;
    objectManager.updateMaterial(cube, { color: newColor });
    expect(cube.material.color.getHex()).toBe(newColor);
  });

  it('should handle updating a material property that does not exist', async () => {
    const cube = await objectManager.addPrimitive('Box');
    expect(() => {
      objectManager.updateMaterial(cube, { nonExistentProperty: 'someValue' });
    }).not.toThrow();
  });

  it('should successfully create a text object when the font is loaded', async () => {
    const textObject = await objectManager.addPrimitive('Text', { text: 'Hello' });
    expect(textObject).not.toBeNull();
    expect(textObject.type).toBe('Mesh');
  });

  it('should ensure a duplicated object is a deep clone, not a reference', async () => {
    const originalCube = await objectManager.addPrimitive('Box');
    originalCube.position.set(1, 2, 3);
    originalCube.material.color.setHex(0xff0000);

    const duplicatedCube = objectManager.duplicateObject(originalCube);

    expect(duplicatedCube).not.toBe(originalCube);
    expect(duplicatedCube.uuid).not.toBe(originalCube.uuid);
    expect(duplicatedCube.position.x).toBe(originalCube.position.x + 0.5);
  });

  it('should ensure that deleting a group also removes all its children from the scene', () => {
    const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
    const group = new THREE.Group();
    group.add(mesh1);
    scene.add(group);

    objectManager.deleteObject(group);

    expect(scene.children).not.toContain(group);
  });

  it('should handle `updateMaterial` for an object with an array of materials', () => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), [
      new THREE.MeshBasicMaterial({ color: 0xff0000 }),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    ]);
    scene.add(mesh);

    objectManager.updateMaterial(mesh, { color: 0x0000ff });

    expect(mesh.material[0].color.getHex()).toBe(0x0000ff);
    expect(mesh.material[1].color.getHex()).toBe(0x0000ff);
  });

  it('should return a new object with a position offset when duplicating', async () => {
    const originalObject = await objectManager.addPrimitive('Box');
    originalObject.position.set(1, 2, 3);

    const duplicatedObject = objectManager.duplicateObject(originalObject);

    expect(duplicatedObject.position.x).toBe(originalObject.position.x + 0.5);
    expect(duplicatedObject.position.y).toBe(originalObject.position.y + 0.5);
    expect(duplicatedObject.position.z).toBe(originalObject.position.z + 0.5);
  });
});
