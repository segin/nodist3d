
import { Events } from './constants.js';

export class ObjectManager {
    constructor(scene, eventBus) {
        this.scene = scene;
        this.eventBus = eventBus;
    }

    deleteObject(object) {
        if (object) {
            if (object.isGroup) {
                // Recursively delete children
                object.children.slice().forEach(child => this.deleteObject(child));
            }
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
            this.eventBus.publish(Events.OBJECT_REMOVED, object);
        }
    }
}
