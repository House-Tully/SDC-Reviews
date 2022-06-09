const db = require('../index');

module.exports = ({ productId, page, count, sort }) => {
  const query = 'select * from reviews limit 10';
  console.log('query', query)
  db.connect()
  db.query(query, (err, res) => {
    if (!err) {
      return res.rows;
    } else {
      return err
    }
  });
}