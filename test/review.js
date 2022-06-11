process.env.NODE_ENV = 'test'
process.env.EXPRESS_PORT = 3001

let pg = require('pg')

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server/index')
let should = chai.should();

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
})