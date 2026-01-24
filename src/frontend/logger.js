// Custom logger implementation to avoid UMD/ESM issues with loglevel
const log = {
    trace: (...args) => console.trace(...args),
    debug: (...args) => console.debug(...args),
    info: (...args) => console.info(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
    setLevel: (level) => {
        // Simple implementation or no-op
        // console.log(`Logger level set to ${level}`);
    }
};

export default log;
