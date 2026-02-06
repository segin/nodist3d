/**
 * Tests for the main App class
 */
import { JSDOM } from 'jsdom';

// Mock THREE.js
jest.mock('three', () => {
<<<<<<< HEAD
  const mockElement = { createElement: jest.fn(() => ({ tagName: 'CANVAS' })) };

=======
<<<<<<< HEAD
    const mockElement = { createElement: jest.fn(() => ({ tagName: 'CANVAS' })) };
    
    const mockVector3 = {
        x: 0, y: 0, z: 0,
        clone: jest.fn(() => ({ x: 0, y: 0, z: 0 })),
        copy: jest.fn(),
        set: jest.fn()
    };

    const mockMesh = {
        position: { ...mockVector3 },
        rotation: { ...mockVector3 },
        scale: { x: 1, y: 1, z: 1, ...mockVector3 },
        material: {
            emissive: { setHex: jest.fn() },
            clone: jest.fn(() => ({ emissive: { setHex: jest.fn() } }))
        },
        geometry: { clone: jest.fn() },
        castShadow: false,
        receiveShadow: false
    };

    return {
        __esModule: true,
        Scene: jest.fn(() => ({
            add: jest.fn(),
            remove: jest.fn()
        })),
        PerspectiveCamera: jest.fn(() => ({
<<<<<<< HEAD
        position: { set: jest.fn(), clone: jest.fn() },
=======
<<<<<<< HEAD
            position: { set: jest.fn(), clone: jest.fn() },
=======
<<<<<<< HEAD
            position: {
                set: jest.fn(),
                clone: jest.fn(() => ({ x: 5, y: 5, z: 5 }))
            },
=======
<<<<<<< HEAD
            position: { set: jest.fn(), clone: jest.fn(() => ({ copy: jest.fn() })) },
=======
<<<<<<< HEAD
            position: { set: jest.fn(), clone: jest.fn() },
=======
            position: { ...mockVector3 },
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
            lookAt: jest.fn(),
            aspect: 1,
            updateProjectionMatrix: jest.fn()
        })),
        WebGLRenderer: jest.fn(() => ({
            setSize: jest.fn(),
            setPixelRatio: jest.fn(),
            render: jest.fn(),
            shadowMap: { enabled: false, type: null },
            domElement: { 
                tagName: 'CANVAS',
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                getBoundingClientRect: jest.fn(() => ({ left: 0, top: 0, width: 800, height: 600 }))
            }
        })),
        Loader: jest.fn(),
        FileLoader: jest.fn(() => ({ load: jest.fn(), setPath: jest.fn(), setResponseType: jest.fn(), setWithCredentials: jest.fn(), setRequestHeader: jest.fn() })),
        Shape: jest.fn(),
        Mesh: jest.fn(() => mockMesh),
        BufferGeometry: jest.fn(),
<<<<<<< HEAD
        ExtrudeGeometry: jest.fn(),
        LatheGeometry: jest.fn(),
=======
>>>>>>> master
        BoxGeometry: jest.fn(),
        SphereGeometry: jest.fn(),
        CylinderGeometry: jest.fn(),
        ConeGeometry: jest.fn(),
        TorusGeometry: jest.fn(),
        PlaneGeometry: jest.fn(),
<<<<<<< HEAD
        BufferGeometry: jest.fn(),
        ExtrudeGeometry: jest.fn(),
        LatheGeometry: jest.fn(),
        Loader: jest.fn(),
        FileLoader: jest.fn(() => ({
            setPath: jest.fn(),
            setRequestHeader: jest.fn(),
            setWithCredentials: jest.fn(),
            load: jest.fn(),
        })),
        ShapeGeometry: jest.fn(),
=======
        ExtrudeGeometry: jest.fn(),
>>>>>>> master
        MeshLambertMaterial: jest.fn(() => ({
            emissive: { setHex: jest.fn() },
            clone: jest.fn(() => ({ emissive: { setHex: jest.fn() } }))
        })),
        AmbientLight: jest.fn(),
        DirectionalLight: jest.fn(() => ({
            position: { ...mockVector3 },
            castShadow: false,
            shadow: { mapSize: { width: 0, height: 0 } }
        })),
        GridHelper: jest.fn(),
        AxesHelper: jest.fn(),
        Raycaster: jest.fn(() => ({
            setFromCamera: jest.fn(),
            intersectObjects: jest.fn(() => [])
        })),
        Vector2: jest.fn(),
<<<<<<< HEAD
        Clock: jest.fn(),
        TOUCH: { ROTATE: 1, DOLLY_PAN: 2 },
=======
<<<<<<< HEAD
        Clock: jest.fn(() => ({
            getDelta: jest.fn(() => 0.016)
        })),
>>>>>>> master
        PCFSoftShadowMap: 'PCFSoftShadowMap',
        DoubleSide: 'DoubleSide',
<<<<<<< HEAD
        TOUCH: { ROTATE: 1, DOLLY_PAN: 2 }
=======
        TOUCH: {
            ROTATE: 0,
            DOLLY_PAN: 1
        }
=======
<<<<<<< HEAD
        Loader: class {
            constructor() {
                this.load = jest.fn();
                this.parse = jest.fn();
            }
        },
        FileLoader: class {
            constructor() {
                this.load = jest.fn();
            }
        },
=======
        Vector3: jest.fn(() => ({ ...mockVector3 })),
>>>>>>> master
        PCFSoftShadowMap: 'PCFSoftShadowMap',
        DoubleSide: 'DoubleSide',
        TOUCH: { ROTATE: 1, DOLLY_PAN: 2 }
>>>>>>> master
>>>>>>> master
    };
=======
  const mockElement = { createElement: jest.fn(() => ({ tagName: 'CANVAS' })) };

>>>>>>> master
  const mockMesh = {
    position: { x: 0, y: 0, z: 0, copy: jest.fn() },
    rotation: { x: 0, y: 0, z: 0, copy: jest.fn() },
    scale: { x: 1, y: 1, z: 1, copy: jest.fn() },
    material: {
      emissive: { setHex: jest.fn() },
      clone: jest.fn(() => ({ emissive: { setHex: jest.fn() } })),
    },
    geometry: { clone: jest.fn() },
    castShadow: false,
    receiveShadow: false,
  };

  return {
    Scene: jest.fn(() => ({
      add: jest.fn(),
      remove: jest.fn(),
    })),
    PerspectiveCamera: jest.fn(() => ({
      position: { set: jest.fn() },
      lookAt: jest.fn(),
      aspect: 1,
      updateProjectionMatrix: jest.fn(),
    })),
    WebGLRenderer: jest.fn(() => ({
      setSize: jest.fn(),
      setPixelRatio: jest.fn(),
      render: jest.fn(),
      shadowMap: { enabled: false, type: null },
      domElement: {
        tagName: 'CANVAS',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
    })),
    Mesh: jest.fn(() => mockMesh),
    BoxGeometry: jest.fn(),
    SphereGeometry: jest.fn(),
    CylinderGeometry: jest.fn(),
    ConeGeometry: jest.fn(),
    TorusGeometry: jest.fn(),
    PlaneGeometry: jest.fn(),
    MeshLambertMaterial: jest.fn(() => ({
      emissive: { setHex: jest.fn() },
      clone: jest.fn(() => ({ emissive: { setHex: jest.fn() } })),
    })),
    AmbientLight: jest.fn(),
    DirectionalLight: jest.fn(() => ({
      position: { set: jest.fn() },
      castShadow: false,
      shadow: { mapSize: { width: 0, height: 0 } },
    })),
    GridHelper: jest.fn(),
    AxesHelper: jest.fn(),
    Raycaster: jest.fn(() => ({
      setFromCamera: jest.fn(),
      intersectObjects: jest.fn(() => []),
    })),
    Vector2: jest.fn(),
    PCFSoftShadowMap: 'PCFSoftShadowMap',
    DoubleSide: 'DoubleSide',
  };
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> master
});

// Mock dat.gui
jest.mock('dat.gui', () => ({
<<<<<<< HEAD
  GUI: jest.fn(() => ({
    addFolder: jest.fn(() => ({
      add: jest.fn(() => ({
        name: jest.fn(() => ({ onChange: jest.fn() })),
        onChange: jest.fn(),
      })),
      addFolder: jest.fn(() => ({
        add: jest.fn(() => ({
          name: jest.fn(() => ({ onChange: jest.fn() })),
          onChange: jest.fn(),
        })),
        addColor: jest.fn(() => ({
          name: jest.fn(() => ({ onChange: jest.fn() })),
          onChange: jest.fn(),
        })),
        open: jest.fn(),
        close: jest.fn(),
      })),
      addColor: jest.fn(() => ({
        name: jest.fn(() => ({ onChange: jest.fn() })),
        onChange: jest.fn(),
      })),
      open: jest.fn(),
      close: jest.fn(),
      remove: jest.fn(),
      removeFolder: jest.fn(),
      __controllers: [],
      __folders: [],
    })),
  })),
=======
<<<<<<< HEAD
    __esModule: true,
    GUI: jest.fn(() => ({
        addFolder: jest.fn(() => ({
            add: jest.fn(() => ({
                name: jest.fn(() => ({ onChange: jest.fn() })),
                onChange: jest.fn()
            })),
            addFolder: jest.fn(() => ({
                add: jest.fn(() => ({
                    name: jest.fn(() => ({ onChange: jest.fn() })),
                    onChange: jest.fn()
                })),
                addColor: jest.fn(() => ({
                    name: jest.fn(() => ({ onChange: jest.fn() })),
                    onChange: jest.fn()
                })),
                open: jest.fn(),
                close: jest.fn()
            })),
            addColor: jest.fn(() => ({
                name: jest.fn(() => ({ onChange: jest.fn() })),
                onChange: jest.fn()
            })),
            open: jest.fn(),
            close: jest.fn(),
            remove: jest.fn(),
            removeFolder: jest.fn(),
            __controllers: [],
            __folders: []
        }))
    }))
>>>>>>> master
}));

<<<<<<< HEAD
// Mock OrbitControls
jest.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
<<<<<<< HEAD
  OrbitControls: jest.fn(() => ({
    enableDamping: true,
    dampingFactor: 0.05,
    enabled: true,
    update: jest.fn(),
  })),
=======
<<<<<<< HEAD
    OrbitControls: class {
        constructor() {
            this.enableDamping = true;
            this.dampingFactor = 0.05;
            this.enabled = true;
            this.update = jest.fn();
            this.target = { clone: jest.fn(() => ({ copy: jest.fn() })) };
        }
    }
=======
    OrbitControls: jest.fn(() => ({
        enableDamping: true,
        dampingFactor: 0.05,
        enabled: true,
        update: jest.fn(),
<<<<<<< HEAD
        target: { clone: jest.fn(), copy: jest.fn() }
=======
<<<<<<< HEAD
        target: { clone: jest.fn(() => ({ copy: jest.fn() })) }
=======
<<<<<<< HEAD
        target: {
            clone: jest.fn(() => ({ x: 0, y: 0, z: 0 })),
            copy: jest.fn()
        }
=======
        target: { clone: jest.fn() }
>>>>>>> master
>>>>>>> master
>>>>>>> master
    }))
>>>>>>> master
>>>>>>> master
}));

// Mock TransformControls
jest.mock('three/examples/jsm/controls/TransformControls.js', () => ({
<<<<<<< HEAD
  TransformControls: jest.fn(() => ({
    addEventListener: jest.fn(),
    setMode: jest.fn(),
    attach: jest.fn(),
    detach: jest.fn(),
    dragging: false,
  })),
}));

describe('Basic App Functionality', () => {
  let dom;

  beforeEach(() => {
    // Setup DOM
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
    global.requestAnimationFrame = jest.fn();

    // Mock document.body.appendChild
    jest.spyOn(document.body, 'appendChild').mockImplementation();
    jest.spyOn(window, 'addEventListener').mockImplementation();

    // Mock document.createElement to return proper elements
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = {
        tagName: tagName.toUpperCase(),
        style: {},
        appendChild: jest.fn(),
        textContent: '',
        innerHTML: '',
        onclick: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };

      // Add style.cssText property
      Object.defineProperty(element.style, 'cssText', {
        set: jest.fn(),
        get: jest.fn(),
      });

      return element;
    });

    // Clear mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (dom) {
      dom.window.close();
    }
  });

  it('should create and initialize the App', () => {
    // Simulate DOM loaded
    const domContentLoadedCallbacks = [];
    document.addEventListener = jest.fn((event, callback) => {
      if (event === 'DOMContentLoaded') {
        domContentLoadedCallbacks.push(callback);
      }
    });

    // Import and execute the module
    delete require.cache[require.resolve('../src/frontend/main.js')];
    require('../src/frontend/main.js');

    // Execute the callback
    domContentLoadedCallbacks.forEach((callback) => callback());

    // Verify basic initialization happened
    expect(document.addEventListener).toHaveBeenCalledWith(
      'DOMContentLoaded',
      expect.any(Function),
    );
  });

  it('should be able to add basic primitives', () => {
    const THREE = require('three');

    // Create a simple App-like class for testing
    class TestApp {
      constructor() {
        this.scene = new THREE.Scene();
        this.objects = [];
        this.selectedObject = null;
        this.transformControls = { attach: jest.fn(), setMode: jest.fn() };
      }

      addBox() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
      }

      selectObject(object) {
        this.selectedObject = object;
        this.transformControls.attach(object);
      }
    }

=======
    TransformControls: class {
        constructor() {
            this.addEventListener = jest.fn();
            this.setMode = jest.fn();
            this.attach = jest.fn();
            this.detach = jest.fn();
            this.dragging = false;
        }
    }
}));
=======
// Mocks for three/examples/jsm/* are handled via moduleNameMapper in jest.config.cjs
// pointing to tests/__mocks__/three-examples.js
>>>>>>> master

// Mock TeapotGeometry
jest.mock('three/examples/jsm/geometries/TeapotGeometry.js', () => ({
    TeapotGeometry: jest.fn()
}));

// Mock FontLoader
jest.mock('three/examples/jsm/loaders/FontLoader.js', () => ({
    FontLoader: jest.fn(() => ({
        load: jest.fn()
    }))
}));

// Mock TextGeometry
jest.mock('three/examples/jsm/geometries/TextGeometry.js', () => ({
    TextGeometry: jest.fn()
}));

describe('Basic App Functionality', () => {
    beforeEach(() => {
        // Setup DOM using existing global document
        document.body.innerHTML = '<div id="scene-graph"></div><button id="fullscreen"></button><button id="save-scene"></button><button id="load-scene"></button><input type="file" id="file-input">';

        global.requestAnimationFrame = jest.fn();
        
        // Mock document.body.appendChild
        jest.spyOn(document.body, 'appendChild').mockImplementation();
        jest.spyOn(window, 'addEventListener').mockImplementation();
        
        // Mock document.createElement to return proper elements
<<<<<<< HEAD
        jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
            const element = {
                tagName: tagName.toUpperCase(),
                style: {},
                appendChild: jest.fn(),
                textContent: '',
                innerHTML: '',
                onclick: null,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
<<<<<<< HEAD
                setAttribute: jest.fn()
=======
                setAttribute: jest.fn(),
                getAttribute: jest.fn()
>>>>>>> master
            };
            
            // Add style.cssText property
            Object.defineProperty(element.style, 'cssText', {
                set: jest.fn(),
                get: jest.fn()
            });
            
            return element;
        });
        
        // Clear mocks
        jest.clearAllMocks();
=======
        // Note: we don't need to replace the document, just spy on it
        // But since we are modifying innerHTML, existing spies might be lost if we reset modules?
        // No, spies on `document` persist until restore.
>>>>>>> master
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.restoreAllMocks();
    });

    it('should create and initialize the App', () => {
        // Verify DOM setup
        expect(document.getElementById('scene-graph')).not.toBeNull();

        // Simulate DOM loaded
        const domContentLoadedCallbacks = [];
        document.addEventListener = jest.fn((event, callback) => {
            if (event === 'DOMContentLoaded') {
                domContentLoadedCallbacks.push(callback);
            }
        });
=======
  GUI: jest.fn(() => ({
    addFolder: jest.fn(() => ({
      add: jest.fn(() => ({
        name: jest.fn(() => ({ onChange: jest.fn() })),
        onChange: jest.fn(),
      })),
      addFolder: jest.fn(() => ({
        add: jest.fn(() => ({
          name: jest.fn(() => ({ onChange: jest.fn() })),
          onChange: jest.fn(),
        })),
        addColor: jest.fn(() => ({
          name: jest.fn(() => ({ onChange: jest.fn() })),
          onChange: jest.fn(),
        })),
        open: jest.fn(),
        close: jest.fn(),
      })),
      addColor: jest.fn(() => ({
        name: jest.fn(() => ({ onChange: jest.fn() })),
        onChange: jest.fn(),
      })),
      open: jest.fn(),
      close: jest.fn(),
      remove: jest.fn(),
      removeFolder: jest.fn(),
      __controllers: [],
      __folders: [],
    })),
  })),
}));

// Mock OrbitControls
jest.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
  OrbitControls: jest.fn(() => ({
    enableDamping: true,
    dampingFactor: 0.05,
    enabled: true,
    update: jest.fn(),
  })),
}));

// Mock TransformControls
jest.mock('three/examples/jsm/controls/TransformControls.js', () => ({
  TransformControls: jest.fn(() => ({
    addEventListener: jest.fn(),
    setMode: jest.fn(),
    attach: jest.fn(),
    detach: jest.fn(),
    dragging: false,
  })),
}));

describe('Basic App Functionality', () => {
  let dom;

  beforeEach(() => {
    // Setup DOM
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
    global.requestAnimationFrame = jest.fn();

    // Mock document.body.appendChild
    jest.spyOn(document.body, 'appendChild').mockImplementation();
    jest.spyOn(window, 'addEventListener').mockImplementation();

    // Mock document.createElement to return proper elements
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = {
        tagName: tagName.toUpperCase(),
        style: {},
        appendChild: jest.fn(),
        textContent: '',
        innerHTML: '',
        onclick: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };

      // Add style.cssText property
      Object.defineProperty(element.style, 'cssText', {
        set: jest.fn(),
        get: jest.fn(),
      });

      return element;
    });

    // Clear mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (dom) {
      dom.window.close();
    }
  });

  it('should create and initialize the App', () => {
    // Simulate DOM loaded
    const domContentLoadedCallbacks = [];
    document.addEventListener = jest.fn((event, callback) => {
      if (event === 'DOMContentLoaded') {
        domContentLoadedCallbacks.push(callback);
      }
    });

    // Import and execute the module
    delete require.cache[require.resolve('../src/frontend/main.js')];
    require('../src/frontend/main.js');
>>>>>>> master

    // Execute the callback
    domContentLoadedCallbacks.forEach((callback) => callback());

    // Verify basic initialization happened
    expect(document.addEventListener).toHaveBeenCalledWith(
      'DOMContentLoaded',
      expect.any(Function),
    );
  });

<<<<<<< HEAD
        // Verify basic initialization happened
        expect(document.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));

        // Verify UX/Accessibility improvements
        const sceneGraphList = document.querySelector('#scene-graph ul');
        expect(sceneGraphList).not.toBeNull();
        expect(sceneGraphList.getAttribute('role')).toBe('listbox');
    });
=======
  it('should be able to add basic primitives', () => {
    const THREE = require('three');
>>>>>>> master

    // Create a simple App-like class for testing
    class TestApp {
      constructor() {
        this.scene = new THREE.Scene();
        this.objects = [];
        this.selectedObject = null;
        this.transformControls = { attach: jest.fn(), setMode: jest.fn() };
      }

      addBox() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
      }

      selectObject(object) {
        this.selectedObject = object;
        this.transformControls.attach(object);
      }
    }

<<<<<<< HEAD
        const app = new TestApp();
        
        // Test adding a box
        app.addBox();
        
        expect(app.objects.length).toBe(1);
        expect(app.selectedObject).toBe(app.objects[0]);
        expect(app.scene.add).toHaveBeenCalledWith(app.objects[0]);
        expect(app.transformControls.attach).toHaveBeenCalledWith(app.objects[0]);
    });
=======
>>>>>>> master
    const app = new TestApp();

    // Test adding a box
    app.addBox();

    expect(app.objects.length).toBe(1);
    expect(app.selectedObject).toBe(app.objects[0]);
    expect(app.scene.add).toHaveBeenCalledWith(app.objects[0]);
    expect(app.transformControls.attach).toHaveBeenCalledWith(app.objects[0]);
  });
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> master
});
