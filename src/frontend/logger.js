// import log from 'loglevel';
// Use global log object from script tag because ESM import fails for UMD build
const log = window.log;

log.setLevel('info'); // Set the default log level

export default log;
