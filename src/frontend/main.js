
import { SceneManager } from './SceneManager.js';
import { ObjectManager } from './ObjectManager.js';
import { Pointer } from './Pointer.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { GUI } from 'dat.gui';
import { SceneGraph } from './SceneGraph.js';
import { SceneStorage } from './SceneStorage.js';
import { History } from './History.js';
import { LightManager } from './LightManager.js';

function main() {
    const canvas = document.querySelector('#c');
    const sceneManager = new SceneManager(canvas);
    const objectManager = new ObjectManager(sceneManager.scene);
    const pointer = new Pointer(sceneManager.camera, sceneManager.scene, sceneManager.renderer);
    const sceneStorage = new SceneStorage(sceneManager.scene);
    const history = new History(sceneManager.scene);
    const lightManager = new LightManager(sceneManager.scene);

    const gui = new GUI();
    let currentObjectFolder = null;
    let currentLightFolder = null;

    function updateGUI(object) {
        if (currentObjectFolder) {
            gui.removeFolder(currentObjectFolder);
            currentObjectFolder = null;
        }
        if (currentLightFolder) {
            gui.removeFolder(currentLightFolder);
            currentLightFolder = null;
        }

        if (object) {
            if (object.isLight) {
                currentLightFolder = gui.addFolder(object.name || object.uuid);
                currentLightFolder.addColor(object, 'color').name('Color').onChange(() => history.saveState());
                currentLightFolder.add(object, 'intensity', 0, 2).name('Intensity').onChange(() => history.saveState());
                if (object.position) {
                    currentLightFolder.add(object.position, 'x', -10, 10).name('Position X').onChange(() => history.saveState());
                    currentLightFolder.add(object.position, 'y', -10, 10).name('Position Y').onChange(() => history.saveState());
                    currentLightFolder.add(object.position, 'z', -10, 10).name('Position Z').onChange(() => history.saveState());
                }
                currentLightFolder.open();
            } else {
                currentObjectFolder = gui.addFolder(object.name || object.uuid);
                currentObjectFolder.add(object.position, 'x', -5, 5).name('Position X').onChange(() => history.saveState());
                currentObjectFolder.add(object.position, 'y', -5, 5).name('Position Y').onChange(() => history.saveState());
                currentObjectFolder.add(object.position, 'z', -5, 5).name('Position Z').onChange(() => history.saveState());
                currentObjectFolder.add(object.rotation, 'x', -Math.PI, Math.PI).name('Rotation X').onChange(() => history.saveState());
                currentObjectFolder.add(object.rotation, 'y', -Math.PI, Math.PI).name('Rotation Y').onChange(() => history.saveState());
                currentObjectFolder.add(object.rotation, 'z', -Math.PI, Math.PI).name('Rotation Z').onChange(() => history.saveState());
                currentObjectFolder.add(object.scale, 'x', 0.1, 5).name('Scale X').onChange(() => history.saveState());
                currentObjectFolder.add(object.scale, 'y', 0.1, 5).name('Scale Y').onChange(() => history.saveState());
                currentObjectFolder.add(object.scale, 'z', 0.1, 5).name('Scale Z').onChange(() => history.saveState());
                if (object.material) {
                    const materialFolder = currentObjectFolder.addFolder('Material');
                    if (object.material.color) {
                        materialFolder.addColor(object.material, 'color').name('Color').onChange(() => history.saveState());
                    }
                    if (object.material.roughness !== undefined) {
                        materialFolder.add(object.material, 'roughness', 0, 1).name('Roughness').onChange(() => history.saveState());
                    }
                    if (object.material.metalness !== undefined) {
                        materialFolder.add(object.material, 'metalness', 0, 1).name('Metalness').onChange(() => history.saveState());
                    }
                    materialFolder.add({
                        addTexture: () => {
                            objectManager.addTexture(object, 'assets/placeholder_texture.png');
                            history.saveState();
                        }
                    }, 'addTexture').name('Add Texture');
                    materialFolder.open();
                }
                currentObjectFolder.open();
            }
        }
    }

    const lightFolder = gui.addFolder('Lights');
    lightFolder.add({
        addAmbientLight: () => {
            const light = lightManager.addLight('AmbientLight', 0x404040, 1);
            light.name = 'AmbientLight';
            history.saveState();
            sceneGraph.update();
        }
    }, 'addAmbientLight').name('Add Ambient Light');
    lightFolder.add({
        addDirectionalLight: () => {
            const light = lightManager.addLight('DirectionalLight', 0xffffff, 1, { x: 1, y: 1, z: 1 });
            light.name = 'DirectionalLight';
            history.saveState();
            sceneGraph.update();
        }
    }, 'addDirectionalLight').name('Add Directional Light');
    lightFolder.add({
        addPointLight: () => {
            const light = lightManager.addLight('PointLight', 0xffffff, 1, { x: 0, y: 0, z: 0 });
            light.name = 'PointLight';
            history.saveState();
            sceneGraph.update();
        }
    }, 'addPointLight').name('Add Point Light');
    lightFolder.open();

    const transformControls = new TransformControls(sceneManager.camera, sceneManager.renderer.domElement);
    sceneManager.scene.add(transformControls);

    transformControls.addEventListener('dragging-changed', function (event) {
        // sceneManager.controls.enabled = !event.value; // Assuming sceneManager.controls exists for camera movement
        if (!event.value) {
            history.saveState();
        }
    });

    pointer.renderer.domElement.addEventListener('pointerdown', (event) => {
        pointer.onPointerDown(event);
        if (pointer.selectedObject) {
            transformControls.attach(pointer.selectedObject);
            updateGUI(pointer.selectedObject);
            sceneGraph.update();
        } else {
            transformControls.detach();
            updateGUI(null);
            sceneGraph.update();
        }
    });

    function animate() {
        transformControls.update();
        sceneManager.controls.update(); // Update OrbitControls
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
    const sceneGraph = new SceneGraph(sceneManager.scene, sceneGraphElement, transformControls, updateGUI);

    function createAddButton(text, addMethod) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', () => {
            const newObject = addMethod();
            transformControls.attach(newObject);
            updateGUI(newObject);
            sceneGraph.update();
            history.saveState();
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

    // Add Save/Load buttons
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Scene';
    saveButton.addEventListener('click', () => {
        sceneStorage.saveScene();
    });
    ui.appendChild(saveButton);

    const loadInput = document.createElement('input');
    loadInput.type = 'file';
    loadInput.accept = '.nodist3d';
    loadInput.style.display = 'none'; // Hide the input
    loadInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            const loadedData = await sceneStorage.loadScene(file);
            // Recreate objects in the scene based on loadedData
            // This part needs more sophisticated logic to recreate specific primitive types
            // For now, it will just clear the scene and add a default cube.
            transformControls.detach();
            updateGUI(null);
            sceneGraph.update();
            history.saveState(); // Save state after loading
        }
    });
    ui.appendChild(loadInput);

    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load Scene';
    loadButton.addEventListener('click', () => {
        loadInput.click(); // Trigger the hidden file input
    });
    ui.appendChild(loadButton);

    // Add Undo/Redo buttons
    const undoButton = document.createElement('button');
    undoButton.textContent = 'Undo';
    undoButton.addEventListener('click', () => {
        history.undo();
        sceneGraph.update();
        transformControls.detach();
        updateGUI(null);
    });
    ui.appendChild(undoButton);

    const redoButton = document.createElement('button');
    redoButton.textContent = 'Redo';
    redoButton.addEventListener('click', () => {
        history.redo();
        sceneGraph.update();
        transformControls.detach();
        updateGUI(null);
    });
    ui.appendChild(redoButton);

    // Initial save state
    history.saveState();
}

main();
