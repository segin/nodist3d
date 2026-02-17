import { performance } from 'perf_hooks';

// Suppress output BEFORE importing logger to capture it during initialization if needed
// and to suppress the actual output during benchmark
const originalConsoleInfo = console.info;
const originalConsoleLog = console.log;

console.info = () => {};
console.log = () => {};

const { default: log } = await import('../src/backend/logger.js');

const iterations = 10000;

// 1. Simple Object
const simpleObj = { id: 1, name: 'Test' };

// 2. Complex Object
const complexObj = {
  id: 1,
  name: 'Complex',
  nested: {
    a: [1, 2, 3],
    b: { c: 'deep' }
  },
  meta: {
    timestamp: new Date(),
    tags: ['a', 'b', 'c']
  }
};

// 3. Circular Object
const circularObj = { name: 'Circular' };
circularObj.self = circularObj;

function runBenchmark(label, obj, expectFail = false) {
  const start = performance.now();
  let failed = false;
  try {
    for (let i = 0; i < iterations; i++) {
      log.info('Benchmark', obj);
    }
  } catch (e) {
    failed = true;
  }
  const end = performance.now();

  if (failed) {
    if (expectFail) {
        // Use original console to report result
        originalConsoleLog(`${label}: Crashed (Expected for baseline)`);
    } else {
        originalConsoleLog(`${label}: Crashed (Unexpected!)`);
    }
  } else {
    originalConsoleLog(`${label}: ${(end - start).toFixed(2)}ms`);
  }
}

originalConsoleLog('--- Logger Benchmark (Silent) ---');
runBenchmark('Simple Object', simpleObj);
runBenchmark('Complex Object', complexObj);
runBenchmark('Circular Object', circularObj, true);

// Restore console
console.info = originalConsoleInfo;
console.log = originalConsoleLog;
