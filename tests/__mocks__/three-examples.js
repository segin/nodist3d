// Mock for three/examples/jsm/* modules
export class TeapotGeometry { constructor() {} }
export class FontLoader { load() {} parse() {} }
export class TextGeometry { constructor() {} }
export class OrbitControls { constructor() { this.enabled = true; } update() {} }
export class TransformControls { constructor() { this.addEventListener = () => {}; } }
