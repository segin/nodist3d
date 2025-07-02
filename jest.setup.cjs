const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;

const THREE = require('three');

jest.mock('three', () => {
    const originalThree = jest.requireActual('three');
    return {
        ...originalThree,
        WebGLRenderer: jest.fn().mockImplementation(() => {
            return {
                domElement: document.createElement('canvas'),
                getContext: jest.fn(),
                setSize: jest.fn(),
                setPixelRatio: jest.fn(),
                render: jest.fn(),
                toDataURL: jest.fn().mockReturnValue('data:image/png;base64,....'),
            };
        }),
        PerspectiveCamera: jest.fn().mockImplementation(() => {
            return {
                aspect: 1,
                updateProjectionMatrix: jest.fn(),
                position: new originalThree.Vector3(),
                quaternion: new originalThree.Quaternion(),
            };
        }),
        Scene: jest.fn().mockImplementation(() => {
            const scene = new originalThree.Scene();
            scene.children = [];
            return scene;
        }),
        Vector3: jest.fn().mockImplementation((x, y, z) => {
            return new originalThree.Vector3(x, y, z);
        }),
        Color: jest.fn().mockImplementation((r, g, b) => {
            return new originalThree.Color(r, g, b);
        }),
        Quaternion: jest.fn().mockImplementation((x, y, z, w) => {
            return new originalThree.Quaternion(x, y, z, w);
        }),
        BoxGeometry: jest.fn().mockImplementation(() => {
            return {
                type: 'BoxGeometry',
                parameters: {
                    width: 1,
                    height: 1,
                    depth: 1,
                },
                dispose: jest.fn(),
            };
        }),
        SphereGeometry: jest.fn().mockImplementation(() => {
            return {
                type: 'SphereGeometry',
                parameters: {
                    radius: 1,
                },
                dispose: jest.fn(),
            };
        }),
        CylinderGeometry: jest.fn().mockImplementation(() => {
            return {
                type: 'CylinderGeometry',
                parameters: {
                    radiusTop: 1,
                    radiusBottom: 1,
                    height: 1,
                    radialSegments: 8,
                },
                dispose: jest.fn(),
            };
        }),
        ConeGeometry: jest.fn().mockImplementation(() => {
            return {
                type: 'ConeGeometry',
                dispose: jest.fn(),
            };
        }),
        TorusGeometry: jest.fn().mockImplementation(() => {
            return {
                type: 'TorusGeometry',
                dispose: jest.fn(),
            };
        }),
        TorusKnotGeometry: jest.fn().mockImplementation(() => {
            return {
                type: 'TorusKnotGeometry',
                dispose: jest.fn(),
            };
        }),
        IcosahedronGeometry: jest.fn().mockImplementation(() => {
            return {
                type: 'IcosahedronGeometry',
                dispose: jest.fn(),
            };
        }),
        DodecahedronGeometry: jest.fn().mockImplementation(() => {
            return {
                type: 'DodecahedronGeometry',
                dispose: jest.fn(),
            };
        }),
        OctahedronGeometry: jest.fn().mockImplementation(() => {
            return {
                type: 'OctahedronGeometry',
                dispose: jest.fn(),
            };
        }),
        PlaneGeometry: jest.fn().mockImplementation(() => {
            return {
                type: 'PlaneGeometry',
                dispose: jest.fn(),
            };
        }),
        TubeGeometry: jest.fn().mockImplementation(() => {
            return {
                type: 'TubeGeometry',
                dispose: jest.fn(),
            };
        }),
        BufferGeometry: jest.fn().mockImplementation(() => {
            return {
                type: 'BufferGeometry',
                dispose: jest.fn(),
            };
        }),
        TextGeometry: jest.fn().mockImplementation(() => {
            return {
                type: 'TextGeometry',
                dispose: jest.fn(),
            };
        }),
        MeshBasicMaterial: jest.fn().mockImplementation(() => {
            return {
                color: new originalThree.Color(),
                dispose: jest.fn(),
            };
        }),
        MeshLambertMaterial: jest.fn().mockImplementation(() => {
            return {
                color: new originalThree.Color(),
                dispose: jest.fn(),
            };
        }),
        ShaderMaterial: jest.fn().mockImplementation(() => {
            return {
                dispose: jest.fn(),
            };
        }),
        PointLight: jest.fn().mockImplementation(() => {
            return {
                isPointLight: true,
                position: new originalThree.Vector3(),
                color: new originalThree.Color(),
                intensity: 1,
                distance: 0,
            };
        }),
        DirectionalLight: jest.fn().mockImplementation(() => {
            return {
                isDirectionalLight: true,
                position: new originalThree.Vector3(),
                color: new originalThree.Color(),
                intensity: 1,
            };
        }),
        AmbientLight: jest.fn().mockImplementation(() => {
            return {
                isAmbientLight: true,
                color: new originalThree.Color(),
                intensity: 1,
            };
        }),
        Group: jest.fn().mockImplementation(() => {
            return new originalThree.Group();
        }),
        Mesh: jest.fn().mockImplementation((geometry, material) => {
            const mesh = new originalThree.Mesh(geometry, material);
            mesh.position = new originalThree.Vector3();
            mesh.rotation = new originalThree.Euler();
            mesh.scale = new originalThree.Vector3(1, 1, 1);
            return mesh;
        }),
        EdgesGeometry: jest.fn(),
        LineBasicMaterial: jest.fn(),
        LineSegments: jest.fn(),
        Raycaster: jest.fn().mockImplementation(() => {
            return {
                setFromCamera: jest.fn(),
                intersectObjects: jest.fn().mockReturnValue([]),
            };
        }),
        TextureLoader: jest.fn().mockImplementation(() => {
            return {
                load: jest.fn(),
            };
        }),
        Vector2: jest.fn().mockImplementation((x, y) => {
            return new originalThree.Vector2(x, y);
        }),
        GridHelper: jest.fn(),
        AxesHelper: jest.fn(),
        DoubleSide: originalThree.DoubleSide,
    };
});

global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

global.FileReader = jest.fn(() => ({
    readAsText: jest.fn(),
    readAsArrayBuffer: jest.fn(),
    onload: jest.fn(),
    onerror: jest.fn(),
}));

global.JSZip = jest.fn(() => ({
    file: jest.fn(),
    generateAsync: jest.fn().mockResolvedValue(''),
}));