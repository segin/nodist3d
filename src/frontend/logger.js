// Access global log instance from window (loaded via script tag)
const log = window.log;

if (log) {
    log.setLevel('info'); // Set the default log level
} else {
    console.error('loglevel not loaded!');
}

export default log;
