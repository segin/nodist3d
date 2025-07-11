import * as THREE from 'three';
import { Events } from './constants.js';

export class SceneGraph {
    constructor(scene, uiElement, transformControls, updateGUI, eventBus) {
        this.scene = scene;
        this.uiElement = uiElement;
        this.transformControls = transformControls;
        this.updateGUI = updateGUI;
        this.eventBus = eventBus;
        this.update();

        this.eventBus.subscribe(Events.OBJECT_ADDED, this.update.bind(this));
        this.eventBus.subscribe(Events.OBJECT_REMOVED, this.update.bind(this));
        this.eventBus.subscribe(Events.GROUP_ADDED, this.update.bind(this));
        this.eventBus.subscribe(Events.GROUP_REMOVED, this.update.bind(this));
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
                    this.eventBus.publish(Events.SELECTION_CHANGE, object);
                });
                li.appendChild(nameSpan);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => {
                    this.eventBus.publish(Events.DELETE_OBJECT, object);
                };
                li.appendChild(deleteButton);

                this.uiElement.appendChild(li);
            }
        });
    }
}