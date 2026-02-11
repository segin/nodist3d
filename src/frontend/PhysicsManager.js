import * as CANNON from 'cannon-es';
import log from './logger.js';

export class PhysicsManager {
  constructor(scene) {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0); // m/s^2
    this.scene = scene;
    this.bodies = [];
    this.bodyToIndexMap = new Map();
  }

  addBody(mesh, mass = 1, shapeType = 'box') {
    if (!mesh.geometry.parameters) {
      log.warn('Unsupported geometry for physics body. Geometry has no parameters.');
      return null;
    }
    let shape;
    switch (shapeType) {
      case 'box': {
        const halfExtents = new CANNON.Vec3(
          (mesh.geometry.parameters.width / 2) * mesh.scale.x,
          (mesh.geometry.parameters.height / 2) * mesh.scale.y,
          (mesh.geometry.parameters.depth / 2) * mesh.scale.z,
        );
        shape = new CANNON.Box(halfExtents);
        break;
      }
      case 'sphere': {
        shape = new CANNON.Sphere(mesh.geometry.parameters.radius * mesh.scale.x);
        break;
      }
      case 'cylinder': {
        shape = new CANNON.Cylinder(
          mesh.geometry.parameters.radiusTop * mesh.scale.x,
          mesh.geometry.parameters.radiusBottom * mesh.scale.x,
          mesh.geometry.parameters.height * mesh.scale.y,
          mesh.geometry.parameters.radialSegments,
        );
        break;
      }
      default: {
        log.warn('Unsupported shape type for physics body:', shapeType);
        return null;
      }
    }

    const body = new CANNON.Body({
      mass: mass,
      position: new CANNON.Vec3(mesh.position.x, mesh.position.y, mesh.position.z),
      quaternion: new CANNON.Quaternion(
        mesh.quaternion.x,
        mesh.quaternion.y,
        mesh.quaternion.z,
        mesh.quaternion.w,
      ),
      shape: shape,
    });
    this.world.addBody(body);
    const index = this.bodies.length;
    this.bodies.push({ mesh, body });
    this.bodyToIndexMap.set(body, index);
    return body;
  }

  removeBody(bodyToRemove) {
    this.world.removeBody(bodyToRemove);
    const index = this.bodyToIndexMap.get(bodyToRemove);

    if (index !== undefined) {
      const lastIndex = this.bodies.length - 1;
      const lastItem = this.bodies[lastIndex];

      if (index !== lastIndex) {
        // Swap with the last element
        this.bodies[index] = lastItem;
        // Update the index of the swapped element in the map
        this.bodyToIndexMap.set(lastItem.body, index);
      }

      // Remove the last element
      this.bodies.pop();
      this.bodyToIndexMap.delete(bodyToRemove);
    }
  }

  update(deltaTime) {
    // Use a fixed time step of 1/60 seconds, with a maximum of 10 substeps to catch up
    this.world.step(1 / 60, deltaTime, 10);

    for (const item of this.bodies) {
      item.mesh.position.copy(item.body.position);
      item.mesh.quaternion.copy(item.body.quaternion);
    }
  }
}
