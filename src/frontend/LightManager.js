
import * as THREE from 'three';

export class LightManager {
    constructor(scene) {
        this.scene = scene;
        this.lights = [];

        // Add a default ambient light
        const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);

        // Add a default directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1).normalize();
        this.scene.add(directionalLight);
        this.lights.push(directionalLight);
    }

    addLight(type, color, intensity, position) {
        let light;
        switch (type) {
            case 'PointLight':
                light = new THREE.PointLight(color, intensity);
                break;
            case 'DirectionalLight':
                light = new THREE.DirectionalLight(color, intensity);
                break;
            case 'AmbientLight':
                light = new THREE.AmbientLight(color, intensity);
                break;
            default:
                console.warn('Unknown light type:', type);
                return null;
        }
        if (position) {
            light.position.set(position.x, position.y, position.z);
        }
        this.scene.add(light);
        this.lights.push(light);
        return light;
    }

    removeLight(light) {
        this.scene.remove(light);
        this.lights = this.lights.filter(l => l !== light);
    }

    updateLight(light, properties) {
        for (const prop in properties) {
            if (light[prop] !== undefined) {
                if (prop === 'color') {
                    light.color.set(properties[prop]);
                } else if (prop === 'position') {
                    light.position.set(properties.position.x, properties.position.y, properties.position.z);
                } else {
                    light[prop] = properties[prop];
                }
            }
        }
    }
}
