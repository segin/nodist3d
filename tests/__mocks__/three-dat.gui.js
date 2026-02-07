const originalThree = jest.requireActual('three');

class MockVector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.isVector3 = true;
        // Bind methods to instance to avoid prototype issues
        this.set = (x, y, z) => { this.x = x; this.y = y; this.z = z; return this; };
        this.clone = () => new MockVector3(this.x, this.y, this.z);
        this.add = (v) => { this.x += v.x; this.y += v.y; this.z += v.z; return this; };
        this.sub = (v) => { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; };
        this.addScalar = (s) => { this.x += s; this.y += s; this.z += s; return this; };
        this.divideScalar = (s) => { this.x /= s; this.y /= s; this.z /= s; return this; };
        this.equals = (v) => { return this.x === v.x && this.y === v.y && this.z === v.z; };
        this.copy = (v) => { this.x = v.x; this.y = v.y; this.z = v.z; return this; };
        this.addVectors = (v1, v2) => { this.x = v1.x + v2.x; this.y = v1.y + v2.y; this.z = v1.z + v2.z; return this; };
        this.normalize = () => this;
    }
}

class MockEuler {
    constructor(x = 0, y = 0, z = 0, order = 'XYZ') {
        this.x = x;
        this.y = y;
        this.z = z;
        this.order = order;
        this.isEuler = true;
        this.set = (x, y, z, order) => { this.x = x; this.y = y; this.z = z; this.order = order || this.order; return this; };
        this.clone = () => new MockEuler(this.x, this.y, this.z, this.order);
        this.copy = (e) => { this.x = e.x; this.y = e.y; this.z = e.z; this.order = e.order; return this; };
        this.equals = (e) => { return this.x === e.x && this.y === e.y && this.z === e.z && this.order === e.order; };
    }
}

class MockQuaternion {
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        this.isQuaternion = true;
        this.copy = (q) => { this.x = q.x; this.y = q.y; this.z = q.z; this.w = q.w; return this; };
        this.setFromAxisAngle = (axis, angle) => { return this; };
        this.equals = (q) => { return this.x === q.x && this.y === q.y && this.z === q.z && this.w === q.w; };
        this.clone = () => new MockQuaternion(this.x, this.y, this.z, this.w);
    }
}

class MockMatrix4 {
    constructor() {
        this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        this.copy = (m) => { this.elements = [...m.elements]; return this; };
    }
}

class MockColor {
    constructor(color) {
        this.r = 0; this.g = 0; this.b = 0;
        this.isColor = true;
        if (typeof color === 'number') this.setHex(color);
        this.setHex = (hex) => {
            this.r = (hex >> 16 & 255) / 255;
            this.g = (hex >> 8 & 255) / 255;
            this.b = (hex & 255) / 255;
            return this;
        };
        this.clone = () => new MockColor().setHex(this.getHex());
        this.getHex = () => { return (this.r * 255) << 16 ^ (this.g * 255) << 8 ^ (this.b * 255) << 0; };
    }
    setHex(hex) { // duplicate for safety if called on proto
        this.r = (hex >> 16 & 255) / 255;
        this.g = (hex >> 8 & 255) / 255;
        this.b = (hex & 255) / 255;
        return this;
    }
    getHex() { return (this.r * 255) << 16 ^ (this.g * 255) << 8 ^ (this.b * 255) << 0; }
}

// Helper to create a mock Material
const createMockMaterial = (options = {}) => ({
    color: new MockColor(options.color !== undefined ? options.color : 0xffffff),

jest.mock('dat.gui', () => {
  const mockController = {
    name: jest.fn().mockReturnThis(),
    onChange: jest.fn().mockReturnThis(),
    listen: jest.fn().mockReturnThis(),
    getValue: jest.fn(),
  };

  const mockFolder = {
    add: jest.fn(() => mockController),
    addColor: jest.fn(() => mockController),
    addFolder: jest.fn(() => mockFolder), // Nested folders also return mockFolder
    open: jest.fn(),
    removeFolder: jest.fn(),
    __controllers: [], // To track controllers added to this folder
  };

  const mockGUI = jest.fn(() => ({
    addFolder: jest.fn(() => mockFolder),
    add: jest.fn(() => mockController),
    __folders: [], // To track root folders
  }));

  return { GUI: mockGUI };
});
