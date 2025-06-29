import * as THREE from 'three';

export class Pointer {
    constructor(camera, scene, renderer) {
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.selectedObject = null;
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
            this.selectedObject = intersects[0].object;
            console.log('Selected object:', this.selectedObject);
        } else {
            this.selectedObject = null;
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
}