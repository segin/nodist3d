
import { JSDOM } from 'jsdom';
import { App } from '../src/frontend/main.js';

// Mock PrimitiveFactory to avoid three/examples issues with loaders
jest.mock('../src/frontend/PrimitiveFactory.js', () => {
    return {
        PrimitiveFactory: jest.fn().mockImplementation(() => ({
            createPrimitive: jest.fn(),
        }))
    };
});

// Mock THREE.js
jest.mock('three', () => {
    let uuidCounter = 0;
    const mockMesh = () => ({
        uuid: `uuid-${uuidCounter++}`,
        position: { x: 0, y: 0, z: 0, copy: jest.fn(), clone: jest.fn(() => ({ x: 0, y: 0, z: 0 })) },
        rotation: { x: 0, y: 0, z: 0, copy: jest.fn(), clone: jest.fn(() => ({ x: 0, y: 0, z: 0 })) },
        scale: { x: 1, y: 1, z: 1, copy: jest.fn(), clone: jest.fn(() => ({ x: 1, y: 1, z: 1 })) },
        material: {
            color: { getHex: jest.fn(() => 0xffffff), setHex: jest.fn(), copy: jest.fn(), set: jest.fn(), clone: jest.fn(() => ({ getHex: jest.fn() })) },
            emissive: { getHex: jest.fn(() => 0x000000), setHex: jest.fn(), copy: jest.fn(), set: jest.fn(), clone: jest.fn(() => ({ getHex: jest.fn(() => 0x000000), setHex: jest.fn(), copy: jest.fn() })) },
            clone: jest.fn(() => ({
                color: { getHex: jest.fn(), clone: jest.fn() },
                emissive: { setHex: jest.fn(), copy: jest.fn(), clone: jest.fn() }
            })),
            dispose: jest.fn()
        },
        geometry: {
            type: 'BoxGeometry',
            dispose: jest.fn(),
            clone: jest.fn(() => ({
                type: 'BoxGeometry',
                dispose: jest.fn(),
                parameters: { width: 1, height: 1, depth: 1 }
            })),
            parameters: { width: 1, height: 1, depth: 1 }
        },
        userData: {},
        visible: true,
        castShadow: false,
        receiveShadow: false
    });

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
            updateProjectionMatrix: jest.fn(),
            clone: jest.fn()
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
                getBoundingClientRect: jest.fn(() => ({ left: 0, top: 0, width: 800, height: 600 })),
                clientWidth: 800,
                clientHeight: 600
            }
        })),
        Mesh: jest.fn(() => mockMesh()),
        BoxGeometry: jest.fn(() => ({ type: 'BoxGeometry', parameters: { width: 1, height: 1, depth: 1 } })),
        SphereGeometry: jest.fn(() => ({ type: 'SphereGeometry', parameters: { radius: 1 } })),
        CylinderGeometry: jest.fn(() => ({ type: 'CylinderGeometry', parameters: { radiusTop: 1 } })),
        ConeGeometry: jest.fn(() => ({ type: 'ConeGeometry', parameters: { radius: 1 } })),
        TorusGeometry: jest.fn(() => ({ type: 'TorusGeometry', parameters: { radius: 1 } })),
        PlaneGeometry: jest.fn(() => ({ type: 'PlaneGeometry', parameters: { width: 1 } })),
        TetrahedronGeometry: jest.fn(() => ({ type: 'TetrahedronGeometry', parameters: {} })),
        IcosahedronGeometry: jest.fn(() => ({ type: 'IcosahedronGeometry', parameters: {} })),
        DodecahedronGeometry: jest.fn(() => ({ type: 'DodecahedronGeometry', parameters: {} })),
        OctahedronGeometry: jest.fn(() => ({ type: 'OctahedronGeometry', parameters: {} })),
        TubeGeometry: jest.fn(() => ({ type: 'TubeGeometry', parameters: {} })),
        TorusKnotGeometry: jest.fn(() => ({ type: 'TorusKnotGeometry', parameters: {} })),
        CatmullRomCurve3: jest.fn(),
        MeshLambertMaterial: jest.fn(() => ({
            color: { getHex: jest.fn(() => 0xffffff), setHex: jest.fn(), clone: jest.fn() },
            emissive: { setHex: jest.fn(), copy: jest.fn(), clone: jest.fn() },
            dispose: jest.fn(),
            clone: jest.fn()
        })),
        AmbientLight: jest.fn(),
        DirectionalLight: jest.fn(() => ({
            position: { set: jest.fn() },
            castShadow: false,
            shadow: { mapSize: { width: 0, height: 0 } }
        })),
        GridHelper: jest.fn(),
        AxesHelper: jest.fn(),
        Group: jest.fn(() => ({
            add: jest.fn(),
            remove: jest.fn(),
            children: [],
            visible: true,
            position: { x: 0, y: 0, z: 0, copy: jest.fn(), clone: jest.fn() },
            rotation: { x: 0, y: 0, z: 0, copy: jest.fn(), clone: jest.fn() },
            scale: { x: 1, y: 1, z: 1, copy: jest.fn(), clone: jest.fn() },
            uuid: `group-uuid-${uuidCounter++}`
        })),
        Raycaster: jest.fn(() => ({
            setFromCamera: jest.fn(),
            intersectObjects: jest.fn(() => [])
        })),
        Vector2: jest.fn(),
        Vector3: jest.fn(),
        PCFSoftShadowMap: 'PCFSoftShadowMap',
        DoubleSide: 'DoubleSide',
        TOUCH: { ROTATE: 0, DOLLY_PAN: 1 }
    };
});

// Mock dat.gui
jest.mock('dat.gui', () => ({
    GUI: jest.fn(() => ({
        addFolder: jest.fn(() => ({
            add: jest.fn(() => ({
                name: jest.fn(() => ({ onChange: jest.fn() })),
                onChange: jest.fn()
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
    __esModule: true,
    OrbitControls: jest.fn(() => ({
        enableDamping: true,
        dampingFactor: 0.05,
        enabled: true,
        update: jest.fn(),
        touches: {},
        target: { clone: jest.fn(), copy: jest.fn() }
    }))
}));

// Mock TransformControls
jest.mock('three/examples/jsm/controls/TransformControls.js', () => ({
    __esModule: true,
    TransformControls: jest.fn(() => ({
        addEventListener: jest.fn(),
        setMode: jest.fn(),
        attach: jest.fn(),
        detach: jest.fn(),
        dragging: false
    }))
}));

describe('Performance Benchmark: restoreState', () => {
    let dom;
    let app;

    beforeEach(() => {
        // Setup DOM
        dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
        global.document = dom.window.document;
        global.window = dom.window;
        global.requestAnimationFrame = jest.fn();
        global.navigator = { userAgent: 'node', maxTouchPoints: 0 };
        delete global.window.ontouchstart;

        jest.spyOn(document.body, 'appendChild').mockImplementation();
        jest.spyOn(window, 'addEventListener').mockImplementation();

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
                id: ''
            };
            Object.defineProperty(element.style, 'cssText', { set: jest.fn(), get: jest.fn() });
            return element;
        });

        jest.clearAllMocks();

        // Create app instance
        app = new App();
    });

    afterEach(() => {
        if (dom) dom.window.close();
    });

    test('Benchmark: restoreState with 200 objects', () => {
        // 1. Populate scene
        const saveStateSpy = jest.spyOn(app, 'saveState').mockImplementation(() => {});
        const updateSceneGraphSpy = jest.spyOn(app, 'updateSceneGraph').mockImplementation(() => {});
        const objectCount = 200;
        for (let i = 0; i < objectCount; i++) {
            app.addBox();
        }
        saveStateSpy.mockRestore();
        updateSceneGraphSpy.mockRestore();

        // 2. Save State (Baseline)
        app.saveState('Baseline');

        // 3. Modify Scene
        if (app.objects.length > 0) {
            app.objects[0].position.x += 1;
        }

        // 4. Save State again (Action)
        app.saveState('Action');

        // 5. Benchmark Undo
        const updateSceneGraphSpy2 = jest.spyOn(app, 'updateSceneGraph').mockImplementation(() => {});
        const start = performance.now();

        app.undo();

        const end = performance.now();
        updateSceneGraphSpy2.mockRestore();
        const duration = end - start;

        console.log(`[Benchmark] restoreState with ${objectCount} objects took: ${duration.toFixed(3)}ms`);

        expect(app.objects.length).toBe(objectCount);
    });
});
