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
<<<<<<< HEAD
export class App {
=======
<<<<<<< HEAD
export class App {
=======
<<<<<<< HEAD
export class App {
=======
<<<<<<< HEAD
export class App {
=======
<<<<<<< HEAD
export class App {
=======
<<<<<<< HEAD
export class App {
=======
<<<<<<< HEAD
class App {
<<<<<<< HEAD
  constructor() {
    // Initialize Service Container
    this.container = new ServiceContainer();
=======
    /**
<<<<<<< HEAD
     * Initializes the application.
     */
=======
     * Initializes the application
     */
=======
export class App {
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
    constructor() {
        // Initialize Service Container
        this.container = new ServiceContainer();
>>>>>>> master

    // Register Core Services
    this.container.register('EventBus', EventBus);

    this.stateManager = new StateManager();
    this.container.register('StateManager', this.stateManager);

<<<<<<< HEAD
    // Initialize Three.js Core
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
=======
        // Initialize Three.js Core
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.clock = new THREE.Clock();
>>>>>>> master

    // Register Three.js Core objects (optional but good for DI)
    this.container.register('Scene', this.scene);
    this.container.register('Camera', this.camera);
    this.container.register('Renderer', this.renderer);

    // Initialize Managers in dependency order

    // PrimitiveFactory
    this.primitiveFactory = new PrimitiveFactory();
    this.container.register('PrimitiveFactory', this.primitiveFactory);

    // ObjectFactory & PropertyUpdater
    this.objectFactory = new ObjectFactory(this.scene, this.primitiveFactory, EventBus);
    this.container.register('ObjectFactory', this.objectFactory);

    this.objectPropertyUpdater = new ObjectPropertyUpdater(this.primitiveFactory);
    this.container.register('ObjectPropertyUpdater', this.objectPropertyUpdater);

    // InputManager: needs domElement (renderer.domElement)
    // Note: We should set up renderer size and append to DOM first.
    this.initRenderer();
    this.inputManager = new InputManager(EventBus, this.renderer.domElement);
    this.container.register('InputManager', this.inputManager);

    // PhysicsManager: needs scene
    this.physicsManager = new PhysicsManager(this.scene);
    this.container.register('PhysicsManager', this.physicsManager);

    // SceneManager: needs renderer, camera, inputManager, scene
    this.sceneManager = new SceneManager(this.renderer, this.camera, this.inputManager, this.scene);
    this.container.register('SceneManager', this.sceneManager);

    // ObjectManager: needs scene, eventBus, physicsManager, primitiveFactory, objectFactory, objectPropertyUpdater, stateManager
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
    this.selectedObject = null;
    this.objects = [];

    // History system for undo/redo
    this.history = [];
    this.historyIndex = -1;
    this.maxHistorySize = 50;
=======
<<<<<<< HEAD
        /** @type {THREE.Object3D|null} */
        this.selectedObject = null;
        /** @type {THREE.Object3D[]} */
        this.objects = [];
        
        // History system for undo/redo
        /** @type {any[]} */
=======
<<<<<<< HEAD
        /** @type {SceneObject | null} */
        this.selectedObject = null;
        /** @type {SceneObject[]} */
        this.objects = [];
        
        // History system for undo/redo
        /** @type {SerializedScene[]} */
=======
        /** @type {THREE.Object3D | null} */
        this.selectedObject = null;
        /** @type {THREE.Object3D[]} */
        this.objects = [];
        
        // History system for undo/redo
        /** @type {any[]} */
>>>>>>> master
>>>>>>> master
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

    /**
<<<<<<< HEAD
     * Initializes the renderer and camera.
=======
<<<<<<< HEAD
     * Initializes the renderer.
=======
     * Initializes the renderer and camera
>>>>>>> master
>>>>>>> master
     */
    initRenderer() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);
>>>>>>> master

    // Continue initialization
    this.initRemaining();
    this.setupControls();
    this.setupGUI();
    this.setupLighting();
    this.setupHelpers();
    this.animate();

    // Save initial state
    this.saveState('Initial state');
  }

<<<<<<< HEAD
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

  // Backward compatibility: init() logic split into initRenderer and initRemaining
  init() {
    // This method is effectively replaced by initRenderer and initRemaining called in constructor
  }

  setupSceneGraph() {
    // Create scene graph panel
    this.sceneGraphPanel = document.createElement('div');
    this.sceneGraphPanel.id = 'scene-graph-panel';
    this.sceneGraphPanel.style.cssText = `
=======
    /**
<<<<<<< HEAD
     * Initializes remaining components like UI and storage.
=======
<<<<<<< HEAD
     * Initializes remaining components.
=======
     * Initializes the rest of the application
>>>>>>> master
>>>>>>> master
     */
    initRemaining() {
        // Setup scene graph UI
        this.setupSceneGraph();

        // Initialize scene storage
        this.sceneStorage = new SceneStorage(this.scene, null); // EventBus not needed for basic save/load
    }

    /**
     * Backward compatibility initialization method.
     * @deprecated Use constructor logic instead.
     */
    init() {
        // This method is effectively replaced by initRenderer and initRemaining called in constructor
    }

    /**
<<<<<<< HEAD
     * Sets up the Scene Graph UI panel.
=======
<<<<<<< HEAD
     * Sets up the scene graph UI.
=======
     * Sets up the Scene Graph UI
>>>>>>> master
>>>>>>> master
     */
    setupSceneGraph() {
<<<<<<< HEAD
        // Create scene graph panel
        this.sceneGraphPanel = document.createElement('div');
        this.sceneGraphPanel.id = 'scene-graph-panel';
        this.sceneGraphPanel.style.cssText = `
>>>>>>> master
            position: fixed;
            top: 80px;
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
<<<<<<< HEAD

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
=======
=======
<<<<<<< HEAD
        // Use existing scene graph panel
        this.sceneGraphPanel = document.getElementById('scene-graph');
        this.sceneGraphPanel.innerHTML = '';
=======
        // Use existing scene graph panel from DOM
        this.sceneGraphPanel = document.getElementById('scene-graph');
        if (!this.sceneGraphPanel) {
            console.error('Scene graph panel element not found!');
            return;
        }
>>>>>>> master
>>>>>>> master
        
        // Create title
        const title = document.createElement('h3');
        title.textContent = 'Scene Graph';
        
        // Create objects list
        this.objectsList = document.createElement('ul');
<<<<<<< HEAD
        this.objectsList.setAttribute('role', 'listbox');
=======
<<<<<<< HEAD
        this.objectsList.setAttribute('role', 'listbox');
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
        this.objectsList.setAttribute('role', 'listbox');
        this.objectsList.setAttribute('aria-label', 'Scene objects');
>>>>>>> master
>>>>>>> master
        this.objectsList.style.cssText = `
>>>>>>> master
            list-style: none;
            margin: 0;
            padding: 0;
        `;
<<<<<<< HEAD

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
=======
<<<<<<< HEAD

        this.sceneGraphMap = new Map();
=======
=======
>>>>>>> master
>>>>>>> master
        
        this.sceneGraphPanel.setAttribute('aria-label', 'Scene Graph');
        this.sceneGraphPanel.appendChild(title);
        this.sceneGraphPanel.appendChild(this.objectsList);
        
        // Update initially
        this.updateSceneGraph();
    }

    /**
<<<<<<< HEAD
     * Sets up camera and object controls (OrbitControls, TransformControls).
=======
<<<<<<< HEAD
     * Sets up camera and transform controls.
=======
     * Sets up controls (orbit, transform, keyboard)
>>>>>>> master
>>>>>>> master
     */
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
        this.transformControls.addEventListener('dragging-changed', (/** @type {any} */ event) => {
            this.orbitControls.enabled = !event.value;
            
            // Save state when transform is completed
            if (!event.value && this.selectedObject) {
                this.saveState('Transform object');
            }
        });
<<<<<<< HEAD
        // @ts-ignore
        this.scene.add(this.transformControls);
=======
        this.scene.add(/** @type {any} */ (this.transformControls));
>>>>>>> master

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
                this.selectObject(/** @type {any} */(intersects[0].object));
>>>>>>> master
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

<<<<<<< HEAD
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
=======
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
                fullscreenButton.textContent = /** @type {any} */ (document).webkitFullscreenElement ? 'Exit Fullscreen' : 'Fullscreen';
            }
        });
        
        document.addEventListener('mozfullscreenchange', () => {
            if (fullscreenButton) {
                fullscreenButton.textContent = /** @type {any} */ (document).mozFullScreenElement ? 'Exit Fullscreen' : 'Fullscreen';
            }
        });
        
        document.addEventListener('MSFullscreenChange', () => {
            if (fullscreenButton) {
                fullscreenButton.textContent = /** @type {any} */ (document).msFullscreenElement ? 'Exit Fullscreen' : 'Fullscreen';
            }
        });

        // Save scene button
        const saveButton = document.getElementById('save-scene');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                this.saveScene();
            });
        }

        // Load scene button and file input
        const loadButton = document.getElementById('load-scene');
        const fileInput = document.getElementById('file-input');
        if (loadButton && fileInput) {
            loadButton.addEventListener('click', () => {
                fileInput.click();
            });
            
            fileInput.addEventListener('change', (event) => {
<<<<<<< HEAD
                const target = event.target;
                if (target instanceof HTMLInputElement && target.files) {
                    const file = target.files[0];
                    if (file) {
                        this.loadScene(file);
                    }
=======
<<<<<<< HEAD
                const target = /** @type {HTMLInputElement} */ (event.target);
                const file = target.files ? target.files[0] : null;
=======
<<<<<<< HEAD
                // @ts-ignore
                const file = /** @type {HTMLInputElement} */ (event.target).files[0];
=======
                const target = /** @type {HTMLInputElement} */ (event.target);
                const file = target.files[0];
>>>>>>> master
>>>>>>> master
                if (file) {
                    this.loadScene(file);
>>>>>>> master
                }
            });
        }
    }

    /**
<<<<<<< HEAD
     * Sets up mobile-specific optimizations and touch controls.
=======
<<<<<<< HEAD
     * Sets up mobile optimizations.
=======
     * Sets up optimizations for mobile devices
>>>>>>> master
>>>>>>> master
     */
    setupMobileOptimizations() {
        // Detect mobile devices
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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
<<<<<<< HEAD
            // @ts-ignore: enableKeys property is deprecated but used here
=======
<<<<<<< HEAD
            // @ts-ignore - enableKeys is deprecated but still used here
>>>>>>> master
            this.orbitControls.enableKeys = false; // Disable keyboard on mobile
            // @ts-ignore - touches property existence
=======
            // @ts-ignore
            this.orbitControls.enableKeys = false; // Disable keyboard on mobile
            // @ts-ignore
>>>>>>> master
            this.orbitControls.touches = {
                ONE: THREE.TOUCH.ROTATE,
                TWO: THREE.TOUCH.DOLLY_PAN
            };
            
            // Reduce damping for snappier feel on mobile
            this.orbitControls.dampingFactor = 0.1;
            
            // Add touch-friendly selection using longer press
            let touchStartTime = 0;
            const touchStart = { x: 0, y: 0 };
            const touchSelectThreshold = 200; // milliseconds
            const touchMoveThreshold = 10; // pixels
>>>>>>> master

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
<<<<<<< HEAD
=======
    
    /**
<<<<<<< HEAD
     * Handles touch events for object selection.
     * @param {Touch} touch - The touch object.
=======
<<<<<<< HEAD
     * Handles touch events for selection.
=======
     * Handles touch events for object selection
>>>>>>> master
     * @param {Touch} touch
>>>>>>> master
     */
    handleTouch(touch) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2();
        mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
>>>>>>> master

    // Load scene button and file input
    const loadButton = document.getElementById('load-scene');
    const fileInput = document.getElementById('file-input');
    if (loadButton && fileInput) {
      loadButton.addEventListener('click', () => {
        fileInput.click();
      });

<<<<<<< HEAD
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
=======
        if (intersects.length > 0) {
            const selectedObject = /** @type {any} */ (intersects[0].object);
            this.selectObject(selectedObject);
>>>>>>> master
        } else {
          this.clearPropertiesPanel();
        }
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
      new THREE.Vector3(0, -0.5, 0),
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
    // Use ObjectManager to handle selection logic, which now uses StateManager
    if (this.objectManager) {
      this.objectManager.selectObject(object);
    }

<<<<<<< HEAD
    this.selectedObject = object;
    this.transformControls.attach(object);
=======
    /**
<<<<<<< HEAD
     * Sets up the dat.GUI panel.
=======
<<<<<<< HEAD
     * Sets up the DAT.GUI interface.
=======
     * Sets up the GUI
>>>>>>> master
>>>>>>> master
     */
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
>>>>>>> master

    // Visual feedback
    this.objects.forEach((obj) => {
      obj.material.emissive.setHex(0x000000);
    });
    object.material.emissive.setHex(0x444444);

    // Update scene graph highlighting
    this.updateSceneGraph();
  }

  deselectObject() {
    if (this.objectManager) {
      this.objectManager.deselectObject();
    }

    if (this.selectedObject) {
      this.selectedObject.material.emissive.setHex(0x000000);
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
    const materialColor = {
      color: object.material.color.getHex(),
    };
    materialFolder
      .addColor(materialColor, 'color')
      .name('Color')
      .onChange((value) => {
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
      geometryFolder
        .add(params, 'width', 0.1, 5)
        .name('Width')
        .onChange(() => {
          this.rebuildGeometry(object, 'box');
        });
<<<<<<< HEAD
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
=======
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
                } else {
                    this.clearPropertiesPanel();
                }
            });
        }
    }

    /**
<<<<<<< HEAD
     * Sets up lighting for the scene.
=======
<<<<<<< HEAD
     * Sets up scene lighting.
=======
     * Sets up the lighting
>>>>>>> master
>>>>>>> master
     */
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

    /**
<<<<<<< HEAD
     * Sets up helper objects (grid, axes).
=======
<<<<<<< HEAD
     * Sets up helper objects (grid, axes).
=======
     * Sets up helpers (grid, axes)
>>>>>>> master
>>>>>>> master
     */
    setupHelpers() {
        // Grid helper
        const gridHelper = new THREE.GridHelper(10, 10);
        this.scene.add(gridHelper);

        // Axis helper
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
    }

    // Primitive creation methods

    /** Adds a box to the scene. */
    addBox() {
        const mesh = this.primitiveFactory.createPrimitive('Box', { width: 1, height: 1, depth: 1, color: 0x00ff00 });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Box_${this.objects.length + 1}`;
        this.scene.add(mesh);
        // @ts-ignore - treat Mesh as SceneObject
        this.objects.push(mesh);
        // @ts-ignore
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Box');
    }

    /** Adds a sphere to the scene. */
    addSphere() {
        const mesh = this.primitiveFactory.createPrimitive('Sphere', { radius: 0.5, widthSegments: 32, heightSegments: 32, color: 0xff0000 });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Sphere_${this.objects.length + 1}`;
        this.scene.add(mesh);
        // @ts-ignore
        this.objects.push(mesh);
        // @ts-ignore
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Sphere');
    }

    /** Adds a cylinder to the scene. */
    addCylinder() {
        const mesh = this.primitiveFactory.createPrimitive('Cylinder', { radiusTop: 0.5, radiusBottom: 0.5, height: 1, radialSegments: 32, color: 0x0000ff });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Cylinder_${this.objects.length + 1}`;
        this.scene.add(mesh);
        // @ts-ignore
        this.objects.push(mesh);
        // @ts-ignore
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Cylinder');
    }

    /** Adds a cone to the scene. */
    addCone() {
        const mesh = this.primitiveFactory.createPrimitive('Cone', { radius: 0.5, height: 1, radialSegments: 32, color: 0xffff00 });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Cone_${this.objects.length + 1}`;
        this.scene.add(mesh);
        // @ts-ignore
        this.objects.push(mesh);
        // @ts-ignore
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Cone');
    }

    /** Adds a torus to the scene. */
    addTorus() {
        const mesh = this.primitiveFactory.createPrimitive('Torus', { radius: 0.4, tube: 0.2, radialSegments: 16, tubularSegments: 100, color: 0xff00ff });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Torus_${this.objects.length + 1}`;
        this.scene.add(mesh);
        // @ts-ignore
        this.objects.push(mesh);
        // @ts-ignore
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Torus');
    }

    /** Adds a plane to the scene. */
    addPlane() {
        const mesh = this.primitiveFactory.createPrimitive('Plane', { width: 2, height: 2, color: 0x00ffff });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Plane_${this.objects.length + 1}`;
        this.scene.add(mesh);
        // @ts-ignore
        this.objects.push(mesh);
        // @ts-ignore
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Plane');
    }

    /** Adds a torus knot to the scene. */
    addTorusKnot() {
        const mesh = this.primitiveFactory.createPrimitive('TorusKnot', { radius: 0.4, tube: 0.15, tubularSegments: 100, radialSegments: 16, color: 0x888888 });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `TorusKnot_${this.objects.length + 1}`;
        this.scene.add(mesh);
        // @ts-ignore
        this.objects.push(mesh);
        // @ts-ignore
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Torus Knot');
    }

    /** Adds a tetrahedron to the scene. */
    addTetrahedron() {
        const mesh = this.primitiveFactory.createPrimitive('Tetrahedron', { radius: 0.6, color: 0x00aa00 });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Tetrahedron_${this.objects.length + 1}`;
        this.scene.add(mesh);
        // @ts-ignore
        this.objects.push(mesh);
        // @ts-ignore
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Tetrahedron');
    }

    /** Adds a icosahedron to the scene. */
    addIcosahedron() {
        const mesh = this.primitiveFactory.createPrimitive('Icosahedron', { radius: 0.6, color: 0xaa0000 });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Icosahedron_${this.objects.length + 1}`;
        this.scene.add(mesh);
        // @ts-ignore
        this.objects.push(mesh);
        // @ts-ignore
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Icosahedron');
    }

    /** Adds a dodecahedron to the scene. */
    addDodecahedron() {
        const mesh = this.primitiveFactory.createPrimitive('Dodecahedron', { radius: 0.6, color: 0x0000aa });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Dodecahedron_${this.objects.length + 1}`;
        this.scene.add(mesh);
        // @ts-ignore
        this.objects.push(mesh);
        // @ts-ignore
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Dodecahedron');
    }

    /** Adds a octahedron to the scene. */
    addOctahedron() {
        const mesh = this.primitiveFactory.createPrimitive('Octahedron', { radius: 0.6, color: 0xaa00aa });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Octahedron_${this.objects.length + 1}`;
        this.scene.add(mesh);
        // @ts-ignore
        this.objects.push(mesh);
        // @ts-ignore
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Octahedron');
    }

    /** Adds a tube to the scene. */
    addTube() {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.5, 0, 0),
            new THREE.Vector3(0, 0.5, 0),
            new THREE.Vector3(0.5, 0, 0),
            new THREE.Vector3(0, -0.5, 0)
        ]);
        const mesh = this.primitiveFactory.createPrimitive('Tube', { path: curve, radius: 0.1, color: 0xaaaa00 });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Tube_${this.objects.length + 1}`;
        this.scene.add(mesh);
        // @ts-ignore
        this.objects.push(mesh);
        // @ts-ignore
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Tube');
    }

    /** Adds a teapot to the scene. */
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
        // @ts-ignore
        this.objects.push(group);
        // @ts-ignore
        this.selectObject(group);
        this.updateSceneGraph();
        this.saveState('Add Teapot');
    }

    // Object manipulation methods
<<<<<<< HEAD

    /**
     * Selects an object in the scene.
     * @param {THREE.Object3D} object - The object to select.
=======
    /**
<<<<<<< HEAD
     * Selects an object.
     * @param {SceneObject} object
=======
     * Selects an object
     * @param {THREE.Object3D} object
>>>>>>> master
>>>>>>> master
     */
    selectObject(object) {
        // Use ObjectManager to handle selection logic, which now uses StateManager
        if (this.objectManager) {
            this.objectManager.selectObject(object);
        }

        this.selectedObject = object;
        this.transformControls.attach(object);
        
        // Visual feedback
        this.objects.forEach(obj => {
<<<<<<< HEAD
            // @ts-ignore: emissive property assumes MeshLambertMaterial or similar
            if (obj.material && obj.material.emissive) {
=======
<<<<<<< HEAD
            if (Array.isArray(obj.material)) {
                // @ts-ignore
                obj.material.forEach(m => m.emissive.setHex(0x000000));
            } else {
=======
            // @ts-ignore
            if (obj.material && obj.material.emissive) {
>>>>>>> master
>>>>>>> master
                // @ts-ignore
                obj.material.emissive.setHex(0x000000);
            }
        });
<<<<<<< HEAD

        // @ts-ignore
        if (object.material && object.material.emissive) {
=======
<<<<<<< HEAD
        if (Array.isArray(object.material)) {
            // @ts-ignore
            object.material.forEach(m => m.emissive.setHex(0x444444));
        } else {
=======
        // @ts-ignore
        if (object.material && object.material.emissive) {
>>>>>>> master
>>>>>>> master
            // @ts-ignore
            object.material.emissive.setHex(0x444444);
        }
        
        // Update scene graph highlighting
        this.updateSceneGraph();
>>>>>>> master
    }
  }

<<<<<<< HEAD
  getGeometryParameters(geometry) {
    const params = geometry.parameters || {};

    // Set default parameters if not available
    switch (geometry.type) {
      case 'BoxGeometry':
        return {
          width: params.width || 1,
          height: params.height || 1,
          depth: params.depth || 1,
=======
    /**
<<<<<<< HEAD
     * Deselects the currently selected object.
=======
<<<<<<< HEAD
     * Deselects the current object.
=======
     * Deselects the currently selected object
>>>>>>> master
>>>>>>> master
     */
    deselectObject() {
        if (this.objectManager) {
            this.objectManager.deselectObject();
        }

        if (this.selectedObject) {
<<<<<<< HEAD
            // @ts-ignore
            if (this.selectedObject.material && this.selectedObject.material.emissive) {
=======
<<<<<<< HEAD
            if (Array.isArray(this.selectedObject.material)) {
                // @ts-ignore
                this.selectedObject.material.forEach(m => m.emissive.setHex(0x000000));
            } else {
=======
            // @ts-ignore
            if (this.selectedObject.material && this.selectedObject.material.emissive) {
>>>>>>> master
>>>>>>> master
                // @ts-ignore
                this.selectedObject.material.emissive.setHex(0x000000);
            }
            this.selectedObject = null;
            this.transformControls.detach();
        }
    }

    /**
<<<<<<< HEAD
     * Updates the properties panel for the selected object.
     * @param {THREE.Object3D} object - The selected object.
=======
<<<<<<< HEAD
     * Updates the properties panel for the selected object.
     * @param {SceneObject} object
=======
     * Updates the properties panel for the selected object
     * @param {THREE.Object3D} object
>>>>>>> master
>>>>>>> master
     */
    updatePropertiesPanel(object) {
        this.clearPropertiesPanel();
        
        if (!object) return;
        
        // Add object name
        const nameController = {
            name: object.name || 'Unnamed Object'
>>>>>>> master
        };
      case 'SphereGeometry':
        return {
          radius: params.radius || 0.5,
          widthSegments: params.widthSegments || 32,
          heightSegments: params.heightSegments || 32,
        };
<<<<<<< HEAD
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

  rebuildGeometry(object, type) {
    const params = object.userData.geometryParams;
    let newGeometry;

    switch (type) {
      case 'box':
        newGeometry = new THREE.BoxGeometry(params.width, params.height, params.depth);
        break;
      case 'sphere':
        newGeometry = new THREE.SphereGeometry(
          params.radius,
          params.widthSegments,
          params.heightSegments,
        );
        break;
      case 'cylinder':
        newGeometry = new THREE.CylinderGeometry(
          params.radiusTop,
          params.radiusBottom,
          params.height,
          32,
        );
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
=======
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
<<<<<<< HEAD
        // @ts-ignore
        if (object.material && object.material.color) {
            const materialColor = {
                // @ts-ignore
                color: object.material.color.getHex()
            };
            materialFolder.addColor(materialColor, 'color').name('Color').onChange((value) => {
                // @ts-ignore
                object.material.color.setHex(value);
            });
        }
=======
        const mat = Array.isArray(object.material) ? object.material[0] : object.material;
        const materialColor = {
            // @ts-ignore
<<<<<<< HEAD
            color: mat.color.getHex()
        };
        materialFolder.addColor(materialColor, 'color').name('Color').onChange((value) => {
            if (Array.isArray(object.material)) {
                // @ts-ignore
                object.material.forEach(m => m.color.setHex(value));
            } else {
                // @ts-ignore
                object.material.color.setHex(value);
            }
=======
            color: object.material.color.getHex()
        };
        materialFolder.addColor(materialColor, 'color').name('Color').onChange((value) => {
            // @ts-ignore
            object.material.color.setHex(value);
>>>>>>> master
        });
>>>>>>> master
        
        // Add geometry-specific properties
        // @ts-ignore
        if (object.geometry) {
            this.addGeometryProperties(object);
        }
        
        this.propertiesFolder.open();
    }

    /**
<<<<<<< HEAD
     * Adds geometry-specific controls to the properties panel.
     * @param {THREE.Object3D} object - The object with geometry.
=======
<<<<<<< HEAD
     * Adds geometry-specific properties to the GUI.
     * @param {SceneObject} object
=======
     * Adds geometry-specific properties to the panel
     * @param {THREE.Object3D} object
>>>>>>> master
>>>>>>> master
     */
    addGeometryProperties(object) {
        // @ts-ignore
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
>>>>>>> master
    }
  }

<<<<<<< HEAD
  clearPropertiesPanel() {
    // Remove all controllers from the properties folder
    const controllers = [...this.propertiesFolder.__controllers];
    controllers.forEach((controller) => {
      this.propertiesFolder.remove(controller);
    });

    // Remove all subfolders
    const folders = [...this.propertiesFolder.__folders];
    folders.forEach((folder) => {
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
=======
    /**
<<<<<<< HEAD
     * Extracts parameters from geometry.
     * @param {THREE.BufferGeometry} geometry - The geometry to extract parameters from.
     * @returns {Object} The parameters.
=======
<<<<<<< HEAD
     * Extracts parameters from geometry.
     * @param {THREE.BufferGeometry} geometry
     * @returns {any}
=======
     * Extracts geometry parameters from a geometry object
     * @param {THREE.BufferGeometry} geometry
     * @returns {object}
>>>>>>> master
>>>>>>> master
     */
    getGeometryParameters(geometry) {
        // @ts-ignore
        const params = geometry.parameters || {};
        // @ts-ignore
        const type = geometry.type;
        
        // Set default parameters if not available
        switch (type) {
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

    /**
<<<<<<< HEAD
     * Rebuilds the object's geometry with new parameters.
     * @param {THREE.Object3D} object - The object to update.
     * @param {string} type - The type of geometry ('box', 'sphere', etc.).
=======
<<<<<<< HEAD
     * Rebuilds geometry with new parameters.
     * @param {SceneObject} object
=======
     * Rebuilds geometry with new parameters
     * @param {THREE.Object3D} object
>>>>>>> master
     * @param {string} type
>>>>>>> master
     */
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
            // @ts-ignore
            object.geometry.dispose();
            // @ts-ignore
            object.geometry = newGeometry;
        }
    }

    /**
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
     * Clears the properties panel.
     */
    clearPropertiesPanel() {
        // Remove all controllers from the properties folder
        // @ts-ignore - __controllers is internal
=======
     * Clears the properties panel
     */
    clearPropertiesPanel() {
        // Remove all controllers from the properties folder
        // @ts-ignore
>>>>>>> master
        const controllers = [...this.propertiesFolder.__controllers];
        controllers.forEach(controller => {
            this.propertiesFolder.remove(controller);
        });
        
        // Remove all subfolders
<<<<<<< HEAD
        const folders = Object.values(this.propertiesFolder.__folders || {});
=======
<<<<<<< HEAD
        const folders = Object.values(this.propertiesFolder.__folders || {});
=======
<<<<<<< HEAD
        // dat.gui __folders is an object, not an array in some versions, or this might be empty
        // Convert to array if it is an object
        const folders = this.propertiesFolder.__folders;
        const folderArray = Array.isArray(folders) ? folders : Object.values(folders);

        folderArray.forEach(folder => {
            try {
                this.propertiesFolder.removeFolder(folder);
            } catch (e) {
                console.warn('Could not remove folder:', e);
            }
=======
<<<<<<< HEAD
        // @ts-ignore
        const folders = Object.values(this.propertiesFolder.__folders || {});
=======
<<<<<<< HEAD
        const folders = Object.values(this.propertiesFolder.__folders || {});
=======
<<<<<<< HEAD
        const folders = Object.values(this.propertiesFolder.__folders || {});
=======
<<<<<<< HEAD
        // @ts-ignore - __folders is internal
        const folders = [...this.propertiesFolder.__folders];
        // @ts-ignore
        if (typeof folders === 'object' && !Array.isArray(folders)) {
             // dat.gui might store folders as object
             Object.values(folders).forEach(folder => {
                 this.propertiesFolder.removeFolder(folder);
             });
        } else if (Array.isArray(folders)) {
             folders.forEach(folder => {
                 this.propertiesFolder.removeFolder(folder);
             });
        }
=======
<<<<<<< HEAD
        const folders = Object.values(this.propertiesFolder.__folders);
=======
<<<<<<< HEAD
        // @ts-ignore
        const folders = [...this.propertiesFolder.__folders];
=======
        const folders = Object.values(this.propertiesFolder.__folders || {});
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
        folders.forEach(folder => {
            // @ts-ignore
            this.propertiesFolder.removeFolder(folder);
>>>>>>> master
        });
>>>>>>> master
        
        this.propertiesFolder.close();
    }

    /**
<<<<<<< HEAD
     * Updates the scene graph UI.
=======
<<<<<<< HEAD
     * Updates the scene graph UI.
=======
     * Updates the scene graph UI
>>>>>>> master
>>>>>>> master
     */
    updateSceneGraph() {
<<<<<<< HEAD
        if (!this.sceneGraphItemMap) this.sceneGraphItemMap = new Map();

        const visited = new Set();
=======
<<<<<<< HEAD
        if (!this.sceneGraphMap) {
            this.sceneGraphMap = new Map();
        }

        const currentUuids = new Set();
>>>>>>> master
        
        // Add or update each object in the scene graph
        this.objects.forEach((object, index) => {
<<<<<<< HEAD
            visited.add(object.uuid);
            
            let listItem = this.sceneGraphItemMap.get(object.uuid);
            const isSelected = this.selectedObject === object;
            const backgroundColor = isSelected ? '#444' : '#222';
            
=======
            currentUuids.add(object.uuid);
            
            let listItem = this.sceneGraphMap.get(object.uuid);
            let objectInfo, objectName, objectType, visibilityBtn, deleteBtn, positionInfo;
=======
<<<<<<< HEAD
        // Check if focus is currently within the list
        const listHasFocus = this.objectsList.contains(document.activeElement);
=======
        // Capture current focus to restore it after update
        const activeElement = document.activeElement;
        let focusedIndex = -1;
        if (activeElement && this.objectsList.contains(activeElement)) {
            const items = Array.from(this.objectsList.children);
            const focusedLi = activeElement.closest('li');
            if (focusedLi) {
                focusedIndex = items.indexOf(focusedLi);
            }
        }
>>>>>>> master

        // Clear existing list
        this.objectsList.innerHTML = '';
        this.objectsList.setAttribute('role', 'listbox');
        this.objectsList.setAttribute('aria-label', 'Scene Graph Objects');
        
        // Add each object to the scene graph
        this.objects.forEach((object, index) => {
            const objectNameText = object.name || `Object_${index + 1}`;
            const listItem = document.createElement('li');
<<<<<<< HEAD
            listItem.className = 'scene-graph-item';
            listItem.tabIndex = 0;
            listItem.setAttribute('role', 'option');
            listItem.setAttribute('aria-selected', this.selectedObject === object);

=======
<<<<<<< HEAD
            listItem.setAttribute('tabindex', '0'); // Make keyboard focusable
=======
<<<<<<< HEAD
            listItem.tabIndex = 0; // Make focusable
=======
<<<<<<< HEAD
            listItem.setAttribute('role', 'option');
            listItem.setAttribute('tabindex', '0');
            listItem.setAttribute('aria-selected', this.selectedObject === object);

=======
<<<<<<< HEAD
            listItem.setAttribute('role', 'option');
            listItem.setAttribute('tabindex', '0');
            listItem.setAttribute('aria-selected', this.selectedObject === object ? 'true' : 'false');
            listItem.dataset.uuid = object.uuid;

            // Handle keyboard selection
>>>>>>> master
            listItem.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectObject(object);
                }
            });

<<<<<<< HEAD
=======
=======
<<<<<<< HEAD
            listItem.tabIndex = 0;
            listItem.role = 'button';
            listItem.setAttribute('aria-label', `Select ${object.name || 'Object ' + (index + 1)}`);
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
            listItem.style.cssText = `
>>>>>>> master
                padding: 5px;
                margin: 2px 0;
                background: ${this.selectedObject === object ? '#444' : '#222'};
                border-radius: 3px;
                cursor: pointer;
                border: 1px solid #555;
                outline: none;
            `;
<<<<<<< HEAD

            // UX: Add keyboard accessibility
            listItem.setAttribute('tabindex', '0');
            listItem.setAttribute('role', 'button');
            listItem.setAttribute('aria-label', `Select ${object.name || 'Object ' + (index + 1)}`);
            if (this.selectedObject === object) {
                listItem.setAttribute('aria-selected', 'true');
            }

            // UX: Add keyboard support for selection
=======
<<<<<<< HEAD
            listItem.tabIndex = 0;
            listItem.setAttribute('role', 'button');
            listItem.setAttribute('aria-label', `Select ${objectNameText}`);
=======
<<<<<<< HEAD

            // Keyboard selection support
>>>>>>> master
>>>>>>> master
            listItem.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectObject(object);
                }
            });
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
<<<<<<< HEAD

      // Object name and type
      const objectInfo = document.createElement('div');
      objectInfo.style.cssText = `
=======
=======
<<<<<<< HEAD
            // Use CSS classes instead of inline styles
            if (this.selectedObject === object) {
                listItem.classList.add('selected');
            }

            // Accessibility attributes for the list item
            listItem.tabIndex = 0;
            listItem.setAttribute('role', 'option');
            listItem.setAttribute('aria-label', `Select ${object.name || `Object_${index + 1}`}`);
            if (this.selectedObject === object) {
                listItem.setAttribute('aria-selected', 'true');
            }
=======
            // Use CSS class for selection state
            if (this.selectedObject === object) {
                listItem.classList.add('selected');
            }
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
            
<<<<<<< HEAD
            // Keyboard selection
=======
            // Accessibility: Focusable and Role
            listItem.tabIndex = 0;
            listItem.setAttribute('role', 'option');
            listItem.setAttribute('aria-selected', this.selectedObject === object);

            // Accessibility: Keyboard support
>>>>>>> master
            listItem.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectObject(object);
                }
            });

            // Object name and type
            const objectInfo = document.createElement('div');
            objectInfo.style.cssText = `
>>>>>>> master
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
<<<<<<< HEAD
            
            const objectName = document.createElement('span');
            objectName.textContent = objectNameText;
            objectName.style.cssText = `
=======
<<<<<<< HEAD

      const objectName = document.createElement('span');
      objectName.textContent = object.name || `Object_${index + 1}`;
      objectName.style.cssText = `
>>>>>>> master
                font-weight: bold;
                color: #fff;
            `;

      const objectType = document.createElement('span');
      objectType.textContent = object.geometry.type.replace('Geometry', '');
      objectType.style.cssText = `
=======
>>>>>>> master
            
>>>>>>> master
            if (!listItem) {
                // Create new list item
                listItem = document.createElement('li');
                listItem.style.cssText = `
                    padding: 5px;
                    margin: 2px 0;
<<<<<<< HEAD
                    background: ${backgroundColor};
=======
>>>>>>> master
                    border-radius: 3px;
                    cursor: pointer;
                    border: 1px solid #555;
                `;
<<<<<<< HEAD

                // Object name and type container
                const objectInfo = document.createElement('div');
=======
                listItem.__cache = {};

                objectInfo = document.createElement('div');
>>>>>>> master
                objectInfo.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                `;

<<<<<<< HEAD
                const objectName = document.createElement('span');
                objectName.className = 'object-name';
=======
                objectName = document.createElement('span');
>>>>>>> master
                objectName.style.cssText = `
                    font-weight: bold;
                    color: #fff;
                `;

<<<<<<< HEAD
                const objectType = document.createElement('span');
                objectType.className = 'object-type';
=======
                objectType = document.createElement('span');
>>>>>>> master
                objectType.style.cssText = `
                    font-size: 10px;
                    color: #aaa;
                    font-style: italic;
                `;

<<<<<<< HEAD
                // Visibility toggle
                const visibilityBtn = document.createElement('button');
                visibilityBtn.className = 'visibility-btn';
=======
                const buttonContainer = document.createElement('div');

                visibilityBtn = document.createElement('button');
>>>>>>> master
                visibilityBtn.style.cssText = `
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 12px;
                    padding: 2px 5px;
                    margin: 0 5px;
                `;

<<<<<<< HEAD
                // Delete button
                const deleteBtn = document.createElement('button');
=======
                deleteBtn = document.createElement('button');
>>>>>>> master
                deleteBtn.textContent = '🗑';
                deleteBtn.style.cssText = `
                    background: none;
                    border: none;
                    color: #ff4444;
                    cursor: pointer;
                    font-size: 12px;
                    padding: 2px 5px;
                `;

<<<<<<< HEAD
                // Position info
                const positionInfo = document.createElement('div');
                positionInfo.className = 'position-info';
                positionInfo.style.cssText = `
                    font-size: 10px;
                    color: #999;
                    margin-top: 3px;
                `;

                // Build structure
                const buttonContainer = document.createElement('div');
=======
>>>>>>> master
                buttonContainer.appendChild(visibilityBtn);
                buttonContainer.appendChild(deleteBtn);

                objectInfo.appendChild(objectName);
                objectInfo.appendChild(objectType);
                objectInfo.appendChild(buttonContainer);

                listItem.appendChild(objectInfo);
<<<<<<< HEAD
                listItem.appendChild(positionInfo);

                // Attach Event Listeners
                visibilityBtn.onclick = (e) => {
                    e.stopPropagation();
                    object.visible = !object.visible;
                    visibilityBtn.textContent = object.visible ? '👁' : '🚫';
                };

                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.deleteObject(object);
                };

                listItem.onclick = () => {
                    this.selectObject(object);
                };

                this.sceneGraphItemMap.set(object.uuid, listItem);
                this.objectsList.appendChild(listItem);
            } else {
                // Ensure correct order in DOM
                this.objectsList.appendChild(listItem);
            }

            // Update Dynamic Properties
            if (listItem.style.background !== (isSelected ? 'rgb(68, 68, 68)' : 'rgb(34, 34, 34)') &&
                listItem.style.background !== backgroundColor) {
                 listItem.style.background = backgroundColor;
            }

            const nameSpan = listItem.querySelector('.object-name');
            const newName = object.name || `Object_${index + 1}`;
            if (nameSpan.textContent !== newName) {
                nameSpan.textContent = newName;
            }

            const typeSpan = listItem.querySelector('.object-type');
            const newType = object.geometry.type.replace('Geometry', '');
            if (typeSpan.textContent !== newType) {
                typeSpan.textContent = newType;
            }

            const visBtn = listItem.querySelector('.visibility-btn');
            const visText = object.visible ? '👁' : '🚫';
            if (visBtn.textContent !== visText) {
                visBtn.textContent = visText;
            }

            const posInfo = listItem.querySelector('.position-info');
            const newPosText = `x: ${object.position.x.toFixed(2)}, y: ${object.position.y.toFixed(2)}, z: ${object.position.z.toFixed(2)}`;
            if (posInfo.textContent !== newPosText) {
                posInfo.textContent = newPosText;
            }
        });
        
        // Remove deleted objects
        for (const [uuid, element] of this.sceneGraphItemMap) {
            if (!visited.has(uuid)) {
                if (element.parentNode === this.objectsList) {
                    this.objectsList.removeChild(element);
                }
                this.sceneGraphItemMap.delete(uuid);
            }
        }

        // Add message if no objects
        if (this.objects.length === 0) {
            let emptyMessage = document.getElementById('scene-graph-empty-message');
            if (!emptyMessage) {
                emptyMessage = document.createElement('li');
                emptyMessage.id = 'scene-graph-empty-message';
                emptyMessage.textContent = 'No objects in scene';
                emptyMessage.style.cssText = `
                    color: #666;
                    font-style: italic;
                    text-align: center;
                    padding: 20px;
                `;
                this.objectsList.appendChild(emptyMessage);
            } else {
                this.objectsList.appendChild(emptyMessage);
            }
        } else {
            const emptyMessage = document.getElementById('scene-graph-empty-message');
            if (emptyMessage && emptyMessage.parentNode === this.objectsList) {
                this.objectsList.removeChild(emptyMessage);
=======

                positionInfo = document.createElement('div');
                positionInfo.style.cssText = `
                    font-size: 10px;
                    color: #999;
                    margin-top: 3px;
                `;
                listItem.appendChild(positionInfo);

                this.sceneGraphMap.set(object.uuid, listItem);
            } else {
                // Retrieve cached elements
                objectInfo = listItem.firstChild;
                objectName = objectInfo.children[0];
                objectType = objectInfo.children[1];
                const buttonContainer = objectInfo.children[2];
                visibilityBtn = buttonContainer.children[0];
                deleteBtn = buttonContainer.children[1];
                positionInfo = listItem.lastChild;
            }
            
<<<<<<< HEAD
            // Update styles and content with caching
            const isSelected = this.selectedObject === object;
            const bg = isSelected ? '#444' : '#222';
            if (listItem.__cache.bg !== bg) {
                listItem.style.background = bg;
                listItem.__cache.bg = bg;
            }
            
            const name = object.name || `Object_${index + 1}`;
            if (listItem.__cache.name !== name) {
                objectName.textContent = name;
                listItem.__cache.name = name;
            }

            const type = object.geometry.type.replace('Geometry', '');
            if (listItem.__cache.type !== type) {
                objectType.textContent = type;
                listItem.__cache.type = type;
            }

            const visText = object.visible ? '👁' : '🚫';
            if (listItem.__cache.vis !== visText) {
                visibilityBtn.textContent = visText;
                listItem.__cache.vis = visText;
            }

            const posText = `x: ${object.position.x.toFixed(2)}, y: ${object.position.y.toFixed(2)}, z: ${object.position.z.toFixed(2)}`;
            if (listItem.__cache.pos !== posText) {
                positionInfo.textContent = posText;
                listItem.__cache.pos = posText;
            }

            // Update event listeners
=======
            const objectType = document.createElement('span');
            // @ts-ignore
            objectType.textContent = object.geometry.type.replace('Geometry', '');
            objectType.style.cssText = `
>>>>>>> master
                font-size: 10px;
                color: #aaa;
                font-style: italic;
            `;
<<<<<<< HEAD

      // Visibility toggle
      const visibilityBtn = document.createElement('button');
      visibilityBtn.textContent = object.visible ? '👁' : '🚫';
      visibilityBtn.style.cssText = `
=======
            
            // Visibility toggle
            const visibilityBtn = document.createElement('button');
<<<<<<< HEAD
            const visibilityLabel = object.visible ? 'Hide ' + (object.name || 'Object') : 'Show ' + (object.name || 'Object');
            visibilityBtn.textContent = object.visible ? '👁' : '🚫';
<<<<<<< HEAD
            visibilityBtn.setAttribute('aria-label', `Toggle visibility for ${object.name || `Object ${index + 1}`}`);
=======
<<<<<<< HEAD
            visibilityBtn.setAttribute('aria-label', object.visible ? `Hide ${object.name}` : `Show ${object.name}`);
=======
<<<<<<< HEAD
            visibilityBtn.setAttribute('aria-label', `Toggle visibility for ${objectNameText}`);
=======
<<<<<<< HEAD
            visibilityBtn.setAttribute('aria-label', `Toggle visibility for ${object.name || 'Object'}`);
=======
<<<<<<< HEAD
            visibilityBtn.title = object.visible ? 'Hide object' : 'Show object';
            visibilityBtn.setAttribute('aria-label', object.visible ? 'Hide object' : 'Show object');
=======
<<<<<<< HEAD
            visibilityBtn.title = object.visible ? 'Hide object' : 'Show object';
            visibilityBtn.setAttribute('aria-label', object.visible ? 'Hide object' : 'Show object');
=======
<<<<<<< HEAD
            visibilityBtn.setAttribute('aria-label', object.visible ? 'Hide object' : 'Show object');
            visibilityBtn.setAttribute('title', object.visible ? 'Hide object' : 'Show object');
=======
<<<<<<< HEAD

            // Accessibility: Labels and Tooltips
            visibilityBtn.setAttribute('aria-label', `Toggle visibility of ${object.name}`);
            visibilityBtn.title = `Toggle visibility of ${object.name}`;

=======
<<<<<<< HEAD
            visibilityBtn.setAttribute('aria-label', `Toggle visibility of ${object.name || `Object ${index + 1}`}`);
=======
<<<<<<< HEAD
            visibilityBtn.setAttribute('aria-label', object.visible ? 'Hide object' : 'Show object');
=======
            visibilityBtn.setAttribute('aria-label', visibilityLabel);
            visibilityBtn.title = visibilityLabel;
=======
            visibilityBtn.className = 'icon-btn';
            visibilityBtn.textContent = object.visible ? '👁' : '🚫';
<<<<<<< HEAD
            visibilityBtn.title = 'Toggle visibility';
=======
<<<<<<< HEAD
            visibilityBtn.title = object.visible ? 'Hide Object' : 'Show Object';
            visibilityBtn.setAttribute('aria-label', `${object.visible ? 'Hide' : 'Show'} ${object.name || `Object_${index + 1}`}`);

=======
            visibilityBtn.title = object.visible ? 'Hide object' : 'Show object';
>>>>>>> master
            visibilityBtn.setAttribute('aria-label', object.visible ? `Hide ${object.name}` : `Show ${object.name}`);
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
            visibilityBtn.style.cssText = `
>>>>>>> master
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 12px;
                padding: 2px 5px;
                margin: 0 5px;
            `;
<<<<<<< HEAD
      visibilityBtn.onclick = (e) => {
        e.stopPropagation();
        object.visible = !object.visible;
        visibilityBtn.textContent = object.visible ? '👁' : '🚫';
      };

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '🗑';
      deleteBtn.style.cssText = `
=======
>>>>>>> master
>>>>>>> master
            visibilityBtn.onclick = (e) => {
                e.stopPropagation();
                object.visible = !object.visible;
                const label = object.visible ? 'Hide object' : 'Show object';
                visibilityBtn.textContent = object.visible ? '👁' : '🚫';
<<<<<<< HEAD
                visibilityBtn.setAttribute('aria-label', object.visible ? `Hide ${object.name}` : `Show ${object.name}`);
=======
<<<<<<< HEAD
                visibilityBtn.title = label;
                visibilityBtn.setAttribute('aria-label', label);
=======
<<<<<<< HEAD
                listItem.__cache.vis = visibilityBtn.textContent;
            };
            
=======
<<<<<<< HEAD
                visibilityBtn.title = label;
                visibilityBtn.setAttribute('aria-label', label);
=======
<<<<<<< HEAD
                visibilityBtn.setAttribute('aria-label', object.visible ? 'Hide object' : 'Show object');
                visibilityBtn.setAttribute('title', object.visible ? 'Hide object' : 'Show object');
=======
<<<<<<< HEAD
                visibilityBtn.setAttribute('aria-label', object.visible ? 'Hide object' : 'Show object');
=======
<<<<<<< HEAD
                const newLabel = object.visible ? 'Hide ' + (object.name || 'Object') : 'Show ' + (object.name || 'Object');
                visibilityBtn.setAttribute('aria-label', newLabel);
                visibilityBtn.title = newLabel;
=======
<<<<<<< HEAD
                visibilityBtn.setAttribute('aria-label', object.visible ? `Hide ${object.name}` : `Show ${object.name}`);
=======
<<<<<<< HEAD
                // Update title and aria-label
                visibilityBtn.title = object.visible ? 'Hide Object' : 'Show Object';
                visibilityBtn.setAttribute('aria-label', `${object.visible ? 'Hide' : 'Show'} ${object.name || `Object_${index + 1}`}`);
=======

                // Update accessibility attributes
                const action = object.visible ? 'Hide' : 'Show';
                visibilityBtn.title = `${action} object`;
                visibilityBtn.setAttribute('aria-label', `${action} ${object.name}`);
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
            };
            
            // Delete button
            const deleteBtn = document.createElement('button');
<<<<<<< HEAD
            const deleteLabel = 'Delete ' + (object.name || 'Object');
            deleteBtn.textContent = '🗑';
<<<<<<< HEAD
            deleteBtn.setAttribute('aria-label', `Delete ${object.name || `Object ${index + 1}`}`);
=======
<<<<<<< HEAD
            deleteBtn.setAttribute('aria-label', `Delete ${object.name}`);
=======
<<<<<<< HEAD
            deleteBtn.setAttribute('aria-label', `Delete ${objectNameText}`);
=======
<<<<<<< HEAD
            deleteBtn.setAttribute('aria-label', `Delete ${object.name || 'Object'}`);
=======
<<<<<<< HEAD
            deleteBtn.title = 'Delete object';
            deleteBtn.setAttribute('aria-label', 'Delete object');
=======
<<<<<<< HEAD
            deleteBtn.title = 'Delete object';
            deleteBtn.setAttribute('aria-label', 'Delete object');
=======
<<<<<<< HEAD
            deleteBtn.setAttribute('aria-label', 'Delete object');
            deleteBtn.setAttribute('title', 'Delete object');
=======
<<<<<<< HEAD

            // Accessibility: Labels and Tooltips
            deleteBtn.setAttribute('aria-label', `Delete ${object.name}`);
            deleteBtn.title = `Delete ${object.name}`;

=======
<<<<<<< HEAD
            deleteBtn.setAttribute('aria-label', `Delete ${object.name || `Object ${index + 1}`}`);
=======
<<<<<<< HEAD
            deleteBtn.setAttribute('aria-label', 'Delete object');
=======
            deleteBtn.setAttribute('aria-label', deleteLabel);
            deleteBtn.title = deleteLabel;
=======
            deleteBtn.className = 'icon-btn';
            deleteBtn.textContent = '🗑';
<<<<<<< HEAD
            deleteBtn.title = `Delete ${object.name}`;
=======
<<<<<<< HEAD
            deleteBtn.title = 'Delete Object';
            deleteBtn.setAttribute('aria-label', `Delete ${object.name || `Object_${index + 1}`}`);

=======
            deleteBtn.title = 'Delete object';
>>>>>>> master
            deleteBtn.setAttribute('aria-label', `Delete ${object.name}`);
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
            deleteBtn.style.cssText = `
>>>>>>> master
                background: none;
                border: none;
                color: #ff4444;
                cursor: pointer;
                font-size: 12px;
                padding: 2px 5px;
            `;
<<<<<<< HEAD
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
=======
>>>>>>> master
>>>>>>> master
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                this.deleteObject(object);
            };
            
<<<<<<< HEAD
=======
            // Click to select
            listItem.tabIndex = 0;
            listItem.setAttribute('aria-label', 'Select ' + (object.name || 'Object'));
>>>>>>> master
            listItem.onclick = () => {
                this.selectObject(object);
            };
<<<<<<< HEAD

            // Keyboard support for selection
            listItem.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
=======
            listItem.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
>>>>>>> master
                    e.preventDefault();
                    this.selectObject(object);
                }
            });
            
<<<<<<< HEAD
            // Keyboard selection
            listItem.onkeydown = (e) => {
=======
<<<<<<< HEAD
            // Ensure correct position in DOM
            if (this.objectsList.children[index] !== listItem) {
                this.objectsList.insertBefore(listItem, this.objectsList.children[index]);
            }
=======
            // Keyboard navigation
            listItem.addEventListener('keydown', (e) => {
>>>>>>> master
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectObject(object);
                }
<<<<<<< HEAD
            };
=======
            });
>>>>>>> master

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
>>>>>>> master
                font-size: 10px;
                color: #999;
                margin-top: 3px;
            `;
<<<<<<< HEAD
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
=======
            positionInfo.textContent = `x: ${object.position.x.toFixed(2)}, y: ${object.position.y.toFixed(2)}, z: ${object.position.z.toFixed(2)}`;
            listItem.appendChild(positionInfo);
            
            this.objectsList.appendChild(listItem);
>>>>>>> master
        });

        // Restore focus if list was focused and we have a selected object
        if (listHasFocus && this.selectedObject) {
            const newItem = this.objectsList.querySelector(`[data-uuid="${this.selectedObject.uuid}"]`);
            if (newItem) {
                newItem.focus();
>>>>>>> master
            }
        }
        
        // Remove items that are no longer in the scene
        for (const [uuid, listItem] of this.sceneGraphMap.entries()) {
            if (!currentUuids.has(uuid)) {
                if (listItem.parentNode === this.objectsList) {
                    this.objectsList.removeChild(listItem);
                }
                this.sceneGraphMap.delete(uuid);
            }
        }

        // Handle empty message
        const existingEmptyMsg = this.objectsList.querySelector('#empty-scene-msg');
        if (this.objects.length === 0) {
            if (!existingEmptyMsg) {
                const emptyMessage = document.createElement('li');
                emptyMessage.id = 'empty-scene-msg';
                emptyMessage.textContent = 'No objects in scene';
                emptyMessage.style.cssText = `
                    color: #666;
                    font-style: italic;
                    text-align: center;
                    padding: 20px;
                `;
                this.objectsList.appendChild(emptyMessage);
            }
        } else {
            if (existingEmptyMsg) {
                existingEmptyMsg.remove();
            }
        }

        // Restore focus if it was within the list
        if (focusedIndex >= 0) {
            const items = this.objectsList.children;
            // If previous index is now out of bounds (e.g. item deleted), select the last item
            if (focusedIndex >= items.length) {
                focusedIndex = items.length - 1;
            }
            if (focusedIndex >= 0) {
                // Check if the item itself is focusable (li with tabindex=0)
                if (items[focusedIndex].tabIndex === 0) {
                    items[focusedIndex].focus();
                } else {
                    // Try to find a focusable element inside?
                    // Actually our li has tabindex=0 so it receives focus.
                    items[focusedIndex].focus();
                }
            }
        }
>>>>>>> master
    }
  }

<<<<<<< HEAD
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
=======
    /**
<<<<<<< HEAD
     * Deletes an object from the scene.
     * @param {THREE.Object3D} object - The object to delete.
=======
<<<<<<< HEAD
     * Deletes an object.
     * @param {SceneObject} object
=======
     * Deletes an object
     * @param {THREE.Object3D} object
>>>>>>> master
>>>>>>> master
     */
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

    /**
<<<<<<< HEAD
     * Deletes the currently selected object.
=======
<<<<<<< HEAD
     * Deletes the currently selected object.
=======
     * Deletes the currently selected object
>>>>>>> master
>>>>>>> master
     */
    deleteSelectedObject() {
        if (this.selectedObject) {
            this.deleteObject(this.selectedObject);
        }
    }

    /**
<<<<<<< HEAD
     * Duplicates the currently selected object.
=======
<<<<<<< HEAD
     * Duplicates the currently selected object.
=======
     * Duplicates the currently selected object
>>>>>>> master
>>>>>>> master
     */
    duplicateSelectedObject() {
        if (this.selectedObject) {
            // @ts-ignore
            const geometry = this.selectedObject.geometry.clone();
            // @ts-ignore
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
            // @ts-ignore
            this.objects.push(mesh);
            // @ts-ignore
            this.selectObject(mesh);
            this.updateSceneGraph();
            this.saveState('Duplicate object');
        }
    }

<<<<<<< HEAD
    /**
     * Saves the current state to history.
     * @param {string} description - The description of the action.
=======
    // History system methods
    /**
<<<<<<< HEAD
     * Saves the current state for undo/redo.
=======
     * Saves the current state of the application
>>>>>>> master
     * @param {string} description
>>>>>>> master
     */
    saveState(description = 'Action') {
        // Create a snapshot of the current state
        /** @type {SerializedScene} */
        const state = {
            description: description,
            timestamp: Date.now(),
            objects: this.objects.map(obj => ({
                name: obj.name,
                // @ts-ignore
                type: obj.geometry.type,
                position: obj.position.clone(),
                rotation: obj.rotation.clone(),
                scale: obj.scale.clone(),
                material: {
                    // @ts-ignore
<<<<<<< HEAD
=======
<<<<<<< HEAD
                    color: Array.isArray(obj.material) ? obj.material[0].color.clone() : obj.material.color.clone(),
                    // @ts-ignore
                    emissive: Array.isArray(obj.material) ? obj.material[0].emissive.clone() : obj.material.emissive.clone()
=======
>>>>>>> master
                    color: obj.material.color.clone(),
                    // @ts-ignore
                    emissive: obj.material.emissive.clone()
>>>>>>> master
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

    /**
<<<<<<< HEAD
     * Undoes the last action.
=======
<<<<<<< HEAD
     * Undoes the last action.
=======
     * Undoes the last action
>>>>>>> master
>>>>>>> master
     */
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState(this.history[this.historyIndex]);
            console.log(`Undo: ${this.history[this.historyIndex].description}`);
        } else {
            console.log('Nothing to undo');
        }
    }

    /**
<<<<<<< HEAD
     * Redoes the last undone action.
=======
<<<<<<< HEAD
     * Redoes the last undone action.
=======
     * Redoes the last undone action
>>>>>>> master
>>>>>>> master
     */
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState(this.history[this.historyIndex]);
            console.log(`Redo: ${this.history[this.historyIndex].description}`);
        } else {
            console.log('Nothing to redo');
        }
    }

<<<<<<< HEAD
    createGeometryFromData(type, params) {
        switch (type) {
            case 'BoxGeometry':
                const boxParams = params || { width: 1, height: 1, depth: 1 };
                return new THREE.BoxGeometry(boxParams.width, boxParams.height, boxParams.depth);
            case 'SphereGeometry':
                const sphereParams = params || { radius: 0.5, widthSegments: 32, heightSegments: 32 };
                return new THREE.SphereGeometry(sphereParams.radius, sphereParams.widthSegments, sphereParams.heightSegments);
            case 'CylinderGeometry':
                const cylinderParams = params || { radiusTop: 0.5, radiusBottom: 0.5, height: 1 };
                return new THREE.CylinderGeometry(cylinderParams.radiusTop, cylinderParams.radiusBottom, cylinderParams.height, 32);
            case 'ConeGeometry':
                const coneParams = params || { radius: 0.5, height: 1 };
                return new THREE.ConeGeometry(coneParams.radius, coneParams.height, 32);
            case 'TorusGeometry':
                const torusParams = params || { radius: 0.4, tube: 0.2 };
                return new THREE.TorusGeometry(torusParams.radius, torusParams.tube, 16, 100);
            case 'PlaneGeometry':
                const planeParams = params || { width: 2, height: 2 };
                return new THREE.PlaneGeometry(planeParams.width, planeParams.height);
=======
<<<<<<< HEAD
    /**
     * Restores the application state.
     * @param {Object} state - The state object to restore.
     */
=======
<<<<<<< HEAD
    /**
     * Restores the scene to a specific state.
     * @param {SerializedScene} state
     */
=======
<<<<<<< HEAD
    /**
     * Restores the application state
     * @param {object} state
     */
=======
    createGeometryFromData(objData) {
        const params = objData.geometryParams || {};
        switch (objData.type) {
            case 'BoxGeometry':
                return new THREE.BoxGeometry(params.width || 1, params.height || 1, params.depth || 1);
            case 'SphereGeometry':
                return new THREE.SphereGeometry(params.radius || 0.5, params.widthSegments || 32, params.heightSegments || 32);
            case 'CylinderGeometry':
                return new THREE.CylinderGeometry(params.radiusTop || 0.5, params.radiusBottom || 0.5, params.height || 1, 32);
            case 'ConeGeometry':
                return new THREE.ConeGeometry(params.radius || 0.5, params.height || 1, 32);
            case 'TorusGeometry':
                return new THREE.TorusGeometry(params.radius || 0.4, params.tube || 0.2, 16, 100);
            case 'PlaneGeometry':
                return new THREE.PlaneGeometry(params.width || 2, params.height || 2);
>>>>>>> master
            default:
                return new THREE.BoxGeometry(1, 1, 1);
        }
    }

<<<<<<< HEAD
    restoreState(state) {
        const currentObjectsMap = new Map();
        this.objects.forEach(obj => currentObjectsMap.set(obj.uuid, obj));

        const newObjects = [];
        
        state.objects.forEach(objData => {
            let mesh = currentObjectsMap.get(objData.uuid);
            
            if (mesh) {
<<<<<<< HEAD
                // Remove from map so we know it's kept
                currentObjectsMap.delete(objData.uuid);

                // Update properties
=======
                // Reuse existing mesh
                currentObjectsMap.delete(objData.uuid);

>>>>>>> master
                mesh.name = objData.name;
                mesh.position.copy(objData.position);
                mesh.rotation.copy(objData.rotation);
                mesh.scale.copy(objData.scale);
                mesh.visible = objData.visible;

<<<<<<< HEAD
                // Update material
                if (!mesh.material.color.equals(objData.material.color)) {
                    mesh.material.color.copy(objData.material.color);
                }
                if (!mesh.material.emissive.equals(objData.material.emissive)) {
                    mesh.material.emissive.copy(objData.material.emissive);
                }

                const expectedSide = objData.type === 'PlaneGeometry' ? THREE.DoubleSide : THREE.FrontSide;
                if (mesh.material.side !== expectedSide) {
                    mesh.material.side = expectedSide;
                    mesh.material.needsUpdate = true;
                }

                // Check geometry
                const currentParams = JSON.stringify(mesh.userData.geometryParams);
                const newParams = JSON.stringify(objData.geometryParams);
                const typeMismatch = mesh.geometry.type !== objData.type;

                if (typeMismatch || currentParams !== newParams) {
                    mesh.geometry.dispose();
                    mesh.geometry = this.createGeometryFromData(objData);
                    mesh.userData.geometryParams = objData.geometryParams ? {...objData.geometryParams} : null;
=======
                if (mesh.material.color.getHex() !== objData.material.color.getHex()) {
                    mesh.material.color.copy(objData.material.color);
                }
                if (mesh.material.emissive.getHex() !== objData.material.emissive.getHex()) {
                    mesh.material.emissive.copy(objData.material.emissive);
                }

                const currentParams = mesh.userData.geometryParams;
                const newParams = objData.geometryParams;
                const paramsChanged = JSON.stringify(currentParams) !== JSON.stringify(newParams);

                if (paramsChanged || mesh.geometry.type !== objData.type) {
                     mesh.geometry.dispose();
                     mesh.geometry = this.createGeometryFromData(objData.type, newParams);
                     mesh.userData.geometryParams = newParams ? {...newParams} : null;
>>>>>>> master
                }

                newObjects.push(mesh);
            } else {
<<<<<<< HEAD
                // Create new object
                const geometry = this.createGeometryFromData(objData);
=======
                // Create new mesh
                const geometry = this.createGeometryFromData(objData.type, objData.geometryParams);
>>>>>>> master

                const material = new THREE.MeshLambertMaterial({
                    color: objData.material.color,
                    side: objData.type === 'PlaneGeometry' ? THREE.DoubleSide : THREE.FrontSide
                });
                material.emissive.copy(objData.material.emissive);

<<<<<<< HEAD
                mesh = new THREE.Mesh(geometry, material);
=======
                const mesh = new THREE.Mesh(geometry, material);
>>>>>>> master
                mesh.name = objData.name;
                mesh.position.copy(objData.position);
                mesh.rotation.copy(objData.rotation);
                mesh.scale.copy(objData.scale);
                mesh.visible = objData.visible;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.uuid = objData.uuid;
<<<<<<< HEAD
                mesh.userData.geometryParams = objData.geometryParams ? {...objData.geometryParams} : null;
=======
                mesh.userData.geometryParams = objData.geometryParams;
>>>>>>> master

                this.scene.add(mesh);
                newObjects.push(mesh);
            }
<<<<<<< HEAD
        });
        
        // Remove deleted objects
        currentObjectsMap.forEach(obj => {
            this.scene.remove(obj);
            obj.geometry.dispose();
            obj.material.dispose();
        });

        this.objects = newObjects;

=======
        });
        
        // Remove unused objects
        currentObjectsMap.forEach(obj => {
=======
>>>>>>> master
>>>>>>> master
>>>>>>> master
    restoreState(state) {
        // Track current objects by UUID for easy lookup
        const currentObjectsMap = new Map();
        this.objects.forEach(obj => {
<<<<<<< HEAD
>>>>>>> master
            this.scene.remove(obj);
            // @ts-ignore
            obj.geometry.dispose();
            // @ts-ignore
            obj.material.dispose();
=======
            currentObjectsMap.set(obj.uuid, obj);
>>>>>>> master
        });
<<<<<<< HEAD

        this.objects = newObjects;

=======
        
        const newObjects = [];

        // Process objects from state
        state.objects.forEach(objData => {
            let object = currentObjectsMap.get(objData.uuid);
            
            if (object) {
                // UPDATE existing object
                if (object.name !== objData.name) object.name = objData.name;
                object.position.copy(objData.position);
                object.rotation.copy(objData.rotation);
                object.scale.copy(objData.scale);
                object.visible = objData.visible;

                // Update material
                if (object.material.color.getHex() !== objData.material.color.getHex()) {
                    object.material.color.set(objData.material.color);
                }
                if (object.material.emissive.getHex() !== objData.material.emissive.getHex()) {
                    object.material.emissive.set(objData.material.emissive);
                }

                // Check if geometry update is needed
                const currentParams = object.userData.geometryParams;
                const newParams = objData.geometryParams;

                let geometryNeedsUpdate = false;
                if (!currentParams && newParams) geometryNeedsUpdate = true;
                else if (currentParams && !newParams) geometryNeedsUpdate = true;
                else if (currentParams && newParams) {
                    // Compare keys
                    for (const key in newParams) {
                        if (currentParams[key] !== newParams[key]) {
                            geometryNeedsUpdate = true;
                            break;
                        }
                    }
                }

                if (geometryNeedsUpdate) {
                     object.userData.geometryParams = newParams ? {...newParams} : null;
                     const newGeometry = this.createGeometryFromData(objData);
                     object.geometry.dispose();
                     object.geometry = newGeometry;
                }

                newObjects.push(object);
                // Remove from map so we know what's left to delete
                currentObjectsMap.delete(objData.uuid);

            } else {
                // CREATE new object
                const geometry = this.createGeometryFromData(objData);

                // Recreate material
                const material = new THREE.MeshLambertMaterial({
                    color: objData.material.color,
                    side: objData.type === 'PlaneGeometry' ? THREE.DoubleSide : THREE.FrontSide
                });
                material.emissive.set(objData.material.emissive);

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
                newObjects.push(mesh);
            }
        });
        
        // DELETE removed objects
        currentObjectsMap.forEach(obj => {
            this.scene.remove(obj);
            // @ts-ignore
            obj.geometry.dispose();
<<<<<<< HEAD
            if (Array.isArray(obj.material)) {
                obj.material.forEach(m => m.dispose());
            } else {
                obj.material.dispose();
            }
=======
            // @ts-ignore
            obj.material.dispose();
>>>>>>> master
        });
<<<<<<< HEAD
        this.objects.length = 0;
        
        // Restore objects
        // @ts-ignore
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
            // @ts-ignore
            this.objects.push(mesh);
        });
        
=======

        this.objects = newObjects;

>>>>>>> master
>>>>>>> master
>>>>>>> master
        // Restore selection
        this.deselectObject();
        // @ts-ignore
        if (state.selectedObjectUuid) {
            // @ts-ignore
            const selectedObj = this.objects.find(obj => obj.uuid === state.selectedObjectUuid);
            if (selectedObj) {
                this.selectObject(selectedObj);
            }
        }
        
        this.updateSceneGraph();
    }

<<<<<<< HEAD
    createGeometryFromData(objData) {
        let geometry;
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
        return geometry;
    }

=======
    /**
<<<<<<< HEAD
     * Toggles fullscreen mode.
=======
<<<<<<< HEAD
     * Toggles fullscreen mode.
=======
     * Toggles fullscreen mode
>>>>>>> master
>>>>>>> master
     */
>>>>>>> master
    toggleFullscreen() {
        const doc = document;
        const docEl = document.documentElement;

        if (!doc.fullscreenElement && !doc.webkitFullscreenElement && !doc.mozFullScreenElement && !doc.msFullscreenElement) {
            // Enter fullscreen
<<<<<<< HEAD
            if (docEl.requestFullscreen) {
                docEl.requestFullscreen();
            } else if (docEl.webkitRequestFullscreen) {
                docEl.webkitRequestFullscreen();
            } else if (docEl.mozRequestFullScreen) {
                docEl.mozRequestFullScreen();
            } else if (docEl.msRequestFullscreen) {
                docEl.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (doc.exitFullscreen) {
                doc.exitFullscreen();
            } else if (doc.webkitExitFullscreen) {
                doc.webkitExitFullscreen();
            } else if (doc.mozCancelFullScreen) {
                doc.mozCancelFullScreen();
            } else if (doc.msExitFullscreen) {
                doc.msExitFullscreen();
=======
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (/** @type {any} */ (document.documentElement).webkitRequestFullscreen) {
                /** @type {any} */ (document.documentElement).webkitRequestFullscreen();
            } else if (/** @type {any} */ (document.documentElement).mozRequestFullScreen) {
                /** @type {any} */ (document.documentElement).mozRequestFullScreen();
            } else if (/** @type {any} */ (document.documentElement).msRequestFullscreen) {
                /** @type {any} */ (document.documentElement).msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (/** @type {any} */ (document).webkitExitFullscreen) {
                /** @type {any} */ (document).webkitExitFullscreen();
            } else if (/** @type {any} */ (document).mozCancelFullScreen) {
                /** @type {any} */ (document).mozCancelFullScreen();
            } else if (/** @type {any} */ (document).msExitFullscreen) {
                /** @type {any} */ (document).msExitFullscreen();
>>>>>>> master
            }
        }
    }

    /**
<<<<<<< HEAD
     * Saves the current scene to a file.
=======
<<<<<<< HEAD
     * Saves the scene to a file.
=======
     * Saves the current scene to local storage
     * @returns {Promise<void>}
>>>>>>> master
>>>>>>> master
     */
    async saveScene() {
        try {
            await this.sceneStorage.saveScene();
            console.log('Scene saved successfully');
        } catch (error) {
            console.error('Error saving scene:', error);
            alert('Error saving scene. Please try again.');
        }
    }

    /**
<<<<<<< HEAD
     * Loads a scene from a file.
     * @param {File} file - The file to load.
=======
<<<<<<< HEAD
     * Loads the scene from a file.
     * @param {File} file
=======
     * Loads a scene from a file
     * @param {File} file
     * @returns {Promise<void>}
>>>>>>> master
>>>>>>> master
     */
    async loadScene(file) {
        try {
            await this.sceneStorage.loadScene(file);
            console.log('Scene loaded successfully');
            // Update the objects array to reflect the loaded scene
            this.objects = [];
            this.scene.traverse((child) => {
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
>>>>>>> master
                // @ts-ignore
                if (child.isMesh) {
                    // @ts-ignore
                    this.objects.push(child);
=======
                if (/** @type {any} */ (child).isMesh) {
                    this.objects.push(/** @type {THREE.Mesh} */ (child));
>>>>>>> master
                }
            });
            this.updateSceneGraph();
            this.deselectObject();
            this.saveState('Load scene');
        } catch (error) {
            console.error('Error loading scene:', error);
            alert('Error loading scene. Please check the file format.');
        }
    }

    /**
<<<<<<< HEAD
     * Animation loop.
=======
<<<<<<< HEAD
     * Animation loop.
=======
     * Animation loop
>>>>>>> master
>>>>>>> master
     */
    animate() {
        requestAnimationFrame(() => this.animate());

        const deltaTime = this.clock.getDelta();
        if (this.physicsManager) {
            this.physicsManager.update(deltaTime);
        }
        
        this.orbitControls.update();
        this.renderer.render(this.scene, this.camera);
>>>>>>> master
    }
  }

  async saveScene() {
    try {
      await this.sceneStorage.saveScene();
      console.log('Scene saved successfully');
    } catch (error) {
      console.error('Error saving scene:', error);
      alert('Error saving scene. Please try again.');
    }
  }

  async loadScene(file) {
    try {
      await this.sceneStorage.loadScene(file);
      console.log('Scene loaded successfully');
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
      alert('Error loading scene. Please check the file format.');
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
<<<<<<< HEAD
  new App();
=======
    new App();
>>>>>>> master
});
