const User = require('../src/models/user');
const chai = require('chai');
const DataFactory = require('./helpers/data-factory');


describe('/users', () => {
  afterEach((done) => {
    User.deleteMany({}, () => {
      done();
    });
  });


  it('creates a user in the database', (done) => {
    chai.request(server)
      .post('/users')
      .send({
        firstName: 'Luk',
        lastName: 'Nut',
        email: 'luk@gmail.com',
        password: 'password',
      })
      .end((error, res) => {
        expect(error).to.equal(null);
        expect(res.status).to.equal(201);

        User.findById(res.body._id, (err, user) => {
          expect(err).to.equal(null);
          expect(res.body).not.to.have.property('password');
          expect(user.firstName).to.equal('Luk');
          expect(user.lastName).to.equal('Nut');
          expect(user.email).to.equal('luk@gmail.com');
          expect(user.password).to.not.equal('password');
          done();
        });
      });
  });
});
