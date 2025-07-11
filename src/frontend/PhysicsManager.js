import * as CANNON from 'cannon-es';
import log from './logger.js';

export class PhysicsManager {
    constructor(scene) {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0); // m/s^2
        this.scene = scene;
        this.bodies = [];
    }

    addBody(mesh, mass = 1, shapeType = 'box') {
        if (!mesh.geometry.parameters) {
            log.warn("Unsupported geometry for physics body. Geometry has no parameters.");
            return null;
        }
        let shape;
        if (shapeType === 'box') {
            const halfExtents = new CANNON.Vec3(mesh.geometry.parameters.width / 2 * mesh.scale.x, mesh.geometry.parameters.height / 2 * mesh.scale.y, mesh.geometry.parameters.depth / 2 * mesh.scale.z);
            shape = new CANNON.Box(halfExtents);
        } else if (shapeType === 'sphere') {
            shape = new CANNON.Sphere(mesh.geometry.parameters.radius * mesh.scale.x);
        } else if (shapeType === 'cylinder') {
            shape = new CANNON.Cylinder(mesh.geometry.parameters.radiusTop * mesh.scale.x, mesh.geometry.parameters.radiusBottom * mesh.scale.x, mesh.geometry.parameters.height * mesh.scale.y, mesh.geometry.parameters.radialSegments);
        } else {
            log.warn("Unsupported shape type for physics body:", shapeType);
            return null;
        }

        const body = new CANNON.Body({
            mass: mass,
            position: new CANNON.Vec3(mesh.position.x, mesh.position.y, mesh.position.z),
            quaternion: new CANNON.Quaternion(mesh.quaternion.x, mesh.quaternion.y, mesh.quaternion.z, mesh.quaternion.w),
            shape: shape
        });
        this.world.addBody(body);
        this.bodies.push({ mesh, body });
        return body;
    }

    removeBody(bodyToRemove) {
        this.world.removeBody(bodyToRemove);
        this.bodies = this.bodies.filter(item => item.body !== bodyToRemove);
    }

    update(deltaTime) {
        this.world.step(deltaTime); // Update physics world

        for (const item of this.bodies) {
            item.mesh.position.copy(item.body.position);
            item.mesh.quaternion.copy(item.body.quaternion);
        }
    }
}
