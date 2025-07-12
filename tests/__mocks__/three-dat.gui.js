import * as THREE from 'three';

jest.mock('three', () => {
    const originalThree = jest.requireActual('three');

    // Helper to create a mock Vector3 with common methods
    const createMockVector3 = (x = 0, y = 0, z = 0) => ({
        x: x, y: y, z: z,
        set: jest.fn(function(newX, newY, newZ) { this.x = newX; this.y = newY; this.z = newZ; return this; }),
        clone: jest.fn(function() { return createMockVector3(this.x, this.y, this.z); }),
        addScalar: jest.fn(function(s) { this.x += s; this.y += s; this.z += s; return this; }),
        equals: jest.fn(function(v) { return this.x === v.x && this.y === v.y && this.z === v.z; }),
        copy: jest.fn(function(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }),
        addVectors: jest.fn(function(v1, v2) { this.x = v1.x + v2.x; this.y = v1.y + v2.y; this.z = v1.z + v2.z; return this; }),
        divideScalar: jest.fn(function(s) { this.x /= s; this.y /= s; this.z /= s; return this; }),
        normalize: jest.fn(function() { return this; }),
    });

    // Helper to create a mock Euler with common methods
    const createMockEuler = (x = 0, y = 0, z = 0, order = 'XYZ') => ({
        x: x, y: y, z: z, order: order,
        set: jest.fn(function(newX, newY, newZ, newOrder) { this.x = newX; this.y = newY; this.z = newZ; this.order = newOrder; return this; }),
        clone: jest.fn(function() { return createMockEuler(this.x, this.y, this.z, this.order); }),
        equals: jest.fn(function(e) { return this.x === e.x && this.y === e.y && this.z === e.z && this.order === e.order; }),
        copy: jest.fn(function(e) { this.x = e.x; this.y = e.y; this.z = e.z; this.order = e.order; return this; }),
    });

    // Helper to create a mock Quaternion with common methods
    const createMockQuaternion = (x = 0, y = 0, z = 0, w = 1) => ({
        x: x, y: y, z: z, w: w,
        copy: jest.fn(function(q) { this.x = q.x; this.y = q.y; this.z = q.z; this.w = q.w; return this; }),
        setFromAxisAngle: jest.fn(function(axis, angle) { return this; }),
        equals: jest.fn(function(q) { return this.x === q.x && this.y === q.y && this.z === q.z && this.w === q.w; }),
    });

    // Helper to create a mock Material with common properties and methods
    const createMockMaterial = (options = {}) => ({
        color: new originalThree.Color(options.color !== undefined ? options.color : 0xffffff),
        dispose: jest.fn(),
        map: null,
        normalMap: null,
        roughnessMap: null,
        needsUpdate: false,
        side: originalThree.FrontSide,
        roughness: options.roughness !== undefined ? options.roughness : 1,
        metalness: options.metalness !== undefined ? options.metalness : 0,
        setHex: jest.fn(function(hex) { this.color.setHex(hex); }),
        clone: jest.fn(function() { return createMockMaterial(options); }),
    });

    // Helper to create a mock Geometry with common properties and methods
    const createMockGeometry = (type, parameters = {}) => ({
        dispose: jest.fn(),
        type: type,
        parameters: parameters,
        uuid: originalThree.MathUtils.generateUUID(),
    });

    // Mock Mesh
    const MockMesh = jest.fn(function(geometry = createMockGeometry('BufferGeometry'), material = createMockMaterial()) {
        this.isMesh = true;
        this.isObject3D = true; // Important for SceneGraph and other checks
        this.geometry = geometry;
        this.material = material;
        this.name = '';
        this.uuid = originalThree.MathUtils.generateUUID();
        this.position = createMockVector3();
        this.rotation = createMockEuler();
        this.scale = createMockVector3(1, 1, 1);
        this.parent = null;
        this.children = [];
        this.add = jest.fn(function(obj) { this.children.push(obj); obj.parent = this; });
        this.remove = jest.fn(function(obj) { this.children = this.children.filter(child => child !== obj); obj.parent = null; });
        this.clone = jest.fn(function() {
            const clonedMesh = new MockMesh(this.geometry.clone(), Array.isArray(this.material) ? this.material.map(m => m.clone()) : this.material.clone());
            clonedMesh.position.copy(this.position);
            clonedMesh.rotation.copy(this.rotation);
            clonedMesh.scale.copy(this.scale);
            clonedMesh.name = this.name;
            return clonedMesh;
        });
        this.getWorldPosition = jest.fn(function(target) { return target.copy(this.position); });
        this.updateMatrixWorld = jest.fn();
        this.userData = {};
        this.visible = true;
        this.quaternion = createMockQuaternion();
    });

    // Mock Group
    const MockGroup = jest.fn(function() {
        this.isGroup = true;
        this.isObject3D = true;
        this.children = [];
        this.add = jest.fn(function(obj) { this.children.push(obj); obj.parent = this; });
        this.remove = jest.fn(function(obj) { this.children = this.children.filter(child => child !== obj); obj.parent = null; });
        this.position = createMockVector3();
        this.name = '';
        this.uuid = originalThree.MathUtils.generateUUID();
        this.clone = jest.fn(function() {
            const clonedGroup = new MockGroup();
            clonedGroup.position.copy(this.position);
            clonedGroup.rotation.copy(this.rotation);
            clonedGroup.scale.copy(this.scale);
            this.children.forEach(child => {
                clonedGroup.add(child.clone());
            });
            return clonedGroup;
        });
    });

    // Mock Lights
    const MockPointLight = jest.fn(function(color, intensity, distance, decay) {
        this.isLight = true;
        this.isPointLight = true;
        this.color = new originalThree.Color(color);
        this.intensity = intensity;
        this.distance = distance;
        this.decay = decay;
        this.position = createMockVector3();
        this.name = '';
        this.uuid = originalThree.MathUtils.generateUUID();
        this.clone = jest.fn(function() { return new MockPointLight(this.color, this.intensity, this.distance, this.decay); });
    });

    const MockDirectionalLight = jest.fn(function(color, intensity) {
        this.isLight = true;
        this.isDirectionalLight = true;
        this.color = new originalThree.Color(color);
        this.intensity = intensity;
        this.position = createMockVector3();
        this.name = '';
        this.uuid = originalThree.MathUtils.generateUUID();
        this.clone = jest.fn(function() { return new MockDirectionalLight(this.color, this.intensity); });
    });

    const MockAmbientLight = jest.fn(function(color, intensity) {
        this.isLight = true;
        this.isAmbientLight = true;
        this.color = new originalThree.Color(color);
        this.intensity = intensity;
        this.name = '';
        this.uuid = originalThree.MathUtils.generateUUID();
        this.clone = jest.fn(function() { return new MockAmbientLight(this.color, this.intensity); });
        // AmbientLight does not have a position, ensure it's not added
    });

    return {
        ...originalThree,
        Scene: jest.fn(function() {
            this.children = [];
            this.add = jest.fn(function(obj) { this.children.push(obj); obj.parent = this; });
            this.remove = jest.fn(function(obj) { this.children = this.children.filter(child => child !== obj); obj.parent = null; });
            this.toJSON = jest.fn(() => ({ metadata: {}, geometries: [], materials: [], object: {} }));
            this.getObjectByProperty = jest.fn(() => null);
            this.traverse = jest.fn((callback) => {
                this.children.forEach(child => callback(child));
            });
            this.camera = new originalThree.PerspectiveCamera(); // Mock camera for scene
        }),
        WebGLRenderer: jest.fn().mockImplementation(() => ({
            domElement: { addEventListener: jest.fn(), removeEventListener: jest.fn(), getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 100 }), style: {} },
            getContext: jest.fn(),
            setSize: jest.fn(),
            setPixelRatio: jest.fn(),
            render: jest.fn(),
            get size() { return { width: 100, height: 100 }; },
            toDataURL: jest.fn(() => 'data:image/png;base64,mockdata'),
        })),
        PerspectiveCamera: jest.fn().mockImplementation(function() {
            this.isCamera = true;
            this.position = createMockVector3();
            this.rotation = createMockEuler();
            this.quaternion = createMockQuaternion();
            this.matrix = new originalThree.Matrix4();
            this.matrixWorld = new originalThree.Matrix4();
            this.updateMatrixWorld = jest.fn();
            this.clone = jest.fn(function() { return new originalThree.PerspectiveCamera(); });
        }),
        ShaderMaterial: jest.fn().mockImplementation(() => ({
            dispose: jest.fn(),
            vertexShader: '',
            fragmentShader: '',
            uniforms: {},
            needsUpdate: false,
        })),
        Mesh: MockMesh,
        BoxGeometry: jest.fn().mockImplementation(() => createMockGeometry('BoxGeometry', { width: 1, height: 1, depth: 1 })),
        SphereGeometry: jest.fn().mockImplementation(() => createMockGeometry('SphereGeometry', { radius: 1, widthSegments: 32, heightSegments: 16 })),
        CylinderGeometry: jest.fn().mockImplementation(() => createMockGeometry('CylinderGeometry', { radiusTop: 1, radiusBottom: 1, height: 1, radialSegments: 32 })),
        ConeGeometry: jest.fn().mockImplementation(() => createMockGeometry('ConeGeometry', { radius: 1, height: 1, radialSegments: 32 })),
        TorusGeometry: jest.fn().mockImplementation(() => createMockGeometry('TorusGeometry', { radius: 1, tube: 0.4, radialSegments: 16, tubularSegments: 100 })),
        TorusKnotGeometry: jest.fn().mockImplementation(() => createMockGeometry('TorusKnotGeometry', { radius: 1, tube: 0.4, tubularSegments: 64, radialSegments: 8, p: 2, q: 3 })),
        TetrahedronGeometry: jest.fn().mockImplementation(() => createMockGeometry('TetrahedronGeometry', { radius: 1, detail: 0 })),
        IcosahedronGeometry: jest.fn().mockImplementation(() => createMockGeometry('IcosahedronGeometry', { radius: 1, detail: 0 })),
        DodecahedronGeometry: jest.fn().mockImplementation(() => createMockGeometry('DodecahedronGeometry', { radius: 1, detail: 0 })),
        OctahedronGeometry: jest.fn().mockImplementation(() => createMockGeometry('OctahedronGeometry', { radius: 1, detail: 0 })),
        PlaneGeometry: jest.fn().mockImplementation(() => createMockGeometry('PlaneGeometry', { width: 1, height: 1 })),
        TubeGeometry: jest.fn().mockImplementation(() => createMockGeometry('TubeGeometry', {})),
        BufferGeometry: jest.fn().mockImplementation(() => createMockGeometry('BufferGeometry', {})),
        TextGeometry: jest.fn().mockImplementation(() => createMockGeometry('TextGeometry', {})),
        ExtrudeGeometry: jest.fn().mockImplementation(() => createMockGeometry('ExtrudeGeometry', {})),
        LatheGeometry: jest.fn().mockImplementation(() => createMockGeometry('LatheGeometry', {})),

        EdgesGeometry: jest.fn().mockImplementation((geometry) => ({
            dispose: jest.fn(),
            parameters: { geometry: geometry },
            type: 'EdgesGeometry',
        })),
        LineBasicMaterial: jest.fn().mockImplementation((options) => ({
            dispose: jest.fn(),
            color: new originalThree.Color(options.color),
            linewidth: options.linewidth,
            type: 'LineBasicMaterial',
        })),
        LineSegments: jest.fn().mockImplementation((geometry, material) => ({
            isLineSegments: true,
            geometry: geometry,
            material: material,
            renderOrder: 0,
            parent: null,
            remove: jest.fn(),
            type: 'LineSegments',
        })),
        Vector3: createMockVector3,
        Euler: createMockEuler,
        Quaternion: createMockQuaternion,
        Clock: jest.fn().mockImplementation(() => ({
            getDelta: jest.fn(() => 0.016), // Mock a fixed delta time
        })),
        Group: MockGroup,
        Object3D: jest.fn().mockImplementation(function() {
            this.name = '';
            this.uuid = originalThree.MathUtils.generateUUID();
            this.position = createMockVector3();
            this.rotation = createMockEuler();
            this.scale = createMockVector3(1,1,1);
            this.parent = null;
            this.children = [];
            this.add = jest.fn(function(obj) { this.children.push(obj); obj.parent = this; });
            this.remove = jest.fn(function(obj) { this.children = this.children.filter(child => child !== obj); obj.parent = null; });
            this.clone = jest.fn(function() { return new originalThree.Object3D(); });
            this.getWorldPosition = jest.fn(function(target) { return target.copy(this.position); });
            this.updateMatrixWorld = jest.fn();
            this.userData = {};
            this.visible = true;
            this.quaternion = createMockQuaternion();
        }),
        Texture: jest.fn().mockImplementation(() => ({
            dispose: jest.fn(),
        })),
        TextureLoader: jest.fn().mockImplementation(() => ({
            load: jest.fn((url, onLoad, onProgress, onError) => {
                if (onLoad) {
                    onLoad(new originalThree.Texture());
                }
            }),
        })),
        MeshBasicMaterial: jest.fn().mockImplementation((options) => createMockMaterial(options)),
        MeshLambertMaterial: jest.fn().mockImplementation((options) => createMockMaterial(options)),
        MeshStandardMaterial: jest.fn().mockImplementation((options) => createMockMaterial(options)),
        PointLight: MockPointLight,
        DirectionalLight: MockDirectionalLight,
        AmbientLight: MockAmbientLight,
        FrontSide: originalThree.FrontSide,
        DoubleSide: originalThree.DoubleSide,
        MathUtils: {
            generateUUID: jest.fn(() => 'mock-uuid'),
        },
        ObjectLoader: jest.fn().mockImplementation(() => ({
            parse: jest.fn((json, onLoad) => {
                const scene = new originalThree.Scene();
                // Simulate loading objects from JSON
                if (json.object && json.object.children) {
                    json.object.children.forEach(childData => {
                        const mesh = new MockMesh(createMockGeometry(childData.geometry.type, childData.geometry.parameters), createMockMaterial(childData.material));
                        mesh.name = childData.name;
                        mesh.uuid = childData.uuid;
                        mesh.position.set(childData.position.x, childData.position.y, childData.position.z);
                        mesh.rotation.set(childData.rotation.x, childData.rotation.y, childData.rotation.z, childData.rotation.order);
                        mesh.scale.set(childData.scale.x, childData.scale.y, childData.scale.z);
                        scene.add(mesh);
                    });
                }
                if (onLoad) {
                    onLoad(scene);
                }
            }),
        })),
        Matrix4: jest.fn().mockImplementation(() => ({
            elements: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            copy: jest.fn(function(m) { this.elements = [...m.elements]; return this; }),
        })),
    };
});

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
