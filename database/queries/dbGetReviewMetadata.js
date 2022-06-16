const { response } = require('express');
const pool = require('../index');

module.exports = async (product_id) => {

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

  // Create ratings and recommend object
  const ratings = {}
  const recommended = { 0: 0, 1: 0 }
  for (let i = 0; i < r.length; i++) {
    let review = r[i]
    ratings[review.rating] = ratings[review.rating] + 1 || 1

    if (review.recommend) {
      recommended['1'] += 1
    } else {
      recommended['0'] += 1
    }
  }

  // Create characteristics object
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
    let averageScore = await client.query(queryCharacteristicsReviews)
    if (averageScore.rows[0].avg !== null) {
      averageScore = averageScore.rows[0].avg.substring(0, 6)
      characteristics[characteristicName] = { id: characteristicId, value: averageScore }
    } else {
      characteristics[characteristicName] = { id: characteristicId, value: null }
    }
  }
  client.release()
  return { product_id, ratings, recommended, characteristics }
}

/*
// SINGULAR QUERY IS BETTER
SELECT json_build_object(
  'product_id', 1000,
  'ratings', (
    SELECT
      json_object_agg(r.ref, r.num) result
    FROM  (
      SELECT
        ref,
        count(rating) AS num
      FROM
        unnest(ARRAY [1, 2, 3, 4, 5]) ref
        LEFT JOIN
          reviews ON (ref = rating AND product_id = 1000)
      GROUP BY ref
      ORDER BY ref
    ) r
  ),
  'recommended', (
    SELECT json_build_object(
      'false', (
        SELECT
          COUNT(*)
        FROM
          reviews
        WHERE (
          product_id = 1000 AND recommend = false
        )
      ),
      'true', (
        SELECT
          COUNT(*)
        FROM
          reviews
        WHERE (
          product_id = 1000 AND recommend = true
        )
      )
    )
  ),
  'characteristics', (
    SELECT json_object_agg(
      name,
        (
          SELECT json_build_object(
            'id', characteristics.id,
            'value', (
              SELECT
                ROUND(AVG(value)::numeric, 4)
              FROM
                characteristics_reviews
              WHERE (
                characteristic_id = characteristics.id
              )
            )
          )
        )
    ) from characteristics
    WHERE (
      product_id = 1000
    )
  )
) data
*/