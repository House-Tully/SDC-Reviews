const pool = require('../index');

module.exports = (review_id) => {
  const query = {
    text: `UPDATE reviews
    SET reported = true
    WHERE id=$1`,
    values: [review_id]
  }

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