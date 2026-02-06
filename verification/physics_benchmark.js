import { PhysicsManager } from '../src/frontend/PhysicsManager.js';
import * as THREE from 'three';

// Mock minimal Scene
class MockScene {
    constructor() {}
}

async function runBenchmark() {
    console.log("Starting Physics Benchmark...");

    const scenarios = [
        { fps: 30, dt: 1/30, name: "30 FPS" },
        { fps: 60, dt: 1/60, name: "60 FPS" },
        { fps: 120, dt: 1/120, name: "120 FPS" }
    ];

    const results = {};

    for (const scenario of scenarios) {
        const scene = new MockScene();
        const physicsManager = new PhysicsManager(scene);

        // Add a box falling from height 10
        // We use real THREE objects to ensure compatibility
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial();
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(0, 10, 0);

        physicsManager.addBody(mesh, 1, 'box');

        let totalTime = 0;
        const duration = 2.0; // Simulate 2 seconds

        // Simulation loop
        while (totalTime < duration - 0.00001) { // Epsilon to avoid off-by-one errors at end
            physicsManager.update(scenario.dt);
            totalTime += scenario.dt;
        }

        const finalY = mesh.position.y;
        results[scenario.name] = finalY;
        console.log(`Scenario ${scenario.name}: Final Y = ${finalY.toFixed(6)}, World Time = ${physicsManager.world.time.toFixed(6)}`);
    }

    const diff30vs60 = Math.abs(results["30 FPS"] - results["60 FPS"]);
    const diff60vs120 = Math.abs(results["60 FPS"] - results["120 FPS"]);

    console.log(`Difference 30 vs 60: ${diff30vs60.toFixed(6)}`);
    console.log(`Difference 60 vs 120: ${diff60vs120.toFixed(6)}`);

    const threshold = 0.001; // Relaxed threshold slightly for float errors

    if (diff30vs60 > threshold || diff60vs120 > threshold) {
        console.log("FAIL: Significant difference detected between frame rates (Variable Time Step Instability).");
    } else {
        console.log("PASS: Results are consistent across frame rates.");
    }
}

runBenchmark();
