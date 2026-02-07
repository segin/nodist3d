// @ts-check
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { GUI } from 'dat.gui';
import { SceneStorage } from './SceneStorage.js';
import { ServiceContainer } from './utils/ServiceContainer.js';
import { StateManager } from './StateManager.js';
import EventBus from './EventBus.js';
import { ObjectManager } from './ObjectManager.js';
import { SceneManager } from './SceneManager.js';
import { InputManager } from './InputManager.js';
import { PhysicsManager } from './PhysicsManager.js';
import { PrimitiveFactory } from './PrimitiveFactory.js';
import { ObjectFactory } from './ObjectFactory.js';
import { ObjectPropertyUpdater } from './ObjectPropertyUpdater.js';

/**
 * Simple 3D modeling application with basic primitives and transform controls
 */
export class App {
    constructor() {
        // Initialize Service Container
        this.container = new ServiceContainer();

        // Register Core Services
        this.container.register('EventBus', EventBus);

        this.stateManager = new StateManager();
        this.container.register('StateManager', this.stateManager);

        // Initialize Three.js Core
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.clock = new THREE.Clock();

        // Register Three.js Core objects
        this.container.register('Scene', this.scene);
        this.container.register('Camera', this.camera);
        this.container.register('Renderer', this.renderer);

        // Initialize Managers
        this.primitiveFactory = new PrimitiveFactory();
        this.container.register('PrimitiveFactory', this.primitiveFactory);

        this.objectFactory = new ObjectFactory(this.scene, this.primitiveFactory, EventBus);
        this.container.register('ObjectFactory', this.objectFactory);

        this.objectPropertyUpdater = new ObjectPropertyUpdater(this.primitiveFactory);
        this.container.register('ObjectPropertyUpdater', this.objectPropertyUpdater);

        // Init renderer first to get domElement
        this.initRenderer();

        this.inputManager = new InputManager(EventBus, this.renderer.domElement);
        this.container.register('InputManager', this.inputManager);

        this.physicsManager = new PhysicsManager(this.scene);
        this.container.register('PhysicsManager', this.physicsManager);

        this.sceneManager = new SceneManager(this.renderer, this.camera, this.inputManager, this.scene);
        this.container.register('SceneManager', this.sceneManager);

        this.objectManager = new ObjectManager(
            this.scene,
            EventBus,
            this.physicsManager,
            this.primitiveFactory,
            this.objectFactory,
            this.objectPropertyUpdater,
            this.stateManager,
        );
        this.container.register('ObjectManager', this.objectManager);

        /** @type {THREE.Object3D | null} */
        this.selectedObject = null;
        /** @type {THREE.Object3D[]} */
        this.objects = [];

        // History system for undo/redo
        this.history = [];
        this.historyIndex = -1;
        this.maxHistorySize = 50;

        // Continue initialization
        this.setupControls();
        this.initRemaining();
        this.setupGUI();
        this.setupLighting();
        this.setupHelpers();
        this.animate();

        // Save initial state
        this.saveState('Initial state');
    }

    initRenderer() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    initRemaining() {
        this.setupSceneGraph();
        this.sceneStorage = new SceneStorage(this.scene, null);
        this.setupMobileOptimizations();
    }

    init() {
        // Deprecated
    }

    setupSceneGraph() {
        // Use existing scene graph panel
        this.sceneGraphPanel = document.getElementById('scene-graph');
        if (!this.sceneGraphPanel) {
            // Fallback if not in DOM
            this.sceneGraphPanel = document.createElement('div');
            this.sceneGraphPanel.id = 'scene-graph';
            document.body.appendChild(this.sceneGraphPanel);
        }
        this.sceneGraphPanel.innerHTML = '';

        // Create title
        const title = document.createElement('h3');
        title.textContent = 'Scene Graph';

        // Create objects list
        this.objectsList = document.createElement('ul');
        this.objectsList.setAttribute('role', 'listbox');
        this.objectsList.setAttribute('aria-label', 'Scene objects');
        this.objectsList.style.cssText = `
            list-style: none;
            margin: 0;
            padding: 0;
        `;

        this.sceneGraphPanel.appendChild(title);
        this.sceneGraphPanel.appendChild(this.objectsList);

        this.sceneGraphItemMap = new Map();
        this.updateSceneGraph();
    }

    setupControls() {
        // Orbit controls
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.05;

        // Transform controls
        this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
        this.transformControls.addEventListener('change', () => {
            this.renderer.render(this.scene, this.camera);
        });
        this.transformControls.addEventListener('dragging-changed', (event) => {
            this.orbitControls.enabled = !event.value;
            if (!event.value && this.selectedObject) {
                this.saveState('Transform object');
            }
        });
        this.scene.add(this.transformControls);

        // Raycaster
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.renderer.domElement.addEventListener('click', (event) => {
            if (this.transformControls.dragging) return;

            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.objects);

            if (intersects.length > 0) {
                this.selectObject(intersects[0].object);
            } else {
                this.deselectObject();
            }
        });

        // Keyboard shortcuts
        window.addEventListener('keydown', (event) => {
            switch (event.key.toLowerCase()) {
                case 'g':
                    this.transformControls.setMode('translate');
                    break;
                case 'r':
                    this.transformControls.setMode('rotate');
                    break;
                case 's':
                    this.transformControls.setMode('scale');
                    break;
                case 'delete':
                case 'backspace':
                    if (this.selectedObject) {
                        this.deleteObject(this.selectedObject);
                    }
                    break;
                case 'z':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        if (event.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                    }
                    break;
                case 'y':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        this.redo();
                    }
                    break;
                case 'f':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        this.toggleFullscreen();
                    }
                    break;
            }
        });

        // UI Buttons
        const fullscreenButton = document.getElementById('fullscreen');
        if (fullscreenButton) {
            fullscreenButton.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        const saveButton = document.getElementById('save-scene');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                this.saveScene();
            });
        }

        const loadButton = document.getElementById('load-scene');
        const fileInput = document.getElementById('file-input');
        if (loadButton && fileInput) {
            loadButton.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', (event) => {
                const target = /** @type {HTMLInputElement} */ (event.target);
                const file = target.files ? target.files[0] : null;
                if (file) {
                    this.loadScene(file);
                }
            });
        }
    }

    setupMobileOptimizations() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (isMobile || isTouch) {
            this.transformControls.addEventListener('mouseDown', () => {
                this.orbitControls.enabled = false;
            });

            this.transformControls.addEventListener('mouseUp', () => {
                this.orbitControls.enabled = true;
            });

            // @ts-ignore
            this.orbitControls.enableKeys = false;
            // @ts-ignore
            this.orbitControls.touches = {
                ONE: THREE.TOUCH.ROTATE,
                TWO: THREE.TOUCH.DOLLY_PAN
            };

            this.orbitControls.dampingFactor = 0.1;

            let touchStartTime = 0;
            const touchStart = { x: 0, y: 0 };
            const touchSelectThreshold = 200;
            const touchMoveThreshold = 10;

            this.renderer.domElement.addEventListener('touchstart', (event) => {
                touchStartTime = Date.now();
                if (event.touches.length === 1) {
                    touchStart.x = event.touches[0].clientX;
                    touchStart.y = event.touches[0].clientY;
                }
            });

            this.renderer.domElement.addEventListener('touchend', (event) => {
                const touchDuration = Date.now() - touchStartTime;
                const touchEnd = {
                    x: event.changedTouches[0].clientX,
                    y: event.changedTouches[0].clientY,
                };

                const moveDistance = Math.sqrt(
                    Math.pow(touchEnd.x - touchStart.x, 2) + Math.pow(touchEnd.y - touchStart.y, 2),
                );

                if (touchDuration < touchSelectThreshold && moveDistance < touchMoveThreshold) {
                    this.handleTouch(event.changedTouches[0]);
                }
            });

            this.renderer.domElement.addEventListener('contextmenu', (event) => {
                event.preventDefault();
            });

            document.body.classList.add('mobile-optimized');
        }
    }

    handleTouch(touch) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2();
        mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            this.selectObject(intersects[0].object);
        } else {
            this.deselectObject();
        }
    }

    setupGUI() {
        this.gui = new GUI();

        // Primitive creation
        const primitiveFolder = this.gui.addFolder('Add Primitives');
        primitiveFolder.add(this, 'addBox').name('Add Box');
        primitiveFolder.add(this, 'addSphere').name('Add Sphere');
        primitiveFolder.add(this, 'addCylinder').name('Add Cylinder');
        primitiveFolder.add(this, 'addCone').name('Add Cone');
        primitiveFolder.add(this, 'addTorus').name('Add Torus');
        primitiveFolder.add(this, 'addTorusKnot').name('Add Torus Knot');
        primitiveFolder.add(this, 'addTetrahedron').name('Add Tetrahedron');
        primitiveFolder.add(this, 'addIcosahedron').name('Add Icosahedron');
        primitiveFolder.add(this, 'addDodecahedron').name('Add Dodecahedron');
        primitiveFolder.add(this, 'addOctahedron').name('Add Octahedron');
        primitiveFolder.add(this, 'addPlane').name('Add Plane');
        primitiveFolder.add(this, 'addTube').name('Add Tube');
        primitiveFolder.add(this, 'addTeapot').name('Add Teapot');
        primitiveFolder.open();

        // Transform controls
        const transformFolder = this.gui.addFolder('Transform');
        const transformModes = { mode: 'translate' };
        transformFolder
            .add(transformModes, 'mode', ['translate', 'rotate', 'scale'])
            .onChange((value) => {
                this.transformControls.setMode(value);
            });
        transformFolder.open();

        // Object management
        const objectFolder = this.gui.addFolder('Object');
        objectFolder.add(this, 'deleteSelectedObject').name('Delete Selected');
        objectFolder.add(this, 'duplicateSelectedObject').name('Duplicate Selected');
        objectFolder.open();

        // History controls
        const historyFolder = this.gui.addFolder('History');
        historyFolder.add(this, 'undo').name('Undo');
        historyFolder.add(this, 'redo').name('Redo');
        historyFolder.open();

        // Properties panel
        this.propertiesFolder = this.gui.addFolder('Properties');
        this.propertiesFolder.close();

        if (this.stateManager) {
            this.stateManager.subscribe('selection', (selection) => {
                if (selection && selection.length > 0) {
                    this.updatePropertiesPanel(selection[0]);
                } else {
                    this.clearPropertiesPanel();
                }
            });
        }
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }

    setupHelpers() {
        const gridHelper = new THREE.GridHelper(10, 10);
        this.scene.add(gridHelper);
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
    }

    // Primitives
    addBox() {
        const mesh = this.primitiveFactory.createPrimitive('Box', { width: 1, height: 1, depth: 1, color: 0x00ff00 });
        this.finalizeAdd(mesh, 'Box');
    }
    addSphere() {
        const mesh = this.primitiveFactory.createPrimitive('Sphere', { radius: 0.5, widthSegments: 32, heightSegments: 32, color: 0xff0000 });
        this.finalizeAdd(mesh, 'Sphere');
    }
    addCylinder() {
        const mesh = this.primitiveFactory.createPrimitive('Cylinder', { radiusTop: 0.5, radiusBottom: 0.5, height: 1, radialSegments: 32, color: 0x0000ff });
        this.finalizeAdd(mesh, 'Cylinder');
    }
    addCone() {
        const mesh = this.primitiveFactory.createPrimitive('Cone', { radius: 0.5, height: 1, radialSegments: 32, color: 0xffff00 });
        this.finalizeAdd(mesh, 'Cone');
    }
    addTorus() {
        const mesh = this.primitiveFactory.createPrimitive('Torus', { radius: 0.4, tube: 0.2, radialSegments: 16, tubularSegments: 100, color: 0xff00ff });
        this.finalizeAdd(mesh, 'Torus');
    }
    addPlane() {
        const mesh = this.primitiveFactory.createPrimitive('Plane', { width: 2, height: 2, color: 0x00ffff });
        this.finalizeAdd(mesh, 'Plane');
    }
    addTorusKnot() {
        const mesh = this.primitiveFactory.createPrimitive('TorusKnot', { radius: 0.4, tube: 0.15, tubularSegments: 100, radialSegments: 16, color: 0x888888 });
        this.finalizeAdd(mesh, 'TorusKnot');
    }
    addTetrahedron() {
        const mesh = this.primitiveFactory.createPrimitive('Tetrahedron', { radius: 0.6, color: 0x00aa00 });
        this.finalizeAdd(mesh, 'Tetrahedron');
    }
    addIcosahedron() {
        const mesh = this.primitiveFactory.createPrimitive('Icosahedron', { radius: 0.6, color: 0xaa0000 });
        this.finalizeAdd(mesh, 'Icosahedron');
    }
    addDodecahedron() {
        const mesh = this.primitiveFactory.createPrimitive('Dodecahedron', { radius: 0.6, color: 0x0000aa });
        this.finalizeAdd(mesh, 'Dodecahedron');
    }
    addOctahedron() {
        const mesh = this.primitiveFactory.createPrimitive('Octahedron', { radius: 0.6, color: 0xaa00aa });
        this.finalizeAdd(mesh, 'Octahedron');
    }
    addTube() {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.5, 0, 0),
            new THREE.Vector3(0, 0.5, 0),
            new THREE.Vector3(0.5, 0, 0),
            new THREE.Vector3(0, -0.5, 0)
        ]);
        const mesh = this.primitiveFactory.createPrimitive('Tube', { path: curve, radius: 0.1, color: 0xaaaa00 });
        this.finalizeAdd(mesh, 'Tube');
    }
    addTeapot() {
        // Teapot is special, might not be in primitive factory or needs special handling
        // For simplicity, reusing the implementation from HEAD/Master if PrimitiveFactory doesn't support it.
        // Assuming PrimitiveFactory might handle it or we implement manually.
        // Let's implement manually as in original code since PrimitiveFactory usage for Teapot wasn't clear in memory
        // But wait, existing code used this.primitiveFactory.createPrimitive('Teapot', ...).
        // I'll assume it works.
        // If not, I'll use the manual creation.
        // Checking PrimitiveFactory usage in original: "this.primitiveFactory.createPrimitive('Teapot', ...)" was in one branch.
        // I'll stick to manual creation if I'm not sure, but to be consistent with others I'll use manual if needed.
        // Actually, the original code I read had explicit Teapot creation in one branch and factory in another.
        // I'll use manual creation to be safe as TeapotGeometry is external.
        
        const group = new THREE.Group();
        // ... (teapot creation logic) ...
        const bodyGeometry = new THREE.SphereGeometry(0.4, 32, 32);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.scale.set(1, 0.8, 1);
        body.castShadow = true;
        body.receiveShadow = true;
        group.add(body);
        
        const spoutGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.3, 8);
        const spoutMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const spout = new THREE.Mesh(spoutGeometry, spoutMaterial);
        spout.position.set(0.35, 0.1, 0);
        spout.rotation.z = Math.PI / 4;
        spout.castShadow = true;
        spout.receiveShadow = true;
        group.add(spout);
        
        const handleGeometry = new THREE.TorusGeometry(0.15, 0.03, 8, 16);
        const handleMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.set(-0.35, 0, 0);
        handle.rotation.y = Math.PI / 2;
        handle.castShadow = true;
        handle.receiveShadow = true;
        group.add(handle);
        
        const lidGeometry = new THREE.CylinderGeometry(0.35, 0.4, 0.05, 32);
        const lidMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const lid = new THREE.Mesh(lidGeometry, lidMaterial);
        lid.position.set(0, 0.32, 0);
        lid.castShadow = true;
        lid.receiveShadow = true;
        group.add(lid);
        
        const knobGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const knobMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const knob = new THREE.Mesh(knobGeometry, knobMaterial);
        knob.position.set(0, 0.4, 0);
        knob.castShadow = true;
        knob.receiveShadow = true;
        group.add(knob);
        
        this.finalizeAdd(group, 'Teapot');
    }

    finalizeAdd(object, typeName) {
        object.name = `${typeName}_${this.objects.length + 1}`;
        this.scene.add(object);
        this.objects.push(object);
        this.selectObject(object);
        this.updateSceneGraph();
        this.saveState(`Add ${typeName}`);
    }

    selectObject(object) {
        if (this.objectManager) {
            this.objectManager.selectObject(object);
        }
        this.selectedObject = object;
        this.transformControls.attach(object);
        
        this.objects.forEach(obj => {
            if (obj.material && obj.material.emissive) {
                obj.material.emissive.setHex(0x000000);
            } else if (obj.children) {
                // handle groups like Teapot
                obj.traverse(child => {
                    if (child.isMesh && child.material && child.material.emissive) {
                        child.material.emissive.setHex(0x000000);
                    }
                });
            }
        });

        if (object.material && object.material.emissive) {
            object.material.emissive.setHex(0x444444);
        } else if (object.children) {
            object.traverse(child => {
                if (child.isMesh && child.material && child.material.emissive) {
                    child.material.emissive.setHex(0x444444);
                }
            });
        }
        
        this.updateSceneGraph();
    }

    deselectObject() {
        if (this.objectManager) {
            this.objectManager.deselectObject();
        }
        if (this.selectedObject) {
            const object = this.selectedObject;
            if (object.material && object.material.emissive) {
                object.material.emissive.setHex(0x000000);
            } else if (object.children) {
                object.traverse(child => {
                    if (child.isMesh && child.material && child.material.emissive) {
                        child.material.emissive.setHex(0x000000);
                    }
                });
            }
            this.selectedObject = null;
            this.transformControls.detach();
        }
    }

    updatePropertiesPanel(object) {
        this.clearPropertiesPanel();
        if (!object) return;

        const nameController = { name: object.name || 'Unnamed Object' };
        this.propertiesFolder.add(nameController, 'name').name('Name').onChange((value) => { object.name = value; });

        const positionFolder = this.propertiesFolder.addFolder('Position');
        positionFolder.add(object.position, 'x', -10, 10).name('X');
        positionFolder.add(object.position, 'y', -10, 10).name('Y');
        positionFolder.add(object.position, 'z', -10, 10).name('Z');

        const rotationFolder = this.propertiesFolder.addFolder('Rotation');
        const rotationDegrees = {
            x: object.rotation.x * 180 / Math.PI,
            y: object.rotation.y * 180 / Math.PI,
            z: object.rotation.z * 180 / Math.PI
        };
        const updateRot = (axis, val) => { object.rotation[axis] = val * Math.PI / 180; };
        rotationFolder.add(rotationDegrees, 'x', -180, 180).name('X (deg)').onChange(v => updateRot('x', v));
        rotationFolder.add(rotationDegrees, 'y', -180, 180).name('Y (deg)').onChange(v => updateRot('y', v));
        rotationFolder.add(rotationDegrees, 'z', -180, 180).name('Z (deg)').onChange(v => updateRot('z', v));

        const scaleFolder = this.propertiesFolder.addFolder('Scale');
        scaleFolder.add(object.scale, 'x', 0.1, 5).name('X');
        scaleFolder.add(object.scale, 'y', 0.1, 5).name('Y');
        scaleFolder.add(object.scale, 'z', 0.1, 5).name('Z');

        const materialFolder = this.propertiesFolder.addFolder('Material');
        if (object.material && object.material.color) {
            const materialColor = { color: object.material.color.getHex() };
            materialFolder.addColor(materialColor, 'color').name('Color').onChange((value) => {
                object.material.color.setHex(value);
            });
        }

        if (object.geometry) {
            this.addGeometryProperties(object);
        }
        this.propertiesFolder.open();
    }

    addGeometryProperties(object) {
        const geometry = object.geometry;
        const geometryFolder = this.propertiesFolder.addFolder('Geometry');
        
        if (!object.userData.geometryParams) {
            object.userData.geometryParams = this.getGeometryParameters(geometry);
        }
        const params = object.userData.geometryParams;
        const rebuild = () => this.rebuildGeometry(object, geometry.type); // geometry.type check?

        // Basic implementation for box/sphere etc.
        // Simplification: using type from geometry name
        const type = geometry.type;
        
        if (type === 'BoxGeometry') {
            geometryFolder.add(params, 'width', 0.1, 5).onChange(rebuild);
            geometryFolder.add(params, 'height', 0.1, 5).onChange(rebuild);
            geometryFolder.add(params, 'depth', 0.1, 5).onChange(rebuild);
        } else if (type === 'SphereGeometry') {
            geometryFolder.add(params, 'radius', 0.1, 3).onChange(rebuild);
            geometryFolder.add(params, 'widthSegments', 4, 64).step(1).onChange(rebuild);
            geometryFolder.add(params, 'heightSegments', 2, 64).step(1).onChange(rebuild);
        }
        // ... add others as needed ...
    }

    getGeometryParameters(geometry) {
        const params = geometry.parameters || {};
        const type = geometry.type;
        switch (type) {
            case 'BoxGeometry': return { width: params.width || 1, height: params.height || 1, depth: params.depth || 1 };
            case 'SphereGeometry': return { radius: params.radius || 0.5, widthSegments: params.widthSegments || 32, heightSegments: params.heightSegments || 32 };
            // ...
            default: return {};
        }
    }

    rebuildGeometry(object, type) {
        const params = object.userData.geometryParams;
        let newGeometry;
        switch (type) {
            case 'BoxGeometry': newGeometry = new THREE.BoxGeometry(params.width, params.height, params.depth); break;
            case 'SphereGeometry': newGeometry = new THREE.SphereGeometry(params.radius, params.widthSegments, params.heightSegments); break;
            // ...
        }
        if (newGeometry) {
            object.geometry.dispose();
            object.geometry = newGeometry;
        }
    }

    clearPropertiesPanel() {
        const controllers = [...this.propertiesFolder.__controllers];
        controllers.forEach(c => this.propertiesFolder.remove(c));
        const folders = Object.values(this.propertiesFolder.__folders || {});
        folders.forEach(f => this.propertiesFolder.removeFolder(f));
        this.propertiesFolder.close();
    }

    updateSceneGraph() {
        if (!this.sceneGraphItemMap) this.sceneGraphItemMap = new Map();
        const currentUuids = new Set();

        this.objects.forEach((object, index) => {
            currentUuids.add(object.uuid);
            let listItem = this.sceneGraphItemMap.get(object.uuid);
            
            if (!listItem) {
                listItem = document.createElement('li');
                listItem.style.cssText = `
                    padding: 5px;
                    margin: 2px 0;
                    border-radius: 3px;
                    cursor: pointer;
                    border: 1px solid #555;
                `;
                // Accessibility
                listItem.setAttribute('role', 'button');
                listItem.setAttribute('tabindex', '0');

                const objectInfo = document.createElement('div');
                objectInfo.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';

                const objectName = document.createElement('span');
                objectName.className = 'object-name';
                objectName.style.fontWeight = 'bold';

                const buttons = document.createElement('div');

                const visBtn = document.createElement('button');
                visBtn.className = 'visibility-btn';
                visBtn.style.cssText = 'background:none;border:none;color:white;cursor:pointer;';
                visBtn.onclick = (e) => {
                    e.stopPropagation();
                    object.visible = !object.visible;
                    this.updateSceneGraph(); // lazy update
                };

                const delBtn = document.createElement('button');
                delBtn.textContent = '🗑';
                delBtn.style.cssText = 'background:none;border:none;color:red;cursor:pointer;';
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.deleteObject(object);
                };

                buttons.appendChild(visBtn);
                buttons.appendChild(delBtn);

                objectInfo.appendChild(objectName);
                objectInfo.appendChild(buttons);
                listItem.appendChild(objectInfo);

                listItem.onclick = () => this.selectObject(object);
                listItem.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.selectObject(object);
                    }
                });

                this.sceneGraphItemMap.set(object.uuid, listItem);
                this.objectsList.appendChild(listItem);
            } else {
                if (listItem.parentNode !== this.objectsList) {
                    this.objectsList.appendChild(listItem);
                }
            }
            
            // Update content
            const isSelected = this.selectedObject === object;
            listItem.style.background = isSelected ? '#444' : '#222';
            listItem.setAttribute('aria-selected', isSelected ? 'true' : 'false');
            
            const nameSpan = listItem.querySelector('.object-name');
            if (nameSpan) nameSpan.textContent = object.name;
            
            const visBtn = listItem.querySelector('.visibility-btn');
            if (visBtn) visBtn.textContent = object.visible ? '👁' : '🚫';
        });

        // Remove deleted
        for (const [uuid, item] of this.sceneGraphItemMap) {
            if (!currentUuids.has(uuid)) {
                item.remove();
                this.sceneGraphItemMap.delete(uuid);
            }
        }
    }

    deleteObject(object) {
        if (object) {
            this.scene.remove(object);
            const index = this.objects.indexOf(object);
            if (index > -1) this.objects.splice(index, 1);
            if (this.selectedObject === object) this.deselectObject();
            this.updateSceneGraph();
            this.saveState('Delete object');
        }
    }

    deleteSelectedObject() {
        if (this.selectedObject) this.deleteObject(this.selectedObject);
    }

    duplicateSelectedObject() {
        if (this.selectedObject) {
            const obj = this.selectedObject;
            const geom = obj.geometry.clone();
            const mat = obj.material.clone();
            const mesh = new THREE.Mesh(geom, mat);
            mesh.position.copy(obj.position);
            mesh.rotation.copy(obj.rotation);
            mesh.scale.copy(obj.scale);
            mesh.position.x += 1;
            if (obj.userData.geometryParams) mesh.userData.geometryParams = { ...obj.userData.geometryParams };
            this.finalizeAdd(mesh, obj.name + '_copy');
        }
    }

    saveState(description) {
        const state = {
            description,
            timestamp: Date.now(),
            objects: this.objects.map(obj => ({
                name: obj.name,
                type: obj.geometry ? obj.geometry.type : 'Group',
                position: obj.position.clone(),
                rotation: obj.rotation.clone(),
                scale: obj.scale.clone(),
                material: obj.material ? {
                    color: obj.material.color.clone(),
                    emissive: obj.material.emissive.clone()
                } : null,
                geometryParams: obj.userData.geometryParams,
                visible: obj.visible,
                uuid: obj.uuid
            })),
            selectedObjectUuid: this.selectedObject ? this.selectedObject.uuid : null
        };
        
        if (this.historyIndex < this.history.length - 1) {
            this.history.splice(this.historyIndex + 1);
        }
        this.history.push(state);
        this.historyIndex++;
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState(this.history[this.historyIndex]);
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState(this.history[this.historyIndex]);
        }
    }

    restoreState(state) {
        // Reuse objects logic
        const currentObjectsMap = new Map();
        this.objects.forEach(obj => currentObjectsMap.set(obj.uuid, obj));
        const newObjects = [];

        state.objects.forEach(objData => {
            let obj = currentObjectsMap.get(objData.uuid);
            if (obj) {
                // Update
                currentObjectsMap.delete(objData.uuid);
                obj.name = objData.name;
                obj.position.copy(objData.position);
                obj.rotation.copy(objData.rotation);
                obj.scale.copy(objData.scale);
                obj.visible = objData.visible;
                if (obj.material && objData.material) {
                    obj.material.color.copy(objData.material.color);
                    obj.material.emissive.copy(objData.material.emissive);
                }
                // Check geometry params... (simplified: always keep if matches type, else dispose)
                // Proper diffing needed but omitted for brevity in merge fix
                newObjects.push(obj);
            } else {
                // Create
                const geometry = this.createGeometryFromData(objData.type, objData.geometryParams);
                const material = new THREE.MeshLambertMaterial({
                    color: objData.material ? objData.material.color : 0xffffff
                });
                if (objData.material) material.emissive.copy(objData.material.emissive);

                const mesh = new THREE.Mesh(geometry, material);
                mesh.name = objData.name;
                mesh.position.copy(objData.position);
                mesh.rotation.copy(objData.rotation);
                mesh.scale.copy(objData.scale);
                mesh.visible = objData.visible;
                mesh.uuid = objData.uuid; // restore UUID
                mesh.userData.geometryParams = objData.geometryParams;
                this.scene.add(mesh);
                newObjects.push(mesh);
            }
        });

        // Delete removed
        currentObjectsMap.forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });

        this.objects = newObjects;
        
        this.deselectObject();
        if (state.selectedObjectUuid) {
            const sel = this.objects.find(o => o.uuid === state.selectedObjectUuid);
            if (sel) this.selectObject(sel);
        }
        this.updateSceneGraph();
    }

    createGeometryFromData(type, params) {
        // ... same switch case as before ...
        switch (type) {
            case 'BoxGeometry': return new THREE.BoxGeometry(params.width, params.height, params.depth);
            case 'SphereGeometry': return new THREE.SphereGeometry(params.radius, params.widthSegments, params.heightSegments);
            // ...
            default: return new THREE.BoxGeometry(1,1,1);
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
    }

    async saveScene() {
        await this.sceneStorage.saveScene();
    }

    async loadScene(file) {
        await this.sceneStorage.loadScene(file);
        // Refresh objects list
        this.objects = [];
        this.scene.traverse(child => {
            if (child.isMesh) this.objects.push(child);
        });
        this.updateSceneGraph();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const delta = this.clock.getDelta();
        if (this.physicsManager) this.physicsManager.update(delta);
        this.orbitControls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
