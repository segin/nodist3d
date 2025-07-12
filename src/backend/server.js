import express from 'express';
import log from './logger.js';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"], // Only unsafe-inline for import maps
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    }
}));
app.use(cors());

// Serve modules from node_modules with proper MIME types
app.get('/modules/three.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, '..', '..', 'node_modules', 'three', 'build', 'three.module.js'));
});

app.get('/modules/OrbitControls.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, '..', '..', 'node_modules', 'three', 'examples', 'jsm', 'controls', 'OrbitControls.js'));
});

app.get('/modules/TransformControls.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, '..', '..', 'node_modules', 'three', 'examples', 'jsm', 'controls', 'TransformControls.js'));
});

app.get('/modules/dat.gui.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, '..', '..', 'node_modules', 'dat.gui', 'build', 'dat.gui.module.js'));
});

app.get('/modules/jszip.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, '..', '..', 'node_modules', 'jszip', 'dist', 'jszip.min.js'));
});

// Serve three.min.js for web worker
app.get('/modules/three.min.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, '..', '..', 'node_modules', 'three', 'build', 'three.min.js'));
});

app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
});

// Centralized error handler
app.use((err, req, res, next) => {
    log.error(err.stack);
    res.status(500).send('Something broke!');
});

const server = app.listen(port, '0.0.0.0', () => {
  log.info(`Server listening at http://localhost:${port}`);
});

process.on('SIGINT', () => {
    log.info('SIGINT signal received: closing HTTP server');
    server.close(() => {
        log.info('HTTP server closed');
    });
});
