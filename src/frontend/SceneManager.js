

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class SceneManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new global.THREE.Scene();
        this.renderer = new global.THREE.WebGLRenderer({ canvas: this.canvas, powerPreference: "high-performance" });
        this.camera = new global.THREE.PerspectiveCamera(75, 2, 0.1, 5);
        this.camera.position.z = 2;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; // an animation loop is required when damping is enabled
        this.controls.dampingFactor = 0.25;
        this.controls.screenSpacePanning = true;
        this.controls.enableZoom = true;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 500;
        this.controls.maxPolarAngle = Math.PI / 2;

        this.initialCameraPosition = this.camera.position.clone();
        this.initialControlsTarget = this.controls.target.clone();

        const gridHelper = new global.THREE.GridHelper(10, 10);
        this.scene.add(gridHelper);

        const axesHelper = new global.THREE.AxesHelper(5);
        this.scene.add(axesHelper);

        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();
    }

    resetCamera() {
        this.camera.position.copy(this.initialCameraPosition);
        this.controls.target.copy(this.initialControlsTarget);
        this.controls.update();
    }

    onWindowResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}
