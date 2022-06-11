const dbAddReview = require('../database/queries/dbAddReview');
const dbGetReviews = require('../database/queries/dbGetReviews');
const dbMarkHelpful = require('../database/queries/dbMarkHelpful');
const dbMarkReviewReported = require('../database/queries/dbMarkReviewReported');
const dbGetReviewMetadata = require('../database/queries/dbGetReviewMetadata')
const dbDeleteReview = require('../database/queries/dbDeleteReview')

module.exports = {
  getReviews: (req, res) => {
    const productId = req.params.product_id;
    const page = parseInt(req.query.page) || 1;
    const count = parseInt(req.query.count) || 5;
    const sort = req.query.sort || 'newest';

    dbGetReviews({ productId, page, count, sort })
      .then(data => {
        res.status(200).send({ product: productId, page, count, results: data })
      })
      .catch(e => {
        res.send(500).send(e)
      })
  },

  getReviewMetadata: (req, res) => {
    dbGetReviewMetadata(req.params.product_id)
      .then(data => {
        res.status(200).send(data)
      })
      .catch(e => {
        res.status(500).send(e)
      })
  },

  addReview: (req, res) => {
    const review = { product_id: req.params.product_id, ...req.body }
    dbAddReview(review)
      .then(data => {
        let review_id = data[0].id
        res.status(201).send({ review_id })
      })
      .catch(e => {
        res.status(500).send(e)
      })
  },

  markReviewHelpful: (req, res) => {
    dbMarkHelpful(req.params.review_id)
      .then(data => {
        res.sendStatus(204)
      })
      .catch(e => {
        res.status(500).send(e)
      })
  },

  markReviewReported: (req, res) => {
    dbMarkReviewReported(req.params.review_id)
      .then(data => {
        res.sendStatus(204)
      })
      .catch(e => {
        res.status(500).send(e)
      })
  },

  deleteReview: (req, res) => {
    dbDeleteReview(req.params.review_id)
      .then((data) => {
        res.sendStatus(204)
      })
      .catch(e => {
        res.status(500).send(e)
      })
  }
}