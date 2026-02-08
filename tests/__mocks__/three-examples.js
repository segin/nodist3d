<<<<<<< HEAD
=======
<<<<<<< HEAD
// tests/__mocks__/three-examples.js
const THREE = require('three');

module.exports = {
    TeapotGeometry: class extends THREE.BufferGeometry {},
    FontLoader: class {
        load(url, onLoad) { onLoad({ type: 'Font' }); }
    },
    TextGeometry: class extends THREE.BufferGeometry {},
    // Add other mocks if needed
};
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
// Mock for three/examples/jsm modules

export const OrbitControls = jest.fn().mockImplementation(() => ({
    enableDamping: false,
    dampingFactor: 0.25,
    screenSpacePanning: false,
    enableZoom: false,
    minDistance: 0,
    maxDistance: Infinity,
    maxPolarAngle: Math.PI,
    update: jest.fn(),
    target: { clone: jest.fn(() => ({ x: 0, y: 0, z: 0 })) },
    dispose: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
}));

export const TransformControls = jest.fn().mockImplementation(() => ({
    isObject3D: true,
    add: jest.fn(),
    remove: jest.fn(),
    children: [],
    setMode: jest.fn(),
    attach: jest.fn(),
    detach: jest.fn(),
    translationSnap: null,
    rotationSnap: null,
    scaleSnap: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    getRaycaster: jest.fn(() => ({ intersectObjects: jest.fn(() => []) })),
    dispose: jest.fn(),
}));

export const TeapotGeometry = jest.fn().mockImplementation(() => ({
    dispose: jest.fn(),
    parameters: {},
    clone: jest.fn(() => ({ dispose: jest.fn() })),
    translate: jest.fn(),
    rotateX: jest.fn(),
    rotateY: jest.fn(),
    rotateZ: jest.fn(),
    scale: jest.fn(),
}));

export const FontLoader = jest.fn().mockImplementation(() => ({
    load: jest.fn((url, onLoad) => {
        if (onLoad) onLoad({ type: 'Font' });
    }),
}));

export const TextGeometry = jest.fn().mockImplementation(() => ({
    dispose: jest.fn(),
    parameters: {},
    clone: jest.fn(() => ({ dispose: jest.fn() })),
    translate: jest.fn(),
    rotateX: jest.fn(),
    rotateY: jest.fn(),
    rotateZ: jest.fn(),
    scale: jest.fn(),
}));

export const OBJExporter = jest.fn().mockImplementation(() => ({
    parse: jest.fn(() => 'mock-obj-data')
}));

export const STLExporter = jest.fn().mockImplementation(() => ({
    parse: jest.fn(() => 'mock-stl-data')
}));

export const GLTFLoader = jest.fn().mockImplementation(() => ({
    load: jest.fn((url, onLoad) => {
        if (onLoad) onLoad({ scene: { children: [] } });
    }),
    parse: jest.fn((data, path, onLoad) => {
        if (onLoad) onLoad({ scene: { children: [] } });
    })
}));
=======
>>>>>>> master
>>>>>>> master
// Mock for three/examples/jsm/* modules
export class TeapotGeometry { constructor() {} }
export class FontLoader { load() {} parse() {} }
export class TextGeometry { constructor() {} }
export class OrbitControls { constructor() { this.enabled = true; } update() {} }
export class TransformControls { constructor() { this.addEventListener = () => {}; } }
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======

>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
