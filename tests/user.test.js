const User = require('../src/models/user');
const mongoose = require('mongoose');
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
          expect(user.password).to.have.length(60);
          done();
        });
      });
  });


  it('checks if email is valid', (done) => {
    chai.request(server)
      .post('/users')
      .send({
        firstName: 'Luk',
        lastName: 'Nut',
        email: 'qwe',
        password: 'password',
      })
      .end((error, res) => {
        expect(error).to.equal(null);
        expect(res.status).to.equal(400);
        expect(res.body.errors.email).to.equal('Email address is not valid.');
        User.countDocuments((error, count) => {
          expect(count).to.equal(0);
          done();
        });
      });
  });

  it('checks if password is valid', (done) => {
    chai.request(server)
      .post('/users')
      .send({
        firstName: 'Luk',
        lastName: 'Nut',
        email: 'luk@gmail.com',
        password: '12',
      })
      .end((error, res) => {
        expect(error).to.equal(null);
        expect(res.status).to.equal(400);
        expect(res.body.errors.password).to.equal('Passwords must be 8 characters long.');
        User.countDocuments((error, count) => {
          expect(count).to.equal(0);
          done();
        });
      });
  });
});
