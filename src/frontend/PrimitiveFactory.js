import * as THREE from 'three';
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { ExtrudeGeometry, LatheGeometry } from 'three';
import log from './logger.js';

export class PrimitiveFactory {
  constructor() {
    this.font = null;
    this.materialCache = {};
    const loader = new FontLoader();
    loader.load('./node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      this.font = font;
    });
  }

  /**
   * @param {THREE.BufferGeometry} geometry
   * @param {number} color
   * @param {THREE.Side} [side]
   */
  _createMesh(geometry, color, side = THREE.FrontSide) {
      const cacheKey = `${color}_${side}`;
      if (!this.materialCache[cacheKey]) {
          this.materialCache[cacheKey] = new THREE.MeshPhongMaterial({ color, side });
      }
      const material = this.materialCache[cacheKey];
      const mesh = new THREE.Mesh(geometry, material);
      return mesh;
  }

  createPrimitive(type, options = {}) {
    if (type === 'Text') {
      return new Promise((resolve) => {
        if (this.font) {
          const geometry = new TextGeometry(options.text || 'nodist3d', {
            font: this.font,
            size: options.size || 0.5,
            height: options.height || 0.2,
            curveSegments: options.curveSegments || 12,
            bevelEnabled: options.bevelEnabled || true,
            bevelThickness: options.bevelThickness || 0.03,
            bevelSize: options.bevelSize || 0.02,
            bevelOffset: options.bevelOffset || 0,
            bevelSegments: options.bevelSegments || 5,
          });
          geometry.center();
          resolve(this._createMesh(geometry, options.color || 0x00bfff));
        } else {
          log.error('Font not loaded. Cannot create text.');
          resolve(null);
        }
      });
    }

    let geometry;
    let color = options.color || 0x44aa88;
    let mesh;

    switch (type) {
      case 'Box':
        geometry = new THREE.BoxGeometry(
          options.width || 1,
          options.height || 1,
          options.depth || 1,
        );
        mesh = this._createMesh(geometry, color);
        break;
      case 'Sphere':
        geometry = new THREE.SphereGeometry(
          options.radius || 0.75,
          options.widthSegments || 32,
          options.heightSegments || 16,
        );
        color = options.color || 0xff0000;
        mesh = this._createMesh(geometry, color);
        break;
      case 'Cylinder':
        geometry = new THREE.CylinderGeometry(
          options.radiusTop || 0.5,
          options.radiusBottom || 0.5,
          options.height || 1,
          options.radialSegments || 32,
        );
        color = options.color || 0x0000ff;
        mesh = this._createMesh(geometry, color);
        break;
      case 'Cone':
        geometry = new THREE.ConeGeometry(
          options.radius || 0.5,
          options.height || 1,
          options.radialSegments || 32,
        );
        color = options.color || 0xffff00;
        mesh = this._createMesh(geometry, color);
        break;
      case 'Torus':
        geometry = new THREE.TorusGeometry(
          options.radius || 0.4,
          options.tube || 0.2,
          options.radialSegments || 16,
          options.tubularSegments || 100,
        );
        color = options.color || 0x800080;
        mesh = this._createMesh(geometry, color);
        break;
      case 'TorusKnot':
        geometry = new THREE.TorusKnotGeometry(
          options.radius || 0.4,
          options.tube || 0.1,
          options.tubularSegments || 64,
          options.radialSegments || 8,
          options.p || 2,
          options.q || 3,
        );
        color = options.color || 0xffa500;
        mesh = this._createMesh(geometry, color);
        break;
      case 'Tetrahedron':
        geometry = new THREE.TetrahedronGeometry(options.radius || 0.7, options.detail || 0);
        color = options.color || 0x00ff00;
        mesh = this._createMesh(geometry, color);
        break;
      case 'Icosahedron':
        geometry = new THREE.IcosahedronGeometry(options.radius || 0.7, options.detail || 0);
        color = options.color || 0x00ffff;
        mesh = this._createMesh(geometry, color);
        break;
      case 'Dodecahedron':
        geometry = new THREE.DodecahedronGeometry(options.radius || 0.7, options.detail || 0);
        color = options.color || 0xff00ff;
        mesh = this._createMesh(geometry, color);
        break;
      case 'Octahedron':
        geometry = new THREE.OctahedronGeometry(options.radius || 0.7, options.detail || 0);
        color = options.color || 0x008080;
        mesh = this._createMesh(geometry, color);
        break;
      case 'Plane':
        geometry = new THREE.PlaneGeometry(options.width || 1, options.height || 1);
        color = options.color || 0x808080;
        mesh = this._createMesh(geometry, color, THREE.DoubleSide);
        break;
      case 'Tube':
        const path = options.path || new THREE.CatmullRomCurve3([
          new THREE.Vector3(-1, -1, 0),
          new THREE.Vector3(-0.5, 1, 0),
          new THREE.Vector3(0.5, -1, 0),
          new THREE.Vector3(1, 1, 0),
        ]);
        geometry = new THREE.TubeGeometry(
          path,
          options.tubularSegments || 20,
          options.radius || 0.2,
          options.radialSegments || 8,
          options.closed || false,
        );
        color = options.color || 0xffc0cb;
        mesh = this._createMesh(geometry, color);
        break;
      case 'Teapot':
        geometry = new TeapotGeometry(
          options.size || 0.5,
          options.segments || 10,
          options.bottom || true,
          options.lid || true,
          options.body || true,
          options.fitLid || false,
          options.blinn || true,
        );
        color = options.color || 0x800000;
        mesh = this._createMesh(geometry, color);
        break;
      case 'Lathe':
        const pointsLathe = [];
        for (let i = 0; i < 10; i++) {
          pointsLathe.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.5 + 0.5, (i - 5) * 0.2));
        }
        geometry = new THREE.LatheGeometry(pointsLathe);
        color = options.color || 0x00ff80;
        mesh = this._createMesh(geometry, color);
        break;
      case 'Extrude':
        const shape = new THREE.Shape();
        const x = 0, y = 0;
        shape.moveTo(x + 0.5, y + 0.5);
        shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
        shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
        shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.5, x + 0.5, y + 1.9);
        shape.bezierCurveTo(x + 1.3, y + 1.5, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
        shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1, y);
        shape.bezierCurveTo(x + 0.85, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);

        const extrudeSettings = {
          steps: 2,
          depth: 0.2,
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.1,
          bevelOffset: 0,
          bevelSegments: 1,
        };
        geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        color = options.color || 0xff6347;
        mesh = this._createMesh(geometry, color);
        break;
      case 'LODCube':
        const lod = new THREE.LOD();
        const material = new THREE.MeshPhongMaterial({ color: options.color || 0x00ff00 });

        // High detail
        const geometryHigh = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
        const meshHigh = new THREE.Mesh(geometryHigh, material);
        lod.addLevel(meshHigh, 0);

        // Medium detail
        const geometryMedium = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
        const meshMedium = new THREE.Mesh(geometryMedium, material);
        lod.addLevel(meshMedium, 5);

        // Low detail
        const geometryLow = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
        const meshLow = new THREE.Mesh(geometryLow, material);
        lod.addLevel(meshLow, 10);

        return lod;
      default:
        log.error(`Unknown primitive type: ${type}`);
        return null;
    }
    return mesh;
  }
}
