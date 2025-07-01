

export class Pointer extends global.THREE.EventDispatcher {
    constructor(camera, scene, renderer, eventBus) {
        super();
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.eventBus = eventBus; // Inject EventBus
        this.selectedObject = null;
        this.outline = null; // To store the outline mesh
        this.isDragging = false;

        this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this));
        this.renderer.domElement.addEventListener('pointermove', this.onPointerMove.bind(this));
        this.renderer.domElement.addEventListener('pointerup', this.onPointerUp.bind(this));
    }

    onPointerDown(event) {
        this.isDragging = true;
        this.updatePointer(event);

        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            const newSelectedObject = intersects[0].object;

            if (this.selectedObject !== newSelectedObject) {
                this.selectedObject = newSelectedObject;
                this.addOutline(this.selectedObject);
                this.eventBus.emit('selectionChange', this.selectedObject); // Emit event via EventBus
                console.log('Selected object:', this.selectedObject);
            }
        } else {
            if (this.selectedObject !== null) {
                this.selectedObject = null;
                this.removeOutline();
                this.eventBus.emit('selectionChange', null); // Emit event via EventBus
            }
        }
    }

    onPointerMove(event) {
        if (!this.isDragging || !this.selectedObject) return;

        this.updatePointer(event);
        // For now, just log the movement. Actual drag logic will be in main.js with TransformControls.
        // console.log('Dragging object:', this.selectedObject);
    }

    onPointerUp() {
        this.isDragging = false;
    }

    updatePointer(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.camera);
    }

    addOutline(object) {
        this.removeOutline(); // Remove any existing outline

        const geometry = new THREE.EdgesGeometry(object.geometry);
        const material = new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 2 });
        this.outline = new THREE.LineSegments(geometry, material);
        this.outline.renderOrder = 1; // Render outline on top
        object.add(this.outline);
    }

    removeOutline() {
        if (this.outline) {
            this.outline.parent.remove(this.outline);
            this.outline.geometry.dispose();
            this.outline.material.dispose();
            this.outline = null;
        }
    }
}