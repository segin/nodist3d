// Access global loglevel instance
const log = window.log;

if (log) {
    log.setLevel('info'); // Set the default log level
} else {
    console.error('loglevel not loaded globally');
}

export default log || console; // Fallback to console if log is missing
