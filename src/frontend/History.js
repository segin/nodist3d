
export class History {
    constructor(scene) {
        this.scene = scene;
        this.history = [];
        this.currentIndex = -1;
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
        const newScene = loader.parse(state);

        // Clear current scene
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }

        // Add objects from the restored scene
        newScene.children.forEach(object => {
            this.scene.add(object);
        });
    }
}
