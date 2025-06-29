
import { SceneManager } from './SceneManager.js';
import { ObjectManager } from './ObjectManager.js';
import { Pointer } from './Pointer.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { GUI } from 'dat.gui';
import { SceneGraph } from './SceneGraph.js';

function main() {
    const canvas = document.querySelector('#c');
    const sceneManager = new SceneManager(canvas);
    const objectManager = new ObjectManager(sceneManager.scene);
    const pointer = new Pointer(sceneManager.camera, sceneManager.scene, sceneManager.renderer);

    const gui = new GUI();
    let currentObjectFolder = null;

    function updateGUI(object) {
        if (currentObjectFolder) {
            gui.removeFolder(currentObjectFolder);
        }

        if (object) {
            currentObjectFolder = gui.addFolder(object.uuid);
            currentObjectFolder.add(object.position, 'x', -5, 5).name('Position X');
            currentObjectFolder.add(object.position, 'y', -5, 5).name('Position Y');
            currentObjectFolder.add(object.position, 'z', -5, 5).name('Position Z');
            currentObjectFolder.add(object.rotation, 'x', -Math.PI, Math.PI).name('Rotation X');
            currentObjectFolder.add(object.rotation, 'y', -Math.PI, Math.PI).name('Rotation Y');
            currentObjectFolder.add(object.rotation, 'z', -Math.PI, Math.PI).name('Rotation Z');
            currentObjectFolder.add(object.scale, 'x', 0.1, 5).name('Scale X');
            currentObjectFolder.add(object.scale, 'y', 0.1, 5).name('Scale Y');
            currentObjectFolder.add(object.scale, 'z', 0.1, 5).name('Scale Z');
            if (object.material && object.material.color) {
                currentObjectFolder.addColor(object.material, 'color').name('Color');
            }
            currentObjectFolder.open();
        }
    }

    const transformControls = new TransformControls(sceneManager.camera, sceneManager.renderer.domElement);
    sceneManager.scene.add(transformControls);

    transformControls.addEventListener('dragging-changed', function (event) {
        // sceneManager.controls.enabled = !event.value; // Assuming sceneManager.controls exists for camera movement
    });

    pointer.renderer.domElement.addEventListener('pointerdown', (event) => {
        pointer.onPointerDown(event);
        if (pointer.selectedObject) {
            transformControls.attach(pointer.selectedObject);
            updateGUI(pointer.selectedObject);
        } else {
            transformControls.detach();
            updateGUI(null);
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
    const sceneGraphElement = document.getElementById('scene-graph');
    const sceneGraph = new SceneGraph(sceneManager.scene, sceneGraphElement);

    function createAddButton(text, addMethod) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', () => {
            const newObject = addMethod();
            transformControls.attach(newObject);
            updateGUI(newObject);
            sceneGraph.update();
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
