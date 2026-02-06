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

if (log) {
    log.setLevel('info');
} else {
    console.warn('loglevel not loaded, falling back to console');
>>>>>>> master
}

export default log || console;
