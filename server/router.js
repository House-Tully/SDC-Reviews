const express = require('express');
const controllers = require('./controllers');
const router = express.Router();

router.get('/reviews/:product_id/list', controllers.getReviews);

module.exports = router;