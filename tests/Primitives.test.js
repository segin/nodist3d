/**
 * Tests for all 13 3D Primitives
 */
import { JSDOM } from 'jsdom';

// Mock THREE.js geometries
const mockGeometryFactory = (type, parameters = {}) => ({
  type: type,
  parameters: parameters,
  dispose: jest.fn(),
});

jest.mock('three', () => ({
<<<<<<< HEAD
    Scene: jest.fn(() => ({
        add: jest.fn(),
        remove: jest.fn()
    })),
    PerspectiveCamera: jest.fn(() => ({
        position: { set: jest.fn() },
        lookAt: jest.fn()
    })),
    WebGLRenderer: jest.fn(() => ({
        setSize: jest.fn(),
        setPixelRatio: jest.fn(),
        shadowMap: {},
        domElement: { addEventListener: jest.fn() }
    })),
    Mesh: jest.fn(() => ({
        position: { x: 0, y: 0, z: 0, set: jest.fn() },
        rotation: { x: 0, y: 0, z: 0, set: jest.fn() },
        scale: { x: 1, y: 1, z: 1, set: jest.fn() },
        material: { color: { setHex: jest.fn() }, emissive: { setHex: jest.fn() } },
        name: '',
        castShadow: false,
        receiveShadow: false,
        userData: {}
    })),
    Group: jest.fn(() => ({
        add: jest.fn(),
        name: '',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
    })),
    // Primitive geometries
    BoxGeometry: jest.fn((w, h, d) => mockGeometryFactory('BoxGeometry', { width: w || 1, height: h || 1, depth: d || 1 })),
    SphereGeometry: jest.fn((r, ws, hs) => mockGeometryFactory('SphereGeometry', { radius: r || 0.5, widthSegments: ws || 32, heightSegments: hs || 32 })),
    CylinderGeometry: jest.fn((rt, rb, h, s) => mockGeometryFactory('CylinderGeometry', { radiusTop: rt || 0.5, radiusBottom: rb || 0.5, height: h || 1, radialSegments: s || 32 })),
    ConeGeometry: jest.fn((r, h, s) => mockGeometryFactory('ConeGeometry', { radius: r || 0.5, height: h || 1, radialSegments: s || 32 })),
    TorusGeometry: jest.fn((r, t, rs, ts) => mockGeometryFactory('TorusGeometry', { radius: r || 0.4, tube: t || 0.2, radialSegments: rs || 16, tubularSegments: ts || 100 })),
    TorusKnotGeometry: jest.fn((r, t, ts, rs) => mockGeometryFactory('TorusKnotGeometry', { radius: r || 0.4, tube: t || 0.15, tubularSegments: ts || 100, radialSegments: rs || 16 })),
    TetrahedronGeometry: jest.fn((r) => mockGeometryFactory('TetrahedronGeometry', { radius: r || 0.6 })),
    IcosahedronGeometry: jest.fn((r) => mockGeometryFactory('IcosahedronGeometry', { radius: r || 0.6 })),
    DodecahedronGeometry: jest.fn((r) => mockGeometryFactory('DodecahedronGeometry', { radius: r || 0.6 })),
    OctahedronGeometry: jest.fn((r) => mockGeometryFactory('OctahedronGeometry', { radius: r || 0.6 })),
    PlaneGeometry: jest.fn((w, h) => mockGeometryFactory('PlaneGeometry', { width: w || 2, height: h || 2 })),
    TubeGeometry: jest.fn((curve, ts, r, rs, closed) => mockGeometryFactory('TubeGeometry', { tubularSegments: ts || 20, radius: r || 0.1, radialSegments: rs || 8, closed: closed || false })),
    // Materials
    MeshLambertMaterial: jest.fn(() => ({
        color: { setHex: jest.fn() },
        emissive: { setHex: jest.fn() },
        dispose: jest.fn()
    })),
    MeshPhongMaterial: jest.fn(() => ({
        color: { setHex: jest.fn() },
        emissive: { setHex: jest.fn() },
        dispose: jest.fn()
    })),
    // Curve for tube geometry
    CatmullRomCurve3: jest.fn(() => ({})),
    Vector3: jest.fn((x, y, z) => ({ x: x || 0, y: y || 0, z: z || 0 })),
    // Lights
    AmbientLight: jest.fn(),
    DirectionalLight: jest.fn(() => ({
        position: { set: jest.fn() },
        shadow: { mapSize: {} }
    })),
    // Helpers
    GridHelper: jest.fn(),
    AxesHelper: jest.fn(),
    // Raycaster
    Raycaster: jest.fn(() => ({
        setFromCamera: jest.fn(),
        intersectObjects: jest.fn(() => [])
    })),
    Vector2: jest.fn(),
    // Constants
    DoubleSide: 'DoubleSide'
=======
  Scene: jest.fn(() => ({
    add: jest.fn(),
    remove: jest.fn(),
  })),
  PerspectiveCamera: jest.fn(() => ({
    position: { set: jest.fn() },
    lookAt: jest.fn(),
  })),
  WebGLRenderer: jest.fn(() => ({
    setSize: jest.fn(),
    setPixelRatio: jest.fn(),
    shadowMap: {},
    domElement: { addEventListener: jest.fn() },
  })),
  Mesh: jest.fn(() => ({
    position: { x: 0, y: 0, z: 0, set: jest.fn() },
    rotation: { x: 0, y: 0, z: 0, set: jest.fn() },
    scale: { x: 1, y: 1, z: 1, set: jest.fn() },
    material: { color: { setHex: jest.fn() }, emissive: { setHex: jest.fn() } },
    name: '',
    castShadow: false,
    receiveShadow: false,
    userData: {},
  })),
  Group: jest.fn(() => ({
    add: jest.fn(),
    name: '',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  })),
  // Primitive geometries
  BoxGeometry: jest.fn((w, h, d) =>
    mockGeometryFactory('BoxGeometry', { width: w || 1, height: h || 1, depth: d || 1 }),
  ),
  SphereGeometry: jest.fn((r, ws, hs) =>
    mockGeometryFactory('SphereGeometry', {
      radius: r || 0.5,
      widthSegments: ws || 32,
      heightSegments: hs || 32,
    }),
  ),
  CylinderGeometry: jest.fn((rt, rb, h, s) =>
    mockGeometryFactory('CylinderGeometry', {
      radiusTop: rt || 0.5,
      radiusBottom: rb || 0.5,
      height: h || 1,
      radialSegments: s || 32,
    }),
  ),
  ConeGeometry: jest.fn((r, h, s) =>
    mockGeometryFactory('ConeGeometry', {
      radius: r || 0.5,
      height: h || 1,
      radialSegments: s || 32,
    }),
  ),
  TorusGeometry: jest.fn((r, t, rs, ts) =>
    mockGeometryFactory('TorusGeometry', {
      radius: r || 0.4,
      tube: t || 0.2,
      radialSegments: rs || 16,
      tubularSegments: ts || 100,
    }),
  ),
  TorusKnotGeometry: jest.fn((r, t, ts, rs) =>
    mockGeometryFactory('TorusKnotGeometry', {
      radius: r || 0.4,
      tube: t || 0.15,
      tubularSegments: ts || 100,
      radialSegments: rs || 16,
    }),
  ),
  TetrahedronGeometry: jest.fn((r) =>
    mockGeometryFactory('TetrahedronGeometry', { radius: r || 0.6 }),
  ),
  IcosahedronGeometry: jest.fn((r) =>
    mockGeometryFactory('IcosahedronGeometry', { radius: r || 0.6 }),
  ),
  DodecahedronGeometry: jest.fn((r) =>
    mockGeometryFactory('DodecahedronGeometry', { radius: r || 0.6 }),
  ),
  OctahedronGeometry: jest.fn((r) =>
    mockGeometryFactory('OctahedronGeometry', { radius: r || 0.6 }),
  ),
  PlaneGeometry: jest.fn((w, h) =>
    mockGeometryFactory('PlaneGeometry', { width: w || 2, height: h || 2 }),
  ),
  TubeGeometry: jest.fn((curve, ts, r, rs, closed) =>
    mockGeometryFactory('TubeGeometry', {
      tubularSegments: ts || 20,
      radius: r || 0.1,
      radialSegments: rs || 8,
      closed: closed || false,
    }),
  ),
  // Materials
  MeshLambertMaterial: jest.fn(() => ({
    color: { setHex: jest.fn() },
    emissive: { setHex: jest.fn() },
    dispose: jest.fn(),
  })),
  // Curve for tube geometry
  CatmullRomCurve3: jest.fn(() => ({})),
  Vector3: jest.fn((x, y, z) => ({ x: x || 0, y: y || 0, z: z || 0 })),
  // Lights
  AmbientLight: jest.fn(),
  DirectionalLight: jest.fn(() => ({
    position: { set: jest.fn() },
    shadow: { mapSize: {} },
  })),
  // Helpers
  GridHelper: jest.fn(),
  AxesHelper: jest.fn(),
  // Raycaster
  Raycaster: jest.fn(() => ({
    setFromCamera: jest.fn(),
    intersectObjects: jest.fn(() => []),
  })),
  Vector2: jest.fn(),
  // Constants
  DoubleSide: 'DoubleSide',
>>>>>>> master
}));

// Mock dat.gui
jest.mock('dat.gui', () => ({
  GUI: jest.fn(() => ({
    addFolder: jest.fn(() => ({
      add: jest.fn(() => ({ name: jest.fn(() => ({ onChange: jest.fn() })) })),
      open: jest.fn(),
    })),
  })),
}));

// Mock controls
jest.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
  OrbitControls: jest.fn(() => ({
    enableDamping: true,
    update: jest.fn(),
  })),
}));

jest.mock('three/examples/jsm/controls/TransformControls.js', () => ({
  TransformControls: jest.fn(() => ({
    addEventListener: jest.fn(),
    setMode: jest.fn(),
    attach: jest.fn(),
    detach: jest.fn(),
  })),
}));

describe('3D Primitives Functionality', () => {
  let dom, app;

  beforeEach(() => {
    // Setup DOM
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
    global.requestAnimationFrame = jest.fn();
    global.console.log = jest.fn(); // Suppress console.log

    // Mock document methods
    jest.spyOn(document.body, 'appendChild').mockImplementation();
    jest.spyOn(window, 'addEventListener').mockImplementation();
    jest.spyOn(document, 'createElement').mockImplementation(() => ({
      style: {},
      appendChild: jest.fn(),
      textContent: '',
      innerHTML: '',
      set cssText(value) {},
    }));

    jest.clearAllMocks();

    // Create test app with all primitive methods
    class TestApp {
      constructor() {
        this.objects = [];
        this.selectedObject = null;
        this.scene = { add: jest.fn(), remove: jest.fn() };
        this.objectCount = 0;
      }

<<<<<<< HEAD
            // All 13 primitive methods
            addBox() {
                const THREE = require('three');
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.name = `Box_${this.objects.length + 1}`;
                this.scene.add(mesh);
                this.objects.push(mesh);
                this.selectObject(mesh);
                this.updateSceneGraph();
                this.saveState('Add Box');
                return mesh;
            }

            addSphere() {
                const THREE = require('three');
                const geometry = new THREE.SphereGeometry(0.5, 32, 32);
                const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.name = `Sphere_${this.objects.length + 1}`;
                this.scene.add(mesh);
                this.objects.push(mesh);
                this.selectObject(mesh);
                this.updateSceneGraph();
                this.saveState('Add Sphere');
                return mesh;
            }

            addCylinder() {
                const THREE = require('three');
                const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
                const material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.name = `Cylinder_${this.objects.length + 1}`;
                this.scene.add(mesh);
                this.objects.push(mesh);
                this.selectObject(mesh);
                this.updateSceneGraph();
                this.saveState('Add Cylinder');
                return mesh;
            }

            addCone() {
                const THREE = require('three');
                const geometry = new THREE.ConeGeometry(0.5, 1, 32);
                const material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.name = `Cone_${this.objects.length + 1}`;
                this.scene.add(mesh);
                this.objects.push(mesh);
                this.selectObject(mesh);
                this.updateSceneGraph();
                this.saveState('Add Cone');
                return mesh;
            }

            addTorus() {
                const THREE = require('three');
                const geometry = new THREE.TorusGeometry(0.4, 0.2, 16, 100);
                const material = new THREE.MeshPhongMaterial({ color: 0xff00ff });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.name = `Torus_${this.objects.length + 1}`;
                this.scene.add(mesh);
                this.objects.push(mesh);
                this.selectObject(mesh);
                this.updateSceneGraph();
                this.saveState('Add Torus');
                return mesh;
            }

            addTorusKnot() {
                const THREE = require('three');
                const geometry = new THREE.TorusKnotGeometry(0.4, 0.15, 100, 16);
                const material = new THREE.MeshPhongMaterial({ color: 0x888888 });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.name = `TorusKnot_${this.objects.length + 1}`;
                this.scene.add(mesh);
                this.objects.push(mesh);
                this.selectObject(mesh);
                this.updateSceneGraph();
                this.saveState('Add Torus Knot');
                return mesh;
            }

            addTetrahedron() {
                const THREE = require('three');
                const geometry = new THREE.TetrahedronGeometry(0.6);
                const material = new THREE.MeshPhongMaterial({ color: 0x00aa00 });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.name = `Tetrahedron_${this.objects.length + 1}`;
                this.scene.add(mesh);
                this.objects.push(mesh);
                this.selectObject(mesh);
                this.updateSceneGraph();
                this.saveState('Add Tetrahedron');
                return mesh;
            }

            addIcosahedron() {
                const THREE = require('three');
                const geometry = new THREE.IcosahedronGeometry(0.6);
                const material = new THREE.MeshPhongMaterial({ color: 0xaa0000 });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.name = `Icosahedron_${this.objects.length + 1}`;
                this.scene.add(mesh);
                this.objects.push(mesh);
                this.selectObject(mesh);
                this.updateSceneGraph();
                this.saveState('Add Icosahedron');
                return mesh;
            }

            addDodecahedron() {
                const THREE = require('three');
                const geometry = new THREE.DodecahedronGeometry(0.6);
                const material = new THREE.MeshPhongMaterial({ color: 0x0000aa });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.name = `Dodecahedron_${this.objects.length + 1}`;
                this.scene.add(mesh);
                this.objects.push(mesh);
                this.selectObject(mesh);
                this.updateSceneGraph();
                this.saveState('Add Dodecahedron');
                return mesh;
            }

            addOctahedron() {
                const THREE = require('three');
                const geometry = new THREE.OctahedronGeometry(0.6);
                const material = new THREE.MeshPhongMaterial({ color: 0xaa00aa });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.name = `Octahedron_${this.objects.length + 1}`;
                this.scene.add(mesh);
                this.objects.push(mesh);
                this.selectObject(mesh);
                this.updateSceneGraph();
                this.saveState('Add Octahedron');
                return mesh;
            }

            addPlane() {
                const THREE = require('three');
                const geometry = new THREE.PlaneGeometry(2, 2);
                const material = new THREE.MeshPhongMaterial({ color: 0x00ffff, side: THREE.DoubleSide });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.name = `Plane_${this.objects.length + 1}`;
                this.scene.add(mesh);
                this.objects.push(mesh);
                this.selectObject(mesh);
                this.updateSceneGraph();
                this.saveState('Add Plane');
                return mesh;
            }

            addTube() {
                const THREE = require('three');
                const curve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(-0.5, 0, 0),
                    new THREE.Vector3(0, 0.5, 0),
                    new THREE.Vector3(0.5, 0, 0),
                    new THREE.Vector3(0, -0.5, 0)
                ]);
                const geometry = new THREE.TubeGeometry(curve, 20, 0.1, 8, false);
                const material = new THREE.MeshPhongMaterial({ color: 0xaaaa00 });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.name = `Tube_${this.objects.length + 1}`;
                this.scene.add(mesh);
                this.objects.push(mesh);
                this.selectObject(mesh);
                this.updateSceneGraph();
                this.saveState('Add Tube');
                return mesh;
            }
=======
      selectObject(object) {
        this.selectedObject = object;
      }

      updateSceneGraph() {
        // Mock implementation
      }

      saveState(description) {
        // Mock implementation
      }

      // All 13 primitive methods
      addBox() {
        const THREE = require('three');
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Box_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Box');
        return mesh;
      }

      addSphere() {
        const THREE = require('three');
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Sphere_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Sphere');
        return mesh;
      }

      addCylinder() {
        const THREE = require('three');
        const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        const material = new THREE.MeshLambertMaterial({ color: 0x0000ff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Cylinder_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Cylinder');
        return mesh;
      }

      addCone() {
        const THREE = require('three');
        const geometry = new THREE.ConeGeometry(0.5, 1, 32);
        const material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Cone_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Cone');
        return mesh;
      }

      addTorus() {
        const THREE = require('three');
        const geometry = new THREE.TorusGeometry(0.4, 0.2, 16, 100);
        const material = new THREE.MeshLambertMaterial({ color: 0xff00ff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Torus_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Torus');
        return mesh;
      }

      addTorusKnot() {
        const THREE = require('three');
        const geometry = new THREE.TorusKnotGeometry(0.4, 0.15, 100, 16);
        const material = new THREE.MeshLambertMaterial({ color: 0x888888 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `TorusKnot_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Torus Knot');
        return mesh;
      }

      addTetrahedron() {
        const THREE = require('three');
        const geometry = new THREE.TetrahedronGeometry(0.6);
        const material = new THREE.MeshLambertMaterial({ color: 0x00aa00 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Tetrahedron_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Tetrahedron');
        return mesh;
      }

      addIcosahedron() {
        const THREE = require('three');
        const geometry = new THREE.IcosahedronGeometry(0.6);
        const material = new THREE.MeshLambertMaterial({ color: 0xaa0000 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Icosahedron_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Icosahedron');
        return mesh;
      }

      addDodecahedron() {
        const THREE = require('three');
        const geometry = new THREE.DodecahedronGeometry(0.6);
        const material = new THREE.MeshLambertMaterial({ color: 0x0000aa });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Dodecahedron_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Dodecahedron');
        return mesh;
      }
>>>>>>> master

      addOctahedron() {
        const THREE = require('three');
        const geometry = new THREE.OctahedronGeometry(0.6);
        const material = new THREE.MeshLambertMaterial({ color: 0xaa00aa });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Octahedron_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Octahedron');
        return mesh;
      }

      addPlane() {
        const THREE = require('three');
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ffff, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Plane_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Plane');
        return mesh;
      }

      addTube() {
        const THREE = require('three');
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.5, 0, 0),
          new THREE.Vector3(0, 0.5, 0),
          new THREE.Vector3(0.5, 0, 0),
          new THREE.Vector3(0, -0.5, 0),
        ]);
        const geometry = new THREE.TubeGeometry(curve, 20, 0.1, 8, false);
        const material = new THREE.MeshLambertMaterial({ color: 0xaaaa00 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `Tube_${this.objects.length + 1}`;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneGraph();
        this.saveState('Add Tube');
        return mesh;
      }

      addTeapot() {
        const THREE = require('three');
        const group = new THREE.Group();

        // Main body
        const bodyGeometry = new THREE.SphereGeometry(0.4, 32, 32);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.scale.set(1, 0.8, 1);
        group.add(body);

        // Spout
        const spoutGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.3, 8);
        const spout = new THREE.Mesh(spoutGeometry, bodyMaterial);
        spout.position.set(0.35, 0.1, 0);
        spout.rotation.z = Math.PI / 4;
        group.add(spout);

        // Handle
        const handleGeometry = new THREE.TorusGeometry(0.15, 0.03, 8, 16);
        const handle = new THREE.Mesh(handleGeometry, bodyMaterial);
        handle.position.set(-0.35, 0, 0);
        handle.rotation.y = Math.PI / 2;
        group.add(handle);

        // Lid
        const lidGeometry = new THREE.CylinderGeometry(0.35, 0.4, 0.05, 32);
        const lid = new THREE.Mesh(lidGeometry, bodyMaterial);
        lid.position.set(0, 0.32, 0);
        group.add(lid);

        // Knob
        const knobGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const knob = new THREE.Mesh(knobGeometry, bodyMaterial);
        knob.position.set(0, 0.4, 0);
        group.add(knob);

        group.name = `Teapot_${this.objects.length + 1}`;
        this.scene.add(group);
        this.objects.push(group);
        this.selectObject(group);
        this.updateSceneGraph();
        this.saveState('Add Teapot');
        return group;
      }
    }

    app = new TestApp();
  });

  afterEach(() => {
    if (dom) {
      dom.window.close();
    }
  });

  describe('Basic Primitive Creation', () => {
    const primitives = [
      { name: 'Box', method: 'addBox', expectedGeometry: 'BoxGeometry' },
      { name: 'Sphere', method: 'addSphere', expectedGeometry: 'SphereGeometry' },
      { name: 'Cylinder', method: 'addCylinder', expectedGeometry: 'CylinderGeometry' },
      { name: 'Cone', method: 'addCone', expectedGeometry: 'ConeGeometry' },
      { name: 'Torus', method: 'addTorus', expectedGeometry: 'TorusGeometry' },
      { name: 'TorusKnot', method: 'addTorusKnot', expectedGeometry: 'TorusKnotGeometry' },
      { name: 'Tetrahedron', method: 'addTetrahedron', expectedGeometry: 'TetrahedronGeometry' },
      { name: 'Icosahedron', method: 'addIcosahedron', expectedGeometry: 'IcosahedronGeometry' },
      { name: 'Dodecahedron', method: 'addDodecahedron', expectedGeometry: 'DodecahedronGeometry' },
      { name: 'Octahedron', method: 'addOctahedron', expectedGeometry: 'OctahedronGeometry' },
      { name: 'Plane', method: 'addPlane', expectedGeometry: 'PlaneGeometry' },
      { name: 'Tube', method: 'addTube', expectedGeometry: 'TubeGeometry' },
    ];

    primitives.forEach((primitive) => {
      it(`should create ${primitive.name} with correct properties`, () => {
        const mesh = app[primitive.method]();

        expect(mesh).toBeDefined();
        expect(mesh.name).toContain(primitive.name);
        expect(mesh.castShadow).toBe(true);
        expect(mesh.receiveShadow).toBe(true);
        expect(app.objects).toContain(mesh);
        expect(app.selectedObject).toBe(mesh);
        expect(app.scene.add).toHaveBeenCalledWith(mesh);
      });
    });

    it('should create Teapot as a Group with multiple components', () => {
      const THREE = require('three');
      const teapot = app.addTeapot();

      expect(teapot).toBeDefined();
      expect(teapot.name).toContain('Teapot');
      expect(THREE.Group).toHaveBeenCalled();
      expect(teapot.add).toHaveBeenCalledTimes(5); // body, spout, handle, lid, knob
      expect(app.objects).toContain(teapot);
      expect(app.selectedObject).toBe(teapot);
    });
  });

  describe('Geometry Parameters', () => {
    it('should create Box with correct dimensions', () => {
      const THREE = require('three');
      app.addBox();

      expect(THREE.BoxGeometry).toHaveBeenCalledWith(1, 1, 1);
    });

    it('should create Sphere with correct radius and segments', () => {
      const THREE = require('three');
      app.addSphere();

      expect(THREE.SphereGeometry).toHaveBeenCalledWith(0.5, 32, 32);
    });

    it('should create Cylinder with correct parameters', () => {
      const THREE = require('three');
      app.addCylinder();

<<<<<<< HEAD
        it('should create Sphere with correct radius and segments', () => {
            const THREE = require('three');
            app.addSphere();
            
            expect(THREE.SphereGeometry).toHaveBeenCalledWith(0.5, 32, 32);
        });

        it('should create Cylinder with correct parameters', () => {
            const THREE = require('three');
            app.addCylinder();
            
            expect(THREE.CylinderGeometry).toHaveBeenCalledWith(0.5, 0.5, 1, 32);
        });

        it('should create Cone with correct radius and height', () => {
            const THREE = require('three');
            app.addCone();
            
            expect(THREE.ConeGeometry).toHaveBeenCalledWith(0.5, 1, 32);
        });

        it('should create Torus with correct major and minor radius', () => {
            const THREE = require('three');
            app.addTorus();
            
            expect(THREE.TorusGeometry).toHaveBeenCalledWith(0.4, 0.2, 16, 100);
        });

        it('should create TorusKnot with correct parameters', () => {
            const THREE = require('three');
            app.addTorusKnot();
            
            expect(THREE.TorusKnotGeometry).toHaveBeenCalledWith(0.4, 0.15, 100, 16);
        });

        it('should create polyhedrons with correct radius', () => {
            const THREE = require('three');
            
            app.addTetrahedron();
            expect(THREE.TetrahedronGeometry).toHaveBeenCalledWith(0.6);
            
            app.addIcosahedron();
            expect(THREE.IcosahedronGeometry).toHaveBeenCalledWith(0.6);
            
            app.addDodecahedron();
            expect(THREE.DodecahedronGeometry).toHaveBeenCalledWith(0.6);
            
            app.addOctahedron();
            expect(THREE.OctahedronGeometry).toHaveBeenCalledWith(0.6);
        });

        it('should create Plane with correct dimensions and double-sided material', () => {
            const THREE = require('three');
            app.addPlane();
            
            expect(THREE.PlaneGeometry).toHaveBeenCalledWith(2, 2);
            expect(THREE.MeshPhongMaterial).toHaveBeenCalledWith({ color: 0x00ffff, side: THREE.DoubleSide });
        });

        it('should create Tube with curve and correct parameters', () => {
            const THREE = require('three');
            app.addTube();
            
            expect(THREE.CatmullRomCurve3).toHaveBeenCalled();
            expect(THREE.TubeGeometry).toHaveBeenCalled();
        });
=======
      expect(THREE.CylinderGeometry).toHaveBeenCalledWith(0.5, 0.5, 1, 32);
>>>>>>> master
    });

    it('should create Cone with correct radius and height', () => {
      const THREE = require('three');
      app.addCone();

      expect(THREE.ConeGeometry).toHaveBeenCalledWith(0.5, 1, 32);
    });

<<<<<<< HEAD
    describe('Material Properties', () => {
        it('should assign unique colors to different primitives', () => {
            const THREE = require('three');
            
            app.addBox();
            expect(THREE.MeshPhongMaterial).toHaveBeenCalledWith({ color: 0x00ff00 });
            
            app.addSphere();
            expect(THREE.MeshPhongMaterial).toHaveBeenCalledWith({ color: 0xff0000 });
            
            app.addCylinder();
            expect(THREE.MeshPhongMaterial).toHaveBeenCalledWith({ color: 0x0000ff });
        });

        it('should create materials for all primitive types', () => {
            const THREE = require('three');
            const lambertCalls = THREE.MeshLambertMaterial.mock.calls.length;
            const phongCalls = THREE.MeshPhongMaterial.mock.calls.length;
            
            // Add all primitives
            app.addBox();
            app.addSphere();
            app.addCylinder();
            app.addCone();
            app.addTorus();
            app.addTorusKnot();
            app.addTetrahedron();
            app.addIcosahedron();
            app.addDodecahedron();
            app.addOctahedron();
            app.addPlane();
            app.addTube();
            app.addTeapot();
            
            // Should have created materials for all primitives
            // Teapot (5 components) uses MeshLambertMaterial
            expect(THREE.MeshLambertMaterial.mock.calls.length).toBeGreaterThan(lambertCalls);
            // All other 12 primitives use MeshPhongMaterial
            expect(THREE.MeshPhongMaterial.mock.calls.length).toBeGreaterThanOrEqual(phongCalls + 12);
        });
=======
    it('should create Torus with correct major and minor radius', () => {
      const THREE = require('three');
      app.addTorus();

      expect(THREE.TorusGeometry).toHaveBeenCalledWith(0.4, 0.2, 16, 100);
>>>>>>> master
    });

    it('should create TorusKnot with correct parameters', () => {
      const THREE = require('three');
      app.addTorusKnot();

      expect(THREE.TorusKnotGeometry).toHaveBeenCalledWith(0.4, 0.15, 100, 16);
    });

    it('should create polyhedrons with correct radius', () => {
      const THREE = require('three');

      app.addTetrahedron();
      expect(THREE.TetrahedronGeometry).toHaveBeenCalledWith(0.6);

      app.addIcosahedron();
      expect(THREE.IcosahedronGeometry).toHaveBeenCalledWith(0.6);

      app.addDodecahedron();
      expect(THREE.DodecahedronGeometry).toHaveBeenCalledWith(0.6);

      app.addOctahedron();
      expect(THREE.OctahedronGeometry).toHaveBeenCalledWith(0.6);
    });

    it('should create Plane with correct dimensions and double-sided material', () => {
      const THREE = require('three');
      app.addPlane();

      expect(THREE.PlaneGeometry).toHaveBeenCalledWith(2, 2);
      expect(THREE.MeshLambertMaterial).toHaveBeenCalledWith({
        color: 0x00ffff,
        side: THREE.DoubleSide,
      });
    });

    it('should create Tube with curve and correct parameters', () => {
      const THREE = require('three');
      app.addTube();

      expect(THREE.CatmullRomCurve3).toHaveBeenCalled();
      expect(THREE.TubeGeometry).toHaveBeenCalled();
    });
  });

  describe('Object Naming and Counting', () => {
    it('should name objects with incremental counters', () => {
      const box1 = app.addBox();
      const box2 = app.addBox();
      const sphere1 = app.addSphere();

      expect(box1.name).toBe('Box_1');
      expect(box2.name).toBe('Box_2');
      expect(sphere1.name).toBe('Sphere_3');
    });

    it('should maintain correct object count', () => {
      expect(app.objects.length).toBe(0);

      app.addBox();
      expect(app.objects.length).toBe(1);

      app.addSphere();
      expect(app.objects.length).toBe(2);

      app.addCylinder();
      expect(app.objects.length).toBe(3);
    });
  });

  describe('Material Properties', () => {
    it('should assign unique colors to different primitives', () => {
      const THREE = require('three');

      app.addBox();
      expect(THREE.MeshLambertMaterial).toHaveBeenCalledWith({ color: 0x00ff00 });

      app.addSphere();
      expect(THREE.MeshLambertMaterial).toHaveBeenCalledWith({ color: 0xff0000 });

      app.addCylinder();
      expect(THREE.MeshLambertMaterial).toHaveBeenCalledWith({ color: 0x0000ff });
    });

    it('should create materials for all primitive types', () => {
      const THREE = require('three');
      const materialCalls = THREE.MeshLambertMaterial.mock.calls.length;

      // Add all primitives
      app.addBox();
      app.addSphere();
      app.addCylinder();
      app.addCone();
      app.addTorus();
      app.addTorusKnot();
      app.addTetrahedron();
      app.addIcosahedron();
      app.addDodecahedron();
      app.addOctahedron();
      app.addPlane();
      app.addTube();
      app.addTeapot();

      // Should have created materials for all primitives (teapot creates multiple materials)
      expect(THREE.MeshLambertMaterial.mock.calls.length).toBeGreaterThan(materialCalls + 12);
    });
  });

  describe('Scene Integration', () => {
    it('should add all primitives to the scene', () => {
      const sceneAddSpy = app.scene.add;

      app.addBox();
      app.addSphere();
      app.addTetrahedron();
      app.addTeapot();

      expect(sceneAddSpy).toHaveBeenCalledTimes(4);
    });

    it('should select newly created objects', () => {
      const box = app.addBox();
      expect(app.selectedObject).toBe(box);

      const sphere = app.addSphere();
      expect(app.selectedObject).toBe(sphere);
    });

    it('should call saveState for each primitive creation', () => {
      const saveStateSpy = jest.spyOn(app, 'saveState');

      app.addBox();
      expect(saveStateSpy).toHaveBeenCalledWith('Add Box');

      app.addSphere();
      expect(saveStateSpy).toHaveBeenCalledWith('Add Sphere');

      app.addTeapot();
      expect(saveStateSpy).toHaveBeenCalledWith('Add Teapot');
    });

    it('should update scene graph for each primitive creation', () => {
      const updateSpy = jest.spyOn(app, 'updateSceneGraph');

      app.addCone();
      expect(updateSpy).toHaveBeenCalled();

      app.addTorus();
      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('Shadow Properties', () => {
    it('should enable shadows for all primitives', () => {
      const primitives = [
        app.addBox(),
        app.addSphere(),
        app.addCylinder(),
        app.addCone(),
        app.addTorus(),
        app.addTorusKnot(),
        app.addTetrahedron(),
        app.addIcosahedron(),
        app.addDodecahedron(),
        app.addOctahedron(),
        app.addPlane(),
        app.addTube(),
      ];

      primitives.forEach((primitive) => {
        expect(primitive.castShadow).toBe(true);
        expect(primitive.receiveShadow).toBe(true);
      });
    });
  });

  describe('Complex Primitives', () => {
    it('should create Tube with proper curve definition', () => {
      const THREE = require('three');
      app.addTube();

      // Verify curve points were created
      expect(THREE.Vector3).toHaveBeenCalledWith(-0.5, 0, 0);
      expect(THREE.Vector3).toHaveBeenCalledWith(0, 0.5, 0);
      expect(THREE.Vector3).toHaveBeenCalledWith(0.5, 0, 0);
      expect(THREE.Vector3).toHaveBeenCalledWith(0, -0.5, 0);
    });

    it('should create Teapot with all components positioned correctly', () => {
      const THREE = require('three');
      const teapot = app.addTeapot();

      // Verify all geometries were created for teapot components
      expect(THREE.SphereGeometry).toHaveBeenCalledWith(0.4, 32, 32); // body
      expect(THREE.CylinderGeometry).toHaveBeenCalledWith(0.05, 0.08, 0.3, 8); // spout
      expect(THREE.TorusGeometry).toHaveBeenCalledWith(0.15, 0.03, 8, 16); // handle
      expect(THREE.CylinderGeometry).toHaveBeenCalledWith(0.35, 0.4, 0.05, 32); // lid
      expect(THREE.SphereGeometry).toHaveBeenCalledWith(0.08, 16, 16); // knob
    });
  });
});
