import { App } from '../src/frontend/main.js';

describe('App', () => {
    let app;

    beforeEach(() => {
        // Setup DOM environment
        document.body.innerHTML = '<div id="objects-list"></div>';
        app = new App();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize correctly', () => {
        expect(app).toBeDefined();
        // Use type check instead of toBeInstanceOf as mocks can be tricky
        expect(app.scene.type).toBe('Scene');
    });

    it('should add a box primitive', async () => {
        const initialCount = app.objects.length;
        await app.addBox();
        expect(app.objects.length).toBeGreaterThan(initialCount);
    });
});
