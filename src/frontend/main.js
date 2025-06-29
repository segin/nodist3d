
import { SceneManager } from './SceneManager.js';
import { ObjectManager } from './ObjectManager.js';

function main() {
    const canvas = document.querySelector('#c');
    const sceneManager = new SceneManager(canvas);
    const objectManager = new ObjectManager(sceneManager.scene);

    // Add a default cube for now
    const cube = objectManager.addCube();

    function animate(time) {
        time *= 0.001; // convert to seconds

        // Animate the cube (for demonstration)
        if (cube) {
            cube.rotation.x = time;
            cube.rotation.y = time;
        }

        sceneManager.render();
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    const fullscreenButton = document.getElementById('fullscreen');
    fullscreenButton.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    });

    // Add UI for adding objects
    const ui = document.getElementById('ui');
    const addCubeButton = document.createElement('button');
    addCubeButton.textContent = 'Add Cube';
    addCubeButton.addEventListener('click', () => {
        objectManager.addCube();
    });
    ui.appendChild(addCubeButton);

    const addSphereButton = document.createElement('button');
    addSphereButton.textContent = 'Add Sphere';
    addSphereButton.addEventListener('click', () => {
        objectManager.addSphere();
    });
    ui.appendChild(addSphereButton);

    const addCylinderButton = document.createElement('button');
    addCylinderButton.textContent = 'Add Cylinder';
    addCylinderButton.addEventListener('click', () => {
        objectManager.addCylinder();
    });
    ui.appendChild(addCylinderButton);

    const addConeButton = document.createElement('button');
    addConeButton.textContent = 'Add Cone';
    addConeButton.addEventListener('click', () => {
        objectManager.addCone();
    });
    ui.appendChild(addConeButton);

    const addTorusButton = document.createElement('button');
    addTorusButton.textContent = 'Add Torus';
    addTorusButton.addEventListener('click', () => {
        objectManager.addTorus();
    });
    ui.appendChild(addTorusButton);

    const addTorusKnotButton = document.createElement('button');
    addTorusKnotButton.textContent = 'Add Torus Knot';
    addTorusKnotButton.addEventListener('click', () => {
        objectManager.addTorusKnot();
    }
    );
    ui.appendChild(addTorusKnotButton);

    const addTetrahedronButton = document.createElement('button');
    addTetrahedronButton.textContent = 'Add Tetrahedron';
    addTetrahedronButton.addEventListener('click', () => {
        objectManager.addTetrahedron();
    });
    ui.appendChild(addTetrahedronButton);

    const addIcosahedronButton = document.createElement('button');
    addIcosahedronButton.textContent = 'Add Icosahedron';
    addIcosahedronButton.addEventListener('click', () => {
        objectManager.addIcosahedron();
    });
    ui.appendChild(addIcosahedronButton);

    const addDodecahedronButton = document.createElement('button');
    addDodecahedronButton.textContent = 'Add Dodecahedron';
    addDodecahedronButton.addEventListener('click', () => {
        objectManager.addDodecahedron();
    });
    ui.appendChild(addDodecahedronButton);

    const addOctahedronButton = document.createElement('button');
    addOctahedronButton.textContent = 'Add Octahedron';
    addOctahedronButton.addEventListener('click', () => {
        objectManager.addOctahedron();
    });
    ui.appendChild(addOctahedronButton);

    const addPlaneButton = document.createElement('button');
    addPlaneButton.textContent = 'Add Plane';
    addPlaneButton.addEventListener('click', () => {
        objectManager.addPlane();
    });
    ui.appendChild(addPlaneButton);

    const addTubeButton = document.createElement('button');
    addTubeButton.textContent = 'Add Tube';
    addTubeButton.addEventListener('click', () => {
        objectManager.addTube();
    });
    ui.appendChild(addTubeButton);

    const addTeapotButton = document.createElement('button');
    addTeapotButton.textContent = 'Add Teapot';
    addTeapotButton.addEventListener('click', () => {
        objectManager.addTeapot();
    });
    ui.appendChild(addTeapotButton);
}

main();
