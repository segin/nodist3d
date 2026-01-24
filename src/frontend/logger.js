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

export default log;
