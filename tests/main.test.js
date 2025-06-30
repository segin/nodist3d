import { App } from '../src/frontend/main.js';
import { Scene, WebGLRenderer, PerspectiveCamera } from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

// Mock necessary DOM elements and their methods
document.body.innerHTML = `
    <canvas id="c"></canvas>
    <div id="ui"></div>
    <div id="scene-graph"></div>
`;

// Mock dat.gui
const mockGUI = {
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
};

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

// Mock WebGLRenderer
jest.mock('three', () => ({
    ...jest.requireActual('three'),
    WebGLRenderer: jest.fn().mockImplementation(() => ({
        domElement: document.createElement('canvas'),
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
        position: { x: 0, y: 0, z: 0 },
        quaternion: { x: 0, y: 0, z: 0, w: 1 }
    }))
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
        target: { x: 0, y: 0, z: 0 }
    }))
}));

// Mock OBJLoader and GLTFLoader
jest.mock('three/examples/jsm/loaders/OBJLoader.js');
jest.mock('three/examples/jsm/loaders/GLTFLoader.js');
jest.mock('three/examples/jsm/exporters/OBJExporter.js');
jest.mock('three/examples/jsm/exporters/GLTFExporter.js');

// Mock dat.gui constructor
jest.mock('dat.gui', () => ({
    GUI: jest.fn().mockImplementation(() => mockGUI)
}));

describe('App Integration Tests', () => {
    let app;

    beforeEach(() => {
        // Reset mocks before each test
        TransformControls.mockClear();
        mockGUI.addFolder.mockClear();
        mockGUI.add.mockClear();

        app = new App();
    });

    it('Clicking the "Translate" button should set `transformControls` mode to "translate" ', () => {
        const translateButton = document.querySelector('#ui button:nth-child(1)'); // Assuming it's the first button
        translateButton.click();
        expect(app.transformControls.setMode).toHaveBeenCalledWith('translate');
    });

    it('Clicking the "Rotate" button should set `transformControls` mode to "rotate" ', () => {
        const rotateButton = document.querySelector('#ui button:nth-child(2)'); // Assuming it's the second button
        rotateButton.click();
        expect(app.transformControls.setMode).toHaveBeenCalledWith('rotate');
    });
});