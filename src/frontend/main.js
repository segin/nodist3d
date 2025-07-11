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
import { PhysicsManager } from './PhysicsManager.js';
import { PrimitiveFactory } from './PrimitiveFactory.js';
import EventBus from './EventBus.js';
import { Clock } from 'three';
import log from './logger.js';

class App {
    constructor() {
        this.clock = new Clock();
        this.state = {
            selectedObject: null,
        };
        document.addEventListener('DOMContentLoaded', () => {
            this.canvas = document.querySelector('#c');
            this.eventBus = EventBus;
            this.sceneManager = new SceneManager(this.canvas);
            this.primitiveFactory = new PrimitiveFactory();
            this.objectManager = new ObjectManager(this.sceneManager.scene, this.primitiveFactory, this.eventBus);
            this.pointer = new Pointer(this.sceneManager.camera, this.sceneManager.scene, this.sceneManager.renderer, this.eventBus);
            this.sceneStorage = new SceneStorage(this.sceneManager.scene);
            this.history = new History(this.sceneManager.scene, this.eventBus);
            this.lightManager = new LightManager(this.sceneManager.scene, this.eventBus);
            this.groupManager = new GroupManager(this.sceneManager.scene, this.eventBus);
            this.physicsManager = new PhysicsManager(this.sceneManager.scene);

            this.gui = new GUI();
            this.shaderEditor = new ShaderEditor(this.gui, this.sceneManager.renderer, this.sceneManager.scene, this.sceneManager.camera, this.eventBus);

            this.currentObjectFolder = null;
            this.currentLightFolder = null;

            this.transformControls = new TransformControls(this.sceneManager.camera, this.sceneManager.renderer.domElement);
            this.sceneManager.scene.add(this.transformControls);

            this.sceneGraphElement = document.getElementById('scene-graph');
            this.sceneGraph = new SceneGraph(this.sceneManager.scene, this.sceneGraphElement, this.transformControls, this.updateGUI.bind(this), this.eventBus);

            this.setupEventListeners();
            this.setupUIButtons();
            this.setupSnapControls();
            this.history.saveState(); // Initial save state
            this.start();
        });
    }

    updateGUI(object) {
        if (this.currentObjectFolder) {
            this.gui.removeFolder(this.currentObjectFolder);
            this.currentObjectFolder = null;
        }
        if (this.currentLightFolder) {
            this.gui.removeFolder(this.currentLightFolder);
            this.currentLightFolder = null;
        }

        if (object) {
            if (object.isLight) {
                this.currentLightFolder = this.gui.addFolder(object.name || object.uuid);
                this.currentLightFolder.addColor(object, 'color').name('Color').onChange(() => this.eventBus.publish('historyChange'));
                this.currentLightFolder.add(object, 'intensity', 0, 2).name('Intensity').onChange(() => this.eventBus.publish('historyChange'));
                this.currentLightFolder.add({ type: object.type }, 'type', ['PointLight', 'DirectionalLight', 'AmbientLight']).name('Light Type').onChange((value) => {
                    const newLight = this.lightManager.changeLightType(object, value);
                    this.transformControls.attach(newLight);
                    this.updateGUI(newLight);
                    this.sceneGraph.update();
                    this.eventBus.publish('historyChange');
                });
                if (object.position) {
                    this.currentLightFolder.add(object.position, 'x', -10, 10).name('Position X').onChange(() => this.eventBus.publish('historyChange'));
                    this.currentLightFolder.add(object.position, 'y', -10, 10).name('Position Y').onChange(() => this.eventBus.publish('historyChange'));
                    this.currentLightFolder.add(object.position, 'z', -10, 10).name('Position Z').onChange(() => this.eventBus.publish('historyChange'));
                }
                this.currentLightFolder.open();
            } else {
                this.currentObjectFolder = this.gui.addFolder(object.name || object.uuid);
                this.currentObjectFolder.add(object.position, 'x', -5, 5).name('Position X').onChange(() => this.eventBus.publish('historyChange'));
                this.currentObjectFolder.add(object.position, 'y', -5, 5).name('Position Y').onChange(() => this.eventBus.publish('historyChange'));
                this.currentObjectFolder.add(object.position, 'z', -5, 5).name('Position Z').onChange(() => this.eventBus.publish('historyChange'));
                this.currentObjectFolder.add(object.rotation, 'x', -Math.PI, Math.PI).name('Rotation X').onChange(() => this.eventBus.publish('historyChange'));
                this.currentObjectFolder.add(object.rotation, 'y', -Math.PI, Math.PI).name('Rotation Y').onChange(() => this.eventBus.publish('historyChange'));
                this.currentObjectFolder.add(object.rotation, 'z', -Math.PI, Math.PI).name('Rotation Z').onChange(() => this.eventBus.publish('historyChange'));
                this.currentObjectFolder.add(object.scale, 'x', 0.1, 5).name('Scale X').onChange(() => this.eventBus.publish('historyChange'));
                this.currentObjectFolder.add(object.scale, 'y', 0.1, 5).name('Scale Y').onChange(() => this.eventBus.publish('historyChange'));
                this.currentObjectFolder.add(object.scale, 'z', 0.1, 5).name('Scale Z').onChange(() => this.eventBus.publish('historyChange'));
                if (object.material) {
                    const materialFolder = this.currentObjectFolder.addFolder('Material');
                    if (object.material.color) {
                        materialFolder.addColor(object.material, 'color').name('Color').onChange(() => this.eventBus.publish('historyChange'));
                    }
                    if (object.material.roughness !== undefined) {
                        materialFolder.add(object.material, 'roughness', 0, 1).name('Roughness').onChange(() => this.eventBus.publish('historyChange'));
                    }
                    if (object.material.metalness !== undefined) {
                        materialFolder.add(object.material, 'metalness', 0, 1).name('Metalness').onChange(() => this.eventBus.publish('historyChange'));
                    }
                    const textureInput = document.createElement('input');
                    textureInput.type = 'file';
                    textureInput.accept = 'image/*';
                    textureInput.style.display = 'none';

                    const textureTypeController = materialFolder.add({ type: 'map' }, 'type', ['map', 'normalMap', 'roughnessMap']).name('Texture Type');

                    textureInput.addEventListener('change', (event) => {
                        const file = event.target.files[0];
                        if (file) {
                            this.objectManager.addTexture(object, file, textureTypeController.getValue());
                            this.eventBus.publish('historyChange');
                        }
                    });

                    materialFolder.add({
                        addTexture: () => {
                            textureInput.click();
                        }
                    }, 'addTexture').name('Add Texture');
                    materialFolder.open();
                }

                if (object.geometry && object.geometry.parameters) {
                    const geometryFolder = this.currentObjectFolder.addFolder('Geometry');
                    for (const key in object.geometry.parameters) {
                        if (typeof object.geometry.parameters[key] === 'number') {
                            geometryFolder.add(object.geometry.parameters, key, 0, 10).name(key).onChange(() => {
                                this.objectManager.updatePrimitive(object, object.geometry.parameters);
                                this.eventBus.publish('historyChange');
                            });
                        }
                    }
                    geometryFolder.open();
                }
                this.currentObjectFolder.open();
            }
        }
    }

    setupEventListeners() {
        this.transformControls.addEventListener('dragging-changed', (event) => {
            if (!event.value) {
                this.eventBus.publish('historyChange');
            }
        });

        this.eventBus.subscribe('selectionChange', (selectedObject) => {
            if (this.state.selectedObject) {
                this.pointer.removeOutline();
            }
            this.state.selectedObject = selectedObject;
            if (this.state.selectedObject) {
                this.pointer.addOutline(this.state.selectedObject);
                this.transformControls.attach(this.state.selectedObject);
            } else {
                this.transformControls.detach();
            }
            this.updateGUI(this.state.selectedObject);
            this.sceneGraph.update();
        });

        const fullscreenButton = document.getElementById('fullscreen');
        fullscreenButton.addEventListener('click', () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.requestFullscreen();
            }
        });
    }

    setupUIButtons() {
        const ui = document.getElementById('ui');

        const lightFolder = this.gui.addFolder('Lights');
        lightFolder.add({
            addAmbientLight: () => {
                const light = this.lightManager.addLight('AmbientLight', 0x404040, 1, undefined, 'AmbientLight');
                this.eventBus.publish('historyChange');
            }
        }, 'addAmbientLight').name('Add Ambient Light');
        lightFolder.add({
            addDirectionalLight: () => {
                const light = this.lightManager.addLight('DirectionalLight', 0xffffff, 1, { x: 1, y: 1, z: 1 }, 'DirectionalLight');
                this.eventBus.publish('historyChange');
            }
        }, 'addDirectionalLight').name('Add Directional Light');
        lightFolder.add({
            addPointLight: () => {
                const light = this.lightManager.addLight('PointLight', 0xffffff, 1, { x: 0, y: 0, z: 0 }, 'PointLight');
                this.eventBus.publish('historyChange');
            }
        }, 'addPointLight').name('Add Point Light');
        lightFolder.open();

        const createAddButton = (text, addMethod) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.addEventListener('click', async () => {
                const newObject = await addMethod();
                if (newObject) {
                    this.eventBus.publish('selectionChange', newObject);
                    this.sceneGraph.update();
                    this.eventBus.publish('historyChange');
                }
            });
            ui.appendChild(button);
        };

        createAddButton('Add Cube', () => this.objectManager.addPrimitive('Box'));
        createAddButton('Add Sphere', () => this.objectManager.addPrimitive('Sphere'));
        createAddButton('Add Cylinder', () => this.objectManager.addPrimitive('Cylinder'));
        createAddButton('Add Cone', () => this.objectManager.addPrimitive('Cone'));
        createAddButton('Add Torus', () => this.objectManager.addPrimitive('Torus'));
        createAddButton('Add Torus Knot', () => this.objectManager.addPrimitive('TorusKnot'));
        createAddButton('Add Tetrahedron', () => this.objectManager.addPrimitive('Tetrahedron'));
        createAddButton('Add Icosahedron', () => this.objectManager.addPrimitive('Icosahedron'));
        createAddButton('Add Dodecahedron', () => this.objectManager.addPrimitive('Dodecahedron'));
        createAddButton('Add Octahedron', () => this.objectManager.addPrimitive('Octahedron'));
        createAddButton('Add Plane', () => this.objectManager.addPrimitive('Plane'));
        createAddButton('Add Tube', () => this.objectManager.addPrimitive('Tube'));
        createAddButton('Add Teapot', () => this.objectManager.addPrimitive('Teapot'));
        createAddButton('Add Lathe', () => this.objectManager.addPrimitive('Lathe'));
        createAddButton('Add Extrude', () => this.objectManager.addPrimitive('Extrude'));
        createAddButton('Add Text', () => this.objectManager.addPrimitive('Text'));
        createAddButton('Add LOD Cube', () => this.objectManager.addPrimitive('LODCube'));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Selected';
        deleteButton.addEventListener('click', () => {
            if (this.state.selectedObject) {
                const objectToDelete = this.state.selectedObject;
                this.eventBus.publish('selectionChange', null);
                this.objectManager.deleteObject(objectToDelete);
                this.sceneGraph.update();
                this.eventBus.publish('historyChange');
            }
        });
        ui.appendChild(deleteButton);

        const duplicateButton = document.createElement('button');
        duplicateButton.textContent = 'Duplicate Selected';
        duplicateButton.addEventListener('click', () => {
            if (this.state.selectedObject) {
                const duplicatedObject = this.objectManager.duplicateObject(this.state.selectedObject);
                this.eventBus.publish('selectionChange', duplicatedObject);
                this.sceneGraph.update();
                this.eventBus.publish('historyChange');
            }
        });
        ui.appendChild(duplicateButton);

        const groupButton = document.createElement('button');
        groupButton.textContent = 'Group Selected';
        groupButton.addEventListener('click', () => {
            const selectedObjects = this.sceneManager.scene.children.filter(obj => obj.userData.selected);
            if (selectedObjects.length > 1) {
                const newGroup = this.groupManager.groupObjects(selectedObjects);
                if (newGroup) {
                    this.eventBus.publish('selectionChange', newGroup);
                    this.sceneGraph.update();
                    this.eventBus.publish('historyChange');
                }
            } else {
                log.warn("Select at least two objects to group.");
            }
        });
        ui.appendChild(groupButton);

        const ungroupButton = document.createElement('button');
        ungroupButton.textContent = 'Ungroup Selected';
        ungroupButton.addEventListener('click', () => {
            if (this.state.selectedObject && this.state.selectedObject instanceof THREE.Group) {
                const ungrouped = this.groupManager.ungroupObjects(this.state.selectedObject);
                this.eventBus.publish('selectionChange', null);
                this.sceneGraph.update();
                this.eventBus.publish('historyChange');
            }
        });
        ui.appendChild(ungroupButton);

        const createCSGButton = (text, operation) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.addEventListener('click', () => {
                const selectedObjects = this.sceneManager.scene.children.filter(obj => obj.userData.selected);
                if (selectedObjects.length === 2) {
                    const resultObject = this.objectManager.performCSG(selectedObjects[0], selectedObjects[1], operation);
                    if (resultObject) {
                        this.eventBus.publish('selectionChange', resultObject);
                        this.sceneGraph.update();
                        this.eventBus.publish('historyChange');
                    }
                } else {
                    log.warn("Select exactly two objects for CSG operation.");
                }
            });
            ui.appendChild(button);
        };

        createCSGButton('Union', 'union');
        createCSGButton('Subtract', 'subtract');
        createCSGButton('Intersect', 'intersect');

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset View';
        resetButton.addEventListener('click', () => {
            this.sceneManager.resetCamera();
            this.eventBus.publish('historyChange');
        });
        ui.appendChild(resetButton);

        const saveImageButton = document.createElement('button');
        saveImageButton.textContent = 'Save as Image';
        saveImageButton.addEventListener('click', () => {
            this.sceneManager.renderer.render(this.sceneManager.scene, this.sceneManager.camera);
            const dataURL = this.sceneManager.renderer.domElement.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = 'nodist3d-scene.png';
            a.click();
        });
        ui.appendChild(saveImageButton);

        const translateButton = document.createElement('button');
        translateButton.textContent = 'Translate';
        translateButton.addEventListener('click', () => {
            this.transformControls.setMode('translate');
        });
        ui.appendChild(translateButton);

        const rotateButton = document.createElement('button');
        rotateButton.textContent = 'Rotate';
        rotateButton.addEventListener('click', () => {
            this.transformControls.setMode('rotate');
        });
        ui.appendChild(rotateButton);

        const scaleButton = document.createElement('button');
        scaleButton.textContent = 'Scale';
        scaleButton.addEventListener('click', () => {
            this.transformControls.setMode('scale');
        });
        ui.appendChild(scaleButton);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Scene';
        saveButton.addEventListener('click', () => {
            this.sceneStorage.saveScene();
        });
        ui.appendChild(saveButton);

        const loadInput = document.createElement('input');
        loadInput.type = 'file';
        loadInput.accept = '.nodist3d';
        loadInput.style.display = 'none';
        loadInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file) {
                const loadedData = await this.sceneStorage.loadScene(file);
                this.transformControls.detach();
                this.updateGUI(null);
                this.sceneGraph.update();
                this.eventBus.publish('historyChange');
            }
        });
        ui.appendChild(loadInput);

        const loadButton = document.createElement('button');
        loadButton.textContent = 'Load Scene';
        loadButton.addEventListener('click', () => {
            loadInput.click();
        });
        ui.appendChild(loadButton);

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
                    this.sceneManager.scene.add(object);
                    this.eventBus.publish('selectionChange', object);
                    this.sceneGraph.update();
                    this.eventBus.publish('historyChange');
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
                        this.sceneManager.scene.add(gltf.scene);
                        this.eventBus.publish('selectionChange', gltf.scene);
                        this.sceneGraph.update();
                        this.eventBus.publish('historyChange');
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
            const result = exporter.parse(this.sceneManager.scene);
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
            exporter.parse(this.sceneManager.scene, (result) => {
                const output = JSON.stringify(result, null, 2);
                const blob = new Blob([output], { type: 'text/plain' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'scene.gltf';
                a.click();
                URL.revokeObjectURL(a.href);
            }, (error) => {
                log.error('An error occurred during GLTF export:', error);
            }, { binary: false });
        });
        ui.appendChild(exportGltfButton);

        const physicsButton = document.createElement('button');
        physicsButton.textContent = 'Add Physics Body';
        physicsButton.addEventListener('click', () => {
            if (this.state.selectedObject) {
                this.physicsManager.addBody(this.state.selectedObject, 1, 'box');
                this.eventBus.publish('historyChange');
            }
        });
        ui.appendChild(physicsButton);

        const undoButton = document.createElement('button');
        undoButton.textContent = 'Undo';
        undoButton.addEventListener('click', () => {
            this.history.undo();
            this.sceneGraph.update();
            this.transformControls.detach();
            this.updateGUI(null);
        });
        ui.appendChild(undoButton);

        const redoButton = document.createElement('button');
        redoButton.textContent = 'Redo';
        redoButton.addEventListener('click', () => {
            this.history.redo();
            this.sceneGraph.update();
            this.transformControls.detach();
            this.updateGUI(null);
        });
        ui.appendChild(redoButton);
    }

    setupSnapControls() {
        const snapFolder = this.gui.addFolder('Snap Settings');
        const snapSettings = {
            snapTranslation: false,
            snapRotation: false,
            snapScale: false,
            translationSnapValue: 0.1,
            rotationSnapValue: Math.PI / 8,
            scaleSnapValue: 0.1
        };

        snapFolder.add(snapSettings, 'snapTranslation').name('Snap Translation').onChange((value) => {
            this.transformControls.translationSnap = value ? snapSettings.translationSnapValue : null;
        });
        snapFolder.add(snapSettings, 'translationSnapValue', 0.01, 1).name('Translation Snap').onChange((value) => {
            if (snapSettings.snapTranslation) {
                this.transformControls.translationSnap = value;
            }
        });

        snapFolder.add(snapSettings, 'snapRotation').name('Snap Rotation').onChange((value) => {
            this.transformControls.rotationSnap = value ? snapSettings.rotationSnapValue : null;
        });
        snapFolder.add(snapSettings, 'rotationSnapValue', 0.01, Math.PI / 2).name('Rotation Snap').onChange((value) => {
            if (snapSettings.snapRotation) {
                this.transformControls.rotationSnap = value;
            }
        });

        snapFolder.add(snapSettings, 'snapScale').name('Snap Scale').onChange((value) => {
            this.transformControls.scaleSnap = value ? snapSettings.scaleSnapValue : null;
        });
        snapFolder.add(snapSettings, 'scaleSnapValue', 0.01, 1).name('Scale Snap').onChange((value) => {
            if (snapSettings.snapScale) {
                this.transformControls.scaleSnap = value;
            }
        });
        snapFolder.open();
    }

    animate() {
        const deltaTime = this.clock.getDelta();
        this.physicsManager.update(deltaTime);
        this.transformControls.update();
        this.sceneManager.controls.update();
        this.sceneManager.render();
        requestAnimationFrame(this.animate.bind(this));
    }

    start() {
        this.animate();
        this.sceneGraph.update();
    }
}

const app = new App();
app.start();
