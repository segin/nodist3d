import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { GUI } from 'dat.gui';

/**
 * Simple 3D modeling application with basic primitives and transform controls
 */
class App {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.selectedObject = null;
        this.objects = [];
        
        // History system for undo/redo
        this.history = [];
        this.historyIndex = -1;
        this.maxHistorySize = 50;
        
        this.init();
        this.setupControls();
        this.setupGUI();
        this.setupLighting();
        this.setupHelpers();
        this.animate();
        
        // Save initial state
        this.saveState('Initial state');
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);

        // Setup scene graph UI
        this.setupSceneGraph();

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setupSceneGraph() {
        // Create scene graph panel
        this.sceneGraphPanel = document.createElement('div');
        this.sceneGraphPanel.id = 'scene-graph-panel';
        this.sceneGraphPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 250px;
            max-height: 400px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            overflow-y: auto;
            z-index: 1000;
        `;
        
        // Create title
        const title = document.createElement('h3');
        title.textContent = 'Scene Graph';
        title.style.cssText = `
            margin: 0 0 10px 0;
            padding: 0;
            font-size: 14px;
            border-bottom: 1px solid #444;
            padding-bottom: 5px;
        `;
        
        // Create objects list
        this.objectsList = document.createElement('ul');
        this.objectsList.style.cssText = `
            list-style: none;
            margin: 0;
            padding: 0;
        `;
        
        this.sceneGraphPanel.appendChild(title);
        this.sceneGraphPanel.appendChild(this.objectsList);
        document.body.appendChild(this.sceneGraphPanel);
        
        // Update initially
        this.updateSceneGraph();
    }

    setupControls() {
        // Orbit controls for camera
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.05;

        // Transform controls for object manipulation
        this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
        this.transformControls.addEventListener('change', () => {
            this.renderer.render(this.scene, this.camera);
        });
        this.transformControls.addEventListener('dragging-changed', (event) => {
            this.orbitControls.enabled = !event.value;
            
            // Save state when transform is completed
            if (!event.value && this.selectedObject) {
                this.saveState('Transform object');
            }
        });
        this.scene.add(this.transformControls);

        // Raycaster for object selection
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

        // Fullscreen button
        const fullscreenButton = document.getElementById('fullscreen');
        if (fullscreenButton) {
            fullscreenButton.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        // Listen for fullscreen changes to update button text
        document.addEventListener('fullscreenchange', () => {
            if (fullscreenButton) {
                fullscreenButton.textContent = document.fullscreenElement ? 'Exit Fullscreen' : 'Fullscreen';
            }
        });
        
        // Handle vendor-specific fullscreen events
        document.addEventListener('webkitfullscreenchange', () => {
            if (fullscreenButton) {
                fullscreenButton.textContent = document.webkitFullscreenElement ? 'Exit Fullscreen' : 'Fullscreen';
            }
        });
        
        document.addEventListener('mozfullscreenchange', () => {
            if (fullscreenButton) {
                fullscreenButton.textContent = document.mozFullScreenElement ? 'Exit Fullscreen' : 'Fullscreen';
            }
        });
        
        document.addEventListener('MSFullscreenChange', () => {
            if (fullscreenButton) {
                fullscreenButton.textContent = document.msFullscreenElement ? 'Exit Fullscreen' : 'Fullscreen';
            }
        });
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
        transformFolder.add(transformModes, 'mode', ['translate', 'rotate', 'scale']).onChange((value) => {
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

        // Properties panel (initially hidden)
        this.propertiesFolder = this.gui.addFolder('Properties');
        this.propertiesFolder.close();
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }

    setupHelpers() {
        // Grid helper
        const gridHelper = new THREE.GridHelper(10, 10);
        this.scene.add(gridHelper);

        // Axis helper
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
    }

    // Primitive creation methods
    addBox() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Box_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Box');
    }

    addSphere() {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Sphere_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Sphere');
    }

    addCylinder() {
        const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        const material = new THREE.MeshLambertMaterial({ color: 0x0000ff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Cylinder_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Cylinder');
    }

    addCone() {
        const geometry = new THREE.ConeGeometry(0.5, 1, 32);
        const material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Cone_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Cone');
    }

    addTorus() {
        const geometry = new THREE.TorusGeometry(0.4, 0.2, 16, 100);
        const material = new THREE.MeshLambertMaterial({ color: 0xff00ff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Torus_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Torus');
    }

    addPlane() {
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ffff, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Plane_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Plane');
    }

    addTorusKnot() {
        const geometry = new THREE.TorusKnotGeometry(0.4, 0.15, 100, 16);
        const material = new THREE.MeshLambertMaterial({ color: 0x888888 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `TorusKnot_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Torus Knot');
    }

    addTetrahedron() {
        const geometry = new THREE.TetrahedronGeometry(0.6);
        const material = new THREE.MeshLambertMaterial({ color: 0x00aa00 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Tetrahedron_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Tetrahedron');
    }

    addIcosahedron() {
        const geometry = new THREE.IcosahedronGeometry(0.6);
        const material = new THREE.MeshLambertMaterial({ color: 0xaa0000 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Icosahedron_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Icosahedron');
    }

    addDodecahedron() {
        const geometry = new THREE.DodecahedronGeometry(0.6);
        const material = new THREE.MeshLambertMaterial({ color: 0x0000aa });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Dodecahedron_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Dodecahedron');
    }

    addOctahedron() {
        const geometry = new THREE.OctahedronGeometry(0.6);
        const material = new THREE.MeshLambertMaterial({ color: 0xaa00aa });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Octahedron_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Octahedron');
    }

    addTube() {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.5, 0, 0),
            new THREE.Vector3(0, 0.5, 0),
            new THREE.Vector3(0.5, 0, 0),
            new THREE.Vector3(0, -0.5, 0)
        ]);
        const geometry = new THREE.TubeGeometry(curve, 20, 0.1, 8, false);
        const material = new THREE.MeshLambertMaterial({ color: 0xaaaa00 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Tube_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Tube');
    }

    addTeapot() {
        // Create a simple teapot-like shape using a sphere with a handle and spout
        const group = new THREE.Group();
        
        // Main body
        const bodyGeometry = new THREE.SphereGeometry(0.4, 32, 32);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.scale.set(1, 0.8, 1);
        body.castShadow = true;
        body.receiveShadow = true;
        group.add(body);
        
        // Spout
        const spoutGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.3, 8);
        const spoutMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const spout = new THREE.Mesh(spoutGeometry, spoutMaterial);
        spout.position.set(0.35, 0.1, 0);
        spout.rotation.z = Math.PI / 4;
        spout.castShadow = true;
        spout.receiveShadow = true;
        group.add(spout);
        
        // Handle
        const handleGeometry = new THREE.TorusGeometry(0.15, 0.03, 8, 16);
        const handleMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.set(-0.35, 0, 0);
        handle.rotation.y = Math.PI / 2;
        handle.castShadow = true;
        handle.receiveShadow = true;
        group.add(handle);
        
        // Lid
        const lidGeometry = new THREE.CylinderGeometry(0.35, 0.4, 0.05, 32);
        const lidMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const lid = new THREE.Mesh(lidGeometry, lidMaterial);
        lid.position.set(0, 0.32, 0);
        lid.castShadow = true;
        lid.receiveShadow = true;
        group.add(lid);
        
        // Knob
        const knobGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const knobMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const knob = new THREE.Mesh(knobGeometry, knobMaterial);
        knob.position.set(0, 0.4, 0);
        knob.castShadow = true;
        knob.receiveShadow = true;
        group.add(knob);
        
        group.name = `Teapot_${this.objects.length + 1}`;
        this.scene.add(group);
        this.objects.push(group);
        this.selectObject(group);
        this.updateSceneGraph();
        this.saveState('Add Teapot');
    }

    // Object manipulation methods
    selectObject(object) {
        this.selectedObject = object;
        this.transformControls.attach(object);
        
        // Visual feedback
        this.objects.forEach(obj => {
            obj.material.emissive.setHex(0x000000);
        });
        object.material.emissive.setHex(0x444444);
        
        // Update properties panel
        this.updatePropertiesPanel(object);
        
        // Update scene graph highlighting
        this.updateSceneGraph();
    }

    deselectObject() {
        if (this.selectedObject) {
            this.selectedObject.material.emissive.setHex(0x000000);
            this.selectedObject = null;
            this.transformControls.detach();
            
            // Clear properties panel
            this.clearPropertiesPanel();
        }
    }

    updatePropertiesPanel(object) {
        this.clearPropertiesPanel();
        
        if (!object) return;
        
        // Add object name
        const nameController = {
            name: object.name || 'Unnamed Object'
        };
        this.propertiesFolder.add(nameController, 'name').name('Name').onChange((value) => {
            object.name = value;
        });
        
        // Add position controls
        const positionFolder = this.propertiesFolder.addFolder('Position');
        positionFolder.add(object.position, 'x', -10, 10).name('X').onChange(() => {
            // Position updates are handled automatically by THREE.js
        });
        positionFolder.add(object.position, 'y', -10, 10).name('Y').onChange(() => {
            // Position updates are handled automatically by THREE.js
        });
        positionFolder.add(object.position, 'z', -10, 10).name('Z').onChange(() => {
            // Position updates are handled automatically by THREE.js
        });
        
        // Add rotation controls (in degrees for better UX)
        const rotationFolder = this.propertiesFolder.addFolder('Rotation');
        const rotationDegrees = {
            x: object.rotation.x * 180 / Math.PI,
            y: object.rotation.y * 180 / Math.PI,
            z: object.rotation.z * 180 / Math.PI
        };
        rotationFolder.add(rotationDegrees, 'x', -180, 180).name('X (deg)').onChange((value) => {
            object.rotation.x = value * Math.PI / 180;
        });
        rotationFolder.add(rotationDegrees, 'y', -180, 180).name('Y (deg)').onChange((value) => {
            object.rotation.y = value * Math.PI / 180;
        });
        rotationFolder.add(rotationDegrees, 'z', -180, 180).name('Z (deg)').onChange((value) => {
            object.rotation.z = value * Math.PI / 180;
        });
        
        // Add scale controls
        const scaleFolder = this.propertiesFolder.addFolder('Scale');
        scaleFolder.add(object.scale, 'x', 0.1, 5).name('X').onChange(() => {
            // Scale updates are handled automatically by THREE.js
        });
        scaleFolder.add(object.scale, 'y', 0.1, 5).name('Y').onChange(() => {
            // Scale updates are handled automatically by THREE.js
        });
        scaleFolder.add(object.scale, 'z', 0.1, 5).name('Z').onChange(() => {
            // Scale updates are handled automatically by THREE.js
        });
        
        // Add material properties
        const materialFolder = this.propertiesFolder.addFolder('Material');
        const materialColor = {
            color: object.material.color.getHex()
        };
        materialFolder.addColor(materialColor, 'color').name('Color').onChange((value) => {
            object.material.color.setHex(value);
        });
        
        // Add geometry-specific properties
        this.addGeometryProperties(object);
        
        this.propertiesFolder.open();
    }

    addGeometryProperties(object) {
        const geometry = object.geometry;
        const geometryFolder = this.propertiesFolder.addFolder('Geometry');
        
        // Store original geometry parameters for rebuilding
        if (!object.userData.geometryParams) {
            object.userData.geometryParams = this.getGeometryParameters(geometry);
        }
        
        const params = object.userData.geometryParams;
        
        if (geometry.type === 'BoxGeometry') {
            geometryFolder.add(params, 'width', 0.1, 5).name('Width').onChange(() => {
                this.rebuildGeometry(object, 'box');
            });
            geometryFolder.add(params, 'height', 0.1, 5).name('Height').onChange(() => {
                this.rebuildGeometry(object, 'box');
            });
            geometryFolder.add(params, 'depth', 0.1, 5).name('Depth').onChange(() => {
                this.rebuildGeometry(object, 'box');
            });
        } else if (geometry.type === 'SphereGeometry') {
            geometryFolder.add(params, 'radius', 0.1, 3).name('Radius').onChange(() => {
                this.rebuildGeometry(object, 'sphere');
            });
            geometryFolder.add(params, 'widthSegments', 4, 64).step(1).name('Width Segments').onChange(() => {
                this.rebuildGeometry(object, 'sphere');
            });
            geometryFolder.add(params, 'heightSegments', 2, 64).step(1).name('Height Segments').onChange(() => {
                this.rebuildGeometry(object, 'sphere');
            });
        } else if (geometry.type === 'CylinderGeometry') {
            geometryFolder.add(params, 'radiusTop', 0.1, 3).name('Top Radius').onChange(() => {
                this.rebuildGeometry(object, 'cylinder');
            });
            geometryFolder.add(params, 'radiusBottom', 0.1, 3).name('Bottom Radius').onChange(() => {
                this.rebuildGeometry(object, 'cylinder');
            });
            geometryFolder.add(params, 'height', 0.1, 5).name('Height').onChange(() => {
                this.rebuildGeometry(object, 'cylinder');
            });
        } else if (geometry.type === 'ConeGeometry') {
            geometryFolder.add(params, 'radius', 0.1, 3).name('Radius').onChange(() => {
                this.rebuildGeometry(object, 'cone');
            });
            geometryFolder.add(params, 'height', 0.1, 5).name('Height').onChange(() => {
                this.rebuildGeometry(object, 'cone');
            });
        } else if (geometry.type === 'TorusGeometry') {
            geometryFolder.add(params, 'radius', 0.1, 3).name('Radius').onChange(() => {
                this.rebuildGeometry(object, 'torus');
            });
            geometryFolder.add(params, 'tube', 0.05, 1).name('Tube').onChange(() => {
                this.rebuildGeometry(object, 'torus');
            });
        } else if (geometry.type === 'PlaneGeometry') {
            geometryFolder.add(params, 'width', 0.1, 10).name('Width').onChange(() => {
                this.rebuildGeometry(object, 'plane');
            });
            geometryFolder.add(params, 'height', 0.1, 10).name('Height').onChange(() => {
                this.rebuildGeometry(object, 'plane');
            });
        }
    }

    getGeometryParameters(geometry) {
        const params = geometry.parameters || {};
        
        // Set default parameters if not available
        switch (geometry.type) {
            case 'BoxGeometry':
                return {
                    width: params.width || 1,
                    height: params.height || 1,
                    depth: params.depth || 1
                };
            case 'SphereGeometry':
                return {
                    radius: params.radius || 0.5,
                    widthSegments: params.widthSegments || 32,
                    heightSegments: params.heightSegments || 32
                };
            case 'CylinderGeometry':
                return {
                    radiusTop: params.radiusTop || 0.5,
                    radiusBottom: params.radiusBottom || 0.5,
                    height: params.height || 1
                };
            case 'ConeGeometry':
                return {
                    radius: params.radius || 0.5,
                    height: params.height || 1
                };
            case 'TorusGeometry':
                return {
                    radius: params.radius || 0.4,
                    tube: params.tube || 0.2
                };
            case 'PlaneGeometry':
                return {
                    width: params.width || 2,
                    height: params.height || 2
                };
            default:
                return {};
        }
    }

    rebuildGeometry(object, type) {
        const params = object.userData.geometryParams;
        let newGeometry;
        
        switch (type) {
            case 'box':
                newGeometry = new THREE.BoxGeometry(params.width, params.height, params.depth);
                break;
            case 'sphere':
                newGeometry = new THREE.SphereGeometry(params.radius, params.widthSegments, params.heightSegments);
                break;
            case 'cylinder':
                newGeometry = new THREE.CylinderGeometry(params.radiusTop, params.radiusBottom, params.height, 32);
                break;
            case 'cone':
                newGeometry = new THREE.ConeGeometry(params.radius, params.height, 32);
                break;
            case 'torus':
                newGeometry = new THREE.TorusGeometry(params.radius, params.tube, 16, 100);
                break;
            case 'plane':
                newGeometry = new THREE.PlaneGeometry(params.width, params.height);
                break;
        }
        
        if (newGeometry) {
            object.geometry.dispose();
            object.geometry = newGeometry;
        }
    }

    clearPropertiesPanel() {
        // Remove all controllers from the properties folder
        const controllers = [...this.propertiesFolder.__controllers];
        controllers.forEach(controller => {
            this.propertiesFolder.remove(controller);
        });
        
        // Remove all subfolders
        const folders = [...this.propertiesFolder.__folders];
        folders.forEach(folder => {
            this.propertiesFolder.removeFolder(folder);
        });
        
        this.propertiesFolder.close();
    }

    updateSceneGraph() {
        // Clear existing list
        this.objectsList.innerHTML = '';
        
        // Add each object to the scene graph
        this.objects.forEach((object, index) => {
            const listItem = document.createElement('li');
            listItem.style.cssText = `
                padding: 5px;
                margin: 2px 0;
                background: ${this.selectedObject === object ? '#444' : '#222'};
                border-radius: 3px;
                cursor: pointer;
                border: 1px solid #555;
            `;
            
            // Object name and type
            const objectInfo = document.createElement('div');
            objectInfo.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            
            const objectName = document.createElement('span');
            objectName.textContent = object.name || `Object_${index + 1}`;
            objectName.style.cssText = `
                font-weight: bold;
                color: #fff;
            `;
            
            const objectType = document.createElement('span');
            objectType.textContent = object.geometry.type.replace('Geometry', '');
            objectType.style.cssText = `
                font-size: 10px;
                color: #aaa;
                font-style: italic;
            `;
            
            // Visibility toggle
            const visibilityBtn = document.createElement('button');
            visibilityBtn.textContent = object.visible ? '👁' : '🚫';
            visibilityBtn.style.cssText = `
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 12px;
                padding: 2px 5px;
                margin: 0 5px;
            `;
            visibilityBtn.onclick = (e) => {
                e.stopPropagation();
                object.visible = !object.visible;
                visibilityBtn.textContent = object.visible ? '👁' : '🚫';
            };
            
            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑';
            deleteBtn.style.cssText = `
                background: none;
                border: none;
                color: #ff4444;
                cursor: pointer;
                font-size: 12px;
                padding: 2px 5px;
            `;
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                this.deleteObject(object);
            };
            
            // Click to select
            listItem.onclick = () => {
                this.selectObject(object);
            };
            
            objectInfo.appendChild(objectName);
            objectInfo.appendChild(objectType);
            
            const buttonContainer = document.createElement('div');
            buttonContainer.appendChild(visibilityBtn);
            buttonContainer.appendChild(deleteBtn);
            
            objectInfo.appendChild(buttonContainer);
            listItem.appendChild(objectInfo);
            
            // Add position info
            const positionInfo = document.createElement('div');
            positionInfo.style.cssText = `
                font-size: 10px;
                color: #999;
                margin-top: 3px;
            `;
            positionInfo.textContent = `x: ${object.position.x.toFixed(2)}, y: ${object.position.y.toFixed(2)}, z: ${object.position.z.toFixed(2)}`;
            listItem.appendChild(positionInfo);
            
            this.objectsList.appendChild(listItem);
        });
        
        // Add message if no objects
        if (this.objects.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'No objects in scene';
            emptyMessage.style.cssText = `
                color: #666;
                font-style: italic;
                text-align: center;
                padding: 20px;
            `;
            this.objectsList.appendChild(emptyMessage);
        }
    }

    deleteObject(object) {
        if (object) {
            this.scene.remove(object);
            const index = this.objects.indexOf(object);
            if (index > -1) {
                this.objects.splice(index, 1);
            }
            if (this.selectedObject === object) {
                this.deselectObject();
            }
            this.updateSceneGraph();
            this.saveState('Delete object');
        }
    }

    deleteSelectedObject() {
        if (this.selectedObject) {
            this.deleteObject(this.selectedObject);
        }
    }

    duplicateSelectedObject() {
        if (this.selectedObject) {
            const geometry = this.selectedObject.geometry.clone();
            const material = this.selectedObject.material.clone();
            const mesh = new THREE.Mesh(geometry, material);
            
            mesh.position.copy(this.selectedObject.position);
            mesh.rotation.copy(this.selectedObject.rotation);
            mesh.scale.copy(this.selectedObject.scale);
            
            // Offset position slightly
            mesh.position.x += 1;
            
            // Copy geometry parameters
            if (this.selectedObject.userData.geometryParams) {
                mesh.userData.geometryParams = { ...this.selectedObject.userData.geometryParams };
            }
            
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.name = `${this.selectedObject.name}_copy`;
            
            this.scene.add(mesh);
            this.objects.push(mesh);
            this.selectObject(mesh);
            this.updateSceneGraph();
            this.saveState('Duplicate object');
        }
    }

    // History system methods
    saveState(description = 'Action') {
        // Create a snapshot of the current state
        const state = {
            description: description,
            timestamp: Date.now(),
            objects: this.objects.map(obj => ({
                name: obj.name,
                type: obj.geometry.type,
                position: obj.position.clone(),
                rotation: obj.rotation.clone(),
                scale: obj.scale.clone(),
                material: {
                    color: obj.material.color.clone(),
                    emissive: obj.material.emissive.clone()
                },
                geometryParams: obj.userData.geometryParams ? {...obj.userData.geometryParams} : null,
                visible: obj.visible,
                uuid: obj.uuid
            })),
            selectedObjectUuid: this.selectedObject ? this.selectedObject.uuid : null
        };
        
        // Remove any future states if we're not at the end
        if (this.historyIndex < this.history.length - 1) {
            this.history.splice(this.historyIndex + 1);
        }
        
        // Add new state
        this.history.push(state);
        this.historyIndex++;
        
        // Limit history size
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
            this.historyIndex--;
        }
        
        console.log(`State saved: ${description} (${this.historyIndex + 1}/${this.history.length})`);
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState(this.history[this.historyIndex]);
            console.log(`Undo: ${this.history[this.historyIndex].description}`);
        } else {
            console.log('Nothing to undo');
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState(this.history[this.historyIndex]);
            console.log(`Redo: ${this.history[this.historyIndex].description}`);
        } else {
            console.log('Nothing to redo');
        }
    }

    restoreState(state) {
        // Clear current scene
        this.objects.forEach(obj => {
            this.scene.remove(obj);
            obj.geometry.dispose();
            obj.material.dispose();
        });
        this.objects.length = 0;
        
        // Restore objects
        state.objects.forEach(objData => {
            let geometry;
            
            // Recreate geometry based on type
            switch (objData.type) {
                case 'BoxGeometry':
                    const params = objData.geometryParams || { width: 1, height: 1, depth: 1 };
                    geometry = new THREE.BoxGeometry(params.width, params.height, params.depth);
                    break;
                case 'SphereGeometry':
                    const sphereParams = objData.geometryParams || { radius: 0.5, widthSegments: 32, heightSegments: 32 };
                    geometry = new THREE.SphereGeometry(sphereParams.radius, sphereParams.widthSegments, sphereParams.heightSegments);
                    break;
                case 'CylinderGeometry':
                    const cylinderParams = objData.geometryParams || { radiusTop: 0.5, radiusBottom: 0.5, height: 1 };
                    geometry = new THREE.CylinderGeometry(cylinderParams.radiusTop, cylinderParams.radiusBottom, cylinderParams.height, 32);
                    break;
                case 'ConeGeometry':
                    const coneParams = objData.geometryParams || { radius: 0.5, height: 1 };
                    geometry = new THREE.ConeGeometry(coneParams.radius, coneParams.height, 32);
                    break;
                case 'TorusGeometry':
                    const torusParams = objData.geometryParams || { radius: 0.4, tube: 0.2 };
                    geometry = new THREE.TorusGeometry(torusParams.radius, torusParams.tube, 16, 100);
                    break;
                case 'PlaneGeometry':
                    const planeParams = objData.geometryParams || { width: 2, height: 2 };
                    geometry = new THREE.PlaneGeometry(planeParams.width, planeParams.height);
                    break;
                default:
                    geometry = new THREE.BoxGeometry(1, 1, 1);
            }
            
            // Recreate material
            const material = new THREE.MeshLambertMaterial({ 
                color: objData.material.color,
                side: objData.type === 'PlaneGeometry' ? THREE.DoubleSide : THREE.FrontSide
            });
            material.emissive.copy(objData.material.emissive);
            
            // Create mesh
            const mesh = new THREE.Mesh(geometry, material);
            mesh.name = objData.name;
            mesh.position.copy(objData.position);
            mesh.rotation.copy(objData.rotation);
            mesh.scale.copy(objData.scale);
            mesh.visible = objData.visible;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.uuid = objData.uuid;
            mesh.userData.geometryParams = objData.geometryParams;
            
            this.scene.add(mesh);
            this.objects.push(mesh);
        });
        
        // Restore selection
        this.deselectObject();
        if (state.selectedObjectUuid) {
            const selectedObj = this.objects.find(obj => obj.uuid === state.selectedObjectUuid);
            if (selectedObj) {
                this.selectObject(selectedObj);
            }
        }
        
        this.updateSceneGraph();
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            // Enter fullscreen
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.orbitControls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});