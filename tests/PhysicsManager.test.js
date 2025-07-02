import { Scene, BufferGeometry, Mesh, MeshBasicMaterial } from 'three';
jest.mock('three');
import { PhysicsManager } from '../src/frontend/PhysicsManager.js';
import { ObjectManager } from '../src/frontend/ObjectManager.js';
import { PrimitiveFactory } from '../src/frontend/PrimitiveFactory.js';
import { EventBus } from '../src/frontend/EventBus.js';
import * as CANNON from 'cannon-es';

jest.mock('../src/frontend/EventBus.js', () => ({
    EventBus: jest.fn().mockImplementation(() => ({
        emit: jest.fn(),
        on: jest.fn(),
    })),
}));

describe('PhysicsManager', () => {
    let scene;
    let physicsManager;
    let objectManager;
    let primitiveFactory;
    let eventBus;

    beforeEach(() => {
        scene = new Scene();
        eventBus = new EventBus();
        physicsManager = new PhysicsManager(scene);
        primitiveFactory = new PrimitiveFactory();
        objectManager = new ObjectManager(scene, primitiveFactory, eventBus);
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

    it('should create a static body when mass is set to 0', () => {
        const cube = objectManager.addPrimitive('Box');
        const body = physicsManager.addBody(cube, 0, 'box');
        expect(body.mass).toBe(0);
        expect(body.type).toBe(CANNON.Body.STATIC);
    });

    it('should correctly scale the physics shape when the associated mesh is scaled', () => {
        const cube = objectManager.addPrimitive('Box');
        cube.scale.set(2, 3, 4);
        const body = physicsManager.addBody(cube, 1, 'box');

        // For a box, the halfExtents should be scaled by the mesh's scale
        expect(body.shapes[0].halfExtents.x).toBeCloseTo(cube.geometry.parameters.width / 2 * cube.scale.x);
        expect(body.shapes[0].halfExtents.y).toBeCloseTo(cube.geometry.parameters.height / 2 * cube.scale.y);
        expect(body.shapes[0].halfExtents.z).toBeCloseTo(cube.geometry.parameters.depth / 2 * cube.scale.z);
    });

    it('should correctly orient the physics shape when the associated mesh is rotated', () => {
        const cube = objectManager.addPrimitive('Box');
        cube.rotation.x = Math.PI / 2; // Rotate 90 degrees around X axis
        cube.updateMatrixWorld(); // Update the world matrix to reflect rotation

        const body = physicsManager.addBody(cube, 1, 'box');

        // The body's quaternion should match the mesh's quaternion
        expect(body.quaternion.x).toBeCloseTo(cube.quaternion.x);
        expect(body.quaternion.y).toBeCloseTo(cube.quaternion.y);
        expect(body.quaternion.z).toBeCloseTo(cube.quaternion.z);
        expect(body.quaternion.w).toBeCloseTo(cube.quaternion.w);
    });

    it('should correctly remove a physics body from the world', () => {
        const cube = objectManager.addPrimitive('Box');
        const body = physicsManager.addBody(cube, 1, 'box');
        expect(physicsManager.world.bodies).toContain(body);

        physicsManager.removeBody(body);
        expect(physicsManager.world.bodies).not.toContain(body);
    });

    it('should not affect other bodies when one is removed', () => {
        const cube1 = objectManager.addPrimitive('Box');
        const body1 = physicsManager.addBody(cube1, 1, 'box');

        const cube2 = objectManager.addPrimitive('Box');
        const body2 = physicsManager.addBody(cube2, 1, 'box');

        expect(physicsManager.world.bodies).toContain(body1);
        expect(physicsManager.world.bodies).toContain(body2);

        physicsManager.removeBody(body1);

        expect(physicsManager.world.bodies).not.toContain(body1);
        expect(physicsManager.world.bodies).toContain(body2);
    });

    it('should synchronize the physics body\'s position with its mesh\'s position upon creation', () => {
        const cube = objectManager.addPrimitive('Box');
        cube.position.set(5, 5, 5);
        const body = physicsManager.addBody(cube, 1, 'box');

        expect(body.position.x).toBeCloseTo(cube.position.x);
        expect(body.position.y).toBeCloseTo(cube.position.y);
        expect(body.position.z).toBeCloseTo(cube.position.z);
    });

    it('should handle meshes with geometries that have no size parameters (e.g., a custom BufferGeometry)', () => {
        const customGeometry = new BufferGeometry();
        const mesh = new Mesh(customGeometry, new MeshBasicMaterial());
        scene.add(mesh);

        const body = physicsManager.addBody(mesh, 1, 'box'); // Try to add a box body
        expect(body).toBeNull(); // Should return null as it\'s an unsupported geometry
    });

    it('should apply world gravity to dynamic bodies correctly over time', () => {
        const cube = objectManager.addPrimitive('Box');
        const initialY = 10;
        cube.position.set(0, initialY, 0);
        const body = physicsManager.addBody(cube, 1, 'box'); // Dynamic body

        const deltaTime = 1 / 60; // Simulate one frame
        physicsManager.update(deltaTime);

        // Expected change in position due to gravity (simplified: y = y0 + v0*t + 0.5*a*t^2)
        // Since v0 is 0, y = y0 + 0.5 * gravity * t^2
        const expectedY = initialY + 0.5 * physicsManager.world.gravity.y * deltaTime * deltaTime;

        expect(cube.position.y).toBeLessThan(initialY);
        expect(cube.position.y).toBeCloseTo(expectedY);
    });

    it('should allow adding the same mesh to the physics world multiple times without error', () => {
        const cube = objectManager.addPrimitive('Box');
        const body1 = physicsManager.addBody(cube, 1, 'box');
        const body2 = physicsManager.addBody(cube, 1, 'box');

        expect(physicsManager.world.bodies).toContain(body1);
        expect(physicsManager.world.bodies).toContain(body2);
        expect(physicsManager.world.bodies.length).toBe(2); // Expect two bodies to be added
    });

    it('should ensure `update` method correctly steps the physics world with the provided `deltaTime`', () => {
        const initialNumSteps = physicsManager.world.fixedStep(); // Get initial number of steps
        const deltaTime = 0.1; // A custom delta time

        physicsManager.update(deltaTime);

        // Verify that the world's step function was called. This is hard to directly test
        // without mocking CANNON.World.prototype.step, but we can infer it by checking
        // if the number of steps increased.
        // Note: This test is a bit weak as it relies on internal implementation details
        // of cannon-es. A more robust test would mock CANNON.World.prototype.step.
        expect(physicsManager.world.fixedStep()).toBeGreaterThan(initialNumSteps);
    });
});