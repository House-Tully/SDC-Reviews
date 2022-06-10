const pool = require('../index');

module.exports = (review) => {
  const { product_id, rating, summary, body, recommend, email, photos, characteristics } = review
  const reviewer_name = review.name
  const values = [product_id, rating, summary, body, recommend, reviewer_name, email]

  //TODO add to photos as well
  const query = {
    text: `
      insert into
      reviews(product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email)
      values($1, $2, extract(epoch from now()), $3, $4, $5, $6, $7)
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