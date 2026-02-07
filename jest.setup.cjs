const { JSDOM } = require('jsdom');
const fetch = require('node-fetch');

global.fetch = fetch;
global.Request = fetch.Request;
global.Response = fetch.Response;
global.Headers = fetch.Headers;
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', {
  url: 'http://localhost',
});

global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;
global.self = global.window;

// Mock loglevel
global.window.log = {
    setLevel: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
};

// Mock console to keep tests clean
global.console.error = jest.fn();
global.console.warn = jest.fn();

const mockVector3 = {
    x: 0,
    y: 0,
    z: 0,
    set: jest.fn(function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }),
    clone: jest.fn(function() {
        return { ...this };
    }),
    copy: jest.fn(function(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }),
    add: jest.fn(function(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }),
    sub: jest.fn(function(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }),
    multiplyScalar: jest.fn(function(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }),
    divideScalar: jest.fn(function(s) {
        this.x /= s;
        this.y /= s;
        this.z /= s;
        return this;
    }),
    normalize: jest.fn(function() {
        return this;
    }),
    addVectors: jest.fn(function(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    }),
    applyEuler: jest.fn(function() { return this; }),
    applyQuaternion: jest.fn(function() { return this; }),
};

const mockQuaternion = {
  x: 0,
  y: 0,
  z: 0,
  w: 1,
  setFromAxisAngle: jest.fn(),
  clone: jest.fn(function () {
    return { ...this };
  }),
};

// Helper for dat.gui mocks
const createChainableMock = () => {
    const obj = {};
    obj.name = jest.fn(() => obj);
    obj.listen = jest.fn(() => obj);
    obj.onChange = jest.fn(() => obj);
    obj.step = jest.fn(() => obj);
    obj.min = jest.fn(() => obj);
    obj.max = jest.fn(() => obj);
    return obj;
};

jest.mock('dat.gui', () => ({
    GUI: jest.fn().mockImplementation(() => ({
        addFolder: jest.fn(() => ({
            add: jest.fn(() => createChainableMock()),
            addColor: jest.fn(() => createChainableMock()),
            open: jest.fn(),
            removeFolder: jest.fn(),
            __controllers: [],
            __folders: {}
        })),
        add: jest.fn(() => createChainableMock())
    }))
}));

global.FileReader = jest.fn(() => ({
  readAsText: jest.fn(),
  readAsArrayBuffer: jest.fn(),
  onload: jest.fn(),
  onerror: jest.fn(),
}));

global.JSZip = jest.fn(() => ({
    file: jest.fn(),
    generateAsync: jest.fn().mockResolvedValue(''),
    loadAsync: jest.fn().mockResolvedValue({
        file: jest.fn((name) => {
             if (name === 'scene.json') return { async: jest.fn().mockResolvedValue('{}') };
             return null;
        }),
        files: {
            'scene.json': {
                async: jest.fn().mockResolvedValue('{}')
            }
        }
    })
}));

global.Worker = class {
  constructor(stringUrl) {
    this.url = stringUrl;
    this.onmessage = () => {};
  }

  postMessage(msg) {
    // Basic mock: echo back or ignore
  }
};
