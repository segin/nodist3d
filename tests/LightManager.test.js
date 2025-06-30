import { Scene } from 'three';
import { LightManager } from '../src/frontend/LightManager.js';
import { EventBus } from '../src/frontend/EventBus.js';

describe('LightManager', () => {
    let scene;
    let lightManager;
    let eventBus;

    beforeEach(() => {
        scene = new Scene();
        eventBus = new EventBus();
        lightManager = new LightManager(scene, eventBus);
    });

    it('should add a PointLight to the scene', () => {
        const light = lightManager.addLight('PointLight', 0xff0000, 1, { x: 1, y: 2, z: 3 });
        expect(scene.children).toContain(light);
        expect(light.isPointLight).toBe(true);
    });

    it('should add a DirectionalLight to the scene', () => {
        const light = lightManager.addLight('DirectionalLight', 0x00ff00, 0.5);
        expect(scene.children).toContain(light);
        expect(light.isDirectionalLight).toBe(true);
    });

    it('should add an AmbientLight to the scene', () => {
        const light = lightManager.addLight('AmbientLight', 0x0000ff, 0.8);
        expect(scene.children).toContain(light);
        expect(light.isAmbientLight).toBe(true);
    });

    it('should remove a specified light from the scene', () => {
        const light = lightManager.addLight('PointLight', 0xffffff, 1);
        expect(scene.children).toContain(light);
        lightManager.removeLight(light);
        expect(scene.children).not.toContain(light);
    });

    it('should update a light's color property', () => {
        const light = lightManager.addLight('PointLight', 0xffffff, 1);
        const newColor = 0x123456;
        lightManager.updateLight(light, { color: newColor });
        expect(light.color.getHex()).toBe(newColor);
    });

    it('should update a light's intensity property', () => {
        const light = lightManager.addLight('PointLight', 0xffffff, 1);
        const newIntensity = 0.75;
        lightManager.updateLight(light, { intensity: newIntensity });
        expect(light.intensity).toBe(newIntensity);
    });

    it('should update a light's position property', () => {
        const light = lightManager.addLight('PointLight', 0xffffff, 1);
        const newPosition = { x: 10, y: 20, z: 30 };
        lightManager.updateLight(light, { position: newPosition });
        expect(light.position.x).toBe(newPosition.x);
        expect(light.position.y).toBe(newPosition.y);
        expect(light.position.z).toBe(newPosition.z);
    });

    it('should successfully change the type of an existing light', () => {
        const oldLight = lightManager.addLight('PointLight', 0xffffff, 1, { x: 1, y: 2, z: 3 });
        const newLight = lightManager.changeLightType(oldLight, 'DirectionalLight');

        expect(scene.children).not.toContain(oldLight);
        expect(scene.children).toContain(newLight);
        expect(newLight.isDirectionalLight).toBe(true);
        expect(newLight.color.getHex()).toBe(oldLight.color.getHex());
        expect(newLight.intensity).toBe(oldLight.intensity);
        expect(newLight.position.x).toBe(oldLight.position.x);
        expect(newLight.position.y).toBe(oldLight.position.y);
        expect(newLight.position.z).toBe(oldLight.position.z);
    });
});
