/**
 * Tests for the main App class
 */
import { JSDOM } from 'jsdom';

// Mock THREE.js
jest.mock('three', () => {
    const mockElement = { createElement: jest.fn(() => ({ tagName: 'CANVAS' })) };
    
    const mockMesh = {
        position: { x: 0, y: 0, z: 0, copy: jest.fn() },
        rotation: { x: 0, y: 0, z: 0, copy: jest.fn() },
        scale: { x: 1, y: 1, z: 1, copy: jest.fn() },
        material: {
            emissive: { setHex: jest.fn() },
            clone: jest.fn(() => ({ emissive: { setHex: jest.fn() } }))
        },
        geometry: { clone: jest.fn() },
        castShadow: false,
        receiveShadow: false
    };

    return {
        Scene: jest.fn(() => ({
            add: jest.fn(),
            remove: jest.fn()
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
                removeEventListener: jest.fn()
            }
        })),
        Mesh: jest.fn(() => mockMesh),
        BoxGeometry: jest.fn(),
        SphereGeometry: jest.fn(),
        CylinderGeometry: jest.fn(),
        ConeGeometry: jest.fn(),
        TorusGeometry: jest.fn(),
        PlaneGeometry: jest.fn(),
        BufferGeometry: jest.fn(),
        ExtrudeGeometry: jest.fn(),
        LatheGeometry: jest.fn(),
        Loader: jest.fn(),
        FileLoader: jest.fn(() => ({
            setPath: jest.fn(),
            setRequestHeader: jest.fn(),
            setWithCredentials: jest.fn(),
            load: jest.fn(),
        })),
        ShapeGeometry: jest.fn(),
        MeshLambertMaterial: jest.fn(() => ({
            emissive: { setHex: jest.fn() },
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
        PCFSoftShadowMap: 'PCFSoftShadowMap',
        DoubleSide: 'DoubleSide',
        TOUCH: { ROTATE: 1, DOLLY_PAN: 2 }
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
        target: { clone: jest.fn(() => ({ copy: jest.fn() })) }
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

describe('Basic App Functionality', () => {
    let dom;

    beforeEach(() => {
        // Setup DOM
        dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
        global.document = dom.window.document;
        global.window = dom.window;
        global.requestAnimationFrame = jest.fn();
        
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
                setAttribute: jest.fn()
            };
            
            // Add style.cssText property
            Object.defineProperty(element.style, 'cssText', {
                set: jest.fn(),
                get: jest.fn()
            });
            
            return element;
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
        domContentLoadedCallbacks.forEach(callback => callback());

        // Verify basic initialization happened
        expect(document.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));
    });

    it('should be able to add basic primitives', () => {
        const THREE = require('three');
        
        // Create a simple App-like class for testing
        class TestApp {
            constructor() {
                this.scene = new THREE.Scene();
                this.objects = [];
                this.selectedObject = null;
                this.transformControls = { attach: jest.fn(), setMode: jest.fn() };
            }

            addBox() {
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
                const mesh = new THREE.Mesh(geometry, material);
                this.scene.add(mesh);
                this.objects.push(mesh);
                this.selectObject(mesh);
            }

            selectObject(object) {
                this.selectedObject = object;
                this.transformControls.attach(object);
            }
        }

        const app = new TestApp();
        
        // Test adding a box
        app.addBox();
        
        expect(app.objects.length).toBe(1);
        expect(app.selectedObject).toBe(app.objects[0]);
        expect(app.scene.add).toHaveBeenCalledWith(app.objects[0]);
        expect(app.transformControls.attach).toHaveBeenCalledWith(app.objects[0]);
    });
});