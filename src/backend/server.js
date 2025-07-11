import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('src/frontend'));

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening at http://localhost:${port}`);
});
