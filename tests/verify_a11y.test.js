/**
 * Verification test for Accessibility
 */
import { JSDOM } from 'jsdom';

// Mock THREE.js
jest.mock('three', () => {
    const mockElement = { createElement: jest.fn(() => ({ tagName: 'CANVAS' })) };

    const mockMesh = {
        position: { x: 0, y: 0, z: 0, copy: jest.fn(), clone: jest.fn(() => ({ copy: jest.fn() })) },
        rotation: { x: 0, y: 0, z: 0, copy: jest.fn(), clone: jest.fn(() => ({ copy: jest.fn() })) },
        scale: { x: 1, y: 1, z: 1, copy: jest.fn(), clone: jest.fn(() => ({ copy: jest.fn() })) },
        material: {
            emissive: { setHex: jest.fn(), clone: jest.fn() },
            color: { clone: jest.fn(() => ({ getHex: jest.fn() })), getHex: jest.fn() },
            clone: jest.fn(() => ({ emissive: { setHex: jest.fn(), clone: jest.fn() }, color: { clone: jest.fn(), getHex: jest.fn() } }))
        },
        geometry: {
            type: 'BoxGeometry',
            clone: jest.fn(),
            dispose: jest.fn()
        },
        castShadow: false,
        receiveShadow: false,
        visible: true,
        userData: {}
    };

    return {
        Scene: jest.fn(() => ({
            add: jest.fn(),
            remove: jest.fn(),
            traverse: jest.fn()
        })),
        PerspectiveCamera: jest.fn(() => ({
            position: {
                set: jest.fn(),
                clone: jest.fn(() => ({ copy: jest.fn() }))
            },
            lookAt: jest.fn(),
            aspect: 1,
            updateProjectionMatrix: jest.fn()
        })),
        WebGLRenderer: jest.fn(() => ({
            setSize: jest.fn(),
            setPixelRatio: jest.fn(),
            render: jest.fn(),
            shadowMap: { enabled: false, type: null },
            get domElement() { return global.document.createElement('canvas'); }
        })),
        Mesh: jest.fn(() => mockMesh),
        BoxGeometry: jest.fn(() => ({ type: 'BoxGeometry', parameters: {} })),
        SphereGeometry: jest.fn(() => ({ type: 'SphereGeometry', parameters: {} })),
        CylinderGeometry: jest.fn(() => ({ type: 'CylinderGeometry', parameters: {} })),
        ConeGeometry: jest.fn(() => ({ type: 'ConeGeometry', parameters: {} })),
        TorusGeometry: jest.fn(() => ({ type: 'TorusGeometry', parameters: {} })),
        PlaneGeometry: jest.fn(() => ({ type: 'PlaneGeometry', parameters: {} })),
        MeshLambertMaterial: jest.fn(() => ({
            emissive: { setHex: jest.fn(), copy: jest.fn() },
            clone: jest.fn(() => ({ emissive: { setHex: jest.fn() } })),
            dispose: jest.fn(),
            color: { getHex: jest.fn(), setHex: jest.fn(), clone: jest.fn() }
        })),
        AmbientLight: jest.fn(),
        DirectionalLight: jest.fn(() => ({
            position: { set: jest.fn() },
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
        Vector3: jest.fn(), // Needed for clone
        PCFSoftShadowMap: 'PCFSoftShadowMap',
        DoubleSide: 'DoubleSide',
        TOUCH: { ROTATE: 0, DOLLY_PAN: 1 }
    };
});

let appInstance;

// Mock dat.gui
jest.mock('dat.gui', () => ({
    GUI: jest.fn(() => ({
        addFolder: jest.fn(() => ({
            add: jest.fn((target, prop) => {
                if (target && target.addBox) {
                    appInstance = target;
                }
                return {
                    name: jest.fn(() => ({ onChange: jest.fn() })),
                    onChange: jest.fn()
                };
            }),
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
}));

// Mock OrbitControls
jest.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
    OrbitControls: jest.fn(() => ({
        enableDamping: true,
        dampingFactor: 0.05,
        enabled: true,
        update: jest.fn(),
        target: {
            clone: jest.fn(() => ({ copy: jest.fn() })),
            copy: jest.fn()
        }
    }))
}));

// Mock TransformControls
jest.mock('three/examples/jsm/controls/TransformControls.js', () => ({
    TransformControls: jest.fn(() => ({
        addEventListener: jest.fn(),
        setMode: jest.fn(),
        attach: jest.fn(),
        detach: jest.fn(),
        dragging: false
    }))
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

describe('Accessibility Verification', () => {
    let dom;

    beforeEach(() => {
        // Setup JSDOM with real DOM behavior
        dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
        global.document = dom.window.document;
        global.window = dom.window;
        global.navigator = dom.window.navigator;
        global.requestAnimationFrame = jest.fn();
        global.HTMLElement = dom.window.HTMLElement; // Important for instanceof checks

        // We do NOT mock document.createElement or appendChild
        // because we want to inspect the real DOM nodes created by main.js

        jest.spyOn(window, 'addEventListener').mockImplementation();

        appInstance = null;
        jest.clearAllMocks();
    });

    afterEach(() => {
        if (dom) {
            dom.window.close();
        }
    });

    it('should create scene graph buttons with accessibility attributes', () => {
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
        domContentLoadedCallbacks.forEach(callback => callback());

        expect(appInstance).toBeDefined();

        // Add a box to populate scene graph
        appInstance.addBox();

        // Find the scene graph panel
        const panel = document.getElementById('scene-graph-panel');
        expect(panel).not.toBeNull();

        // Find the list items
        const listItems = panel.querySelectorAll('li');
        // There should be 1 item (the box)
        // Note: The "No objects in scene" item should be gone or replaced.
        // wait, addBox pushes to this.objects and calls updateSceneGraph.

        // In our mock, THREE.Mesh returns a mock object.
        // The App logic pushes this mock object to this.objects.

        expect(listItems.length).toBeGreaterThan(0);

        const firstItem = listItems[0];

        // Check for buttons inside
        const buttons = firstItem.querySelectorAll('button');
        expect(buttons.length).toBe(2); // Visibility and Delete

        const visibilityBtn = buttons[0];
        const deleteBtn = buttons[1];

        // Assert Accessibility Attributes (Expect failure initially)
        expect(visibilityBtn.getAttribute('aria-label')).toBeTruthy();
        expect(visibilityBtn.getAttribute('title')).toBeTruthy();

        expect(deleteBtn.getAttribute('aria-label')).toBeTruthy();
        expect(deleteBtn.getAttribute('title')).toBeTruthy();
    });
});
