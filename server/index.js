if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const port = process.env.EXPRESS_PORT || 3000;
const host = process.env.EXPRESS_HOST || 'localhost'
const router = require('./router')

app.use('/', router);

app.get('/test', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => console.log(`Listening at http://${host}:${port}`))
