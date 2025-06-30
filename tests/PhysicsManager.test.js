import { Scene } from 'three';
import { PhysicsManager } from '../src/frontend/PhysicsManager.js';
import { ObjectManager } from '../src/frontend/ObjectManager.js';
import { PrimitiveFactory } from '../src/frontend/PrimitiveFactory.js';
import * as CANNON from 'cannon-es';

describe('PhysicsManager', () => {
    let scene;
    let physicsManager;
    let objectManager;
    let primitiveFactory;

    beforeEach(() => {
        scene = new Scene();
        physicsManager = new PhysicsManager(scene);
        primitiveFactory = new PrimitiveFactory();
        objectManager = new ObjectManager(scene, primitiveFactory);
    });

    it('should add a box-shaped physics body to the world', () => {
        const cube = objectManager.addPrimitive('Box');
        const body = physicsManager.addBody(cube, 1, 'box');
        expect(physicsManager.world.bodies).toContain(body);
        expect(body.shapes[0]).toBeInstanceOf(CANNON.Box);
    });

    it('should add a sphere-shaped physics body to the world', () => {
        const sphere = objectManager.addPrimitive('Sphere');
        const body = physicsManager.addBody(sphere, 1, 'sphere');
        expect(physicsManager.world.bodies).toContain(body);
        expect(body.shapes[0]).toBeInstanceOf(CANNON.Sphere);
    });

    it('should add a cylinder-shaped physics body to the world', () => {
        const cylinder = objectManager.addPrimitive('Cylinder');
        const body = physicsManager.addBody(cylinder, 1, 'cylinder');
        expect(physicsManager.world.bodies).toContain(body);
        expect(body.shapes[0]).toBeInstanceOf(CANNON.Cylinder);
    });

    it('should return null when trying to add a physics body with an unsupported shape', () => {
        const cube = objectManager.addPrimitive('Box');
        const body = physicsManager.addBody(cube, 1, 'unsupported');
        expect(body).toBeNull();
    });

    it('should update the corresponding mesh position and quaternion after a physics world step', () => {
        const cube = objectManager.addPrimitive('Box');
        const body = physicsManager.addBody(cube, 1, 'box');

        // Set initial positions
        cube.position.set(0, 0, 0);
        body.position.set(0, 10, 0);

        physicsManager.update(1 / 60);

        expect(cube.position.x).toBeCloseTo(body.position.x);
        expect(cube.position.y).toBeCloseTo(body.position.y);
        expect(cube.position.z).toBeCloseTo(body.position.z);
        expect(cube.quaternion.x).toBeCloseTo(body.quaternion.x);
        expect(cube.quaternion.y).toBeCloseTo(body.quaternion.y);
        expect(cube.quaternion.z).toBeCloseTo(body.quaternion.z);
        expect(cube.quaternion.w).toBeCloseTo(body.quaternion.w);
    });
});