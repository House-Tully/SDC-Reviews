const pool = require('../index');

module.exports = (review) => {

  console.log('review', review)

  const { product_id, rating, summary, body, recommend, email, photos, characteristics } = review
  const reviewer_name = review.name
  const values = [product_id, rating, summary, body, recommend, reviewer_name, email]

  //TODO add to photos as well
  //TODO default response to ''
  //TODO default helpfulness to 0
  //TODO default date to NOW() ISO timestamp

  const query = {
    text: `
      insert into
      reviews(product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness)
      values($1, $2, 1234, $3, $4, $5, false, $6, $7, '', 0)
    ;`,
    values: values
  }

  console.log('add query', query)

  return pool
    .connect()
    .then(client => {
      return client
        .query(query)
        .then(res => {
          client.release()
          return res.rows
        })
        .catch(err => {
          client.release()
          console.log(err.stack)
          return err.stack
        })
    })
}