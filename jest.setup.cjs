const { JSDOM } = require('jsdom');
const fetch = require('node-fetch');

global.fetch = fetch;
global.Request = fetch.Request;
global.Response = fetch.Response;
global.Headers = fetch.Headers;
global.URL.createObjectURL = jest.fn();

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', {
  url: 'http://localhost',
});

global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;
global.self = global.window;

// Mock console.error and console.warn to prevent them from cluttering test output
// and to allow checking if they were called in tests.
global.console.error = jest.fn();
global.console.warn = jest.fn();

const mockVector3 = {
<<<<<<< HEAD
  x: 0,
  y: 0,
  z: 0,
  set: jest.fn(function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }),
  clone: jest.fn(function () {
    return { ...this };
  }),
  copy: jest.fn(function (v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }),
  sub: jest.fn(function (v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }),
  normalize: jest.fn(function () {
    const length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    if (length > 0) {
      this.x /= length;
      this.y /= length;
      this.z /= length;
    }
    return this;
  }),
  addVectors: jest.fn(function (a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;
    return this;
  }),
  divideScalar: jest.fn(function (s) {
    this.x /= s;
    this.y /= s;
    this.z /= s;
    return this;
  }),
=======
    x: 0,
    y: 0,
    z: 0,
    set: jest.fn(function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }),
    clone: jest.fn(function() {
        return { ...this };
    }),
    copy: jest.fn(function(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }),
    add: jest.fn(function(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }),
    sub: jest.fn(function(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }),
    normalize: jest.fn(function() {
        const length = Math.hypot(this.x, this.y, this.z);
        if (length > 0) {
            this.x /= length;
            this.y /= length;
            this.z /= length;
        }
        return this;
    }),
    add: jest.fn(function(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }),
    sub: jest.fn(function(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }),
    addVectors: jest.fn(function(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    }),
    multiplyScalar: jest.fn(function(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }),
    divideScalar: jest.fn(function(s) {
        this.x /= s;
        this.y /= s;
        this.z /= s;
        return this;
    }),
    applyEuler: jest.fn(function() { return this; }),
    applyQuaternion: jest.fn(function() { return this; }),
>>>>>>> master
};

const mockQuaternion = {
  x: 0,
  y: 0,
  z: 0,
  w: 1,
  setFromAxisAngle: jest.fn(),
  clone: jest.fn(function () {
    return { ...this };
  }),
};

const mockEventDispatcher = {
  addEventListener: jest.fn(),
  hasEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
};

const mockObject3D = {
  ...mockEventDispatcher,
  isObject3D: true,
  uuid: 'mock-object3d-uuid',
  name: '',
  position: { ...mockVector3 },
  rotation: { x: 0, y: 0, z: 0, set: jest.fn() },
  scale: { x: 1, y: 1, z: 1, set: jest.fn() },
  quaternion: { ...mockQuaternion },
  add: jest.fn(function (object) {
    this.children.push(object);
    object.parent = this;
  }),
  remove: jest.fn(function (object) {
    this.children = this.children.filter((child) => child.uuid !== object.uuid);
    object.parent = null;
  }),
  children: [],
  parent: null,
  clone: jest.fn(function () {
    return { ...this, children: [] };
  }),
  copy: jest.fn(),
  traverse: jest.fn(function (callback) {
    callback(this);
    this.children.forEach((child) => child.traverse(callback));
  }),
  updateMatrixWorld: jest.fn(),
  getWorldPosition: jest.fn(() => ({ ...mockVector3 })),
  getWorldQuaternion: jest.fn(() => ({ ...mockQuaternion })),
  removeFromParent: jest.fn(function () {
    if (this.parent) {
      this.parent.remove(this);
    }
  }),
  toJSON: jest.fn(function () {
    return {
      object: {
        uuid: this.uuid,
        type: this.type,
        name: this.name,
        children: this.children.map((child) => child.toJSON()),
      },
    };
  }),
};

const mockGeometry = {
  dispose: jest.fn(),
  parameters: {
    width: 1,
    height: 1,
    depth: 1,
    radius: 1,
    radiusTop: 1,
    radiusBottom: 1,
    radialSegments: 8,
  },
  clone: jest.fn(function () {
    return { ...this };
  }),
};

const mockMaterial = {
  dispose: jest.fn(),
  clone: jest.fn(function () {
    return { ...this };
  }),
  color: { getHex: jest.fn(() => 0x00ff00), set: jest.fn(), setHex: jest.fn() },
  map: null,
  normalMap: null,
  roughnessMap: null,
  metalness: 0.5,
  roughness: 0.5,
  side: undefined,
  needsUpdate: false,
};

const mockMesh = {
  ...mockObject3D,
  isMesh: true,
  type: 'Mesh',
  name: 'Mesh',
  uuid: 'mock-mesh-uuid',
  geometry: { ...mockGeometry },
  material: { ...mockMaterial },
};

const mockScene = {
  ...mockObject3D,
  type: 'Scene',
  background: null,
  children: [
    { type: 'GridHelper', toJSON: () => ({ object: { type: 'GridHelper' } }) },
    { type: 'AxesHelper', toJSON: () => ({ object: { type: 'AxesHelper' } }) },
  ],
  toJSON: jest.fn(function () {
    return {
      metadata: {
        version: 4.5,
        type: 'Scene',
        generator: 'Scene.toJSON',
      },
      object: {
        uuid: 'scene-uuid',
        type: 'Scene',
        children: this.children.map((child) => child.toJSON()),
      },
    };
  }),
};

const THREE = {
  Vector2: jest.fn().mockImplementation(() => ({ ...mockVector3 })),
  Vector3: jest.fn().mockImplementation(() => ({ ...mockVector3 })),
  Quaternion: jest.fn().mockImplementation(() => ({ ...mockQuaternion })),
  Color: jest.fn().mockImplementation((color) => ({
    _value: color,
    getHex: jest.fn(function () {
      return this._value;
    }),
<<<<<<< HEAD
    PerspectiveCamera: jest.fn().mockImplementation(() => ({
        ...mockObject3D,
        isPerspectiveCamera: true,
        aspect: 1,
        updateProjectionMatrix: jest.fn(),
    })),
    WebGLRenderer: jest.fn(() => ({
        domElement: dom.window.document.createElement('canvas'),
        setSize: jest.fn(),
        setPixelRatio: jest.fn(),
        shadowMap: { enabled: false, type: null },
        render: jest.fn(),
        dispose: jest.fn(),
    })),
    Clock: jest.fn(() => ({
        getDelta: jest.fn(() => 0.016),
    })),
    EventDispatcher: jest.fn(() => mockEventDispatcher),
    Object3D: jest.fn(() => ({ ...mockObject3D })),
    Mesh: jest.fn(() => ({ ...mockMesh })),
    Group: jest.fn().mockImplementation(function() {
        const group = {
            ...mockObject3D,
            isGroup: true,
            type: 'Group',
            name: 'Group',
            uuid: 'mock-group-uuid',
            children: [],
        };
        group.add = jest.fn(function(object) {
            this.children.push(object);
            object.parent = this;
        });
        group.remove = jest.fn(function(object) {
            this.children = this.children.filter(child => child.uuid !== object.uuid);
            object.parent = null;
        });
        return group;
=======
    set: jest.fn(function (value) {
      this._value = value;
      return this;
>>>>>>> master
    }),
<<<<<<< HEAD
    setHex: jest.fn(function (value) {
      this._value = value;
      return this;
=======
    BoxGeometry: jest.fn(() => ({ ...mockGeometry })),
    SphereGeometry: jest.fn(() => ({ ...mockGeometry })),
    CylinderGeometry: jest.fn(() => ({ ...mockGeometry })),
    PlaneGeometry: jest.fn(() => ({ ...mockGeometry })),
    TorusGeometry: jest.fn(() => ({ ...mockGeometry })),
    TeapotGeometry: jest.fn(() => ({ ...mockGeometry })),
    TextGeometry: jest.fn(() => ({ ...mockGeometry })),
    MeshBasicMaterial: jest.fn(() => ({ ...mockMaterial })),
    MeshStandardMaterial: jest.fn(() => ({ ...mockMaterial })),
    MeshPhongMaterial: jest.fn(() => ({ ...mockMaterial })),
    ShaderMaterial: jest.fn(() => ({
        ...mockMaterial,
        vertexShader: '',
        fragmentShader: '',
        uniforms: {},
    })),
    Loader: class {
        constructor(manager) {
            this.manager = manager;
        }
        load() {}
        parse() {}
    },
    FileLoader: class {
        constructor(manager) {
            this.manager = manager;
        }
        load() {}
    },
    TextureLoader: jest.fn().mockImplementation(() => ({
        load: jest.fn((url, onLoad) => {
            if (onLoad) onLoad(new THREE.Texture());
        }),
    })),
    ObjectLoader: jest.fn().mockImplementation(() => ({
        parse: jest.fn((data, onLoad) => {
            if (onLoad) onLoad(new THREE.Scene());
        }),
    })),
    Texture: jest.fn(() => ({
        dispose: jest.fn(),
    })),
    FontLoader: jest.fn().mockImplementation(() => ({
        load: jest.fn((url, onLoad) => {
            if (onLoad) onLoad(new THREE.Font());
        }),
    })),
    Font: jest.fn(() => ({
        type: 'Font',
    })),
    DirectionalLight: jest.fn(() => {
        const light = {
            ...mockObject3D,
            isDirectionalLight: true,
            color: { set: jest.fn() },
            intensity: 1,
        };
        light.position = new THREE.Vector3(); // Ensure position is a Vector3 instance
        return light;
>>>>>>> master
    }),
  })),
  Scene: jest.fn(() => {
    const scene = {
      children: [],
      add: jest.fn((object) => {
        if (object.parent) {
          object.removeFromParent();
        }
        object.parent = scene;
        scene.children.push(object);
      }),
      remove: jest.fn((object) => {
        scene.children = scene.children.filter((child) => child !== object);
        object.parent = null;
      }),
      traverse: jest.fn(),
      getObjectByProperty: jest.fn(() => null),
    };
    return scene;
  }),
  PerspectiveCamera: jest.fn().mockImplementation(() => ({
    ...mockObject3D,
    isPerspectiveCamera: true,
    aspect: 1,
    updateProjectionMatrix: jest.fn(),
  })),
  WebGLRenderer: jest.fn(() => ({
    domElement: dom.window.document.createElement('canvas'),
    setSize: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
  })),
  Clock: jest.fn(() => ({
    getDelta: jest.fn(() => 0.016),
  })),
  EventDispatcher: jest.fn(() => mockEventDispatcher),
  Object3D: jest.fn(() => ({ ...mockObject3D })),
  Mesh: jest.fn(() => ({ ...mockMesh })),
  Group: jest.fn().mockImplementation(function () {
    const group = {
      ...mockObject3D,
      isGroup: true,
      type: 'Group',
      name: 'Group',
      uuid: 'mock-group-uuid',
      children: [],
    };
    group.add = jest.fn(function (object) {
      this.children.push(object);
      object.parent = this;
    });
    group.remove = jest.fn(function (object) {
      this.children = this.children.filter((child) => child.uuid !== object.uuid);
      object.parent = null;
    });
    return group;
  }),
  BoxGeometry: jest.fn(() => ({ ...mockGeometry })),
  SphereGeometry: jest.fn(() => ({ ...mockGeometry })),
  CylinderGeometry: jest.fn(() => ({ ...mockGeometry })),
  PlaneGeometry: jest.fn(() => ({ ...mockGeometry })),
  TorusGeometry: jest.fn(() => ({ ...mockGeometry })),
  TeapotGeometry: jest.fn(() => ({ ...mockGeometry })),
  TextGeometry: jest.fn(() => ({ ...mockGeometry })),
  MeshBasicMaterial: jest.fn(() => ({ ...mockMaterial })),
  MeshStandardMaterial: jest.fn(() => ({ ...mockMaterial })),
  MeshPhongMaterial: jest.fn(() => ({ ...mockMaterial })),
  ShaderMaterial: jest.fn(() => ({
    ...mockMaterial,
    vertexShader: '',
    fragmentShader: '',
    uniforms: {},
  })),
  TextureLoader: jest.fn().mockImplementation(() => ({
    load: jest.fn((url, onLoad) => {
      if (onLoad) onLoad(new THREE.Texture());
    }),
  })),
  ObjectLoader: jest.fn().mockImplementation(() => ({
    parse: jest.fn((data, onLoad) => {
      if (onLoad) onLoad(new THREE.Scene());
    }),
  })),
  Texture: jest.fn(() => ({
    dispose: jest.fn(),
  })),
  FontLoader: jest.fn().mockImplementation(() => ({
    load: jest.fn((url, onLoad) => {
      if (onLoad) onLoad(new THREE.Font());
    }),
  })),
  Font: jest.fn(() => ({
    type: 'Font',
  })),
  DirectionalLight: jest.fn(() => {
    const light = {
      ...mockObject3D,
      isDirectionalLight: true,
      color: { set: jest.fn() },
      intensity: 1,
    };
    light.position = new THREE.Vector3(); // Ensure position is a Vector3 instance
    return light;
  }),
  PointLight: jest.fn(() => ({
    ...mockObject3D,
    isPointLight: true,
    color: { set: jest.fn() },
    intensity: 1,
  })),
  AmbientLight: jest.fn(() => ({ ...mockObject3D, isAmbientLight: true })),
  GridHelper: jest.fn(() => ({
    ...mockObject3D,
    isGridHelper: true,
    toJSON: () => ({ object: { type: 'GridHelper' } }),
  })),
  AxesHelper: jest.fn(() => ({
    ...mockObject3D,
    isAxesHelper: true,
    toJSON: () => ({ object: { type: 'AxesHelper' } }),
  })),
  LineSegments: jest.fn(() => ({ ...mockObject3D, renderOrder: 1 })),
  EdgesGeometry: jest.fn(() => ({ ...mockGeometry })),
  LineBasicMaterial: jest.fn(() => ({ ...mockMaterial })),
  Raycaster: jest.fn(() => ({
    setFromCamera: jest.fn(),
    intersectObjects: jest.fn(() => []),
  })),
  DoubleSide: 2,
};

global.THREE = THREE;

<<<<<<< HEAD
jest.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
  OrbitControls: jest.fn().mockImplementation(() => ({
    enableDamping: false,
    dampingFactor: 0.25,
    screenSpacePanning: false,
    enableZoom: false,
    minDistance: 0,
    maxDistance: Infinity,
    maxPolarAngle: Math.PI,
    update: jest.fn(),
    target: { clone: jest.fn(() => ({ ...mockVector3 })) },
  })),
}));

jest.mock('three/examples/jsm/controls/TransformControls.js', () => ({
  TransformControls: jest.fn().mockImplementation(() => ({
    ...mockObject3D,
    setMode: jest.fn(),
    attach: jest.fn(),
    detach: jest.fn(),
    translationSnap: null,
    rotationSnap: null,
    scaleSnap: null,
  })),
}));

jest.mock('dat.gui', () => ({
  GUI: jest.fn().mockImplementation(() => ({
    addFolder: jest.fn(() => ({
      add: jest.fn(() => ({
        name: jest.fn(),
        onChange: jest.fn(),
      })),
      addColor: jest.fn(() => ({
        name: jest.fn(),
        onChange: jest.fn(),
      })),
      open: jest.fn(),
      removeFolder: jest.fn(),
    })),
    add: jest.fn(() => ({
      name: jest.fn(),
      listen: jest.fn(() => ({
        onChange: jest.fn(),
      })),
    })),
  })),
=======
// Mocks for three/examples/jsm/* are handled via moduleNameMapper in jest.config.cjs
// pointing to tests/__mocks__/three-examples.js

const createChainableMock = () => {
    const obj = {};
    obj.name = jest.fn(() => obj);
    obj.listen = jest.fn(() => obj);
    obj.onChange = jest.fn(() => obj);
    obj.step = jest.fn(() => obj);
    obj.min = jest.fn(() => obj);
    obj.max = jest.fn(() => obj);
    return obj;
};

jest.mock('dat.gui', () => ({
    GUI: jest.fn().mockImplementation(() => ({
        addFolder: jest.fn(() => ({
            add: jest.fn(() => createChainableMock()),
            addColor: jest.fn(() => createChainableMock()),
            open: jest.fn(),
            removeFolder: jest.fn()
        })),
        add: jest.fn(() => createChainableMock())
    }))
>>>>>>> master
}));

global.URL.revokeObjectURL = jest.fn();

global.FileReader = jest.fn(() => ({
  readAsText: jest.fn(),
  readAsArrayBuffer: jest.fn(),
  onload: jest.fn(),
  onerror: jest.fn(),
}));

global.JSZip = jest.fn(() => ({
<<<<<<< HEAD
  file: jest.fn(),
  generateAsync: jest.fn().mockResolvedValue(''),
  loadAsync: jest.fn().mockResolvedValue({
    files: {
      'scene.json': {
        async: jest.fn().mockResolvedValue('{}'),
      },
    },
  }),
=======
    file: jest.fn(),
    generateAsync: jest.fn().mockResolvedValue(''),
    loadAsync: jest.fn().mockResolvedValue({
        file: jest.fn(() => ({
            async: jest.fn().mockResolvedValue('{}')
        })),
        files: {
            'scene.json': {
                async: jest.fn().mockResolvedValue('{}')
            }
        },
        file: jest.fn((name) => {
            if (name === 'scene.json') {
                return { async: jest.fn().mockResolvedValue('{}') };
            }
            return null;
        })
    })
>>>>>>> master
}));

global.Worker = class {
  constructor(stringUrl) {
    this.url = stringUrl;
    this.onmessage = () => {};
  }

  postMessage(msg) {
    // Wrap the message in an event-like object with a 'data' property
    this.onmessage({ data: msg });
  }
};
