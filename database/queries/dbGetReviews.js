const pool = require('../index');

module.exports = ({ productId, page, count, sort }) => {
  let offset = (count * page - count)

  if (sort === 'newest') sort = 'date desc'
  if (sort === 'helpful') sort = 'helpfulness desc'
  if (sort === 'relevant') sort = 'helpfulness desc, date desc'

  count = count.toString()
  offset = offset.toString()

  const query = {
    text: `
    select id as review_id, rating, summary, recommend, response, body, to_timestamp(date/1000) as date, reviewer_name, helpfulness,
    ( select coalesce(json_agg(to_json(photo_rows)), '[]')
        from (
            select rp.id, rp.url
            from reviews r
            inner join reviews_photos rp
            on r.id = rp.review_id
            where rp.review_id = reviews.id
        ) photo_rows
    ) as photos
    from reviews
    where product_id=$1 and reported=false
    order by ${sort}
    limit $2
    offset $3
    ;`,
    values: [productId, count, offset]
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
/*
/review/:product_id/list
I want all the reviews for product with that product_id.
We have product_id from endpoint.
From review table, we will get every record with that product_id.
records that are queried have review_id. The reviews_photos table maps the review_id to photo URLs.
I need the photoUrls to also be in the query repsonse.
*/

/*
select reviews.id as review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness
from reviews
inner join reviews_photos
on reviews.id=reviews_photos.id
limit 10

select p.id, p.url from reviews r inner join reviews_photos p on r.id = p.review_id limit 10
*/

// select *
// from reviews
// where product_id=2

// const query = {
//   text: `select coalesce(json_agg(json_build_object('id', id, 'url', url)) filter (where id is not null), '[]')  as photos from reviews_photos where review_id=5`
// }



// const query = {
//   text: `select *, (
//     select coalesce(json_agg(json_build_object('id', reviews_photos.id, 'url', url)) filter (where reviews_photos.id is not null), '[]') as photos
//     from reviews_photos
//     inner join reviews as r on reviews.id=reviews_photos.review_id
//     where reviews_photos.review_id=reviews.id
//   ) photos
//   from reviews
//   where product_id=$1
//   order by ${sort} desc
//   limit $2
//   offset $3`,
//   values: [productId, count, offset]
// }
