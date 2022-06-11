const express = require('express');
const controllers = require('./controllers');
const router = express.Router();

router.get('/:product_id/list', controllers.getReviews);
router.get('/:product_id/meta', controllers.getReviewMetadata);
router.post('/:product_id', controllers.addReview);
router.put('/helpful/:review_id', controllers.markReviewHelpful);
router.put('/report/:review_id', controllers.markReviewReported);
router.delete('/remove/:review_id', controllers.deleteReview)

module.exports = router;