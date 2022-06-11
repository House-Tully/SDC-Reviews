process.env.NODE_ENV = 'test'
process.env.EXPRESS_PORT = 3001

let pg = require('pg')

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server/index')
let should = chai.should();
let testReview = require('./sample_review');
console.log(testReview)

chai.use(chaiHttp);

describe('Reviews', () => {
  // beforeEach((done) => {
  //   // clear db here
  // })
  describe('/GET reviews', () => {
    it('it should GET generic object response with product_id, page=1, count=5, results array', (done) => {
      chai.request(server)
        .get('/reviews/1/list')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.product.should.eql('1')
          res.body.page.should.eql(1)
          res.body.count.should.eql(5)
          Array.isArray(res.body.results).should.eql(true)
          done();
        })
    })
  })
  describe('POST review', () => {
    it('it should POST a new review for product_id=1', (done) => {
      let posted_review_id = null
      chai.request(server)
        .post('/reviews/1')
        .send(testReview)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.review_id.should.not.eql(null)
          posted_review_id = res.body.review_id;
        })
      chai.request(server)
        .get('/reviews/1/list')
        .end((err, res) => {
          res.should.have.status(200)
          console.log(res.body)
          //res.body.results[0].review_id.should.eql(posted_review_id)
          done()
        })
    })
  })
})