// Access loglevel from global scope (loaded via script tag in index.html)
// This avoids ESM vs UMD issues with the loglevel package.
const log = window.log;

if (log) {
    log.setLevel('info');
} else {
    console.warn('loglevel not loaded globally, falling back to console');
}

export default log || console;
