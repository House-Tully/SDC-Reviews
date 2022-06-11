const express = require('express');
const morgan = require('morgan');
const app = express();

if (process.env.NODE_ENV !== 'prod') {
  require('dotenv').config();
}

// logging for dev env
if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

app.use(express.json())

const port = process.env.EXPRESS_PORT || 3000;
const host = process.env.EXPRESS_HOST || 'localhost'
const router = require('./router')

app.use('/reviews', router);

app.get('/test', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => console.log(`Listening at http://${host}:${port}`))

module.exports = app
