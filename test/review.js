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
    let posted_review_id = null
    it('it should POST a new review for product_id=1', (done) => {
      chai.request(server)
        .post('/reviews/1')
        .send(testReview)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.review_id.should.not.eql(null)
          posted_review_id = res.body.review_id;
          done()
        })
    })
    it('POSTed review should appear first in results array when GET with default sort', (done) => {
      chai.request(server)
        .get('/reviews/1/list')
        .end((err, res) => {
          res.should.have.status(200)
          let data = res.body.results[0]
          data.review_id.should.eql(posted_review_id)
          data.summary.should.eql(testReview.summary)
          data.helpfulness.should.eql(0)
          done()
        })
    })
    it('should mark a review as helpful', (done) => {
      chai.request(server)
        .put(`/reviews/helpful/${posted_review_id}`)
        .end((err, res) => {
          res.should.have.status(204)
          done()
        })
    })
    it('should have updated helpfulness value in GET response', (done) => {
      chai.request(server)
        .get('/reviews/1/list')
        .end((err, res) => {
          res.should.have.status(200)
          let data = res.body.results[0]
          data.review_id.should.eql(posted_review_id)
          data.helpfulness.should.eql(1)
          done()
        })
    })
    it('should mark a review as reported', (done) => {
      chai.request(server)
        .put(`/reviews/report/${posted_review_id}`)
        .end((err, res) => {
          res.should.have.status(204)
          done()
        })
    })
    it('reported review should not appear in GET request', (done) => {
      chai.request(server)
        .get(`/reviews/1/list`)
        .end((err, res) => {
          res.should.have.status(200)
          let data = res.body.results[0]
          data.review_id.should.not.eql(posted_review_id)
          done()
        })
    })
  })
})