import * as THREE from 'three';
const scene = new THREE.Scene();
const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
scene.add(mesh);
const json = scene.toJSON();
const jsonStr = JSON.stringify(json);

console.log('JSON length:', jsonStr.length);

const loader = new THREE.ObjectLoader();
const loaded = loader.parse(JSON.parse(jsonStr));
console.log('Loaded children:', loaded.children.length);
