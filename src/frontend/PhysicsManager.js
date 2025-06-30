import * as CANNON from 'cannon-es';

export class PhysicsManager {
    constructor(scene) {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0); // m/s^2
        this.scene = scene;
        this.bodies = [];
    }

    addBody(mesh, mass = 1, shapeType = 'box') {
        let shape;
        if (shapeType === 'box') {
            const halfExtents = new CANNON.Vec3(mesh.geometry.parameters.width / 2, mesh.geometry.parameters.height / 2, mesh.geometry.parameters.depth / 2);
            shape = new CANNON.Box(halfExtents);
        } else if (shapeType === 'sphere') {
            shape = new CANNON.Sphere(mesh.geometry.parameters.radius);
        } else if (shapeType === 'cylinder') {
            shape = new CANNON.Cylinder(mesh.geometry.parameters.radiusTop, mesh.geometry.parameters.radiusBottom, mesh.geometry.parameters.height, mesh.geometry.parameters.radialSegments);
        } else {
            console.warn("Unsupported shape type for physics body:", shapeType);
            return null;
        }

        const body = new CANNON.Body({
            mass: mass,
            position: new CANNON.Vec3(mesh.position.x, mesh.position.y, mesh.position.z),
            shape: shape
        });
        this.world.addBody(body);
        this.bodies.push({ mesh, body });
        return body;
    }

    update(deltaTime) {
        this.world.step(1 / 60, deltaTime); // Update physics world

        for (const item of this.bodies) {
            item.mesh.position.copy(item.body.position);
            item.mesh.quaternion.copy(item.body.quaternion);
        }
    }
}
