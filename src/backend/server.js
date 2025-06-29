const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('src/frontend'));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
