
export class SceneGraph {
    constructor(scene, uiElement) {
        this.scene = scene;
        this.uiElement = uiElement;
        this.update();
    }

    update() {
        this.uiElement.innerHTML = '';
        const ul = document.createElement('ul');
        this.scene.children.forEach(object => {
            const li = document.createElement('li');
            li.textContent = object.type + (object.name ? ` (${object.name})` : '');
            ul.appendChild(li);
        });
        this.uiElement.appendChild(ul);
    }
}
