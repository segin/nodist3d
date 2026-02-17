/**
 * Verification test for Accessibility
 */
jest.mock('cannon-es', () => ({
  World: jest.fn().mockImplementation(() => ({
    gravity: { set: jest.fn(), x: 0, y: -9.82, z: 0 },
    addBody: jest.fn(),
    removeBody: jest.fn(),
    step: jest.fn(),
  })),
  Vec3: jest.fn().mockImplementation((x, y, z) => ({ x, y, z, set: jest.fn() })),
  Body: jest.fn().mockImplementation(() => ({ position: { set: jest.fn() }, quaternion: { set: jest.fn() }, addShape: jest.fn() })),
  Box: jest.fn(),
  Sphere: jest.fn(),
  Cylinder: jest.fn(),
  Shape: jest.fn(),
  Quaternion: jest.fn().mockImplementation((x, y, z, w) => ({ x, y, z, w, set: jest.fn() })),
}));

let appInstance;

describe('Accessibility Verification', () => {
    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = '<div id="scene-graph-panel"><ul id="objects-list"></ul></div>';
        global.requestAnimationFrame = jest.fn();

        appInstance = null;
        jest.clearAllMocks();
    });

    afterEach(() => {
    });

    it('should create scene graph buttons with accessibility attributes', async () => {
        // Simulate DOM loaded
        const domContentLoadedCallbacks = [];
        const originalAddEventListener = document.addEventListener.bind(document);
        document.addEventListener = jest.fn((event, callback) => {
            if (event === 'DOMContentLoaded') {
                domContentLoadedCallbacks.push(callback);
            } else {
                originalAddEventListener(event, callback);
            }
        });

        // Import and execute the module
        delete require.cache[require.resolve('../src/frontend/main.js')];
        const { App } = require('../src/frontend/main.js');

        // Execute the callback
        domContentLoadedCallbacks.forEach(callback => callback());

        if (!appInstance) {
            appInstance = new App();
        }

        // Add a box to populate scene graph
        await appInstance.addBox();

        // Find the scene graph panel
        const panel = document.getElementById('scene-graph-panel');
        expect(panel).not.toBeNull();

        // Find the list items
        const listItems = panel.querySelectorAll('li');
        expect(listItems.length).toBeGreaterThan(0);

        const firstItem = listItems[0];

        // Check for buttons inside
        const buttons = firstItem.querySelectorAll('button');
        expect(buttons.length).toBe(2);

        const visibilityBtn = buttons[0];
        const deleteBtn = buttons[1];

        // Assert Accessibility Attributes
        expect(visibilityBtn.getAttribute('aria-label')).toBeTruthy();
        expect(visibilityBtn.getAttribute('title')).toBeTruthy();

        expect(deleteBtn.getAttribute('aria-label')).toBeTruthy();
        expect(deleteBtn.getAttribute('title')).toBeTruthy();
    });
});
