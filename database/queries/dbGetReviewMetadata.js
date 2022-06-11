const { response } = require('express');
const pool = require('../index');

module.exports = async (product_id) => {
  const meta = {}

  queryReviews = {
    text: `
    select id, rating, recommend from reviews where product_id=$1
    ;`,
    values: [product_id]
  }

  queryCharacteristics = {
    text: `
    select id, name from characteristics where product_id=$1
    ;`,
    values: [product_id]
  }

  const client = await pool.connect()

  let r = await client.query(queryReviews)
  r = r.rows
  let c = await client.query(queryCharacteristics)
  c = c.rows
  console.log('r', r)
  console.log('c', c)

  // Create ratings and recommend object
  const ratings = {}
  const recommended = { 0: 0, 1: 0 }
  for (let i = 0; i < r.length; i++) {
    let review = r[i]
    if (ratings[review.rating]) {
      ratings[review.rating] += 1
    } else {
      ratings[review.rating] = 1
    }
    if (review.recommend) {
      recommended['1'] += 1
    } else {
      recommended['0'] += 1
    }
  }
  // console.log('recommended', recommended)
  // console.log('ratings', ratings)

  const characteristics = {}
  for (let i = 0; i < c.length; i++) {
    let characteristicId = c[i].id
    let characteristicName = c[i].name
    queryCharacteristicsReviews = {
      text: `
      select avg(value) from characteristics_reviews where characteristic_id=$1
      ;`,
      values: [characteristicId]
    }
    let averageScore = await pool.query(queryCharacteristicsReviews)
    averageScore = averageScore.rows[0].avg.substring(0, 6)
    characteristics[characteristicName] = { id: characteristicId, value: averageScore }
  }
  //console.log(characteristics)

  return { product_id, ratings, recommended, characteristics }
  client.release()

  // query = queryReviews
  // return pool
  //   .connect()
  //   .then(client => {
  //     return client
  //       .query(query)
  //       .then(res => {
  //         console.log(res.rows)
  //         res.rows.forEach((row) => { // row is { id: 3, rating: 4, recommend: true }
  //           query = `

  //           `
  //         })
  //         client.release()
  //         return res.rows
  //       })
  //       .catch(err => {
  //         client.release()
  //         console.log(err.stack)
  //         return err.stack
  //       })
  //   })
}
