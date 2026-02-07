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
    this.shaderMaterial = null;
    this.uniforms = {};
    this.editorFolder = null;
     * Creates an instance of ShaderEditor.
     * @param {GUI} gui - The dat.GUI instance.
     * @param {THREE.WebGLRenderer} renderer - The renderer.
     * @param {THREE.Scene} scene - The scene.
     * @param {THREE.Camera} camera - The camera.
     * @param {any} eventBus - The event bus.
     */
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
>>>>>>> master

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
      }
    }

    const vertexShader = `
        }
        if (this.shaderMesh) {
            this.scene.remove(this.shaderMesh);
            if (this.shaderMesh.geometry) this.shaderMesh.geometry.dispose();
        }
        if (this.uniformsFolder) {
            // @ts-ignore: dat.gui types might not have removeFolder correctly typed or editorFolder is possibly null
            this.editorFolder.removeFolder(this.uniformsFolder);
            this.uniformsFolder = null;
        }

        const vertexShader = `
>>>>>>> master
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
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      uniforms: this.uniforms,
    });

    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), this.shaderMaterial);
    mesh.name = 'ShaderMesh';
    this.scene.add(mesh);
    this.eventBus.publish('objectAdded', mesh);
    return mesh;

    this.addShaderControls();
  }

  addShaderControls() {
    if (this.uniformsFolder) {
      this.editorFolder.removeFolder(this.uniformsFolder);
        this.shaderMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), this.shaderMaterial);
        this.shaderMesh.name = 'ShaderMesh';
        this.scene.add(this.shaderMesh);
        this.eventBus.publish('objectAdded', this.shaderMesh);
        this.shaderMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), this.shaderMaterial);
        this.shaderMesh.name = 'ShaderMesh';
        this.scene.add(this.shaderMesh);

        if (this.eventBus) {
            this.eventBus.publish('objectAdded', this.shaderMesh);
        }

        this.addShaderControls();

        return this.shaderMesh;
        return mesh;
>>>>>>> master
>>>>>>> master
>>>>>>> master
    }
    this.uniformsFolder = this.editorFolder.addFolder('Uniforms');

    // Example: Add a color uniform
    this.uniforms.myColor = { value: new global.THREE.Color(0xff0000) };
    this.uniformsFolder
      .addColor(this.uniforms.myColor, 'value')
      .name('Color')
      .onChange(() => {
        this.shaderMaterial.needsUpdate = true;
      });

    // Example: Add a float uniform
    this.uniforms.myFloat = { value: 0.5 };
    this.uniformsFolder
      .add(this.uniforms.myFloat, 'value', 0, 1)
      .name('Float')
      .onChange(() => {
        this.shaderMaterial.needsUpdate = true;
      });

    this.uniformsFolder.open();

    // Add text areas for editing shaders
    const shaderCode = {
      vertex: this.shaderMaterial.vertexShader,
      fragment: this.shaderMaterial.fragmentShader,
    };

    this.editorFolder
      .add(shaderCode, 'vertex')
      .name('Vertex Shader')
      .listen()
      .onChange((value) => {
        this.shaderMaterial.vertexShader = value;
        this.shaderMaterial.needsUpdate = true;
      });

    this.editorFolder
      .add(shaderCode, 'fragment')
      .name('Fragment Shader')
      .listen()
      .onChange((value) => {
        this.shaderMaterial.fragmentShader = value;
        this.shaderMaterial.needsUpdate = true;
      });
  }
        this.uniforms.myColor = { value: new THREE.Color(0xff0000) };
        this.uniformsFolder.addColor(this.uniforms.myColor, 'value').name('Color').onChange(() => {
            if (this.shaderMaterial) this.shaderMaterial.needsUpdate = true;
        // @ts-ignore
        this.uniforms.myColor = { value: new THREE.Color(0xff0000) };
        // @ts-ignore
        this.uniformsFolder.addColor(this.uniforms.myColor, 'value').name('Color').onChange(() => {
            // @ts-ignore
            this.shaderMaterial.needsUpdate = true;
>>>>>>> master
        });

        // Example: Add a float uniform
        // @ts-ignore
        this.uniforms.myFloat = { value: 0.5 };
        // @ts-ignore
        this.uniformsFolder.add(this.uniforms.myFloat, 'value', 0, 1).name('Float').onChange(() => {
            if (this.shaderMaterial) this.shaderMaterial.needsUpdate = true;
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
            if (this.shaderMaterial) {
                this.shaderMaterial.vertexShader = value;
                this.shaderMaterial.needsUpdate = true;
            }
        });

        // @ts-ignore
        this.editorFolder.add(shaderCode, 'fragment').name('Fragment Shader').listen().onChange((value) => {
            if (this.shaderMaterial) {
                this.shaderMaterial.fragmentShader = value;
                this.shaderMaterial.needsUpdate = true;
            }
        });
    }
>>>>>>> master
}
