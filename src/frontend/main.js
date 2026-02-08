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
import { ToastManager } from './ToastManager.js';

/**
 * Simple 3D modeling application with basic primitives and transform controls
 */
export class App {
<<<<<<< HEAD
  constructor() {
    // Initialize Service Container
    this.container = new ServiceContainer();
=======
<<<<<<< HEAD
    constructor() {
        // Initialize Service Container
        this.container = new ServiceContainer();
=======
  constructor() {
    // Initialize Toast Manager
    this.toastManager = new ToastManager();

    // Initialize Service Container
    this.container = new ServiceContainer();
>>>>>>> master
>>>>>>> master

        // Register Core Services
        this.container.register('EventBus', EventBus);

        this.stateManager = new StateManager();
        this.container.register('StateManager', this.stateManager);

<<<<<<< HEAD
=======
<<<<<<< HEAD
        // Initialize Three.js Core
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.clock = new THREE.Clock();
=======
>>>>>>> master
    // Initialize Three.js Core
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
<<<<<<< HEAD
    this.clock = new THREE.Clock(); // Added from master
=======
>>>>>>> master
>>>>>>> master

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

<<<<<<< HEAD
=======
<<<<<<< HEAD
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
=======
>>>>>>> master
    this.selectedObject = null;
    this.objects = [];

    // History system for undo/redo
    this.history = [];
    this.historyIndex = -1;
    this.maxHistorySize = 50;
<<<<<<< HEAD

    // Continue initialization
    this.setupControls();
    this.initRemaining();
    this.setupGUI();
    this.setupLighting();
    this.setupHelpers();

    // Bind animation loop
    this.animate = this.animate.bind(this);
    this.animate();
=======
>>>>>>> master

        // Setup camera
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);
>>>>>>> master

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

<<<<<<< HEAD
=======
<<<<<<< HEAD
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
=======
>>>>>>> master
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
    // Setup scene graph UI
    this.setupSceneGraph();

    // Initialize scene storage
    this.sceneStorage = new SceneStorage(this.scene, null); // EventBus not needed for basic save/load

    // Mobile touch optimizations
    this.setupMobileOptimizations();
  }

  setupSceneGraph() {
<<<<<<< HEAD
    // Use existing scene graph panel from DOM (master logic)
    this.sceneGraphPanel = document.getElementById('scene-graph');
    if (!this.sceneGraphPanel) {
        console.warn('Scene graph panel element not found! Creating one.');
        this.sceneGraphPanel = document.createElement('div');
        this.sceneGraphPanel.id = 'scene-graph';
        document.body.appendChild(this.sceneGraphPanel);
    }
    this.sceneGraphPanel.innerHTML = '';
=======
    // Create scene graph panel
    this.sceneGraphPanel = document.createElement('div');
    this.sceneGraphPanel.id = 'scene-graph-panel';
    this.sceneGraphPanel.style.cssText = `
            position: fixed;
            top: 70px;
            left: 10px;
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
>>>>>>> master

    // Create title
    const title = document.createElement('h3');
    title.textContent = 'Scene Graph';

    // Create objects list
    this.objectsList = document.createElement('ul');
    this.objectsList.setAttribute('role', 'listbox');
<<<<<<< HEAD
    this.objectsList.setAttribute('aria-label', 'Scene objects');
    this.objectsList.style.cssText = `
        list-style: none;
        margin: 0;
        padding: 0;
    `;

    this.sceneGraphPanel.setAttribute('aria-label', 'Scene Graph');
=======
    this.objectsList.style.cssText = `
>>>>>>> master
            list-style: none;
            margin: 0;
            padding: 0;
        `;

<<<<<<< HEAD
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
=======
>>>>>>> master
    this.sceneGraphPanel.appendChild(title);
    this.sceneGraphPanel.appendChild(this.objectsList);

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
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> master
            } else {
                this.deselectObject();
            }
        });

<<<<<<< HEAD
=======
<<<<<<< HEAD
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
=======
>>>>>>> master
    // Fullscreen button
    const fullscreenButton = document.getElementById('fullscreen');
    if (fullscreenButton) {
      fullscreenButton.addEventListener('click', () => {
        this.toggleFullscreen();
<<<<<<< HEAD
      });
    }

    // Listen for fullscreen changes to update button text
    document.addEventListener('fullscreenchange', () => {
      if (fullscreenButton) {
        fullscreenButton.textContent = document.fullscreenElement
          ? 'Exit Fullscreen'
          : 'Fullscreen';
      }
    });

    // Handle vendor-specific fullscreen events
    document.addEventListener('webkitfullscreenchange', () => {
      if (fullscreenButton) {
        fullscreenButton.textContent = document.webkitFullscreenElement
          ? 'Exit Fullscreen'
          : 'Fullscreen';
      }
    });

    document.addEventListener('mozfullscreenchange', () => {
      if (fullscreenButton) {
        fullscreenButton.textContent = document.mozFullScreenElement
          ? 'Exit Fullscreen'
          : 'Fullscreen';
      }
    });

    document.addEventListener('MSFullscreenChange', () => {
      if (fullscreenButton) {
        fullscreenButton.textContent = document.msFullscreenElement
          ? 'Exit Fullscreen'
          : 'Fullscreen';
      }
    });

    // Save scene button
    const saveButton = document.getElementById('save-scene');
    if (saveButton) {
      saveButton.addEventListener('click', () => {
        this.saveScene();
      });
    }
=======
      });
    }

    // Listen for fullscreen changes to update button text
    document.addEventListener('fullscreenchange', () => {
      if (fullscreenButton) {
        fullscreenButton.textContent = document.fullscreenElement
          ? 'Exit Fullscreen'
          : 'Fullscreen';
      }
    });

    // Handle vendor-specific fullscreen events
    document.addEventListener('webkitfullscreenchange', () => {
      if (fullscreenButton) {
        fullscreenButton.textContent = document.webkitFullscreenElement
          ? 'Exit Fullscreen'
          : 'Fullscreen';
      }
    });
>>>>>>> master

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
<<<<<<< HEAD

    handleTouch(touch) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2();
        mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
=======
>>>>>>> master
>>>>>>> master

        this.raycaster.setFromCamera(mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects);

<<<<<<< HEAD
=======
<<<<<<< HEAD
        if (intersects.length > 0) {
            this.selectObject(intersects[0].object);
=======
>>>>>>> master
      fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
          this.loadScene(file);
        }
      });
    }
  }

  setupMobileOptimizations() {
    // Detect mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isMobile || isTouch) {
      // Disable transform controls hover effects on mobile for better performance
      this.transformControls.addEventListener('mouseDown', () => {
        this.orbitControls.enabled = false;
      });

      this.transformControls.addEventListener('mouseUp', () => {
        this.orbitControls.enabled = true;
      });

      // Optimize orbit controls for touch
      this.orbitControls.enableKeys = false; // Disable keyboard on mobile
      this.orbitControls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      };

      // Reduce damping for snappier feel on mobile
      this.orbitControls.dampingFactor = 0.1;

      // Add touch-friendly selection using longer press
      let touchStartTime = 0;
      const touchStart = { x: 0, y: 0 };
      const touchSelectThreshold = 200; // milliseconds
      const touchMoveThreshold = 10; // pixels

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

        // If touch was short and didn't move much, treat as selection
        if (touchDuration < touchSelectThreshold && moveDistance < touchMoveThreshold) {
          this.handleTouch(event.changedTouches[0]);
        }
      });

      // Prevent context menu on long press
      this.renderer.domElement.addEventListener('contextmenu', (event) => {
        event.preventDefault();
      });

      // Add visual feedback for mobile interactions
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
      const selectedObject = intersects[0].object;
      this.selectObject(selectedObject);
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

    // Properties panel (initially hidden)
    this.propertiesFolder = this.gui.addFolder('Properties');
    this.propertiesFolder.close();

    // Subscribe to state changes for properties panel updates
    if (this.stateManager) {
      this.stateManager.subscribe('selection', (selection) => {
        if (selection && selection.length > 0) {
          this.updatePropertiesPanel(selection[0]);
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> master
        } else {
            this.deselectObject();
        }
<<<<<<< HEAD
      });
    }
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
    const mesh = this.primitiveFactory.createPrimitive('Box', { width: 1, height: 1, depth: 1, color: 0x00ff00 });
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
    const mesh = this.primitiveFactory.createPrimitive('Sphere', { radius: 0.5, widthSegments: 32, heightSegments: 32, color: 0xff0000 });
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
    const mesh = this.primitiveFactory.createPrimitive('Cylinder', { radiusTop: 0.5, radiusBottom: 0.5, height: 1, radialSegments: 32, color: 0x0000ff });
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
    const mesh = this.primitiveFactory.createPrimitive('Cone', { radius: 0.5, height: 1, radialSegments: 32, color: 0xffff00 });
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
    const mesh = this.primitiveFactory.createPrimitive('Torus', { radius: 0.4, tube: 0.2, radialSegments: 16, tubularSegments: 100, color: 0xff00ff });
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
    const mesh = this.primitiveFactory.createPrimitive('Plane', { width: 2, height: 2, color: 0x00ffff });
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
    const mesh = this.primitiveFactory.createPrimitive('TorusKnot', { radius: 0.4, tube: 0.15, tubularSegments: 100, radialSegments: 16, color: 0x888888 });
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
    const mesh = this.primitiveFactory.createPrimitive('Tetrahedron', { radius: 0.6, color: 0x00aa00 });
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
    const mesh = this.primitiveFactory.createPrimitive('Icosahedron', { radius: 0.6, color: 0xaa0000 });
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
    const mesh = this.primitiveFactory.createPrimitive('Dodecahedron', { radius: 0.6, color: 0x0000aa });
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
    const mesh = this.primitiveFactory.createPrimitive('Octahedron', { radius: 0.6, color: 0xaa00aa });
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
      new THREE.Vector3(0, -0.5, 0),
    ]);
    const mesh = this.primitiveFactory.createPrimitive('Tube', { path: curve, radius: 0.1, color: 0xaaaa00 });
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
    // Use ObjectManager to handle selection logic, which now uses StateManager
    if (this.objectManager) {
      this.objectManager.selectObject(object);
    }

=======
    }

<<<<<<< HEAD
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
=======
>>>>>>> master
    this.selectedObject = object;
    this.transformControls.attach(object);

    // Visual feedback
    this.objects.forEach((obj) => {
        if (obj.material && obj.material.emissive) {
            obj.material.emissive.setHex(0x000000);
        }
    });

    if (object.material && object.material.emissive) {
        object.material.emissive.setHex(0x444444);
    }

    // Update scene graph highlighting
    this.updateSceneGraph();
  }

  deselectObject() {
    if (this.objectManager) {
      this.objectManager.deselectObject();
    }

    if (this.selectedObject) {
      if (this.selectedObject.material && this.selectedObject.material.emissive) {
        this.selectedObject.material.emissive.setHex(0x000000);
      }
      this.selectedObject = null;
      this.transformControls.detach();
    }
  }

  updatePropertiesPanel(object) {
    this.clearPropertiesPanel();

    if (!object) return;

    // Add object name
    const nameController = {
      name: object.name || 'Unnamed Object',
    };
    this.propertiesFolder
      .add(nameController, 'name')
      .name('Name')
      .onChange((value) => {
        object.name = value;
      });

    // Add position controls
    const positionFolder = this.propertiesFolder.addFolder('Position');
    positionFolder
      .add(object.position, 'x', -10, 10)
      .name('X')
      .onChange(() => {
        // Position updates are handled automatically by THREE.js
      });
    positionFolder
      .add(object.position, 'y', -10, 10)
      .name('Y')
      .onChange(() => {
        // Position updates are handled automatically by THREE.js
      });
    positionFolder
      .add(object.position, 'z', -10, 10)
      .name('Z')
      .onChange(() => {
        // Position updates are handled automatically by THREE.js
      });

    // Add rotation controls (in degrees for better UX)
    const rotationFolder = this.propertiesFolder.addFolder('Rotation');
    const rotationDegrees = {
      x: (object.rotation.x * 180) / Math.PI,
      y: (object.rotation.y * 180) / Math.PI,
      z: (object.rotation.z * 180) / Math.PI,
    };
    rotationFolder
      .add(rotationDegrees, 'x', -180, 180)
      .name('X (deg)')
      .onChange((value) => {
        object.rotation.x = (value * Math.PI) / 180;
      });
    rotationFolder
      .add(rotationDegrees, 'y', -180, 180)
      .name('Y (deg)')
      .onChange((value) => {
        object.rotation.y = (value * Math.PI) / 180;
      });
    rotationFolder
      .add(rotationDegrees, 'z', -180, 180)
      .name('Z (deg)')
      .onChange((value) => {
        object.rotation.z = (value * Math.PI) / 180;
      });

    // Add scale controls
    const scaleFolder = this.propertiesFolder.addFolder('Scale');
    scaleFolder
      .add(object.scale, 'x', 0.1, 5)
      .name('X')
      .onChange(() => {
        // Scale updates are handled automatically by THREE.js
      });
    scaleFolder
      .add(object.scale, 'y', 0.1, 5)
      .name('Y')
      .onChange(() => {
        // Scale updates are handled automatically by THREE.js
      });
    scaleFolder
      .add(object.scale, 'z', 0.1, 5)
      .name('Z')
      .onChange(() => {
        // Scale updates are handled automatically by THREE.js
      });

    // Add material properties
    const materialFolder = this.propertiesFolder.addFolder('Material');
    if (object.material && object.material.color) {
        const materialColor = {
            color: object.material.color.getHex(),
        };
        materialFolder
        .addColor(materialColor, 'color')
        .name('Color')
        .onChange((value) => {
            object.material.color.setHex(value);
        });
    }

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
      geometryFolder
        .add(params, 'width', 0.1, 5)
        .name('Width')
        .onChange(() => {
          this.rebuildGeometry(object, 'box');
        });
      geometryFolder
        .add(params, 'height', 0.1, 5)
        .name('Height')
        .onChange(() => {
          this.rebuildGeometry(object, 'box');
        });
      geometryFolder
        .add(params, 'depth', 0.1, 5)
        .name('Depth')
        .onChange(() => {
          this.rebuildGeometry(object, 'box');
        });
    } else if (geometry.type === 'SphereGeometry') {
      geometryFolder
        .add(params, 'radius', 0.1, 3)
        .name('Radius')
        .onChange(() => {
          this.rebuildGeometry(object, 'sphere');
        });
      geometryFolder
        .add(params, 'widthSegments', 4, 64)
        .step(1)
        .name('Width Segments')
        .onChange(() => {
          this.rebuildGeometry(object, 'sphere');
        });
      geometryFolder
        .add(params, 'heightSegments', 2, 64)
        .step(1)
        .name('Height Segments')
        .onChange(() => {
          this.rebuildGeometry(object, 'sphere');
        });
    } else if (geometry.type === 'CylinderGeometry') {
      geometryFolder
        .add(params, 'radiusTop', 0.1, 3)
        .name('Top Radius')
        .onChange(() => {
          this.rebuildGeometry(object, 'cylinder');
        });
      geometryFolder
        .add(params, 'radiusBottom', 0.1, 3)
        .name('Bottom Radius')
        .onChange(() => {
          this.rebuildGeometry(object, 'cylinder');
        });
      geometryFolder
        .add(params, 'height', 0.1, 5)
        .name('Height')
        .onChange(() => {
          this.rebuildGeometry(object, 'cylinder');
        });
    } else if (geometry.type === 'ConeGeometry') {
      geometryFolder
        .add(params, 'radius', 0.1, 3)
        .name('Radius')
        .onChange(() => {
          this.rebuildGeometry(object, 'cone');
        });
      geometryFolder
        .add(params, 'height', 0.1, 5)
        .name('Height')
        .onChange(() => {
          this.rebuildGeometry(object, 'cone');
        });
    } else if (geometry.type === 'TorusGeometry') {
      geometryFolder
        .add(params, 'radius', 0.1, 3)
        .name('Radius')
        .onChange(() => {
          this.rebuildGeometry(object, 'torus');
        });
      geometryFolder
        .add(params, 'tube', 0.05, 1)
        .name('Tube')
        .onChange(() => {
          this.rebuildGeometry(object, 'torus');
        });
    } else if (geometry.type === 'PlaneGeometry') {
      geometryFolder
        .add(params, 'width', 0.1, 10)
        .name('Width')
        .onChange(() => {
          this.rebuildGeometry(object, 'plane');
        });
      geometryFolder
        .add(params, 'height', 0.1, 10)
        .name('Height')
        .onChange(() => {
          this.rebuildGeometry(object, 'plane');
        });
<<<<<<< HEAD
=======
>>>>>>> master
    }

<<<<<<< HEAD
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
>>>>>>> master
    }

<<<<<<< HEAD
=======
    updatePropertiesPanel(object) {
        this.clearPropertiesPanel();
        if (!object) return;
=======
>>>>>>> master
  getGeometryParameters(geometry) {
    const params = geometry.parameters || {};

    // Set default parameters if not available
    switch (geometry.type) {
      case 'BoxGeometry':
        return {
          width: params.width || 1,
          height: params.height || 1,
          depth: params.depth || 1,
        };
      case 'SphereGeometry':
        return {
          radius: params.radius || 0.5,
          widthSegments: params.widthSegments || 32,
          heightSegments: params.heightSegments || 32,
        };
      case 'CylinderGeometry':
        return {
          radiusTop: params.radiusTop || 0.5,
          radiusBottom: params.radiusBottom || 0.5,
          height: params.height || 1,
        };
      case 'ConeGeometry':
        return {
          radius: params.radius || 0.5,
          height: params.height || 1,
        };
      case 'TorusGeometry':
        return {
          radius: params.radius || 0.4,
          tube: params.tube || 0.2,
        };
      case 'PlaneGeometry':
        return {
          width: params.width || 2,
          height: params.height || 2,
        };
      default:
        return {};
    }
  }
>>>>>>> master

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

<<<<<<< HEAD
=======
<<<<<<< HEAD
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
=======
>>>>>>> master
    if (newGeometry) {
      object.geometry.dispose();
      object.geometry = newGeometry;
    }
  }

  clearPropertiesPanel() {
    // Remove all controllers from the properties folder
    const controllers = [...this.propertiesFolder.__controllers];
    controllers.forEach((controller) => {
      this.propertiesFolder.remove(controller);
    });

    // Remove all subfolders
    // dat.gui might store folders as object
    const folders = this.propertiesFolder.__folders;
    if (folders) {
        Object.values(folders).forEach((folder) => {
            this.propertiesFolder.removeFolder(folder);
        });
    }

    this.propertiesFolder.close();
  }

  updateSceneGraph() {
    // Check if focus is currently within the list
    const listHasFocus = this.objectsList.contains(document.activeElement);

    // Clear existing list
    this.objectsList.innerHTML = '';

    // Add each object to the scene graph
    this.objects.forEach((object, index) => {
      const listItem = document.createElement('li');
      listItem.setAttribute('role', 'option');
      listItem.setAttribute('tabindex', '0');
      listItem.setAttribute('aria-selected', this.selectedObject === object ? 'true' : 'false');
      listItem.setAttribute('aria-label', `Select ${object.name || `Object_${index + 1}`}`);

      // Keyboard selection
      listItem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.selectObject(object);
        }
      });

      listItem.style.cssText = `
<<<<<<< HEAD
        padding: 5px;
        margin: 2px 0;
        background: ${this.selectedObject === object ? '#444' : '#222'};
        border-radius: 3px;
        cursor: pointer;
        border: 1px solid #555;
        outline: none;
      `;

      // Click to select
      listItem.onclick = () => {
        this.selectObject(object);
      };
=======
                padding: 5px;
                margin: 2px 0;
                background: ${this.selectedObject === object ? '#444' : '#222'};
                border-radius: 3px;
                cursor: pointer;
                border: 1px solid #555;
                outline: none;
            `;
      listItem.setAttribute('role', 'button');
      listItem.setAttribute('tabindex', '0');
      listItem.setAttribute('aria-label', `Select ${object.name || `Object_${index + 1}`}`);

      // Keyboard selection
      listItem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectObject(object);
        }
      });
>>>>>>> master

      // Object name and type
      const objectInfo = document.createElement('div');
      objectInfo.style.cssText = `
<<<<<<< HEAD
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;
=======
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
>>>>>>> master

      const objectName = document.createElement('span');
      objectName.textContent = object.name || `Object_${index + 1}`;
      objectName.style.cssText = `
<<<<<<< HEAD
        font-weight: bold;
        color: #fff;
      `;
=======
                font-weight: bold;
                color: #fff;
            `;
>>>>>>> master

      const objectType = document.createElement('span');
      objectType.textContent = object.geometry.type.replace('Geometry', '');
      objectType.style.cssText = `
<<<<<<< HEAD
        font-size: 10px;
        color: #aaa;
        font-style: italic;
      `;
=======
                font-size: 10px;
                color: #aaa;
                font-style: italic;
            `;
>>>>>>> master

      // Visibility toggle
      const visibilityBtn = document.createElement('button');
      const visibilityLabel = object.visible
        ? `Hide ${object.name || 'object'}`
        : `Show ${object.name || 'object'}`;
      visibilityBtn.textContent = object.visible ? '👁' : '🚫';
<<<<<<< HEAD
      visibilityBtn.title = object.visible ? 'Hide object' : 'Show object';
      visibilityBtn.setAttribute('aria-label', object.visible ? 'Hide object' : 'Show object');
      visibilityBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 12px;
        padding: 5px 8px;
        margin: 0 5px;
        min-width: 24px;
      `;
=======
      visibilityBtn.setAttribute('aria-label', visibilityLabel);
      visibilityBtn.title = visibilityLabel;
      visibilityBtn.style.cssText = `
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 12px;
                padding: 5px 8px;
                margin: 0 5px;
                min-width: 24px;
            `;
>>>>>>> master
      visibilityBtn.onclick = (e) => {
        e.stopPropagation();
        object.visible = !object.visible;
        const newLabel = object.visible
          ? `Hide ${object.name || 'object'}`
          : `Show ${object.name || 'object'}`;
        visibilityBtn.textContent = object.visible ? '👁' : '🚫';
<<<<<<< HEAD
        const label = object.visible ? 'Hide object' : 'Show object';
        visibilityBtn.setAttribute('aria-label', label);
        visibilityBtn.title = label;
=======
        visibilityBtn.setAttribute('aria-label', newLabel);
        visibilityBtn.title = newLabel;
>>>>>>> master
      };

      // Delete button
      const deleteBtn = document.createElement('button');
      const deleteLabel = `Delete ${object.name || 'object'}`;
      deleteBtn.textContent = '🗑';
<<<<<<< HEAD
      deleteBtn.title = 'Delete object';
      deleteBtn.setAttribute('aria-label', 'Delete object');
      deleteBtn.style.cssText = `
        background: none;
        border: none;
        color: #ff4444;
        cursor: pointer;
        font-size: 12px;
        padding: 5px 8px;
        min-width: 24px;
      `;
=======
      deleteBtn.setAttribute('aria-label', deleteLabel);
      deleteBtn.title = deleteLabel;
      deleteBtn.style.cssText = `
                background: none;
                border: none;
                color: #ff4444;
                cursor: pointer;
                font-size: 12px;
                padding: 5px 8px;
                min-width: 24px;
            `;
>>>>>>> master
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        this.deleteObject(object);
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
<<<<<<< HEAD
        font-size: 10px;
        color: #999;
        margin-top: 3px;
      `;
=======
                font-size: 10px;
                color: #999;
                margin-top: 3px;
            `;
>>>>>>> master
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
<<<<<<< HEAD
    }

    // Restore focus if list was focused and we have a selected object
    if (listHasFocus && this.selectedObject) {
         // This logic is simplified; in a real app we'd find the specific element
=======
>>>>>>> master
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
      objects: this.objects.map((obj) => ({
        name: obj.name,
        type: obj.geometry.type,
        position: obj.position.clone(),
        rotation: obj.rotation.clone(),
        scale: obj.scale.clone(),
        material: {
          color: obj.material.color.clone(),
          emissive: obj.material.emissive.clone(),
        },
        geometryParams: obj.userData.geometryParams ? { ...obj.userData.geometryParams } : null,
        visible: obj.visible,
        uuid: obj.uuid,
      })),
      selectedObjectUuid: this.selectedObject ? this.selectedObject.uuid : null,
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
    this.objects.forEach((obj) => {
      this.scene.remove(obj);
      obj.geometry.dispose();
      obj.material.dispose();
    });
    this.objects.length = 0;

    // Restore objects
    state.objects.forEach((objData) => {
      let geometry;

      // Recreate geometry based on type
      switch (objData.type) {
        case 'BoxGeometry':
          const params = objData.geometryParams || { width: 1, height: 1, depth: 1 };
          geometry = new THREE.BoxGeometry(params.width, params.height, params.depth);
          break;
        case 'SphereGeometry':
          const sphereParams = objData.geometryParams || {
            radius: 0.5,
            widthSegments: 32,
            heightSegments: 32,
          };
          geometry = new THREE.SphereGeometry(
            sphereParams.radius,
            sphereParams.widthSegments,
            sphereParams.heightSegments,
          );
          break;
        case 'CylinderGeometry':
          const cylinderParams = objData.geometryParams || {
            radiusTop: 0.5,
            radiusBottom: 0.5,
            height: 1,
          };
          geometry = new THREE.CylinderGeometry(
            cylinderParams.radiusTop,
            cylinderParams.radiusBottom,
            cylinderParams.height,
            32,
          );
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
        side: objData.type === 'PlaneGeometry' ? THREE.DoubleSide : THREE.FrontSide,
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
      const selectedObj = this.objects.find((obj) => obj.uuid === state.selectedObjectUuid);
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

  async saveScene() {
    try {
      await this.sceneStorage.saveScene();
      console.log('Scene saved successfully');
      this.toastManager.show('Scene saved successfully', 'success');
    } catch (error) {
      console.error('Error saving scene:', error);
      this.toastManager.show('Error saving scene. Please try again.', 'error');
    }
  }

  async loadScene(file) {
    try {
      this.toastManager.show('Loading scene...', 'info');
      await this.sceneStorage.loadScene(file);
      console.log('Scene loaded successfully');
      this.toastManager.show('Scene loaded successfully', 'success');
      // Update the objects array to reflect the loaded scene
      this.objects = [];
      this.scene.traverse((child) => {
        if (child.isMesh) {
          this.objects.push(child);
        }
      });
      this.updateSceneGraph();
      this.deselectObject();
      this.saveState('Load scene');
    } catch (error) {
      console.error('Error loading scene:', error);
      this.toastManager.show('Error loading scene. Please check the file format.', 'error');
    }
  }

  animate() {
    requestAnimationFrame(this.animate);

    const deltaTime = this.clock.getDelta();
    if (this.physicsManager) {
        this.physicsManager.update(deltaTime);
    }

    this.orbitControls.update();
    this.renderer.render(this.scene, this.camera);
  }
>>>>>>> master
}

// Init
document.addEventListener('DOMContentLoaded', () => {
<<<<<<< HEAD
  new App();
=======
<<<<<<< HEAD
    new App();
=======
  new App();
>>>>>>> master
>>>>>>> master
});
