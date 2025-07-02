import { Scene, AmbientLight } from 'three';
jest.mock('three');
import { LightManager } from '../src/frontend/LightManager.js';
import { EventBus } from '../src/frontend/EventBus.js';

jest.mock('../src/frontend/EventBus.js', () => ({
    EventBus: jest.fn().mockImplementation(() => ({
        emit: jest.fn(),
        on: jest.fn(),
    })),
}));

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

    it('should update a light\'s color property', () => {
        const light = lightManager.addLight('PointLight', 0xffffff, 1);
        const newColor = 0x123456;
        lightManager.updateLight(light, { color: newColor });
        expect(light.color.getHex()).toBe(newColor);
    });

    it('should update a light\'s intensity property', () => {
        const light = lightManager.addLight('PointLight', 0xffffff, 1);
        const newIntensity = 0.75;
        lightManager.updateLight(light, { intensity: newIntensity });
        expect(light.intensity).toBe(newIntensity);
    });

    it('should update a light\'s position property', () => {
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

    it('should assign a default name to a new light if no name is provided', () => {
        const light = lightManager.addLight('PointLight', 0xffffff, 1);
        expect(light.name).toBe('PointLight');
    });

    it('should not throw an error when attempting to remove a light that is not in the scene', () => {
        const nonExistentLight = { uuid: 'non-existent-light' };
        expect(() => {
            lightManager.removeLight(nonExistentLight);
        }).not.toThrow();
    });

    it('should preserve light properties (color, intensity) when changing light type', () => {
        const oldLight = lightManager.addLight('PointLight', 0xabcdef, 0.7, { x: 5, y: 6, z: 7 });
        const newLight = lightManager.changeLightType(oldLight, 'DirectionalLight');

        expect(newLight.color.getHex()).toBe(0xabcdef);
        expect(newLight.intensity).toBe(0.7);
        expect(newLight.position.x).toBe(5);
        expect(newLight.position.y).toBe(6);
        expect(newLight.position.z).toBe(7);
    });

    it('should handle updating a light with an invalid or non-existent property', () => {
        const light = lightManager.addLight('PointLight', 0xffffff, 1);
        expect(() => {
            lightManager.updateLight(light, { nonExistentProperty: 'someValue' });
        }).not.toThrow();
    });

    it('should ensure ambient lights do not have a position property that can be updated', () => {
        const ambientLight = lightManager.addLight('AmbientLight', 0xffffff, 1);
        const initialPosition = ambientLight.position.clone();
        lightManager.updateLight(ambientLight, { position: { x: 10, y: 10, z: 10 } });
        expect(ambientLight.position.equals(initialPosition)).toBe(true);
    });
});
