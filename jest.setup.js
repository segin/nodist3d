// Mock the Worker global for SceneStorage
global.Worker = class MockWorker {
    constructor() {
        this.onmessage = null;
        this.onerror = null;
    }

    postMessage(message) {
        if (message.type === 'serialize') {
            if (this.onmessage) {
                this.onmessage({ data: { type: 'serialize_complete', data: JSON.stringify(message.data) } });
            }
        } else if (message.type === 'deserialize') {
            const parsedData = JSON.parse(message.data);
            const mockScene = { children: [] };
            if (parsedData.children) {
                parsedData.children.forEach(childData => {
                    let mockObject;
                    if (childData.type === 'Mesh') {
                        mockObject = new global.THREE.Mesh(new global.THREE.BoxGeometry(), new global.THREE.MeshBasicMaterial());
                    } else if (childData.type === 'PointLight') {
                        mockObject = new global.THREE.PointLight(childData.color, childData.intensity);
                    } else if (childData.type === 'DirectionalLight') {
                        mockObject = new global.THREE.DirectionalLight(childData.color, childData.intensity);
                    } else if (childData.type === 'AmbientLight') {
                        mockObject = new global.THREE.AmbientLight(childData.color, childData.intensity);
                    } else if (childData.type === 'Group') {
                        mockObject = new global.THREE.Group();
                        if (childData.children) {
                            childData.children.forEach(grandChildData => {
                                let grandChildObject;
                                if (grandChildData.type === 'Mesh') {
                                    grandChildObject = new global.THREE.Mesh(new global.THREE.BoxGeometry(), new global.THREE.MeshBasicMaterial());
                                }
                                if (grandChildObject) {
                                    grandChildObject.uuid = grandChildData.uuid;
                                    grandChildObject.name = grandChildData.name;
                                    grandChildObject.position.set(grandChildData.position[0], grandChildData.position[1], grandChildData.position[2]);
                                    if (grandChildData.rotation) {
                                        grandChildObject.rotation.set(grandChildData.rotation[0], grandChildData.rotation[1], grandChildData.rotation[2]);
                                    }
                                    if (grandChildData.scale) {
                                        grandChildObject.scale.set(grandChildData.scale[0], grandChildData.scale[1], grandChildData.scale[2]);
                                    }
                                    if (grandChildData.material && grandChildData.material.color) {
                                        grandChildObject.material.color.setHex(grandChildData.material.color);
                                    }
                                    mockObject.add(grandChildObject);
                                }
                            });
                        }
                    }

                    if (mockObject) {
                        mockObject.uuid = childData.uuid;
                        mockObject.name = childData.name;
                        mockObject.position.set(childData.position[0], childData.position[1], childData.position[2]);
                        if (childData.rotation) {
                            mockObject.rotation.set(childData.rotation[0], childData.rotation[1], childData.rotation[2]);
                        }
                        if (childData.scale) {
                            mockObject.scale.set(childData.scale[0], childData.scale[1], childData.scale[2]);
                        }
                        if (childData.material && childData.material.color) {
                            mockObject.material.color.setHex(childData.material.color);
                        }
                        mockScene.children.push(mockObject);
                    }
                });
            }
            if (this.onmessage) {
                this.onmessage({ data: { type: 'deserialize_complete', data: mockScene } });
            }
        }
    }
};

// Mock FontLoader to prevent file loading errors in test environment
jest.mock('three/examples/jsm/loaders/FontLoader.js', () => ({
    FontLoader: jest.fn().mockImplementation(() => ({
        load: jest.fn((url, onLoad) => {
            onLoad({ json: {} });
        }),
    })),
}));

// Mock OrbitControls
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
        target: { x: 0, y: 0, z: 0, clone: jest.fn(function() { return new global.THREE.Vector3(this.x, this.y, this.z); }) }
    }))
}));

// Mock TransformControls
jest.mock('three/examples/jsm/controls/TransformControls.js', () => ({
    TransformControls: jest.fn().mockImplementation(() => ({
        addEventListener: jest.fn(),
        setMode: jest.fn(),
        attach: jest.fn(),
        detach: jest.fn(),
        update: jest.fn(),
        object: undefined,
        translationSnap: null,
        rotationSnap: null,
        scaleSnap: null
    }))
}));

// Mock dat.gui
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

// Mock GLTFLoader and GLTFExporter
jest.mock('three/examples/jsm/loaders/GLTFLoader.js', () => ({
    GLTFLoader: jest.fn().mockImplementation(() => ({
        parse: jest.fn((data, path, onLoad) => {
            const mockGltf = { scene: new global.THREE.Mesh(new global.THREE.BoxGeometry(), new global.THREE.MeshBasicMaterial()) };
            mockGltf.scene.name = 'MockGLTFScene';
            onLoad(mockGltf);
        })
    }))
}));
jest.mock('three/examples/jsm/exporters/GLTFExporter.js', () => ({
    GLTFExporter: jest.fn().mockImplementation(() => ({
        parse: jest.fn((scene, onCompleted, onError, options) => {
            onCompleted({ /* mock GLTF JSON data */ });
        })
    }))
}));

// Mock OBJLoader and OBJExporter
jest.mock('three/examples/jsm/loaders/OBJLoader.js');
jest.mock('three/examples/jsm/exporters/OBJExporter.js');

// Mock TeapotGeometry
jest.mock('three/examples/jsm/geometries/TeapotGeometry.js', () => ({
    TeapotGeometry: jest.fn().mockImplementation(() => ({})),
}));

// Mock TextEncoder for backend tests
global.TextEncoder = class {
    encode() {
        return new Uint8Array();
    }
};

jest.mock('three', () => ({
    __esModule: true,
    ...global.THREE,
}));

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL = class MockURL {
    static createObjectURL = jest.fn(() => 'blob:mockurl');
    static revokeObjectURL = jest.fn();
};

// Mock document.createElement for canvas and div
const mockCanvas = {
    clientWidth: 800,
    clientHeight: 600,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    style: {},
    getContext: jest.fn(() => ({})),
    toDataURL: jest.fn(() => 'data:image/png;base64,mockdata'),
};

const mockDiv = {
    innerHTML: '',
    querySelector: jest.fn(() => ({
        value: '',
        dispatchEvent: jest.fn(),
        addEventListener: jest.fn(),
        click: jest.fn(), // Add click method for elements queried by querySelector
    })),
    querySelectorAll: jest.fn(() => ([{
        value: '',
        dispatchEvent: jest.fn(),
        addEventListener: jest.fn(),
        click: jest.fn(), // Add click method for elements queried by querySelectorAll
    }])),
    appendChild: jest.fn(),
    removeChild: jest.fn(),
};

global.document = {
    createElement: jest.fn((tagName) => {
        if (tagName === 'canvas') {
            return mockCanvas;
        } else if (tagName === 'div') {
            return mockDiv;
        } else if (tagName === 'input') { // Mock input element for file operations
            return {
                type: '',
                accept: '',
                style: {},
                files: [],
                addEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            };
        } else if (tagName === 'a') { // Mock anchor element for downloads
            return {
                href: '',
                download: '',
                click: jest.fn(),
            };
        }
        return {};
    }),
    querySelector: jest.fn(() => mockDiv),
    querySelectorAll: jest.fn(() => ([mockDiv])),
    body: { appendChild: jest.fn(), removeChild: jest.fn() },
};

// Mock window properties
global.window = {
    innerWidth: 1024,
    innerHeight: 768,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    FileReader: class MockFileReader {
        constructor() {
            this.onload = null;
            this.readAsArrayBuffer = jest.fn();
        }
    },
};

// Define global THREE object with mocks
global.THREE = {
    Texture: jest.fn().mockImplementation(() => ({
        dispose: jest.fn(),
    })),
    WebGLRenderer: jest.fn().mockImplementation(() => ({
        domElement: {
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            getContext: jest.fn(() => ({})),
            toDataURL: jest.fn(() => 'data:image/png;base64,mockdata'),
        },
        setSize: jest.fn(),
        render: jest.fn(),
        toDataURL: jest.fn(() => 'data:image/png;base64,mockdata')
    })),
    Scene: jest.fn().mockImplementation(() => ({
        children: [],
        add: jest.fn(function(obj) { this.children.push(obj); }),
        remove: jest.fn(function(obj) { this.children = this.children.filter(child => child !== obj); }),
        toJSON: jest.fn(() => ({})),
        addEventListener: jest.fn()
    })),
    PerspectiveCamera: jest.fn().mockImplementation(() => ({
        aspect: 1,
        updateProjectionMatrix: jest.fn(),
        position: { x: 0, y: 0, z: 0, clone: jest.fn(function() { return new global.THREE.Vector3(this.x, this.y, this.z); }), set: jest.fn() },
        quaternion: { x: 0, y: 0, z: 0, w: 1, clone: jest.fn(function() { return new global.THREE.Quaternion(this.x, this.y, this.z, this.w); }) },
        lookAt: jest.fn(),
        rotation: { x: 0, y: 0, z: 0, set: jest.fn(), copy: jest.fn() },
    })),
    AmbientLight: jest.fn().mockImplementation(() => ({
        isAmbientLight: true,
        color: { getHex: jest.fn(() => 0x404040), setHex: jest.fn(), set: jest.fn() },
        intensity: 1,
        uuid: 'mock-ambient-light-uuid',
        name: 'AmbientLight',
        type: 'AmbientLight',
        parent: null,
        children: [],
        add: jest.fn(),
        remove: jest.fn(),
        copy: jest.fn(),
        clone: jest.fn(),
        traverse: jest.fn(),
        dispatchEvent: jest.fn(),
        hasEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addEventListener: jest.fn(),
    })),
    PointLight: jest.fn().mockImplementation(() => ({
        isPointLight: true,
        color: { getHex: jest.fn(() => 0xffffff), setHex: jest.fn(), set: jest.fn() },
        intensity: 1,
        distance: 0,
        decay: 2,
        position: { x: 0, y: 0, z: 0, set: jest.fn() },
        uuid: 'mock-point-light-uuid',
        name: 'PointLight',
        type: 'PointLight',
        parent: null,
        children: [],
        add: jest.fn(),
        remove: jest.fn(),
        copy: jest.fn(),
        clone: jest.fn(),
        traverse: jest.fn(),
        dispatchEvent: jest.fn(),
        hasEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addEventListener: jest.fn(),
    })),
    DirectionalLight: jest.fn().mockImplementation(() => ({
        isDirectionalLight: true,
        color: { getHex: jest.fn(() => 0xffffff), setHex: jest.fn(), set: jest.fn() },
        intensity: 1,
        position: { x: 0, y: 0, z: 0, set: jest.fn(), normalize: jest.fn() },
        target: { position: { x: 0, y: 0, z: 0, set: jest.fn() } },
        uuid: 'mock-directional-light-uuid',
        name: 'DirectionalLight',
        type: 'DirectionalLight',
        parent: null,
        children: [],
        add: jest.fn(),
        remove: jest.fn(),
        copy: jest.fn(),
        clone: jest.fn(),
        traverse: jest.fn(),
        dispatchEvent: jest.fn(),
        hasEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addEventListener: jest.fn(),
    })),
    Group: jest.fn().mockImplementation(() => ({
        isGroup: true,
        children: [],
        add: jest.fn(function(obj) { this.children.push(obj); }),
        remove: jest.fn(function(obj) { this.children = this.children.filter(child => child !== obj); }),
        uuid: 'mock-group-uuid',
        name: 'Group',
        type: 'Group',
        parent: null,
        position: { x: 0, y: 0, z: 0, set: jest.fn(), copy: jest.fn() },
        rotation: { x: 0, y: 0, z: 0, set: jest.fn() },
        scale: { x: 1, y: 1, z: 1, set: jest.fn() },
        matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        matrixWorld: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        updateMatrixWorld: jest.fn(),
        getWorldPosition: jest.fn((target) => {
            if (target) {
                target.set(0, 0, 0);
            }
            return target;
        }),
        copy: jest.fn(),
        clone: jest.fn(),
        traverse: jest.fn(),
        dispatchEvent: jest.fn(),
        hasEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addEventListener: jest.fn(),
    })),
    Mesh: jest.fn().mockImplementation(() => ({
        isMesh: true,
        geometry: {
            dispose: jest.fn(),
            parameters: { width: 1, height: 1, depth: 1, radius: 1, radiusTop: 1, radiusBottom: 1, height: 1, radialSegments: 8 },
            clone: jest.fn(function() { return new global.THREE.BufferGeometry(); }),
            type: 'MeshGeometry',
        },
        material: {
            dispose: jest.fn(),
            color: { getHex: jest.fn(() => 0xffffff), setHex: jest.fn(), set: jest.fn() },
            map: null,
            normalMap: null,
            roughnessMap: null,
            roughness: 0.5,
            metalness: 0.5,
            copy: jest.fn(function(source) {
                this.color.setHex(source.color.getHex());
                this.roughness = source.roughness;
                this.metalness = source.metalness;
                this.map = source.map;
                this.normalMap = source.normalMap;
                this.roughnessMap = source.roughnessMap;
                this.side = source.side;
                return this;
            }),
            clone: jest.fn(function() { return new global.THREE.MeshBasicMaterial().copy(this); }),
            side: undefined,
        },
        uuid: 'mock-mesh-uuid',
        name: 'Mesh',
        type: 'Mesh',
        parent: null,
        children: [],
        add: jest.fn(),
        remove: jest.fn(),
        position: { x: 0, y: 0, z: 0, set: jest.fn(), copy: jest.fn() },
        rotation: { x: 0, y: 0, z: 0, set: jest.fn(), copy: jest.fn() },
        scale: { x: 1, y: 1, z: 1, set: jest.fn(), copy: jest.fn() },
        matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        matrixWorld: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        updateMatrixWorld: jest.fn(),
        getWorldPosition: jest.fn((target) => {
            if (target) {
                target.set(0, 0, 0);
            }
            return target;
        }),
        getWorldQuaternion: jest.fn((target) => {
            if (target) {
                target.set(0, 0, 0, 1);
            }
            return target;
        }),
        copy: jest.fn(function(source) {
            this.position.copy(source.position);
            this.rotation.copy(source.rotation);
            this.scale.copy(source.scale);
            this.matrix.splice(0, this.matrix.length, ...source.matrix);
            this.matrixWorld.splice(0, this.matrixWorld.length, ...source.matrixWorld);
            this.uuid = source.uuid;
            this.name = source.name;
            this.type = source.type;
            this.parent = source.parent;
            this.children = source.children.map(child => child.clone()); // Deep clone children
            this.visible = source.visible;
            this.geometry = source.geometry.clone(); // Deep clone geometry
            this.material = source.material.clone(); // Deep clone material
            return this;
        }),
        clone: jest.fn(function() {
            return new global.THREE.Object3D().copy(this);
        }),
        traverse: jest.fn(),
        dispatchEvent: jest.fn(),
        hasEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addEventListener: jest.fn(),
        visible: true,
    })),
    BoxGeometry: jest.fn().mockImplementation(() => ({
        dispose: jest.fn(),
        parameters: { width: 1, height: 1, depth: 1 },
        type: 'BoxGeometry',
        clone: jest.fn(function() { return new global.THREE.BoxGeometry(); }),
    })),
    SphereGeometry: jest.fn().mockImplementation(() => ({
        dispose: jest.fn(),
        parameters: { radius: 1 },
        type: 'SphereGeometry',
        clone: jest.fn(function() { return new global.THREE.SphereGeometry(); }),
    })),
    CylinderGeometry: jest.fn().mockImplementation(() => ({
        dispose: jest.fn(),
        parameters: { radiusTop: 1, radiusBottom: 1, height: 1, radialSegments: 8 },
        type: 'CylinderGeometry',
        clone: jest.fn(function() { return new global.THREE.CylinderGeometry(); }),
    })),
    PlaneGeometry: jest.fn().mockImplementation(() => ({
        dispose: jest.fn(),
        parameters: { width: 1, height: 1 },
        type: 'PlaneGeometry',
        clone: jest.fn(function() { return new global.THREE.PlaneGeometry(); }),
    })),
    ConeGeometry: jest.fn().mockImplementation(() => ({
        dispose: jest.fn(),
        parameters: { radius: 1, height: 1, radialSegments: 8 },
        type: 'ConeGeometry',
        clone: jest.fn(function() { return new global.THREE.ConeGeometry(); }),
    })),
    TorusGeometry: jest.fn().mockImplementation(() => ({
        dispose: jest.fn(),
        parameters: { radius: 1, tube: 0.4, radialSegments: 8, tubularSegments: 6 },
        type: 'TorusGeometry',
        clone: jest.fn(function() { return new global.THREE.TorusGeometry(); }),
    })),
    CapsuleGeometry: jest.fn().mockImplementation(() => ({
        dispose: jest.fn(),
        parameters: { radius: 1, length: 1, capSegments: 4, radialSegments: 8 },
        type: 'CapsuleGeometry',
        clone: jest.fn(function() { return new global.THREE.CapsuleGeometry(); }),
    })),
    DodecahedronGeometry: jest.fn().mockImplementation(() => ({
        dispose: jest.fn(),
        parameters: { radius: 1 },
        type: 'DodecahedronGeometry',
        clone: jest.fn(function() { return new global.THREE.DodecahedronGeometry(); }),
    })),
    OctahedronGeometry: jest.fn().mockImplementation(() => ({
        dispose: jest.fn(),
        parameters: { radius: 1 },
        type: 'OctahedronGeometry',
        clone: jest.fn(function() { return new global.THREE.OctahedronGeometry(); }),
    })),
    IcosahedronGeometry: jest.fn().mockImplementation(() => ({
        dispose: jest.fn(),
        parameters: { radius: 1 },
        type: 'IcosahedronGeometry',
        clone: jest.fn(function() { return new global.THREE.IcosahedronGeometry(); }),
    })),
    RingGeometry: jest.fn().mockImplementation(() => ({
        dispose: jest.fn(),
        parameters: { innerRadius: 0.5, outerRadius: 1, thetaSegments: 8 },
        type: 'RingGeometry',
        clone: jest.fn(function() { return new global.THREE.RingGeometry(); }),
    })),
    TubeGeometry: jest.fn().mockImplementation(() => ({
        dispose: jest.fn(),
        parameters: {},
        type: 'TubeGeometry',
        clone: jest.fn(function() { return new global.THREE.TubeGeometry(); }),
    })),
    TorusKnotGeometry: jest.fn().mockImplementation(() => ({
        dispose: jest.fn(),
        parameters: { radius: 1, tube: 0.4, tubularSegments: 64, radialSegments: 8, p: 2, q: 3 },
        type: 'TorusKnotGeometry',
        clone: jest.fn(function() { return new global.THREE.TorusKnotGeometry(); }),
    })),
    ShapeGeometry: jest.fn().mockImplementation(() => ({
        dispose: jest.fn(),
        parameters: {},
        type: 'ShapeGeometry',
        clone: jest.fn(function() { return new global.THREE.ShapeGeometry(); }),
    })),
    ExtrudeGeometry: jest.fn().mockImplementation(() => ({
        dispose: jest.fn(),
        parameters: {},
        type: 'ExtrudeGeometry',
        clone: jest.fn(function() { return new global.THREE.ExtrudeGeometry(); }),
    })),
    LatheGeometry: jest.fn().mockImplementation(() => ({
        dispose: jest.fn(),
        parameters: {},
        type: 'LatheGeometry',
        clone: jest.fn(function() { return new global.THREE.LatheGeometry(); }),
    })),
    MeshBasicMaterial: jest.fn().mockImplementation(() => ({
        isMaterial: true,
        color: { getHex: jest.fn(() => 0xffffff), setHex: jest.fn(), set: jest.fn() },
        map: null,
        normalMap: null,
        roughnessMap: null,
        roughness: 0.5,
        metalness: 0.5,
        dispose: jest.fn(),
        copy: jest.fn(function(source) {
            this.color.setHex(source.color.getHex());
            this.map = source.map;
            this.normalMap = source.normalMap;
            this.roughnessMap = source.roughnessMap;
            this.roughness = source.roughness;
            this.metalness = source.metalness;
            this.side = source.side;
            return this;
        }),
        clone: jest.fn(function() { return new global.THREE.MeshBasicMaterial().copy(this); }),
        side: global.THREE.FrontSide, // Default side for MeshBasicMaterial
    })),
    MeshLambertMaterial: jest.fn().mockImplementation(() => ({
        isMaterial: true,
        color: { getHex: jest.fn(() => 0xffffff), setHex: jest.fn(), set: jest.fn() },
        map: null,
        normalMap: null,
        roughnessMap: null,
        roughness: 0.5,
        metalness: 0.5,
        dispose: jest.fn(),
        copy: jest.fn(function(source) {
            this.color.setHex(source.color.getHex());
            this.map = source.map;
            this.normalMap = source.normalMap;
            this.roughnessMap = source.roughnessMap;
            this.roughness = source.roughness;
            this.metalness = source.metalness;
            this.side = source.side;
            return this;
        }),
        clone: jest.fn(function() { return new global.THREE.MeshLambertMaterial().copy(this); }),
        side: global.THREE.FrontSide,
    })),
    MeshStandardMaterial: jest.fn().mockImplementation(() => ({
        isMaterial: true,
        color: { getHex: jest.fn(() => 0xffffff), setHex: jest.fn(), set: jest.fn() },
        map: null,
        normalMap: null,
        roughnessMap: null,
        roughness: 0.5,
        metalness: 0.5,
        dispose: jest.fn(),
        copy: jest.fn(function(source) {
            this.color.setHex(source.color.getHex());
            this.map = source.map;
            this.normalMap = source.normalMap;
            this.roughnessMap = source.roughnessMap;
            this.roughness = source.roughness;
            this.metalness = source.metalness;
            this.side = source.side;
            return this;
        }),
        clone: jest.fn(function() { return new global.THREE.MeshStandardMaterial().copy(this); }),
        side: global.THREE.FrontSide,
    })),
    ShaderMaterial: jest.fn().mockImplementation(() => ({
        isMaterial: true,
        uniforms: {},
        vertexShader: '',
        fragmentShader: '',
        dispose: jest.fn(),
        copy: jest.fn(function(source) {
            this.uniforms = JSON.parse(JSON.stringify(source.uniforms)); // Deep copy uniforms
            this.vertexShader = source.vertexShader;
            this.fragmentShader = source.fragmentShader;
            this.needsUpdate = source.needsUpdate;
            return this;
        }),
        clone: jest.fn(function() { return new global.THREE.ShaderMaterial().copy(this); }),
        needsUpdate: false,
    })),
    Object3D: jest.fn().mockImplementation(() => ({
        isObject3D: true,
        uuid: 'mock-object3d-uuid',
        name: 'Object3D',
        type: 'Object3D',
        parent: null,
        children: [],
        add: jest.fn(function(obj) { this.children.push(obj); }),
        remove: jest.fn(function(obj) { this.children = this.children.filter(child => child !== obj); }),
        position: { x: 0, y: 0, z: 0, set: jest.fn(), copy: jest.fn(function(source) { this.x = source.x; this.y = source.y; this.z = source.z; return this; }) },
        rotation: { x: 0, y: 0, z: 0, set: jest.fn(), copy: jest.fn(function(source) { this.x = source.x; this.y = source.y; this.z = source.z; return this; }) },
        scale: { x: 1, y: 1, z: 1, set: jest.fn(), copy: jest.fn(function(source) { this.x = source.x; this.y = source.y; this.z = source.z; return this; }) },
        matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        matrixWorld: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        updateMatrixWorld: jest.fn(),
        getWorldPosition: jest.fn((target) => {
            if (target) {
                target.set(0, 0, 0);
            }
            return target;
        }),
        getWorldQuaternion: jest.fn((target) => {
            if (target) {
                target.set(0, 0, 0, 1);
            }
            return target;
        }),
        copy: jest.fn(function(source) {
            this.position.copy(source.position);
            this.rotation.copy(source.rotation);
            this.scale.copy(source.scale);
            this.matrix.splice(0, this.matrix.length, ...source.matrix);
            this.matrixWorld.splice(0, this.matrixWorld.length, ...source.matrixWorld);
            this.uuid = source.uuid;
            this.name = source.name;
            this.type = source.type;
            this.parent = source.parent;
            this.children = source.children.map(child => child.clone()); // Deep clone children
            this.visible = source.visible;
            return this;
        }),
        clone: jest.fn(function() {
            return new global.THREE.Object3D().copy(this);
        }),
        traverse: jest.fn(),
        dispatchEvent: jest.fn(),
        hasEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addEventListener: jest.fn(),
        visible: true,
    })),
    Vector3: jest.fn().mockImplementation((x = 0, y = 0, z = 0) => ({
        x, y, z,
        set: jest.fn(function(newX, newY, newZ) { this.x = newX; this.y = newY; this.z = newZ; return this; }),
        clone: jest.fn(function() { return new global.THREE.Vector3(this.x, this.y, this.z); }),
        equals: jest.fn(function(v) { return this.x === v.x && this.y === v.y && this.z === v.z; }),
        sub: jest.fn(function(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; }),
        subVectors: jest.fn(function(a, b) { this.x = a.x - b.x; this.y = a.y - b.y; this.z = a.z - b.z; return this; }),
        add: jest.fn(function(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }),
        multiplyScalar: jest.fn(function(s) { this.x *= s; this.y *= s; this.z *= s; return this; }),
        divideScalar: jest.fn(function(s) { this.x /= s; this.y /= s; this.z /= s; return this; }),
        length: jest.fn(() => Math.sqrt(x*x + y*y + z*z)),
        normalize: jest.fn(function() {
            const len = this.length();
            if (len > 0) {
                this.x /= len;
                this.y /= len;
                this.z /= len;
            }
            return this;
        }),
        distanceTo: jest.fn(() => 0),
        setFromMatrixPosition: jest.fn(),
        copy: jest.fn(function(source) { this.x = source.x; this.y = source.y; this.z = source.z; return this; }),
    })),
    Euler: jest.fn().mockImplementation((x = 0, y = 0, z = 0, order = 'XYZ') => ({
        x, y, z, order,
        set: jest.fn(function(newX, newY, newZ, newOrder) { this.x = newX; this.y = newY; this.z = newZ; this.order = newOrder || this.order; return this; }),
        clone: jest.fn(function() { return new global.THREE.Euler(this.x, this.y, this.z, this.order); }),
        copy: jest.fn(function(source) { this.x = source.x; this.y = source.y; this.z = source.z; this.order = source.order; return this; }),
    })),
    Quaternion: jest.fn().mockImplementation((x = 0, y = 0, z = 0, w = 1) => ({
        x, y, z, w,
        set: jest.fn(function(newX, newY, newZ, newW) { this.x = newX; this.y = newY; this.z = newZ; this.w = newW; return this; }),
        clone: jest.fn(function() { return new global.THREE.Quaternion(this.x, this.y, this.z, this.w); }),
        setFromEuler: jest.fn(),
        multiplyQuaternions: jest.fn(),
        copy: jest.fn(function(source) { this.x = source.x; this.y = source.y; this.z = source.z; this.w = source.w; return this; }),
    })),
    Raycaster: jest.fn().mockImplementation(() => ({
        setFromCamera: jest.fn(),
        intersectObjects: jest.fn(() => []),
    })),
    EventDispatcher: jest.fn().mockImplementation(() => ({
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
    BufferGeometry: jest.fn().mockImplementation(() => ({
        dispose: jest.fn(),
        parameters: {},
        center: jest.fn(),
        type: 'BufferGeometry',
    })),
    DoubleSide: 2, // THREE.DoubleSide is a constant
    LineSegments: jest.fn().mockImplementation(() => ({})),
    EdgesGeometry: jest.fn().mockImplementation(() => ({})),
    LineBasicMaterial: jest.fn().mockImplementation(() => ({})),
    Color: jest.fn().mockImplementation((color) => ({
        value: color,
        getHex: jest.fn(function() { return this.value; }),
        setHex: jest.fn(function(hex) { this.value = hex; return this; }),
        set: jest.fn(function(c) { this.value = c; return this; }),
    })),
    GridHelper: jest.fn().mockImplementation(() => ({})),
    AxesHelper: jest.fn().mockImplementation(() => ({})),
    ObjectLoader: jest.fn().mockImplementation(() => ({
        parse: jest.fn((json) => {
            // Simplified mock for parsing scene JSON
            const sceneData = typeof json === 'string' ? JSON.parse(json) : json;
            const newScene = new global.THREE.Scene();
            if (sceneData.camera) {
                newScene.camera = new global.THREE.PerspectiveCamera();
                if (sceneData.camera.position) newScene.camera.position.set(sceneData.camera.position[0], sceneData.camera.position[1], sceneData.camera.position[2]);
                if (sceneData.camera.quaternion) newScene.camera.quaternion.set(sceneData.camera.quaternion[0], sceneData.camera.quaternion[1], sceneData.camera.quaternion[2], sceneData.camera.quaternion[3]);
            }
            if (sceneData.children) {
                sceneData.children.forEach(childData => {
                    let obj;
                    if (childData.type === 'Mesh') {
                        obj = new global.THREE.Mesh(new global.THREE.BufferGeometry(), new global.THREE.MeshBasicMaterial());
                        obj.geometry.type = childData.geometry.type; // Set geometry type
                    } else if (childData.type === 'PointLight') {
                        obj = new global.THREE.PointLight();
                    } else if (childData.type === 'DirectionalLight') {
                        obj = new global.THREE.DirectionalLight();
                    } else if (childData.type === 'AmbientLight') {
                        obj = new global.THREE.AmbientLight();
                    } else if (childData.type === 'Group') {
                        obj = new global.THREE.Group();
                    }
                    if (obj) {
                        obj.uuid = childData.uuid;
                        obj.name = childData.name;
                        if (childData.position) obj.position.set(childData.position[0], childData.position[1], childData.position[2]);
                        if (childData.rotation) obj.rotation.set(childData.rotation[0], childData.rotation[1], childData.rotation[2]);
                        if (childData.scale) obj.scale.set(childData.scale[0], childData.scale[1], childData.scale[2]);
                        if (childData.material && childData.material.color) obj.material.color.setHex(childData.material.color);
                        if (childData.visible !== undefined) obj.visible = childData.visible;
                        if (childData.children) {
                            childData.children.forEach(grandChildData => {
                                let grandChildObj;
                                if (grandChildData.type === 'Mesh') {
                                    grandChildObj = new global.THREE.Mesh(new global.THREE.BufferGeometry(), new global.THREE.MeshBasicMaterial());
                                    grandChildObj.geometry.type = grandChildData.geometry.type; // Set geometry type
                                }
                                if (grandChildObj) {
                                    grandChildObj.uuid = grandChildData.uuid;
                                    grandChildObj.name = grandChildData.name;
                                    if (grandChildData.position) grandChildObj.position.set(grandChildData.position[0], grandChildData.position[1], grandChildData.position[2]);
                                    if (grandChildData.rotation) grandChildObj.rotation.set(grandChildData.rotation[0], grandChildData.rotation[1], grandChildData.rotation[2]);
                                    if (grandChildData.scale) grandChildObj.scale.set(grandChildData.scale[0], grandChildData.scale[1], grandChildData.scale[2]);
                                    if (grandChildData.material && grandChildData.material.color) grandChildObj.material.color.setHex(grandChildData.material.color);
                                    obj.add(grandChildObj);
                                }
                            });
                        }
                        newScene.add(obj);
                    }
                });
            }
            return newScene;
        }),
    })),
    MeshPhongMaterial: jest.fn().mockImplementation(() => ({
        isMaterial: true,
        color: { getHex: jest.fn(() => 0xffffff), setHex: jest.fn(), set: jest.fn() },
        map: null,
        normalMap: null,
        roughnessMap: null,
        roughness: 0.5,
        metalness: 0.5,
        dispose: jest.fn(),
        copy: jest.fn(),
        clone: jest.fn(),
        side: undefined,
    })),
    Camera: jest.fn().mockImplementation(() => ({
        uuid: 'mock-camera-uuid',
        position: { x: 0, y: 0, z: 0, set: jest.fn(function(newX, newY, newZ) { this.x = newX; this.y = newY; this.z = newZ; return this; }), clone: jest.fn(function() { return new global.THREE.Vector3(this.x, this.y, this.z); }) },
        quaternion: { x: 0, y: 0, z: 0, w: 1, clone: jest.fn(function() { return new global.THREE.Quaternion(this.x, this.y, this.z, this.w); }), copy: jest.fn(function(source) { this.x = source.x; this.y = source.y; this.z = source.z; this.w = source.w; return this; }) },
        lookAt: jest.fn(),
        updateProjectionMatrix: jest.fn(),
        copy: jest.fn(function(source) {
            this.position.copy(source.position);
            this.quaternion.copy(source.quaternion);
            return this;
        }),
    })),
    CatmullRomCurve3: jest.fn().mockImplementation(() => ({
        getPoints: jest.fn(() => []),
    })),
    Shape: jest.fn().mockImplementation(() => ({
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        bezierCurveTo: jest.fn(),
        splineCurveTo: jest.fn(),
        quadraticCurveTo: jest.fn(),
        absarc: jest.fn(),
        absellipse: jest.fn(),
        getPoints: jest.fn(() => []),
    })),
    Vector2: jest.fn().mockImplementation((x = 0, y = 0) => ({
        x, y,
        set: jest.fn(function(newX, newY) { this.x = newX; this.y = newY; return this; }),
        clone: jest.fn(function() { return new global.THREE.Vector2(this.x, this.y); }),
    })),
    TextGeometry: jest.fn().mockImplementation(() => ({
        dispose: jest.fn(),
        parameters: {},
        center: jest.fn(),
        type: 'TextGeometry',
    })),
    TextureLoader: jest.fn().mockImplementation(() => ({
        load: jest.fn((url, onLoad) => {
            onLoad(new global.THREE.Texture());
        }),
    })),
    FrontSide: 0, // THREE.FrontSide is a constant
    // Mock CANNON.World for PhysicsManager tests
    CANNON: {
        World: jest.fn().mockImplementation(() => ({
            bodies: [],
            gravity: { x: 0, y: -9.82, z: 0 },
            addBody: jest.fn(function(body) { this.bodies.push(body); }),
            removeBody: jest.fn(function(body) { this.bodies = this.bodies.filter(b => b !== body); }),
            step: jest.fn(),
            fixedStep: jest.fn(() => 1), // Return a number for fixedStep
        })),
        Body: {
            STATIC: 0,
            DYNAMIC: 1,
        },
        Box: jest.fn().mockImplementation((halfExtents) => ({ halfExtents: halfExtents || { x: 0.5, y: 0.5, z: 0.5 }})),
        Sphere: jest.fn().mockImplementation((radius) => ({ radius: radius || 0.5 })),
        Cylinder: jest.fn().mockImplementation((radiusTop, radiusBottom, height, numSegments) => ({ radiusTop, radiusBottom, height, numSegments })),
        Vec3: jest.fn().mockImplementation((x = 0, y = 0, z = 0) => ({ x, y, z })),
        Quaternion: jest.fn().mockImplementation((x = 0, y = 0, z = 0, w = 1) => ({
            x, y, z, w,
            set: jest.fn(function(newX, newY, newZ, newW) { this.x = newX; this.y = newY; this.z = newZ; this.w = newW; return this; }),
            clone: jest.fn(function() { return new global.THREE.Quaternion(this.x, this.y, this.z, this.w); }),
            setFromEuler: jest.fn(),
            multiplyQuaternions: jest.fn(),
            copy: jest.fn(function(source) { this.x = source.x; this.y = source.y; this.z = source.z; this.w = source.w; return this; }),
        })),
    },
};

// Make TextureLoader globally available for spying
global.TextureLoader = global.THREE.TextureLoader;
global.THREE.Texture.prototype.dispose = jest.fn(); // Ensure dispose is mocked on prototype
