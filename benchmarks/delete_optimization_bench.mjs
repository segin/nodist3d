import { performance } from 'perf_hooks';

// Simulated App class with Array
class AppArray {
  constructor() {
    this.objects = [];
  }
  add(obj) {
    this.objects.push(obj);
  }
  deleteObject(obj) {
    const index = this.objects.indexOf(obj);
    if (index > -1) this.objects.splice(index, 1);
  }
}

// Simulated App class with Set
class AppSet {
  constructor() {
    this.objects = new Set();
  }
  add(obj) {
    this.objects.add(obj);
  }
  deleteObject(obj) {
    this.objects.delete(obj);
  }
}

const COUNT = 10000;
const DELETE_COUNT = 1000;

function benchmark() {
  console.log(`Benchmarking with ${COUNT} objects, deleting ${DELETE_COUNT} objects.`);

  // Array Benchmark
  const appArray = new AppArray();
  const objects = [];
  for (let i = 0; i < COUNT; i++) {
    const obj = { id: i };
    objects.push(obj);
    appArray.add(obj);
  }

  // Shuffle or pick random objects to delete
  const toDelete = [];
  for (let i = 0; i < DELETE_COUNT; i++) {
    toDelete.push(objects[Math.floor(Math.random() * COUNT)]);
  }

  let start = performance.now();
  for (const obj of toDelete) {
    appArray.deleteObject(obj);
  }
  let end = performance.now();
  console.log(`Array delete: ${(end - start).toFixed(4)} ms`);

  // Set Benchmark
  const appSet = new AppSet();
  for (let i = 0; i < COUNT; i++) {
    appSet.add(objects[i]);
  }

  start = performance.now();
  for (const obj of toDelete) {
    appSet.deleteObject(obj);
  }
  end = performance.now();
  console.log(`Set delete: ${(end - start).toFixed(4)} ms`);
}

benchmark();
