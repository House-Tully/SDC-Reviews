const express = require('express');
const controllers = require('./controllers');
const router = express.Router();

router.get('/reviews/:product_id/list', (req, res) => {
  res.send('hello router')
});


module.exports = router;