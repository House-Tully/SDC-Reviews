const dbGetReviews = require('../database/queries/dbGetReviews')
const pool = require('../database/index');

module.exports = {
  getReviews: (req, res) => {
    const text = 'select * from reviews limit 10';

    pool.query(text)
      .then(data => {
        console.log(data)
        res.status(200).send(data.rows)
      })
      .catch(e => {
        res.status(500).send(e)
      })

    // pool.query(query, (error, response) => {
    //   if (!error) {
    //     console.log(response.rows)
    //     res.send(response.rows)
    //   } else {
    //     res.send(error)
    //   }
    //   db.end()
    // });

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