const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Only setup JSDOM manually if not in a JSDOM environment (though Jest should handle this)
if (typeof window === 'undefined') {
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM('<!doctype html><html><body></body></html>', {
        url: 'http://localhost/',
        pretendToBeVisual: true
    });

    global.window = dom.window;
    global.document = dom.window.document;
    global.navigator = dom.window.navigator;

    // Ensure TextEncoder/TextDecoder are on window
    if (!global.window.TextEncoder) {
        global.window.TextEncoder = TextEncoder;
    }
    if (!global.window.TextDecoder) {
        global.window.TextDecoder = TextDecoder;
    }

    // Polyfill requestAnimationFrame if missing
    if (!global.window.requestAnimationFrame) {
        global.window.requestAnimationFrame = (callback) => {
            return setTimeout(callback, 0);
        };
    }
    if (!global.window.cancelAnimationFrame) {
        global.window.cancelAnimationFrame = (id) => {
            clearTimeout(id);
        };
    }
}
