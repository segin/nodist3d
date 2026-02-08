
import { JSDOM } from 'jsdom';

// Mock THREE.js
jest.mock('three', () => {
    const mockElement = { createElement: jest.fn(() => ({ tagName: 'CANVAS' })) };

    const mockMesh = {
        position: { x: 0, y: 0, z: 0, copy: jest.fn(), toFixed: jest.fn(() => "0.00") },
        rotation: { x: 0, y: 0, z: 0, copy: jest.fn() },
        scale: { x: 1, y: 1, z: 1, copy: jest.fn() },
        material: {
            emissive: { setHex: jest.fn(), clone: jest.fn() },
            color: { getHex: jest.fn(), setHex: jest.fn(), clone: jest.fn() },
            clone: jest.fn(() => ({
                emissive: { setHex: jest.fn(), copy: jest.fn() },
                color: { clone: jest.fn() },
                dispose: jest.fn()
            })),
            dispose: jest.fn()
        },
        geometry: {
            type: 'BoxGeometry',
            clone: jest.fn(),
            dispose: jest.fn(),
            parameters: {}
        },
        castShadow: false,
        receiveShadow: false,
        name: 'Box_1',
        visible: true,
        uuid: 'test-uuid',
        userData: {}
    };

    return {
        Scene: jest.fn(() => ({
            add: jest.fn(),
            remove: jest.fn(),
            traverse: jest.fn()
        })),
        PerspectiveCamera: jest.fn(() => ({
            position: { set: jest.fn(), clone: jest.fn() },
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
                getBoundingClientRect: jest.fn(() => ({ left: 0, top: 0, width: 100, height: 100 }))
            }
        })),
        Mesh: jest.fn(() => mockMesh),
        BoxGeometry: jest.fn(),
        SphereGeometry: jest.fn(),
        CylinderGeometry: jest.fn(),
        ConeGeometry: jest.fn(),
        TorusGeometry: jest.fn(),
        PlaneGeometry: jest.fn(),
        TetrahedronGeometry: jest.fn(),
        IcosahedronGeometry: jest.fn(),
        DodecahedronGeometry: jest.fn(),
        OctahedronGeometry: jest.fn(),
        TubeGeometry: jest.fn(),
        TorusKnotGeometry: jest.fn(),
        CatmullRomCurve3: jest.fn(),
        Group: jest.fn(() => ({
            add: jest.fn(),
            name: '',
            children: [],
            position: { set: jest.fn() },
            rotation: { y: 0 },
            scale: { set: jest.fn() }
        })),
        MeshLambertMaterial: jest.fn(() => ({
            emissive: { setHex: jest.fn() },
            color: { setHex: jest.fn() },
            clone: jest.fn(() => ({ emissive: { setHex: jest.fn() } }))
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
        Vector3: jest.fn(),
        PCFSoftShadowMap: 'PCFSoftShadowMap',
        DoubleSide: 'DoubleSide',
        FrontSide: 'FrontSide',
        TOUCH: {
            ROTATE: 1,
            DOLLY_PAN: 2
        }
    };
});

// Mock dat.gui
jest.mock('dat.gui', () => ({
    GUI: jest.fn(() => ({
        addFolder: jest.fn(() => ({
            add: jest.fn(() => ({
                name: jest.fn(() => ({ onChange: jest.fn() })),
                onChange: jest.fn(),
                step: jest.fn(() => ({ name: jest.fn(() => ({ onChange: jest.fn() })) }))
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
                close: jest.fn(),
                remove: jest.fn(),
                removeFolder: jest.fn(),
                __controllers: [],
                __folders: []
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

// Mock other dependencies
jest.mock('three/examples/jsm/geometries/TeapotGeometry.js', () => ({
    TeapotGeometry: jest.fn()
}), { virtual: true });

jest.mock('three/examples/jsm/loaders/FontLoader.js', () => ({
    FontLoader: jest.fn(() => ({
        load: jest.fn((path, onLoad) => {
             // Simulate successful load if needed
             if (onLoad) onLoad({});
        })
    }))
}), { virtual: true });

jest.mock('three/examples/jsm/geometries/TextGeometry.js', () => ({
    TextGeometry: jest.fn()
}), { virtual: true });

jest.mock('cannon-es', () => ({
    World: jest.fn(() => ({
        gravity: { set: jest.fn() },
        addBody: jest.fn()
    })),
    Body: jest.fn(),
    Box: jest.fn(),
    Vec3: jest.fn()
}), { virtual: true });

jest.mock('three-csg-ts', () => ({
    CSG: {
        fromMesh: jest.fn(),
        toMesh: jest.fn(),
        union: jest.fn(),
        subtract: jest.fn(),
        intersect: jest.fn()
    }
}), { virtual: true });


describe('Scene Graph Accessibility', () => {
    let dom;
    let app;
    let App;

    beforeEach(() => {
        // Setup DOM
        dom = new JSDOM('<!DOCTYPE html><html><body><div id="ui"></div></body></html>');
        global.document = dom.window.document;
        global.window = dom.window;
        global.requestAnimationFrame = jest.fn();

        // Mock document.createElement to return proper elements with attributes support
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
                attributes: {},
                setAttribute: jest.fn(function(name, value) {
                    this.attributes[name] = value;
                }),
                getAttribute: jest.fn(function(name) {
                    return this.attributes[name];
                }),
                classList: {
                    add: jest.fn(),
                    remove: jest.fn(),
                    contains: jest.fn()
                },
                // Properties mapped to attributes or internal state
                get tabIndex() { return this.attributes['tabindex']; },
                set tabIndex(val) { this.attributes['tabindex'] = val; },
                get role() { return this.attributes['role']; },
                set role(val) { this.attributes['role'] = val; },
                get id() { return this.attributes['id']; },
                set id(val) { this.attributes['id'] = val; }
            };

            // Add style.cssText property
            Object.defineProperty(element.style, 'cssText', {
                set: jest.fn(),
                get: jest.fn()
            });

            return element;
        });

        // Mock document.getElementById
        jest.spyOn(document, 'getElementById').mockImplementation((id) => {
            return {
                id: id,
                addEventListener: jest.fn(),
                click: jest.fn()
            };
        });

        // Mock document.body.appendChild
        jest.spyOn(document.body, 'appendChild').mockImplementation();

        // Import App
        const mainModule = require('../src/frontend/main.js');
        App = mainModule.App;

        // Initialize App
        app = new App();

        // Clear mocks from constructor calls
        jest.clearAllMocks();
    });

    afterEach(() => {
        if (dom) {
            dom.window.close();
        }
        jest.clearAllMocks();
    });

    test('Scene graph list items should have accessibility attributes', () => {
        // Setup mock objects
        const mockObject = {
            name: 'TestBox',
            geometry: { type: 'BoxGeometry' },
            position: { x: 1, y: 2, z: 3, toFixed: (n) => "0.00" },
            visible: true,
            material: { emissive: { setHex: jest.fn() } },
            uuid: 'obj1'
        };
        app.objects = [mockObject];

        // Call updateSceneGraph
        app.updateSceneGraph();

        // Verify elements were created
        expect(app.objectsList.appendChild).toHaveBeenCalled();

        // Find the list item call (it's called for each object)
        // Since objectsList.appendChild is a mock, we inspect its calls.
        // The calls to appendChild on objectsList:
        // 1. listItem
        const calls = app.objectsList.appendChild.mock.calls;
        const listItem = calls[0][0]; // First call, first argument

        // Verify accessibility attributes on list item
        expect(listItem.setAttribute).toHaveBeenCalledWith('tabindex', '0');
        expect(listItem.setAttribute).toHaveBeenCalledWith('role', 'option');
        expect(listItem.setAttribute).toHaveBeenCalledWith('aria-label', expect.stringContaining('Select TestBox'));

        // Verify keydown listener added
        expect(listItem.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    test('Visibility and Delete buttons should have ARIA labels', () => {
         // Setup mock objects
         const mockObject = {
            name: 'TestSphere',
            geometry: { type: 'SphereGeometry' },
            position: { x: 0, y: 0, z: 0, toFixed: (n) => "0.00" },
            visible: true,
            material: { emissive: { setHex: jest.fn() } },
            uuid: 'obj2'
        };
        app.objects = [mockObject];

        // Call updateSceneGraph
        app.updateSceneGraph();

        // We need to find the buttons inside the listItem.
        // In our mock createElement, appendChild is just a mock function, it doesn't actually build a tree we can traverse easily
        // unless we implemented that logic.
        // However, we can inspect the calls to document.createElement('button') and check their attributes.

        // Get all button creations
        const createdButtons = document.createElement.mock.results
            .filter(r => r.value.tagName === 'BUTTON')
            .map(r => r.value);

        // Filter for visibility and delete buttons based on their likely text content assignment (which happens after creation)
        // Since we can't see property assignments easily on the return value of results unless we spy on setAttribute calls directly.

        // A better way is to see which setAttribute calls happened on which objects.

        // Let's filter the created elements that received aria-label
        const ariaLabelElements = createdButtons.filter(btn =>
            btn.setAttribute.mock.calls.some(call => call[0] === 'aria-label')
        );

        // We expect at least 2 buttons (visibility and delete)
        expect(ariaLabelElements.length).toBeGreaterThanOrEqual(2);

        const visibilityBtn = ariaLabelElements.find(btn =>
            btn.setAttribute.mock.calls.some(call => call[1].includes('Toggle visibility') || call[1].includes('Hide object'))
        );

        const deleteBtn = ariaLabelElements.find(btn =>
            btn.setAttribute.mock.calls.some(call => call[1].includes('Delete'))
        );

        expect(visibilityBtn).toBeDefined();
        // Object is visible, so title should be 'Hide object'
        expect(visibilityBtn.setAttribute).toHaveBeenCalledWith('title', 'Hide object');

        expect(deleteBtn).toBeDefined();
        expect(deleteBtn.setAttribute).toHaveBeenCalledWith('title', expect.stringContaining('Delete object'));
    });
});
