
import { SceneManager } from './SceneManager.js';
import { ObjectManager } from './ObjectManager.js';
import { Pointer } from './Pointer.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { GUI } from 'dat.gui';
import { SceneGraph } from './SceneGraph.js';
import { SceneStorage } from './SceneStorage.js';
import { History } from './History.js';
import { LightManager } from './LightManager.js';
import { GroupManager } from './GroupManager.js';
import { ShaderEditor } from './ShaderEditor.js';

function main() {
    const canvas = document.querySelector('#c');
    const sceneManager = new SceneManager(canvas);
    const objectManager = new ObjectManager(sceneManager.scene);
    const pointer = new Pointer(sceneManager.camera, sceneManager.scene, sceneManager.renderer);
    const sceneStorage = new SceneStorage(sceneManager.scene);
    const history = new History(sceneManager.scene);
    const lightManager = new LightManager(sceneManager.scene);
    const groupManager = new GroupManager(sceneManager.scene);
    const shaderEditor = new ShaderEditor(gui, sceneManager.renderer, sceneManager.scene, sceneManager.camera);

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
                currentLightFolder.add({ type: object.type }, 'type', ['PointLight', 'DirectionalLight', 'AmbientLight']).name('Light Type').onChange((value) => {
                    const newLight = lightManager.changeLightType(object, value);
                    transformControls.attach(newLight);
                    updateGUI(newLight);
                    sceneGraph.update();
                    history.saveState();
                });
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
                    const textureInput = document.createElement('input');
                    textureInput.type = 'file';
                    textureInput.accept = 'image/*';
                    textureInput.style.display = 'none';

                    const textureTypeController = materialFolder.add({ type: 'map' }, 'type', ['map', 'normalMap', 'roughnessMap']).name('Texture Type');

                    textureInput.addEventListener('change', (event) => {
                        const file = event.target.files[0];
                        if (file) {
                            objectManager.addTexture(object, file, textureTypeController.getValue());
                            history.saveState();
                        }
                    });

                    materialFolder.add({
                        addTexture: () => {
                            textureInput.click();
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
            const light = lightManager.addLight('AmbientLight', 0x404040, 1, undefined, 'AmbientLight');
            history.saveState();
        }
    }, 'addAmbientLight').name('Add Ambient Light');
    lightFolder.add({
        addDirectionalLight: () => {
            const light = lightManager.addLight('DirectionalLight', 0xffffff, 1, { x: 1, y: 1, z: 1 }, 'DirectionalLight');
            history.saveState();
        }
    }, 'addDirectionalLight').name('Add Directional Light');
    lightFolder.add({
        addPointLight: () => {
            const light = lightManager.addLight('PointLight', 0xffffff, 1, { x: 0, y: 0, z: 0 }, 'PointLight');
            history.saveState();
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

    // Update GUI and outline when object selection changes
    pointer.addEventListener('selectionChange', () => {
        if (pointer.selectedObject) {
            transformControls.attach(pointer.selectedObject);
            updateGUI(pointer.selectedObject);
        } else {
            transformControls.detach();
            updateGUI(null);
        }
        sceneGraph.update();
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
    createAddButton('Add Lathe', () => objectManager.addLathe());
    createAddButton('Add Extrude', () => objectManager.addExtrude());
    createAddButton('Add Text', async () => {
        const textObject = await objectManager.addText();
        transformControls.attach(textObject);
        updateGUI(textObject);
        sceneGraph.update();
        history.saveState();
        return textObject;
    });

    // Add Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Selected';
    deleteButton.addEventListener('click', () => {
        if (pointer.selectedObject) {
            const objectToDelete = pointer.selectedObject;
            transformControls.detach();
            pointer.removeOutline();
            pointer.selectedObject = null;
            objectManager.deleteObject(objectToDelete);
            updateGUI(null);
            sceneGraph.update();
            history.saveState();
        }
    });
    ui.appendChild(deleteButton);

    // Add Duplicate button
    const duplicateButton = document.createElement('button');
    duplicateButton.textContent = 'Duplicate Selected';
    duplicateButton.addEventListener('click', () => {
        if (pointer.selectedObject) {
            const duplicatedObject = objectManager.duplicateObject(pointer.selectedObject);
            transformControls.attach(duplicatedObject);
            pointer.selectedObject = duplicatedObject;
            pointer.addOutline(duplicatedObject);
            updateGUI(duplicatedObject);
            sceneGraph.update();
            history.saveState();
        }
    });
    ui.appendChild(duplicateButton);

    // Add Group button
    const groupButton = document.createElement('button');
    groupButton.textContent = 'Group Selected';
    groupButton.addEventListener('click', () => {
        const selectedObjects = sceneManager.scene.children.filter(obj => obj.userData.selected);
        if (selectedObjects.length > 1) {
            const newGroup = groupManager.groupObjects(selectedObjects);
            if (newGroup) {
                transformControls.attach(newGroup);
                pointer.selectedObject = newGroup;
                pointer.addOutline(newGroup);
                updateGUI(newGroup);
                sceneGraph.update();
                history.saveState();
            }
        } else {
            console.warn("Select at least two objects to group.");
        }
    });
    ui.appendChild(groupButton);

    // Add Ungroup button
    const ungroupButton = document.createElement('button');
    ungroupButton.textContent = 'Ungroup Selected';
    ungroupButton.addEventListener('click', () => {
        if (pointer.selectedObject && pointer.selectedObject instanceof THREE.Group) {
            const ungrouped = groupManager.ungroupObjects(pointer.selectedObject);
            transformControls.detach();
            pointer.removeOutline();
            pointer.selectedObject = null;
            updateGUI(null);
            sceneGraph.update();
            history.saveState();
        } else {
            console.warn("No group selected for ungrouping.");
        }
    });
    ui.appendChild(ungroupButton);

    // Add CSG operation buttons
    function createCSGButton(text, operation) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', () => {
            const selectedObjects = sceneManager.scene.children.filter(obj => obj.userData.selected);
            if (selectedObjects.length === 2) {
                const resultObject = objectManager.performCSG(selectedObjects[0], selectedObjects[1], operation);
                if (resultObject) {
                    transformControls.attach(resultObject);
                    pointer.selectedObject = resultObject;
                    pointer.addOutline(resultObject);
                    updateGUI(resultObject);
                    sceneGraph.update();
                    history.saveState();
                }
            } else {
                console.warn("Select exactly two objects for CSG operation.");
            }
        });
        ui.appendChild(button);
    }

    createCSGButton('Union', 'union');
    createCSGButton('Subtract', 'subtract');
    createCSGButton('Intersect', 'intersect');

    // Add Reset View button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset View';
    resetButton.addEventListener('click', () => {
        sceneManager.resetCamera();
        history.saveState();
    });
    ui.appendChild(resetButton);

    // Add Save as Image button
    const saveImageButton = document.createElement('button');
    saveImageButton.textContent = 'Save as Image';
    saveImageButton.addEventListener('click', () => {
        sceneManager.renderer.render(sceneManager.scene, sceneManager.camera);
        const dataURL = sceneManager.renderer.domElement.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = 'nodist3d-scene.png';
        a.click();
    });
    ui.appendChild(saveImageButton);

    sceneGraph.update();

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

    // Add Import/Export buttons
    const importObjInput = document.createElement('input');
    importObjInput.type = 'file';
    importObjInput.accept = '.obj';
    importObjInput.style.display = 'none';
    importObjInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const objLoader = new OBJLoader();
                const object = objLoader.parse(e.target.result);
                sceneManager.scene.add(object);
                transformControls.attach(object);
                pointer.selectedObject = object;
                pointer.addOutline(object);
                updateGUI(object);
                sceneGraph.update();
                history.saveState();
            };
            reader.readAsText(file);
        }
    });
    ui.appendChild(importObjInput);

    const importObjButton = document.createElement('button');
    importObjButton.textContent = 'Import OBJ';
    importObjButton.addEventListener('click', () => {
        importObjInput.click();
    });
    ui.appendChild(importObjButton);

    const importGltfInput = document.createElement('input');
    importGltfInput.type = 'file';
    importGltfInput.accept = '.gltf,.glb';
    importGltfInput.style.display = 'none';
    importGltfInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const gltfLoader = new GLTFLoader();
                gltfLoader.parse(e.target.result, '', (gltf) => {
                    sceneManager.scene.add(gltf.scene);
                    transformControls.attach(gltf.scene);
                    pointer.selectedObject = gltf.scene;
                    pointer.addOutline(gltf.scene);
                    updateGUI(gltf.scene);
                    sceneGraph.update();
                    history.saveState();
                });
            };
            reader.readAsArrayBuffer(file);
        }
    });
    ui.appendChild(importGltfInput);

    const importGltfButton = document.createElement('button');
    importGltfButton.textContent = 'Import GLTF';
    importGltfButton.addEventListener('click', () => {
        importGltfInput.click();
    });
    ui.appendChild(importGltfButton);

    const exportObjButton = document.createElement('button');
    exportObjButton.textContent = 'Export OBJ';
    exportObjButton.addEventListener('click', () => {
        const exporter = new OBJExporter();
        const result = exporter.parse(sceneManager.scene);
        const blob = new Blob([result], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'scene.obj';
        a.click();
        URL.revokeObjectURL(a.href);
    });
    ui.appendChild(exportObjButton);

    const exportGltfButton = document.createElement('button');
    exportGltfButton.textContent = 'Export GLTF';
    exportGltfButton.addEventListener('click', () => {
        const exporter = new GLTFExporter();
        exporter.parse(sceneManager.scene, (result) => {
            const output = JSON.stringify(result, null, 2);
            const blob = new Blob([output], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'scene.gltf';
            a.click();
            URL.revokeObjectURL(a.href);
        }, (error) => {
            console.error('An error occurred during GLTF export:', error);
        }, { binary: false }); // Set to true for GLB, false for GLTF
    });
    ui.appendChild(exportGltfButton);

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

    // Snap controls
    const snapFolder = gui.addFolder('Snap Settings');
    const snapSettings = {
        snapTranslation: false,
        snapRotation: false,
        snapScale: false,
        translationSnapValue: 0.1,
        rotationSnapValue: Math.PI / 8,
        scaleSnapValue: 0.1
    };

    snapFolder.add(snapSettings, 'snapTranslation').name('Snap Translation').onChange((value) => {
        transformControls.translationSnap = value ? snapSettings.translationSnapValue : null;
    });
    snapFolder.add(snapSettings, 'translationSnapValue', 0.01, 1).name('Translation Snap').onChange((value) => {
        if (snapSettings.snapTranslation) {
            transformControls.translationSnap = value;
        }
    });

    snapFolder.add(snapSettings, 'snapRotation').name('Snap Rotation').onChange((value) => {
        transformControls.rotationSnap = value ? snapSettings.rotationSnapValue : null;
    });
    snapFolder.add(snapSettings, 'rotationSnapValue', 0.01, Math.PI / 2).name('Rotation Snap').onChange((value) => {
        if (snapSettings.snapRotation) {
            transformControls.rotationSnap = value;
        }
    });

    snapFolder.add(snapSettings, 'snapScale').name('Snap Scale').onChange((value) => {
        transformControls.scaleSnap = value ? snapSettings.scaleSnapValue : null;
    });
    snapFolder.add(snapSettings, 'scaleSnapValue', 0.01, 1).name('Scale Snap').onChange((value) => {
        if (snapSettings.snapScale) {
            transformControls.scaleSnap = value;
        }
    });
    snapFolder.open();

    // Initial save state
    history.saveState();
}

main();
