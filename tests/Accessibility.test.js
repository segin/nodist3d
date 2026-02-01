/**
 * Accessibility tests for Scene Graph
 */
import { JSDOM } from 'jsdom';

// Mock THREE.js
jest.mock('three', () => {
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
            position: { set: jest.fn() },
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
        BoxGeometry: jest.fn(() => ({ parameters: {}, type: 'BoxGeometry', dispose: jest.fn() })),
        SphereGeometry: jest.fn(),
        CylinderGeometry: jest.fn(),
        ConeGeometry: jest.fn(),
        TorusGeometry: jest.fn(),
        PlaneGeometry: jest.fn(),
        MeshLambertMaterial: jest.fn(() => ({
            emissive: { setHex: jest.fn(), copy: jest.fn() },
            color: { setHex: jest.fn(), clone: jest.fn() },
            clone: jest.fn(() => ({ emissive: { setHex: jest.fn() }, color: { clone: jest.fn() } }))
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
        touches: {}
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

describe('Scene Graph Accessibility', () => {
    let dom;
    let app;
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
                textContent: '',
                innerHTML: '',
                onclick: null,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
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

            // Add style.cssText property
            Object.defineProperty(element.style, 'cssText', {
                set: jest.fn(),
                get: jest.fn()
            });

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
    });

    afterEach(() => {
        if (dom) {
            dom.window.close();
        }
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
    });
});
