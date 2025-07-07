import * as THREE from 'three';

export class SceneGraph {
    constructor(scene, uiElement, transformControls, updateGUI, eventBus) {
        this.scene = scene;
        this.uiElement = uiElement;
        this.transformControls = transformControls;
        this.updateGUI = updateGUI;
        this.eventBus = eventBus;
        this.update();

        this.eventBus.on('objectAdded', this.update.bind(this));
        this.eventBus.on('objectRemoved', this.update.bind(this));
        this.eventBus.on('groupAdded', this.update.bind(this));
        this.eventBus.on('groupRemoved', this.update.bind(this));
    }

    update() {
        this.uiElement.innerHTML = '';
        const ul = document.createElement('ul');

        this.scene.children.forEach(object => {
            const isLight = object.isLight; // Check if the object is a light
            const isMesh = object instanceof THREE.Mesh; // Check if the object is a mesh

            if (isLight || isMesh) { // Only show Mesh objects and Lights in the scene graph
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