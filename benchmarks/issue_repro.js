
import { performance } from 'perf_hooks';

function benchmark() {
    const objectCount = 10000;
    const stateSelectedUuid = 'uuid-5000';

    // Setup sortedObjects (simulating the result of the previous map/filter)
    const sortedObjects = [];
    for (let i = 0; i < objectCount; i++) {
        sortedObjects.push({ uuid: `uuid-${i}`, name: `Object ${i}` });
    }

    // Setup objMap (the one we want to use for optimization)
    const objMap = new Map();
    sortedObjects.forEach(o => objMap.set(o.uuid, o));

    const iterations = 1000;

    // 1. Baseline: Array.find()
    const startFind = performance.now();
    for (let i = 0; i < iterations; i++) {
        const selected = sortedObjects.find(o => o.uuid === stateSelectedUuid);
    }
    const endFind = performance.now();

    // 2. Optimized: Map.get()
    const startMap = performance.now();
    for (let i = 0; i < iterations; i++) {
        const selected = objMap.get(stateSelectedUuid);
    }
    const endMap = performance.now();

    console.log(`Array.find() took: ${(endFind - startFind).toFixed(4)}ms`);
    console.log(`Map.get() took: ${(endMap - startMap).toFixed(4)}ms`);
    console.log(`Improvement: ${((endFind - startFind) / (endMap - startMap)).toFixed(2)}x faster`);
}

benchmark();
