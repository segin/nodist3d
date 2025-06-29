import JSZip from 'jszip';

export class SceneStorage {
    constructor(scene) {
        this.scene = scene;
    }

    async saveScene() {
        const zip = new JSZip();
        const sceneData = [];

        this.scene.children.forEach(object => {
            if (object.isMesh) {
                sceneData.push({
                    uuid: object.uuid,
                    type: object.geometry.type,
                    name: object.name,
                    position: object.position.toArray(),
                    rotation: object.rotation.toArray(),
                    scale: object.scale.toArray(),
                    materialColor: object.material.color.getHex()
                });
            }
        });

        zip.file('scene.json', JSON.stringify(sceneData));

        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'scene.nodist3d';
        a.click();
        URL.revokeObjectURL(url);
    }

    async loadScene(file) {
        const zip = new JSZip();
        const loadedZip = await zip.loadAsync(file);
        const sceneJson = await loadedZip.file('scene.json').async('string');
        const sceneData = JSON.parse(sceneJson);

        // Clear existing objects from the scene
        while(this.scene.children.length > 0){
            this.scene.remove(this.scene.children[0]);
        }

        // Recreate objects based on loaded data (simplified - will need proper object creation logic)
        sceneData.forEach(objData => {
            // This is a placeholder. Actual object creation needs to be dynamic based on objData.type
            // For now, we'll just add a cube as a placeholder.
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshPhongMaterial({ color: objData.materialColor });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.fromArray(objData.position);
            mesh.rotation.fromArray(objData.rotation);
            mesh.scale.fromArray(objData.scale);
            mesh.name = objData.name;
            mesh.uuid = objData.uuid; // Preserve UUID
            this.scene.add(mesh);
        });

        return sceneData;
    }
}