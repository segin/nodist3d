<<<<<<< HEAD
// Custom logger implementation to replace loglevel due to ESM issues
const log = {
    trace: (...args) => console.trace(...args),
    debug: (...args) => console.debug(...args),
    info: (...args) => console.info(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
    setLevel: (level) => {
        // No-op for now, or implement level filtering if needed
        console.log(`Logger level set to ${level} (not implemented)`);
    }
};
=======
<<<<<<< HEAD
// Access global log instance from window (loaded via script tag)
const log = window.log;

if (log) {
    log.setLevel('info'); // Set the default log level
} else {
    console.error('loglevel not loaded globally');
=======
// Access loglevel from global scope (loaded via script tag)
const log = window.log;
>>>>>>> master

if (log) {
    log.setLevel('info');
} else {
    console.warn('loglevel not loaded, falling back to console');
>>>>>>> master
}

export default log || console;
