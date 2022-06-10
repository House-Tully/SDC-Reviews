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
  }
}