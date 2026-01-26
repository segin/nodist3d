// Access global log variable provided by loglevel script
const log = window.log;

if (log) {
    log.setLevel('info');
} else {
    console.error('loglevel not loaded');
}

export default log;
