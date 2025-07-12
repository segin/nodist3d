import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { GUI } from 'dat.gui';

/**
 * Simple 3D modeling application with basic primitives and transform controls
 */
class App {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.selectedObject = null;
        this.objects = [];
        
        this.init();
        this.setupControls();
        this.setupGUI();
        this.setupLighting();
        this.setupHelpers();
        this.animate();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setupControls() {
        // Orbit controls for camera
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.05;

        // Transform controls for object manipulation
        this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
        this.transformControls.addEventListener('change', () => {
            this.renderer.render(this.scene, this.camera);
        });
        this.transformControls.addEventListener('dragging-changed', (event) => {
            this.orbitControls.enabled = !event.value;
        });
        this.scene.add(this.transformControls);

        // Raycaster for object selection
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.renderer.domElement.addEventListener('click', (event) => {
            if (this.transformControls.dragging) return;
            
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.objects);
            
            if (intersects.length > 0) {
                this.selectObject(intersects[0].object);
            } else {
                this.deselectObject();
            }
        });

        // Keyboard shortcuts
        window.addEventListener('keydown', (event) => {
            switch (event.key.toLowerCase()) {
                case 'g':
                    this.transformControls.setMode('translate');
                    break;
                case 'r':
                    this.transformControls.setMode('rotate');
                    break;
                case 's':
                    this.transformControls.setMode('scale');
                    break;
                case 'delete':
                case 'backspace':
                    if (this.selectedObject) {
                        this.deleteObject(this.selectedObject);
                    }
                    break;
            }
        });
    }

    setupGUI() {
        this.gui = new GUI();
        
        // Primitive creation
        const primitiveFolder = this.gui.addFolder('Add Primitives');
        primitiveFolder.add(this, 'addBox').name('Add Box');
        primitiveFolder.add(this, 'addSphere').name('Add Sphere');
        primitiveFolder.add(this, 'addCylinder').name('Add Cylinder');
        primitiveFolder.add(this, 'addCone').name('Add Cone');
        primitiveFolder.add(this, 'addTorus').name('Add Torus');
        primitiveFolder.add(this, 'addPlane').name('Add Plane');
        primitiveFolder.open();

        // Transform controls
        const transformFolder = this.gui.addFolder('Transform');
        const transformModes = { mode: 'translate' };
        transformFolder.add(transformModes, 'mode', ['translate', 'rotate', 'scale']).onChange((value) => {
            this.transformControls.setMode(value);
        });
        transformFolder.open();

        // Object management
        const objectFolder = this.gui.addFolder('Object');
        objectFolder.add(this, 'deleteSelectedObject').name('Delete Selected');
        objectFolder.add(this, 'duplicateSelectedObject').name('Duplicate Selected');
        objectFolder.open();
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }

    setupHelpers() {
        // Grid helper
        const gridHelper = new THREE.GridHelper(10, 10);
        this.scene.add(gridHelper);

        // Axis helper
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
    }

    // Primitive creation methods
    addBox() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
    }

    addSphere() {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
    }

    addCylinder() {
        const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        const material = new THREE.MeshLambertMaterial({ color: 0x0000ff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
    }

    addCone() {
        const geometry = new THREE.ConeGeometry(0.5, 1, 32);
        const material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
    }

    addTorus() {
        const geometry = new THREE.TorusGeometry(0.4, 0.2, 16, 100);
        const material = new THREE.MeshLambertMaterial({ color: 0xff00ff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
    }

    addPlane() {
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ffff, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
    }

    // Object manipulation methods
    selectObject(object) {
        this.selectedObject = object;
        this.transformControls.attach(object);
        
        // Visual feedback
        this.objects.forEach(obj => {
            obj.material.emissive.setHex(0x000000);
        });
        object.material.emissive.setHex(0x444444);
    }

    deselectObject() {
        if (this.selectedObject) {
            this.selectedObject.material.emissive.setHex(0x000000);
            this.selectedObject = null;
            this.transformControls.detach();
        }
    }

    deleteObject(object) {
        if (object) {
            this.scene.remove(object);
            const index = this.objects.indexOf(object);
            if (index > -1) {
                this.objects.splice(index, 1);
            }
            if (this.selectedObject === object) {
                this.deselectObject();
            }
        }
    }

    deleteSelectedObject() {
        if (this.selectedObject) {
            this.deleteObject(this.selectedObject);
        }
    }

    duplicateSelectedObject() {
        if (this.selectedObject) {
            const geometry = this.selectedObject.geometry.clone();
            const material = this.selectedObject.material.clone();
            const mesh = new THREE.Mesh(geometry, material);
            
            mesh.position.copy(this.selectedObject.position);
            mesh.rotation.copy(this.selectedObject.rotation);
            mesh.scale.copy(this.selectedObject.scale);
            
            // Offset position slightly
            mesh.position.x += 1;
            
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            this.scene.add(mesh);
            this.objects.push(mesh);
            this.selectObject(mesh);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.orbitControls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});