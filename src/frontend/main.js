
import { SceneManager } from './SceneManager.js';
import { ObjectManager } from './ObjectManager.js';
import { Pointer } from './Pointer.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

function main() {
    const canvas = document.querySelector('#c');
    const sceneManager = new SceneManager(canvas);
    const objectManager = new ObjectManager(sceneManager.scene);
    const pointer = new Pointer(sceneManager.camera, sceneManager.scene, sceneManager.renderer);

    const transformControls = new TransformControls(sceneManager.camera, sceneManager.renderer.domElement);
    sceneManager.scene.add(transformControls);

    transformControls.addEventListener('dragging-changed', function (event) {
        sceneManager.controls.enabled = !event.value;
    });

    pointer.renderer.domElement.addEventListener('pointerdown', (event) => {
        pointer.onPointerDown(event);
        if (pointer.selectedObject) {
            transformControls.attach(pointer.selectedObject);
        } else {
            transformControls.detach();
        }
    });

    function animate() {
        transformControls.update();
        sceneManager.render();
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    const fullscreenButton = document.getElementById('fullscreen');
    fullscreenButton.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    });

    // Add UI for adding objects
    const ui = document.getElementById('ui');

    function createAddButton(text, addMethod) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', () => {
            const newObject = addMethod();
            transformControls.attach(newObject);
        });
        ui.appendChild(button);
    }

    createAddButton('Add Cube', () => objectManager.addCube());
    createAddButton('Add Sphere', () => objectManager.addSphere());
    createAddButton('Add Cylinder', () => objectManager.addCylinder());
    createAddButton('Add Cone', () => objectManager.addCone());
    createAddButton('Add Torus', () => objectManager.addTorus());
    createAddButton('Add Torus Knot', () => objectManager.addTorusKnot());
    createAddButton('Add Tetrahedron', () => objectManager.addTetrahedron());
    createAddButton('Add Icosahedron', () => objectManager.addIcosahedron());
    createAddButton('Add Dodecahedron', () => objectManager.addDodecahedron());
    createAddButton('Add Octahedron', () => objectManager.addOctahedron());
    createAddButton('Add Plane', () => objectManager.addPlane());
    createAddButton('Add Tube', () => objectManager.addTube());
    createAddButton('Add Teapot', () => objectManager.addTeapot());

    // Add transform controls buttons
    const translateButton = document.createElement('button');
    translateButton.textContent = 'Translate';
    translateButton.addEventListener('click', () => {
        transformControls.setMode('translate');
    });
    ui.appendChild(translateButton);

    const rotateButton = document.createElement('button');
    rotateButton.textContent = 'Rotate';
    rotateButton.addEventListener('click', () => {
        transformControls.setMode('rotate');
    });
    ui.appendChild(rotateButton);

    const scaleButton = document.createElement('button');
    scaleButton.textContent = 'Scale';
    scaleButton.addEventListener('click', () => {
        transformControls.setMode('scale');
    });
    ui.appendChild(scaleButton);
}

main();
