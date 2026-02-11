// @ts-check
import { GUI } from 'dat.gui';
import * as THREE from 'three';

/**
 * Editor for creating and modifying shaders.
 */
export class ShaderEditor {
    constructor(gui, renderer, scene, camera, eventBus) {
        this.eventBus = eventBus;
        this.gui = gui;
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        /** @type {THREE.ShaderMaterial|null} */
        this.shaderMaterial = null;
        /** @type {THREE.Mesh|null} */
        this.shaderMesh = null;
        this.uniforms = {};
        /** @type {GUI|null} */
        this.editorFolder = null;
        /** @type {GUI|null} */
        this.uniformsFolder = null;

        this.initGUI();
    }

    initGUI() {
        this.editorFolder = this.gui.addFolder('Shader Editor');
        this.editorFolder
            .add(
                {
                    createShader: () => this.createShader(),
                },
                'createShader',
            )
            .name('Create New Shader');
        this.editorFolder.open();
    }

    createShader() {
        if (this.shaderMaterial) {
            this.shaderMaterial.dispose();
            this.scene.remove(this.shaderMesh);
            if (this.uniformsFolder) {
                this.editorFolder.removeFolder(this.uniformsFolder);
                this.uniformsFolder = null;
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
            this.editorFolder.removeFolder(this.uniformsFolder);
        }
        this.uniformsFolder = this.editorFolder.addFolder('Uniforms');

        // Example: Add a color uniform
        this.uniforms.myColor = { value: new global.THREE.Color(0xff0000) };
        this.uniformsFolder.addColor(this.uniforms.myColor, 'value').name('Color').onChange(() => {
            if (this.shaderMaterial) this.shaderMaterial.needsUpdate = true;
        });

        // Example: Add a float uniform
        this.uniforms.myFloat = { value: 0.5 };
        this.uniformsFolder.add(this.uniforms.myFloat, 'value', 0, 1).name('Float').onChange(() => {
            if (this.shaderMaterial) this.shaderMaterial.needsUpdate = true;
        });

        this.uniformsFolder.open();

        // Add text areas for editing shaders
        const shaderCode = {
            vertex: this.shaderMaterial ? this.shaderMaterial.vertexShader : '',
            fragment: this.shaderMaterial ? this.shaderMaterial.fragmentShader : ''
        };

        this.editorFolder.add(shaderCode, 'vertex').name('Vertex Shader').listen().onChange((value) => {
            if (this.shaderMaterial) {
                this.shaderMaterial.vertexShader = value;
                this.shaderMaterial.needsUpdate = true;
            }
        });

        this.editorFolder.add(shaderCode, 'fragment').name('Fragment Shader').listen().onChange((value) => {
            if (this.shaderMaterial) {
                this.shaderMaterial.fragmentShader = value;
                this.shaderMaterial.needsUpdate = true;
            }
        });
    }
}
