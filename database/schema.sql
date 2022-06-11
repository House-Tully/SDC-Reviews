-- to run
-- to start psql: psql -U postgres
-- to run file in psql: \i schema.sql

\c test;

DROP TABLE IF EXISTS "reviews";

CREATE TABLE "reviews" (
  "id" SERIAL PRIMARY KEY,
  "product_id" INT,
  "rating" SMALLINT CHECK (rating > 0 AND rating < 6),
  "date" BIGINT,
  "summary" TEXT,
  "body" TEXT,
  "recommend" BOOLEAN,
  "reported" BOOLEAN DEFAULT false,
  "reviewer_name" TEXT,
  "reviewer_email" TEXT,
  "response" TEXT DEFAULT '',
  "helpfulness" INT DEFAULT 0
);

DROP TABLE IF EXISTS "characteristics";

CREATE TABLE "characteristics" (
  "id" SERIAL PRIMARY KEY,
  "product_id" INT,
  "name" TEXT
);

DROP TABLE IF EXISTS "characteristics_reviews";

CREATE TABLE "characteristics_reviews" (
  "id" SERIAL PRIMARY KEY,
  "characteristic_id" INT,
  "review_id" INT,
  "value" SMALLINT CHECK (value > 0 AND value < 6)
);

DROP TABLE IF EXISTS "reviews_photos";

CREATE TABLE "reviews_photos" (
  "id" SERIAL PRIMARY KEY,
  "review_id" INT,
  "url" TEXT
);

COPY characteristics_reviews
FROM '/Users/keeganleary/Documents/Coding/Hack Reactor.nosync/solo/reviews-API/data/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics
FROM '/Users/keeganleary/Documents/Coding/Hack Reactor.nosync/solo/reviews-API/data/characteristics.csv'
DELIMITER ','
CSV HEADER;

COPY reviews_photos
FROM '/Users/keeganleary/Documents/Coding/Hack Reactor.nosync/solo/reviews-API/data/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

COPY reviews
FROM '/Users/keeganleary/Documents/Coding/Hack Reactor.nosync/solo/reviews-API/data/reviews.csv'
DELIMITER ','
CSV HEADER;



SELECT setval(pg_get_serial_sequence('reviews', 'id'), max(id)) FROM reviews;
SELECT setval(pg_get_serial_sequence('reviews_photos', 'id'), max(id)) FROM reviews_photos;
SELECT setval(pg_get_serial_sequence('characteristics', 'id'), max(id)) FROM characteristics;
SELECT setval(pg_get_serial_sequence('characteristics_reviews', 'id'), max(id)) FROM characteristics_reviews;

create index review_product_id_index ON reviews (product_id);
create index characteristics_characteristics_id_index ON characteristics_reviews (characteristic_id);
create index reviews_photos_review_id ON reviews_photos (review_id);