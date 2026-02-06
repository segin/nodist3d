<<<<<<< HEAD
// import log from 'loglevel';
// Use global log object from script tag because ESM import fails for UMD build
const log = window.log;
=======
<<<<<<< HEAD
const log = (typeof window !== 'undefined' && window.log) ? window.log : {
    info: console.log,
    warn: console.warn,
    error: console.error,
    setLevel: () => {}
};
>>>>>>> master

if (log && log.setLevel) {
    log.setLevel('info');
=======
<<<<<<< HEAD
// Access global log instance from window (loaded via script tag)
=======
<<<<<<< HEAD
// Access global loglevel instance
=======
<<<<<<< HEAD
// loglevel loaded as global script in index.html
=======
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
>>>>>>> master
>>>>>>> master
>>>>>>> master
const log = window.log;

if (log) {
    log.setLevel('info'); // Set the default log level
} else {
<<<<<<< HEAD
    console.error('loglevel not loaded!');
=======
<<<<<<< HEAD
    console.error('loglevel not loaded globally');
>>>>>>> master
>>>>>>> master
}

export default log || console; // Fallback to console if log is missing
=======
<<<<<<< HEAD
    console.warn('loglevel not loaded correctly');
}
=======
    console.error('loglevel not loaded globally');
=======
// Access loglevel from global scope (loaded via script tag)
const log = window.log;
>>>>>>> master
>>>>>>> master

if (log) {
    log.setLevel('info');
} else {
    console.warn('loglevel not loaded, falling back to console');
>>>>>>> master
}

export default log || console;
>>>>>>> master
