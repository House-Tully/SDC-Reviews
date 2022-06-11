const pool = require('../index');

module.exports = (review) => {
  const { product_id, rating, summary, body, recommend, email, photos, characteristics } = review
  const reviewer_name = review.name
  const values = [product_id, rating, summary, body, recommend, reviewer_name, email]

  //TODO add to photos as well
  let query = {
    text: `
    with new_review as (
      insert into
      reviews(product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email)
      values($1, $2, extract(epoch from now())*1000, $3, $4, $5, $6, $7)
      returning id
    )
    select new_review.id from new_review
    ;`,
    values: values
  }

  return pool
    .connect()
    .then(client => {
      return client
        .query(query)
        .then(async (res) => {
          await photos.forEach(photo => {
            query = {
              text: `insert into reviews_photos(review_id, url)
              values($1, $2)`,
              values: [res.rows[0].id, photo]
            }
            client.query(query)
          });
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

// insert into
// reviews(product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email)
// values($1, $2, extract(epoch from now()), $3, $4, $5, $6, $7)