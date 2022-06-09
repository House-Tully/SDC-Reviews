const dbGetReviews = require('../database/queries/dbGetReviews')
const db = require('../database/index');

module.exports = {
  getReviews: (req, res) => {
    //console.log('req', req)

    const query = 'select * from reviews limit 10';
    db.connect()
    db.query(query, (error, response) => {
      if (!error) {
        console.log(response.rows)
        res.send(response.rows)
      } else {
        res.send(error)
      }
      db.end()
    });

    // const productId = req.params.product_id;
    // const page = req.params.page || 1;
    // const count = req.params.count || 5;
    // const sort = req.query.sort || 'newest';
    // try {
    //   let data = await dbGetReviews({ productId, page, count, sort })
    //   console.log('data', data)
    //   res.send({ product: productId, page, count, results: data.rows })
    // } catch (error) {
    //   console.log('getReviews Error')
    //   res.send(error)
    // }
  }
}