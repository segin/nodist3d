import * as THREE from 'three';

export class History {
    constructor(scene, eventBus) {
        this.scene = scene;
        this.eventBus = eventBus;
        this.history = [];
        this.currentIndex = -1;
        this.transformControls = null;

        this.eventBus.on('historyChange', () => this.saveState());
        this.eventBus.on('objectAdded', () => this.saveState());
        this.eventBus.on('lightAdded', () => this.saveState());
        this.eventBus.on('groupAdded', () => this.saveState());
    }

    setTransformControls(controls) {
        this.transformControls = controls;
    }

    // Save the current state of the scene
    saveState() {
        const state = this.scene.toJSON(); // Three.js provides a toJSON method for scenes
        this.history = this.history.slice(0, this.currentIndex + 1);
        this.history.push(state);
        this.currentIndex++;
    }

    // Undo the last action
    undo() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.restoreState();
        }
    }

    // Redo the last undone action
    redo() {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            this.restoreState();
        }
    }

    // Restore a specific state from the history
    restoreState() {
        const state = this.history[this.currentIndex];
        const loader = new THREE.ObjectLoader();
        loader.parse(state, (newScene) => {
            // Create maps of objects in the current and new scenes
            const currentObjects = new Map(this.scene.children.map(obj => [obj.uuid, obj]));
            const newObjects = new Map(newScene.children.map(obj => [obj.uuid, obj]));

            // Remove objects that are in the current scene but not in the new one
            for (const [uuid, object] of currentObjects) {
                if (!newObjects.has(uuid)) {
                    this.scene.remove(object);
                }
            }

            // Add or update objects that are in the new scene
            for (const [uuid, newObject] of newObjects) {
                const currentObject = currentObjects.get(uuid);
                if (currentObject) {
                    // Object exists, so update its properties
                    currentObject.position.copy(newObject.position);
                    currentObject.rotation.copy(newObject.rotation);
                    currentObject.scale.copy(newObject.scale);
                    if (currentObject.material && newObject.material) {
                        currentObject.material.color.copy(newObject.material.color);
                        currentObject.material.roughness = newObject.material.roughness;
                        currentObject.material.metalness = newObject.material.metalness;
                    }
                } else {
                    // Object is new, so add it to the scene
                    this.scene.add(newObject);
                }
            }
        });
    }
}