
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;

// Mock console.error and console.warn to prevent them from cluttering test output
// and to allow checking if they were called in tests.
global.console.error = jest.fn();
global.console.warn = jest.fn();

const mockConstructor = jest.fn();

const mockVector2 = {
    x: 0,
    y: 0,
    set: jest.fn(function(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }),
    clone: jest.fn(function() {
        return { ...this };
    }),
};

const mockVector3 = {
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
    sub: jest.fn(function(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }),
    normalize: jest.fn(function() {
        // For simplicity in tests, normalize can return the same object
        // In a real scenario, you might want to implement actual normalization logic
        return this;
    }),
};

const mockQuaternion = {
    x: 0,
    y: 0,
    z: 0,
    w: 1,
    setFromAxisAngle: jest.fn(),
    clone: jest.fn(function() {
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
    add: jest.fn(function(object) {
        this.children.push(object);
        object.parent = this;
    }),
    remove: jest.fn(function(object) {
        this.children = this.children.filter(child => child.uuid !== object.uuid);
        object.parent = null;
    }),
    children: [],
    parent: null,
    clone: jest.fn(function() { return { ...this, children: [] } }),
    copy: jest.fn(),
    traverse: jest.fn(function(callback) {
        callback(this);
        this.children.forEach(child => child.traverse(callback));
    }),
    updateMatrixWorld: jest.fn(),
    getWorldPosition: jest.fn(() => ({ ...mockVector3 })),
    getWorldQuaternion: jest.fn(() => ({ ...mockQuaternion })),
    removeFromParent: jest.fn(function() {
        if (this.parent) {
            this.parent.remove(this);
        }
    }),
    toJSON: jest.fn(function() {
        return {
            metadata: {
                version: 4.5,
                type: 'Scene',
                generator: 'Scene.toJSON'
            },
            object: {
                uuid: 'scene-uuid',
                type: 'Scene',
                children: this.children.map(child => child.toJSON())
            }
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
    clone: jest.fn(function() { return { ...this } }),
};

const mockMaterial = {
    dispose: jest.fn(),
    clone: jest.fn(function() { return { ...this } }),
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

const THREE = {
    Vector2: jest.fn().mockImplementation(() => ({ ...mockVector2 })),
    Vector3: jest.fn().mockImplementation(() => ({ ...mockVector3 })),
    Quaternion: jest.fn().mockImplementation(() => ({ ...mockQuaternion })),
    Color: jest.fn().mockImplementation((color) => ({
        _value: color,
        getHex: jest.fn(function() { return this._value; }),
        set: jest.fn(function(value) { this._value = value; return this; }),
        setHex: jest.fn(function(value) { this._value = value; return this; }),
    })),
    Scene: jest.fn().mockImplementation(() => ({
        ...mockObject3D,
        type: 'Scene',
        background: null,
        toJSON: jest.fn(function() {
            const sceneData = {
                metadata: { version: 4.6, type: 'Scene', generator: 'Object3D.toJSON' },
                geometries: [],
                materials: [],
                object: {
                    uuid: this.uuid,
                    type: this.type,
                    children: []
                }
            };

            this.traverse(object => {
                if (object.isMesh && object.geometry) {
                    const geometryJson = object.geometry.toJSON();
                    if (!sceneData.geometries.some(g => g.uuid === geometryJson.uuid)) {
                        sceneData.geometries.push(geometryJson);
                    }
                }
                if (object.isMesh && object.material) {
                    const materials = Array.isArray(object.material) ? object.material : [object.material];
                    materials.forEach(material => {
                        const materialJson = material.toJSON();
                        if (!sceneData.materials.some(m => m.uuid === materialJson.uuid)) {
                            sceneData.materials.push(materialJson);
                        }
                    });
                }
                if (object !== this) {
                    sceneData.object.children.push(object.toJSON());
                }
            });
            return sceneData;
        }),
    })),
    PerspectiveCamera: jest.fn().mockImplementation(() => ({
        ...mockObject3D,
        isPerspectiveCamera: true,
        aspect: 1,
        updateProjectionMatrix: jest.fn(),
    })),
    WebGLRenderer: jest.fn(() => ({
        domElement: {
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            // Add clientWidth and clientHeight for SceneManager tests
            clientWidth: 800,
            clientHeight: 600,
            style: {},
            // Mock getBoundingClientRect for Pointer.js tests
            getBoundingClientRect: jest.fn(() => ({
                left: 0,
                top: 0,
                width: 800,
                height: 600,
            })),
        },
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
    Group: jest.fn().mockImplementation(function() {
        const group = {
            ...mockObject3D,
            isGroup: true,
            type: 'Group',
            name: 'Group',
            uuid: 'mock-group-uuid',
            children: [],
            toJSON: jest.fn(function() {
                return {
                    metadata: { version: 4.6, type: 'Object', generator: 'Object3D.toJSON' },
                    object: {
                        uuid: this.uuid,
                        type: this.type,
                        children: this.children.map(child => child.toJSON ? child.toJSON().object : { uuid: child.uuid, type: child.type })
                    }
                };
            }),
        };
        // Override add and remove to correctly manage children for groups
        group.add = jest.fn(function(object) {
            this.children.push(object);
            object.parent = this;
        });
        group.remove = jest.fn(function(object) {
            this.children = this.children.filter(child => child.uuid !== object.uuid);
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
        vertexShader: `
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            void main() {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            }
        `,
        uniforms: {},
    })),
    TextureLoader: jest.fn().mockImplementation(() => ({
        load: jest.fn((url, onLoad) => {
            if (onLoad) onLoad(new THREE.Texture());
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
    DirectionalLight: jest.fn(() => ({
        ...mockObject3D,
        isDirectionalLight: true,
        position: { ...mockVector3, normalize: jest.fn(() => ({...mockVector3})) },
        color: { set: jest.fn() },
        intensity: 1,
    })),
    PointLight: jest.fn(() => ({
        ...mockObject3D,
        isPointLight: true,
        color: { set: jest.fn() },
        intensity: 1,
    })),
    AmbientLight: jest.fn(() => ({ ...mockObject3D, isAmbientLight: true })),
    GridHelper: jest.fn(() => ({ ...mockObject3D, isGridHelper: true })),
    AxesHelper: jest.fn(() => ({ ...mockObject3D, isAxesHelper: true })),
    LineSegments: jest.fn(() => ({ ...mockObject3D, renderOrder: 1 })),
    EdgesGeometry: jest.fn(() => ({...mockGeometry})),
    LineBasicMaterial: jest.fn(() => ({...mockMaterial})),
    Raycaster: jest.fn(() => ({
        setFromCamera: jest.fn(),
        intersectObjects: jest.fn(() => []),
    })),
    DoubleSide: 2,
};

global.THREE = THREE;

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
        target: { clone: jest.fn(() => ({...mockVector3})) }
    }))
}));

jest.mock('three/examples/jsm/controls/TransformControls.js', () => ({
    TransformControls: jest.fn().mockImplementation(() => ({
        ...mockObject3D,
        setMode: jest.fn(),
        attach: jest.fn(),
        detach: jest.fn(),
        translationSnap: null,
        rotationSnap: null,
        scaleSnap: null
    }))
}));

jest.mock('dat.gui', () => ({
    GUI: jest.fn().mockImplementation(() => ({
        addFolder: jest.fn(() => ({
            add: jest.fn(() => ({
                name: jest.fn(),
                onChange: jest.fn()
            })),
            addColor: jest.fn(() => ({
                name: jest.fn(),
                onChange: jest.fn()
            })),
            open: jest.fn(),
            removeFolder: jest.fn()
        })),
        add: jest.fn(() => ({
            name: jest.fn(),
            listen: jest.fn(() => ({
                onChange: jest.fn()
            }))
        }))
    }))
}));

global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

global.FileReader = jest.fn(() => ({
    readAsText: jest.fn(),
    readAsArrayBuffer: jest.fn(),
    onload: jest.fn(),
    onerror: jest.fn(),
}));

global.JSZip = jest.fn(() => ({
    file: jest.fn(),
    generateAsync: jest.fn().mockResolvedValue(''),
    loadAsync: jest.fn().mockResolvedValue({
        files: {
            'scene.json': {
                async: jest.fn().mockResolvedValue('{}')
            }
        }
    })
}));

global.Worker = class {
  constructor(stringUrl) {
    this.url = stringUrl;
    this.onmessage = () => {};
  }

  postMessage(msg) {
    this.onmessage(msg);
  }
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

// Mock FileLoader to prevent actual file system access during tests
jest.mock('three/src/loaders/FileLoader.js', () => {
    return {
        FileLoader: jest.fn().mockImplementation(() => ({
            load: jest.fn((url, onLoad) => {
                // Simulate loading a font file
                if (url.includes('helvetiker_regular.typeface.json')) {
                    onLoad(JSON.stringify({ metadata: { type: 'Font' } }));
                } else {
                    onLoad('');
                }
            }),
        })),
    };
});
