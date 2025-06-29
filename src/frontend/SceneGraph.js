import * as THREE from 'three';

export class SceneGraph {
    constructor(scene, uiElement, transformControls, updateGUI) {
        this.scene = scene;
        this.uiElement = uiElement;
        this.transformControls = transformControls;
        this.updateGUI = updateGUI;
        this.update();

        // Listen for changes in the scene (e.g., object added/removed)
        // This is a simplified approach; for complex scenes, consider a more robust event system.
        this.scene.addEventListener('added', this.update.bind(this));
        this.scene.addEventListener('removed', this.update.bind(this));
    }

    update() {
        this.uiElement.innerHTML = '';
        const ul = document.createElement('ul');

        this.scene.children.forEach(object => {
            if (object instanceof THREE.Mesh) { // Only show Mesh objects in the scene graph
                const li = document.createElement('li');

                const nameSpan = document.createElement('span');
                nameSpan.textContent = object.name || object.type;
                nameSpan.style.cursor = 'pointer';
                nameSpan.addEventListener('click', () => {
                    this.transformControls.attach(object);
                    this.updateGUI(object);
                });
                li.appendChild(nameSpan);

                const renameInput = document.createElement('input');
                renameInput.type = 'text';
                renameInput.value = object.name || '';
                renameInput.placeholder = 'Rename';
                renameInput.style.marginLeft = '5px';
                renameInput.addEventListener('change', (event) => {
                    object.name = event.target.value;
                    this.update(); // Re-render the list to show new name
                });
                li.appendChild(renameInput);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.style.marginLeft = '5px';
                deleteButton.addEventListener('click', () => {
                    this.scene.remove(object);
                    this.transformControls.detach();
                    this.updateGUI(null);
                    this.update(); // Re-render the list after deletion
                });
                li.appendChild(deleteButton);

                ul.appendChild(li);
            }
        });
        this.uiElement.appendChild(ul);
    }
}