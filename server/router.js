const express = require('express');
const controllers = require('./controllers');
const router = express.Router();

router.get('/reviews/:product_id/list', controllers.getReviews);
router.get('/reviews/:product_id/meta', controllers.getReviewMetadata);
router.post('/reviews/:product_id', controllers.addReview);
router.put('/reviews/helpful/:review_id', controllers.markReviewHelpful);
router.put('/reviews/report/:review_id', controllers.markReviewReported);

module.exports = router;