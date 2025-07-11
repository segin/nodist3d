import express from 'express';
import log from './logger.js';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('src/frontend'));

app.listen(port, '0.0.0.0', () => {
  log.info(`Server listening at http://localhost:${port}`);
});
