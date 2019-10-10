const User = require('../src/models/user');
const DataFactory = require('./helpers/data-factory');
const UserHelpers = require('./helpers/users-helpers');


describe('/user', () => {
  beforeEach((done) => {
    User.deleteMany({}, () => {
      done();
    });
  });
  beforeEach((done) => {
    const user = DataFactory.user();
    UserHelpers.signUp(user)
      .then(() => done())
      .catch((error) => done(error));
  });

  describe('user', () => {
    describe('POST /user', () => {
      it('creates a user in the database', (done) => {
        const data = DataFactory.user();
        UserHelpers.signUp(data)
          .then(res => {
            expect(res.status).to.equal(201);
            expect(res.body).not.to.have.property('password');

            User.findById(res.body._id, (err, user) => {
              expect(err).to.equal(null);
              expect(user.firstName).to.equal(data.firstName);
              expect(user.lastName).to.equal(data.lastName);
              expect(user.email).to.equal(data.email);
              done();
            });
          })
          .catch(error => done(error));
      });
      it('checks if email is valid', (done) => {
        const data = DataFactory.user({ email: 'mail' });
        UserHelpers.signUp(data)
          .then(res => {
            expect(res.status).to.equal(422);
            expect(res.body.errors.email).to.equal('Email address is not valid.');
            User.countDocuments((err, count) => {
              expect(count).to.equal(1);
              done();
            })
              .catch(error => done(error));
          });
      });
      it('checks if password is valid', (done) => {
        const data = DataFactory.user({ password: '12234' });
        UserHelpers.signUp(data)
          .then(res => {
            expect(res.status).to.equal(422);
            expect(res.body.errors.password).to.equal('Passwords must be 8 characters long.');
            User.countDocuments((err, count) => {
              expect(count).to.equal(1);
              done();
            })
              .catch(error => done(error));
          });
      });
    });
  });
});
