// Access loglevel from global scope (loaded via script tag)
const log = window.log;

if (log) {
    log.setLevel('info');
} else {
    console.warn('loglevel not loaded, falling back to console');
}

export default log || console;
