// Use the global 'log' variable exposed by the loglevel script loaded in index.html
// because the UMD build doesn't provide a proper default export for ESM.
// Fallback to console if not loaded.

const log = window.log || window.loglevel || {
    trace: console.trace,
    debug: console.debug,
    info: console.log,
    warn: console.warn,
    error: console.error,
    setLevel: () => {}
};

if (window.log || window.loglevel) {
    log.setLevel('info');
} else {
    console.warn('Loglevel not loaded, falling back to console');
}

export default log;
