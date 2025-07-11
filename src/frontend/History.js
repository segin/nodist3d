import * as THREE from 'three';
import { Events } from './constants.js';

export class History {
    constructor(scene, eventBus) {
        this.scene = scene;
        this.eventBus = eventBus;
        this.history = [];
        this.currentIndex = -1;
        this.transformControls = null;

        this.eventBus.subscribe(Events.HISTORY_CHANGE, () => this.saveState());
        this.eventBus.subscribe(Events.OBJECT_ADDED, () => this.saveState());
        this.eventBus.subscribe(Events.LIGHT_ADDED, () => this.saveState());
        this.eventBus.subscribe(Events.GROUP_ADDED, () => this.saveState());
    }

    setTransformControls(controls) {
        this.transformControls = controls;
    }

    // Save the current state of the scene
    saveState() {
        const state = this.scene.toJSON();
        if (this.history.length > 0 && JSON.stringify(state) === JSON.stringify(this.history[this.currentIndex])) {
            return;
        }
        this.history = this.history.slice(0, this.currentIndex + 1);
        this.history.push(state);
        this.currentIndex++;
    }

    // Undo the last action
    undo() {
        if (this.transformControls) {
            this.transformControls.detach();
        }
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.restoreState();
        }
    }

    // Redo the last undone action
    redo() {
        if (this.transformControls) {
            this.transformControls.detach();
        }
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            this.restoreState();
        }
    }

    // Restore a specific state from the history
    restoreState() {
        if (this.transformControls) {
            this.transformControls.detach();
        }
        const state = this.history[this.currentIndex];
        const loader = new THREE.ObjectLoader();
        loader.parse(state, (newScene) => {
            this.scene.children.slice().forEach(child => {
                this.scene.remove(child);
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
            newScene.children.slice().forEach(child => {
                this.scene.add(child);
            });
        });
    }
}