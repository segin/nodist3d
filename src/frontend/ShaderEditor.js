// @ts-check
import { GUI } from 'dat.gui';
import * as THREE from 'three';

export class ShaderEditor {
    /**
     * @param {GUI} gui
     * @param {THREE.WebGLRenderer} renderer
     * @param {THREE.Scene} scene
     * @param {THREE.Camera} camera
     * @param {any} eventBus
     */
    constructor(gui, renderer, scene, camera, eventBus) {
        this.eventBus = eventBus;
        this.gui = gui;
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.shaderMaterial = null;
        this.uniforms = {};
        this.editorFolder = null;
        /** @type {THREE.Mesh | null} */
        this.shaderMesh = null;
        this.uniformsFolder = null;

        this.initGUI();
    }

    initGUI() {
        // @ts-ignore
        this.editorFolder = this.gui.addFolder('Shader Editor');
        // @ts-ignore
        this.editorFolder.add({
            createShader: () => this.createShader()
        }, 'createShader').name('Create New Shader');
        // @ts-ignore
        this.editorFolder.open();
    }

    createShader() {
        if (this.shaderMaterial) {
            // @ts-ignore
            this.shaderMaterial.dispose();
            if (this.shaderMesh) {
                this.scene.remove(this.shaderMesh);
            }
            if (this.uniformsFolder) {
                // @ts-ignore
                this.editorFolder.removeFolder(this.uniformsFolder);
            }
        }

        const vertexShader = `
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            void main() {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            }
        `;

        this.uniforms = {};

        this.shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: this.uniforms,
        });

        const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), this.shaderMaterial);
        mesh.name = 'ShaderMesh';
        this.shaderMesh = mesh;
        this.scene.add(mesh);
        this.eventBus.publish('objectAdded', mesh);

        this.addShaderControls();
        return mesh;
    }

    addShaderControls() {
        if (this.uniformsFolder) {
            // @ts-ignore
            this.editorFolder.removeFolder(this.uniformsFolder);
        }
        // @ts-ignore
        this.uniformsFolder = this.editorFolder.addFolder('Uniforms');

        // Example: Add a color uniform
        // @ts-ignore
        this.uniforms.myColor = { value: new THREE.Color(0xff0000) };
        // @ts-ignore
        this.uniformsFolder.addColor(this.uniforms.myColor, 'value').name('Color').onChange(() => {
            // @ts-ignore
            this.shaderMaterial.needsUpdate = true;
        });

        // Example: Add a float uniform
        // @ts-ignore
        this.uniforms.myFloat = { value: 0.5 };
        // @ts-ignore
        this.uniformsFolder.add(this.uniforms.myFloat, 'value', 0, 1).name('Float').onChange(() => {
            // @ts-ignore
            this.shaderMaterial.needsUpdate = true;
        });

        // @ts-ignore
        this.uniformsFolder.open();

        // Add text areas for editing shaders
        const shaderCode = {
            // @ts-ignore
            vertex: this.shaderMaterial.vertexShader,
            // @ts-ignore
            fragment: this.shaderMaterial.fragmentShader
        };

        // @ts-ignore
        this.editorFolder.add(shaderCode, 'vertex').name('Vertex Shader').listen().onChange((value) => {
            // @ts-ignore
            this.shaderMaterial.vertexShader = value;
            // @ts-ignore
            this.shaderMaterial.needsUpdate = true;
        });

        // @ts-ignore
        this.editorFolder.add(shaderCode, 'fragment').name('Fragment Shader').listen().onChange((value) => {
            // @ts-ignore
            this.shaderMaterial.fragmentShader = value;
            // @ts-ignore
            this.shaderMaterial.needsUpdate = true;
        });
    }
}
