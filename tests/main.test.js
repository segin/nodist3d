/**
 * Tests for the main App class
 */
import { JSDOM } from 'jsdom';

// Mock THREE.js
jest.mock('three', () => {
    const mockElement = { createElement: jest.fn(() => ({ tagName: 'CANVAS' })) };

    const mockMesh = {
        position: { x: 0, y: 0, z: 0, copy: jest.fn(), clone: jest.fn() },
        rotation: { x: 0, y: 0, z: 0, copy: jest.fn(), clone: jest.fn() },
        scale: { x: 1, y: 1, z: 1, copy: jest.fn(), clone: jest.fn() },
        material: {
            emissive: { setHex: jest.fn(), clone: jest.fn() },
            clone: jest.fn(() => ({ emissive: { setHex: jest.fn() } })),
            color: { set: jest.fn(), getHexString: jest.fn(), clone: jest.fn() }
        },
        geometry: { clone: jest.fn(), type: 'BoxGeometry', dispose: jest.fn() },
        castShadow: false,
        receiveShadow: false,
        name: 'test',
        uuid: 'test-uuid'
    };

    return {
        Scene: jest.fn(() => ({
            add: jest.fn(),
            remove: jest.fn(),
            children: []
        })),
        PerspectiveCamera: jest.fn(() => ({
            position: { set: jest.fn(), clone: jest.fn() },
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
                parentElement: { appendChild: jest.fn() }
            },
        })),
        Mesh: jest.fn(() => mockMesh),
        BoxGeometry: jest.fn(() => ({ type: 'BoxGeometry', parameters: { width: 1, height: 1, depth: 1 } })),
        SphereGeometry: jest.fn(() => ({ type: 'SphereGeometry', parameters: { radius: 1 } })),
        CylinderGeometry: jest.fn(),
        ConeGeometry: jest.fn(),
        TorusGeometry: jest.fn(),
        PlaneGeometry: jest.fn(),
        MeshLambertMaterial: jest.fn(() => ({
            emissive: { setHex: jest.fn() },
            clone: jest.fn(() => ({ emissive: { setHex: jest.fn() } })),
        })),
        MeshPhongMaterial: jest.fn(() => ({
             color: { set: jest.fn() }
        })),
        AmbientLight: jest.fn(),
        DirectionalLight: jest.fn(() => ({
            position: { set: jest.fn(() => ({ normalize: jest.fn() })) },
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
        Vector3: jest.fn(),
        Clock: jest.fn(() => ({ getDelta: jest.fn() })),
        PCFSoftShadowMap: 'PCFSoftShadowMap',
        DoubleSide: 'DoubleSide',
        TOUCH: { ROTATE: 1, DOLLY_PAN: 2 },
    };
});

// Mock dat.gui
jest.mock('dat.gui', () => ({
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
        touches: {},
        target: { clone: jest.fn(() => ({ copy: jest.fn() })), copy: jest.fn() }
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

// Mock TeapotGeometry
jest.mock('three/examples/jsm/geometries/TeapotGeometry.js', () => ({
    TeapotGeometry: jest.fn()
}), { virtual: true });

// Mock FontLoader
jest.mock('three/examples/jsm/loaders/FontLoader.js', () => ({
    FontLoader: jest.fn(() => ({
        load: jest.fn()
    }))
}), { virtual: true });

// Mock TextGeometry
jest.mock('three/examples/jsm/geometries/TextGeometry.js', () => ({
    TextGeometry: jest.fn()
}), { virtual: true });

// Mock cannon-es
jest.mock('cannon-es', () => ({
    World: jest.fn(() => ({
        gravity: { set: jest.fn() },
        addBody: jest.fn(),
        removeBody: jest.fn(),
        step: jest.fn()
    })),
    Body: jest.fn(),
    Box: jest.fn(),
    Sphere: jest.fn(),
    Cylinder: jest.fn(),
    Vec3: jest.fn(),
    Quaternion: jest.fn()
}));

// Mock JSZip
global.JSZip = jest.fn();

describe('Basic App Functionality', () => {
    let dom;

    beforeEach(() => {
        // Setup DOM
        dom = new JSDOM('<!DOCTYPE html><html><body><div id="scene-graph"></div><button id="fullscreen"></button><button id="save-scene"></button><button id="load-scene"></button><input type="file" id="file-input"></body></html>');
        global.document = dom.window.document;
        global.window = dom.window;
        global.requestAnimationFrame = jest.fn();
        global.URL = { createObjectURL: jest.fn(), revokeObjectURL: jest.fn() };
        global.Worker = jest.fn(() => ({
            postMessage: jest.fn(),
            addEventListener: jest.fn()
        }));

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
                setAttribute: jest.fn(),
                id: ''
            };

            // Add style.cssText property
            Object.defineProperty(element.style, 'cssText', {
                set: jest.fn(),
                get: jest.fn(),
            });

            return element;
        });
        
        // Mock getElementById
        const originalGetElementById = document.getElementById.bind(document);
        document.getElementById = jest.fn((id) => {
             if (['save-scene', 'load-scene', 'file-input', 'scene-graph'].includes(id)) {
                 return {
                     addEventListener: jest.fn(),
                     style: {},
                     appendChild: jest.fn()
                 };
             }
             return originalGetElementById(id);
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
});
