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
        this.scene.children.forEach(object => {
            if (object.isMesh || object.isLight) {
                const li = document.createElement('li');
                const nameSpan = document.createElement('span');
                nameSpan.textContent = object.name;
                nameSpan.style.cursor = 'pointer';
                nameSpan.addEventListener('click', () => {
                    this.eventBus.emit('objectSelected', object);
                });
                li.appendChild(nameSpan);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => {
                    this.eventBus.emit('deleteObject', object);
                };
                li.appendChild(deleteButton);

                this.uiElement.appendChild(li);
            }
        });
    }
}