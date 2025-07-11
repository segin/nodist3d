import { ObjectFactory } from './ObjectFactory.js';
import { CSGManager } from './CSGManager.js';
import { ObjectPropertyUpdater } from './ObjectPropertyUpdater.js';
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
import { Events, ObjectTypes } from './constants.js';
import { AddObjectCommand } from './commands/AddObjectCommand.js';
import { RemoveObjectCommand } from './commands/RemoveObjectCommand.js';
import { TransformObjectCommand } from './commands/TransformObjectCommand.js';
import { GroupCommand } from './commands/GroupCommand.js';
import { UngroupCommand } from './commands/UngroupCommand.js';

/**
 * The main application class.
 */
class App {
    /**
     * Initializes the application.
     */
    constructor() {
        this.clock = new Clock();
        this.state = {
            selectedObject: null,
            mode: 'IDLE',
        };
        document.addEventListener('DOMContentLoaded', () => {
            this.canvas = document.querySelector('#c');
            this.eventBus = EventBus;
            this.sceneManager = new SceneManager(this.canvas);
            this.primitiveFactory = new PrimitiveFactory();
            this.objectManager = new ObjectManager(this.sceneManager.scene, this.eventBus);
            this.objectFactory = new ObjectFactory(this.sceneManager.scene, this.primitiveFactory, this.eventBus);
            this.csgManager = new CSGManager(this.sceneManager.scene, this.eventBus);
            this.objectPropertyUpdater = new ObjectPropertyUpdater(this.primitiveFactory);
            this.pointer = new Pointer(this.sceneManager.camera, this.sceneManager.scene, this.sceneManager.renderer, this.eventBus);
            this.sceneStorage = new SceneStorage(this.sceneManager.scene);
            this.history = new History(this.eventBus);
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
            this.history.add(new AddObjectCommand(this.sceneManager.scene, new THREE.Object3D())); // Initial empty command
            this.start();
        });
    }

    /**
     * Updates the GUI with the properties of the selected object.
     * @param {THREE.Object3D} object The selected object.
     */
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
                this.currentLightFolder.addColor(object, 'color').name('Color').onChange(() => this.eventBus.publish(Events.HISTORY_CHANGE, new TransformObjectCommand(object, { position: object.position, rotation: object.rotation, scale: object.scale }, this.state.selectedObject.userData.oldTransform)));
                this.currentLightFolder.add(object, 'intensity', 0, 2).name('Intensity').onChange(() => this.eventBus.publish(Events.HISTORY_CHANGE, new TransformObjectCommand(object, { position: object.position, rotation: object.rotation, scale: object.scale }, this.state.selectedObject.userData.oldTransform)));
                this.currentLightFolder.add({ type: object.type }, 'type', ['PointLight', 'DirectionalLight', 'AmbientLight']).name('Light Type').onChange((value) => {
                    const newLight = this.lightManager.changeLightType(object, value);
                    this.transformControls.attach(newLight);
                    this.updateGUI(newLight);
                    this.sceneGraph.update();
                    this.eventBus.publish(Events.HISTORY_CHANGE, new AddObjectCommand(this.sceneManager.scene, newLight));
                });
                if (object.position) {
                    this.currentLightFolder.add(object.position, 'x', -10, 10).name('Position X').onChange(() => this.eventBus.publish(Events.HISTORY_CHANGE, new TransformObjectCommand(object, { position: object.position, rotation: object.rotation, scale: object.scale }, this.state.selectedObject.userData.oldTransform)));
                    this.currentLightFolder.add(object.position, 'y', -10, 10).name('Position Y').onChange(() => this.eventBus.publish(Events.HISTORY_CHANGE, new TransformObjectCommand(object, { position: object.position, rotation: object.rotation, scale: object.scale }, this.state.selectedObject.userData.oldTransform)));
                    this.currentLightFolder.add(object.position, 'z', -10, 10).name('Position Z').onChange(() => this.eventBus.publish(Events.HISTORY_CHANGE, new TransformObjectCommand(object, { position: object.position, rotation: object.rotation, scale: object.scale }, this.state.selectedObject.userData.oldTransform)));
                }
                this.currentLightFolder.open();
            } else {
                this.currentObjectFolder = this.gui.addFolder(object.name || object.uuid);
                this.currentObjectFolder.add(object.position, 'x', -5, 5).name('Position X').onChange(() => this.eventBus.publish(Events.HISTORY_CHANGE, new TransformObjectCommand(object, { position: object.position, rotation: object.rotation, scale: object.scale }, this.state.selectedObject.userData.oldTransform)));
                this.currentObjectFolder.add(object.position, 'y', -5, 5).name('Position Y').onChange(() => this.eventBus.publish(Events.HISTORY_CHANGE, new TransformObjectCommand(object, { position: object.position, rotation: object.rotation, scale: object.scale }, this.state.selectedObject.userData.oldTransform)));
                this.currentObjectFolder.add(object.position, 'z', -5, 5).name('Position Z').onChange(() => this.eventBus.publish(Events.HISTORY_CHANGE, new TransformObjectCommand(object, { position: object.position, rotation: object.rotation, scale: object.scale }, this.state.selectedObject.userData.oldTransform)));
                this.currentObjectFolder.add(object.rotation, 'x', -Math.PI, Math.PI).name('Rotation X').onChange(() => this.eventBus.publish(Events.HISTORY_CHANGE, new TransformObjectCommand(object, { position: object.position, rotation: object.rotation, scale: object.scale }, this.state.selectedObject.userData.oldTransform)));
                this.currentObjectFolder.add(object.rotation, 'y', -Math.PI, Math.PI).name('Rotation Y').onChange(() => this.eventBus.publish(Events.HISTORY_CHANGE, new TransformObjectCommand(object, { position: object.position, rotation: object.rotation, scale: object.scale }, this.state.selectedObject.userData.oldTransform)));
                this.currentObjectFolder.add(object.rotation, 'z', -Math.PI, Math.PI).name('Rotation Z').onChange(() => this.eventBus.publish(Events.HISTORY_CHANGE, new TransformObjectCommand(object, { position: object.position, rotation: object.rotation, scale: object.scale }, this.state.selectedObject.userData.oldTransform)));
                this.currentObjectFolder.add(object.scale, 'x', 0.1, 5).name('Scale X').onChange(() => this.eventBus.publish(Events.HISTORY_CHANGE, new TransformObjectCommand(object, { position: object.position, rotation: object.rotation, scale: object.scale }, this.state.selectedObject.userData.oldTransform)));
                this.currentObjectFolder.add(object.scale, 'y', 0.1, 5).name('Scale Y').onChange(() => this.eventBus.publish(Events.HISTORY_CHANGE, new TransformObjectCommand(object, { position: object.position, rotation: object.rotation, scale: object.scale }, this.state.selectedObject.userData.oldTransform)));
                this.currentObjectFolder.add(object.scale, 'z', 0.1, 5).name('Scale Z').onChange(() => this.eventBus.publish(Events.HISTORY_CHANGE, new TransformObjectCommand(object, { position: object.position, rotation: object.rotation, scale: object.scale }, this.state.selectedObject.userData.oldTransform)));
                if (object.material) {
                    const materialFolder = this.currentObjectFolder.addFolder('Material');
                    if (object.material.color) {
                        materialFolder.addColor(object.material, 'color').name('Color').onChange(() => this.eventBus.publish(Events.HISTORY_CHANGE, new TransformObjectCommand(object, { position: object.position, rotation: object.rotation, scale: object.scale }, this.state.selectedObject.userData.oldTransform)));
                    }
                    if (object.material.roughness !== undefined) {
                        materialFolder.add(object.material, 'roughness', 0, 1).name('Roughness').onChange(() => this.eventBus.publish(Events.HISTORY_CHANGE, new TransformObjectCommand(object, { position: object.position, rotation: object.rotation, scale: object.scale }, this.state.selectedObject.userData.oldTransform)));
                    }
                    if (object.material.metalness !== undefined) {
                        materialFolder.add(object.material, 'metalness', 0, 1).name('Metalness').onChange(() => this.eventBus.publish(Events.HISTORY_CHANGE, new TransformObjectCommand(object, { position: object.position, rotation: object.rotation, scale: object.scale }, this.state.selectedObject.userData.oldTransform)));
                    }
                    const textureInput = document.createElement('input');
                    textureInput.type = 'file';
                    textureInput.accept = 'image/*';
                    textureInput.style.display = 'none';

                    const textureTypeController = materialFolder.add({ type: 'map' }, 'type', ['map', 'normalMap', 'roughnessMap']).name('Texture Type');

                    textureInput.addEventListener('change', (event) => {
                        const file = event.target.files[0];
                        if (file) {
                            this.objectPropertyUpdater.addTexture(object, file, textureTypeController.getValue());
                            this.eventBus.publish(Events.HISTORY_CHANGE, new TransformObjectCommand(object, { position: object.position, rotation: object.rotation, scale: object.scale }, this.state.selectedObject.userData.oldTransform));
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
                                this.objectPropertyUpdater.updatePrimitive(object, object.geometry.parameters);
                                this.eventBus.publish(Events.HISTORY_CHANGE, new TransformObjectCommand(object, { position: object.position, rotation: object.rotation, scale: object.scale }, this.state.selectedObject.userData.oldTransform));
                            });
                        }
                    }
                    geometryFolder.open();
                }
                this.currentObjectFolder.open();
            }
        }
    }

    /**
     * Sets up the event listeners for the application.
     */
    setupEventListeners() {
        this.transformControls.addEventListener('dragging-changed', (event) => {
            if (!event.value) {
                this.state.mode = 'OBJECT_SELECTED';
                this.eventBus.publish(Events.HISTORY_CHANGE, new TransformObjectCommand(this.state.selectedObject, { position: this.state.selectedObject.position, rotation: this.state.selectedObject.rotation, scale: this.state.selectedObject.scale }, this.state.selectedObject.userData.oldTransform));
            } else {
                this.state.mode = 'TRANSFORMING';
                this.state.selectedObject.userData.oldTransform = {
                    position: this.state.selectedObject.position.clone(),
                    rotation: this.state.selectedObject.rotation.clone(),
                    scale: this.state.selectedObject.scale.clone(),
                };
            }
        });

        this.eventBus.subscribe(Events.SELECTION_CHANGE, (selectedObject) => {
            if (this.state.selectedObject) {
                this.pointer.removeOutline();
            }
            this.state.selectedObject = selectedObject;
            if (this.state.selectedObject) {
                this.state.mode = 'OBJECT_SELECTED';
                this.pointer.addOutline(this.state.selectedObject);
                this.transformControls.attach(this.state.selectedObject);
            } else {
                this.state.mode = 'IDLE';
                this.transformControls.detach();
            }
            this.updateGUI(this.state.selectedObject);
            this.sceneGraph.update();
        });

        this.eventBus.subscribe(Events.DELETE_OBJECT, (object) => {
            if (this.state.selectedObject === object) {
                this.eventBus.publish(Events.SELECTION_CHANGE, null);
            }
            const command = new RemoveObjectCommand(this.sceneManager.scene, object);
            command.execute();
            this.eventBus.publish(Events.HISTORY_CHANGE, command);
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

    /**
     * Sets up the UI buttons for the application.
     */
    setupUIButtons() {
        const ui = document.getElementById('ui');

        const lightFolder = this.gui.addFolder('Lights');
        lightFolder.add({
            addAmbientLight: () => {
                const light = this.lightManager.addLight('AmbientLight', 0x404040, 1, undefined, 'AmbientLight');
                this.eventBus.publish(Events.HISTORY_CHANGE, new AddObjectCommand(this.sceneManager.scene, light));
            }
        }, 'addAmbientLight').name('Add Ambient Light');
        lightFolder.add({
            addDirectionalLight: () => {
                const light = this.lightManager.addLight('DirectionalLight', 0xffffff, 1, { x: 1, y: 1, z: 1 }, 'DirectionalLight');
                this.eventBus.publish(Events.HISTORY_CHANGE, new AddObjectCommand(this.sceneManager.scene, light));
            }
        }, 'addDirectionalLight').name('Add Directional Light');
        lightFolder.add({
            addPointLight: () => {
                const light = this.lightManager.addLight('PointLight', 0xffffff, 1, { x: 0, y: 0, z: 0 }, 'PointLight');
                this.eventBus.publish(Events.HISTORY_CHANGE, new AddObjectCommand(this.sceneManager.scene, light));
            }
        }, 'addPointLight').name('Add Point Light');
        lightFolder.open();

        const createAddButton = (text, addMethod) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.addEventListener('click', async () => {
                const newObject = await addMethod();
                if (newObject) {
                    const command = new AddObjectCommand(this.sceneManager.scene, newObject);
                    command.execute();
                    this.eventBus.publish(Events.SELECTION_CHANGE, newObject);
                    this.sceneGraph.update();
                    this.eventBus.publish(Events.HISTORY_CHANGE, command);
                }
            });
            ui.appendChild(button);
        };

        createAddButton('Add Cube', () => this.objectFactory.addPrimitive(ObjectTypes.BOX));
        createAddButton('Add Sphere', () => this.objectFactory.addPrimitive(ObjectTypes.SPHERE));
        createAddButton('Add Cylinder', () => this.objectFactory.addPrimitive(ObjectTypes.CYLINDER));
        createAddButton('Add Cone', () => this.objectFactory.addPrimitive(ObjectTypes.CONE));
        createAddButton('Add Torus', () => this.objectFactory.addPrimitive(ObjectTypes.TORUS));
        createAddButton('Add Torus Knot', () => this.objectFactory.addPrimitive(ObjectTypes.TORUS_KNOT));
        createAddButton('Add Tetrahedron', () => this.objectFactory.addPrimitive(ObjectTypes.TETRAHEDRON));
        createAddButton('Add Icosahedron', () => this.objectFactory.addPrimitive(ObjectTypes.ICOSAHEDRON));
        createAddButton('Add Dodecahedron', () => this.objectFactory.addPrimitive(ObjectTypes.DODECAHEDRON));
        createAddButton('Add Octahedron', () => this.objectFactory.addPrimitive(ObjectTypes.OCTAHEDRON));
        createAddButton('Add Plane', () => this.objectFactory.addPrimitive(ObjectTypes.PLANE));
        createAddButton('Add Tube', () => this.objectFactory.addPrimitive(ObjectTypes.TUBE));
        createAddButton('Add Teapot', () => this.objectFactory.addPrimitive(ObjectTypes.TEAPOT));
        createAddButton('Add Lathe', () => this.objectFactory.addPrimitive(ObjectTypes.LATHE));
        createAddButton('Add Extrude', () => this.objectFactory.addPrimitive(ObjectTypes.EXTRUDE));
        createAddButton('Add Text', () => this.objectFactory.addPrimitive(ObjectTypes.TEXT));
        createAddButton('Add LOD Cube', () => this.objectFactory.addPrimitive(ObjectTypes.LOD_CUBE));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Selected';
        deleteButton.addEventListener('click', () => {
            if (this.state.selectedObject) {
                const objectToDelete = this.state.selectedObject;
                const command = new RemoveObjectCommand(this.sceneManager.scene, objectToDelete);
                command.execute();
                this.eventBus.publish(Events.SELECTION_CHANGE, null);
                this.sceneGraph.update();
                this.eventBus.publish(Events.HISTORY_CHANGE, command);
            }
        });
        ui.appendChild(deleteButton);

        const duplicateButton = document.createElement('button');
        duplicateButton.textContent = 'Duplicate Selected';
        duplicateButton.addEventListener('click', () => {
            if (this.state.selectedObject) {
                const duplicatedObject = this.objectFactory.duplicateObject(this.state.selectedObject);
                const command = new AddObjectCommand(this.sceneManager.scene, duplicatedObject);
                command.execute();
                this.eventBus.publish(Events.SELECTION_CHANGE, duplicatedObject);
                this.sceneGraph.update();
                this.eventBus.publish(Events.HISTORY_CHANGE, command);
            }
        });
        ui.appendChild(duplicateButton);

        const groupButton = document.createElement('button');
        groupButton.textContent = 'Group Selected';
        groupButton.addEventListener('click', () => {
            const selectedObjects = this.sceneManager.scene.children.filter(obj => obj.userData.selected);
            if (selectedObjects.length > 1) {
                const command = new GroupCommand(this.sceneManager.scene, this.groupManager, selectedObjects);
                command.execute();
                this.eventBus.publish(Events.SELECTION_CHANGE, command.group);
                this.sceneGraph.update();
                this.eventBus.publish(Events.HISTORY_CHANGE, command);
            } else {
                log.warn("Select at least two objects to group.");
            }
        });
        ui.appendChild(groupButton);

        const ungroupButton = document.createElement('button');
        ungroupButton.textContent = 'Ungroup Selected';
        ungroupButton.addEventListener('click', () => {
            if (this.state.selectedObject && this.state.selectedObject instanceof THREE.Group) {
                const command = new UngroupCommand(this.sceneManager.scene, this.groupManager, this.state.selectedObject);
                command.execute();
                this.eventBus.publish(Events.SELECTION_CHANGE, null);
                this.sceneGraph.update();
                this.eventBus.publish(Events.HISTORY_CHANGE, command);
            }
        });
        ui.appendChild(ungroupButton);

        const createCSGButton = (text, operation) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.addEventListener('click', () => {
                const selectedObjects = this.sceneManager.scene.children.filter(obj => obj.userData.selected);
                if (selectedObjects.length === 2) {
                    const resultObject = this.csgManager.performCSG(selectedObjects[0], selectedObjects[1], operation);
                    if (resultObject) {
                        const command = new AddObjectCommand(this.sceneManager.scene, resultObject);
                        command.execute();
                        this.eventBus.publish(Events.SELECTION_CHANGE, resultObject);
                        this.sceneGraph.update();
                        this.eventBus.publish(Events.HISTORY_CHANGE, command);
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
            this.eventBus.publish(Events.HISTORY_CHANGE, new Command());
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
                this.eventBus.publish(Events.HISTORY_CHANGE, new AddObjectCommand(this.sceneManager.scene, loadedData));
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
                    const command = new AddObjectCommand(this.sceneManager.scene, object);
                    command.execute();
                    this.eventBus.publish(Events.SELECTION_CHANGE, object);
                    this.sceneGraph.update();
                    this.eventBus.publish(Events.HISTORY_CHANGE, command);
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
                        const command = new AddObjectCommand(this.sceneManager.scene, gltf.scene);
                        command.execute();
                        this.eventBus.publish(Events.SELECTION_CHANGE, gltf.scene);
                        this.sceneGraph.update();
                        this.eventBus.publish(Events.HISTORY_CHANGE, command);
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
                this.eventBus.publish(Events.HISTORY_CHANGE, new Command());
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

    /**
     * Sets up the snap controls in the GUI.
     */
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

    /**
     * The main animation loop.
     */
    animate() {
        const deltaTime = this.clock.getDelta();
        this.physicsManager.update(deltaTime);
        this.transformControls.update();
        this.sceneManager.controls.update();
        this.sceneManager.render();
        requestAnimationFrame(this.animate.bind(this));
    }

    /**
     * Starts the application.
     */
    start() {
        this.animate();
        this.sceneGraph.update();
    }
}

const app = new App();
app.start();
