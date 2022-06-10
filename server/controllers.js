const dbAddReview = require('../database/queries/dbAddReview');
const dbGetReviews = require('../database/queries/dbGetReviews')

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
    res.status(200).send('meta data coming soon')
  },

  addReview: (req, res) => {
    console.log('body', req.body)
    const review = { product_id: req.params.product_id, ...req.body }
    console.log('review', review)
    dbAddReview(review)
      .then(data => {
        res.sendStatus(200)
      })
      .catch(e => {
        res.status(500).send(e)
      })
  },

  markReviewHelpful: (req, res) => {
    res.status(200).send('review helpful coming soon')
  },

  markReviewReported: (req, res) => {
    res.status(200).send('mark reported coming soon')
  },
}