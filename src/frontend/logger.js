// loglevel loaded as global script in index.html
const log = window.log;

if (log) {
    log.setLevel('info'); // Set the default log level
} else {
    console.warn('loglevel not loaded correctly');
}

export default log;
