<<<<<<< HEAD

=======
/**
 * Accessibility tests for Scene Graph
 */
>>>>>>> master
import { JSDOM } from 'jsdom';

// Mock THREE.js
jest.mock('three', () => {
<<<<<<< HEAD
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
=======
    const mockMesh = {
        position: { x: 0, y: 0, z: 0, copy: jest.fn(), clone: jest.fn(() => ({ x: 0, y: 0, z: 0 })) },
        rotation: { x: 0, y: 0, z: 0, copy: jest.fn(), clone: jest.fn(() => ({ x: 0, y: 0, z: 0 })) },
        scale: { x: 1, y: 1, z: 1, copy: jest.fn(), clone: jest.fn(() => ({ x: 0, y: 0, z: 0 })) },
        material: {
            color: { clone: jest.fn() },
            emissive: { setHex: jest.fn(), clone: jest.fn() },
            clone: jest.fn(() => ({ emissive: { setHex: jest.fn() }, color: { clone: jest.fn() } }))
        },
        geometry: { type: 'BoxGeometry', clone: jest.fn(), dispose: jest.fn() },
        castShadow: false,
        receiveShadow: false,
>>>>>>> master
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
<<<<<<< HEAD
            position: { set: jest.fn(), clone: jest.fn() },
=======
            position: { set: jest.fn() },
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
                getBoundingClientRect: jest.fn(() => ({ left: 0, top: 0, width: 100, height: 100 }))
            }
        })),
        Mesh: jest.fn(() => mockMesh),
<<<<<<< HEAD
        BoxGeometry: jest.fn(),
=======
        BoxGeometry: jest.fn(() => ({ parameters: {}, type: 'BoxGeometry', dispose: jest.fn() })),
>>>>>>> master
        SphereGeometry: jest.fn(),
        CylinderGeometry: jest.fn(),
        ConeGeometry: jest.fn(),
        TorusGeometry: jest.fn(),
        PlaneGeometry: jest.fn(),
<<<<<<< HEAD
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
=======
        MeshLambertMaterial: jest.fn(() => ({
            emissive: { setHex: jest.fn(), copy: jest.fn() },
            color: { setHex: jest.fn(), clone: jest.fn() },
            clone: jest.fn(() => ({ emissive: { setHex: jest.fn() }, color: { clone: jest.fn() } }))
>>>>>>> master
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
<<<<<<< HEAD
        FrontSide: 'FrontSide',
        TOUCH: {
            ROTATE: 1,
            DOLLY_PAN: 2
        }
=======
        TOUCH: { ROTATE: 1, DOLLY_PAN: 2 },
        CatmullRomCurve3: jest.fn(),
        TubeGeometry: jest.fn(),
        Group: jest.fn(() => ({
            add: jest.fn(),
            position: { set: jest.fn() },
            rotation: { z: 0, y: 0 }
        })),
        TorusKnotGeometry: jest.fn(),
        TetrahedronGeometry: jest.fn(),
        IcosahedronGeometry: jest.fn(),
        DodecahedronGeometry: jest.fn(),
        OctahedronGeometry: jest.fn()
>>>>>>> master
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
<<<<<<< HEAD
                close: jest.fn(),
                remove: jest.fn(),
                removeFolder: jest.fn(),
                __controllers: [],
                __folders: []
=======
                close: jest.fn()
>>>>>>> master
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
<<<<<<< HEAD
        target: {
            clone: jest.fn(() => ({ copy: jest.fn() })),
            copy: jest.fn()
        }
=======
        touches: {}
>>>>>>> master
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
<<<<<<< HEAD
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

=======
jest.mock('../src/frontend/SceneStorage.js', () => ({
    SceneStorage: jest.fn()
}));
jest.mock('../src/frontend/utils/ServiceContainer.js', () => ({
    ServiceContainer: jest.fn(() => ({
        register: jest.fn(),
        get: jest.fn()
    }))
}));
jest.mock('../src/frontend/StateManager.js', () => ({
    StateManager: jest.fn(() => ({
        subscribe: jest.fn(),
        setState: jest.fn(),
        getState: jest.fn()
    }))
}));
jest.mock('../src/frontend/EventBus.js', () => ({
    subscribe: jest.fn(),
    publish: jest.fn()
}));
jest.mock('../src/frontend/ObjectManager.js', () => ({
    ObjectManager: jest.fn(() => ({
        selectObject: jest.fn(),
        deselectObject: jest.fn()
    }))
}));
jest.mock('../src/frontend/SceneManager.js', () => ({
    SceneManager: jest.fn()
}));
jest.mock('../src/frontend/InputManager.js', () => ({
    InputManager: jest.fn()
}));
jest.mock('../src/frontend/PhysicsManager.js', () => ({
    PhysicsManager: jest.fn()
}));
jest.mock('../src/frontend/PrimitiveFactory.js', () => ({
    PrimitiveFactory: jest.fn()
}));
jest.mock('../src/frontend/ObjectFactory.js', () => ({
    ObjectFactory: jest.fn()
}));
jest.mock('../src/frontend/ObjectPropertyUpdater.js', () => ({
    ObjectPropertyUpdater: jest.fn()
}));

// Import App after mocks
const { App } = require('../src/frontend/main.js');
>>>>>>> master

describe('Scene Graph Accessibility', () => {
    let dom;
    let app;
<<<<<<< HEAD
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
=======
    let elementIdCounter = 0;

    beforeEach(() => {
        elementIdCounter = 0;
        // Setup DOM
        dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
        global.document = dom.window.document;
        global.window = dom.window;
        global.navigator = dom.window.navigator;
        global.requestAnimationFrame = jest.fn();

        // Mock document.body.appendChild
        jest.spyOn(document.body, 'appendChild').mockImplementation((node) => {
            // We need to keep track of appended children for querying
            if (!document.body._children) document.body._children = [];
            document.body._children.push(node);
        });

        // Mock document.createElement to return proper elements with setAttribute support
        jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
            const id = ++elementIdCounter;
            const element = {
                _id: id,
                tagName: tagName.toUpperCase(),
                style: {},
                attributes: {},
                children: [],
>>>>>>> master
                textContent: '',
                innerHTML: '',
                onclick: null,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
<<<<<<< HEAD
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

=======
                classList: {
                    add: jest.fn()
                }
            };

            element.appendChild = jest.fn((child) => {
                element.children.push(child);
            });

            element.setAttribute = jest.fn((name, value) => {
                element.attributes[name] = String(value);
            });

            element.getAttribute = jest.fn((name) => {
                return element.attributes[name];
            });

>>>>>>> master
            // Add style.cssText property
            Object.defineProperty(element.style, 'cssText', {
                set: jest.fn(),
                get: jest.fn()
            });

<<<<<<< HEAD
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
=======
            // Handle innerHTML clearing children
            Object.defineProperty(element, 'innerHTML', {
                set: jest.fn((val) => {
                    if (val === '') {
                        element.children = [];
                    }
                }),
                get: jest.fn(() => '')
            });

            return element;
        });

        // Clear mocks
        jest.clearAllMocks();

        // Instantiate App
        app = new App();
>>>>>>> master
    });

    afterEach(() => {
        if (dom) {
            dom.window.close();
        }
<<<<<<< HEAD
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
        expect(listItem.setAttribute).toHaveBeenCalledWith('role', 'button');
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
        // Since we can't see property assignments easily on the return value of results unless we spy on textContent setter (which we didn't),
        // we might rely on the order or spy on setAttribute calls directly.

        // A better way is to see which setAttribute calls happened on which objects.

        // Let's filter the created elements that received aria-label
        const ariaLabelElements = createdButtons.filter(btn =>
            btn.setAttribute.mock.calls.some(call => call[0] === 'aria-label')
        );

        // We expect at least 2 buttons (visibility and delete)
        expect(ariaLabelElements.length).toBeGreaterThanOrEqual(2);

        const visibilityBtn = ariaLabelElements.find(btn =>
            btn.setAttribute.mock.calls.some(call => call[1].includes('Toggle visibility'))
        );

        const deleteBtn = ariaLabelElements.find(btn =>
            btn.setAttribute.mock.calls.some(call => call[1].includes('Delete'))
        );

        expect(visibilityBtn).toBeDefined();
        // Object is visible, so title should be 'Hide object'
        expect(visibilityBtn.setAttribute).toHaveBeenCalledWith('title', 'Hide object');

        expect(deleteBtn).toBeDefined();
        expect(deleteBtn.setAttribute).toHaveBeenCalledWith('title', expect.stringContaining('Delete object'));
=======
    });

    it('should have role="listbox" on the objects list', () => {
        expect(app.objectsList.getAttribute('role')).toBe('listbox');
    });

    it('should have accessibility attributes on list items and buttons', () => {
        // Add a mock object to the app
        const mockObject = {
            name: 'TestBox',
            geometry: { type: 'BoxGeometry' },
            position: { x: 0, y: 0, z: 0, toFixed: (n) => '0.00' },
            visible: true,
            uuid: 'test-uuid-1'
        };
        app.objects.push(mockObject);

        // Trigger update
        app.updateSceneGraph();

        // Check list item
        const listItem = app.objectsList.children[0];
        expect(listItem.getAttribute('role')).toBe('option');
        expect(listItem.getAttribute('tabindex')).toBe('0');
        expect(listItem.getAttribute('aria-selected')).toBe('false');

        // Check keyboard listener
        expect(listItem.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));

        // Check visibility button
        const objectInfo = listItem.children[0];
        const buttonContainer = objectInfo.children[2]; // name, type, container
        const visibilityBtn = buttonContainer.children[0];
        const deleteBtn = buttonContainer.children[1];

        expect(visibilityBtn.getAttribute('aria-label')).toBe('Hide object');
        expect(visibilityBtn.getAttribute('title')).toBe('Hide object');

        expect(deleteBtn.getAttribute('aria-label')).toBe('Delete object');
        expect(deleteBtn.getAttribute('title')).toBe('Delete object');
    });

    it('should update aria-label when visibility changes', () => {
        const mockObject = {
            name: 'TestBox',
            geometry: { type: 'BoxGeometry' },
            position: { x: 0, y: 0, z: 0, toFixed: (n) => '0.00' },
            visible: false, // Initially hidden
            uuid: 'test-uuid-2'
        };
        app.objects.push(mockObject);

        app.updateSceneGraph();

        const listItem = app.objectsList.children[0];
        const objectInfo = listItem.children[0];
        const buttonContainer = objectInfo.children[2];
        const visibilityBtn = buttonContainer.children[0];

        expect(visibilityBtn.getAttribute('aria-label')).toBe('Show object');
        expect(visibilityBtn.getAttribute('title')).toBe('Show object');
    });

    it('should update aria-selected when object is selected', () => {
         const mockObject = {
            name: 'TestBox',
            geometry: { type: 'BoxGeometry' },
            position: { x: 0, y: 0, z: 0, toFixed: (n) => '0.00' },
            visible: true,
            uuid: 'test-uuid-3',
            material: { emissive: { setHex: jest.fn() } }
        };
        app.objects.push(mockObject);
        app.selectedObject = mockObject;

        app.updateSceneGraph();

        const listItem = app.objectsList.children[0];
        expect(listItem.getAttribute('aria-selected')).toBe('true');
>>>>>>> master
    });
});
