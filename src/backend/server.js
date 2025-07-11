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

app.use(helmet());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.listen(port, '0.0.0.0', () => {
  log.info(`Server listening at http://localhost:${port}`);
});
