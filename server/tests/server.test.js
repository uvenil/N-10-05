const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Utxt} = require('./../models/utxt');
const {User} = require('./../models/user');
const {utxts, populateUtxts, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateUtxts);

describe('POST /utxts', () => {
  it('should create a new utxt', (done) => {
    var text = 'Test utxt text';

    request(app)
      .post('/utxts')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Utxt.find({text}).then((utxts) => {
          expect(utxts.length).toBe(1);
          expect(utxts[0].text).toBe(text);
          expect(typeof utxts[0].lastModified).toBe('number');
          expect(typeof utxts[0].createdAt).toBe('number');
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create utxt with invalid body data', (done) => {
    request(app)
      .post('/utxts')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Utxt.find().then((utxts) => {
          expect(utxts.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /utxts', () => {
  it('should get all utxts', (done) => {
    request(app)
      .get('/utxts')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.utxts.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /utxts/:id', () => {
  it('should return utxt doc', (done) => {
    request(app)
      .get(`/utxts/${utxts[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.utxt.text).toBe(utxts[0].text);
      })
      .end(done);
  });

  it('should not return utxt doc created by other user', (done) => {
    request(app)
      .get(`/utxts/${utxts[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if utxt not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .get(`/utxts/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/utxts/123abc')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /utxts/:id', () => {
  it('should remove a utxt', (done) => {
    var hexId = utxts[1]._id.toHexString();

    request(app)
      .delete(`/utxts/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.utxt._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Utxt.findById(hexId).then((utxt) => {
          expect(utxt).not.toBeTruthy();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should remove a utxt', (done) => {
    var hexId = utxts[0]._id.toHexString();

    request(app)
      .delete(`/utxts/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Utxt.findById(hexId).then((utxt) => {
          expect(utxt).toBeTruthy();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if utxt not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/utxts/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/utxts/123abc')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /utxts/:id', () => {
  it('should update the utxt', (done) => {
    var hexId = utxts[0]._id.toHexString();
    var text = 'This should be the new text';

    request(app)
      .patch(`/utxts/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.utxt.text).toBe(text);
        expect(res.body.utxt.completed).toBe(true);
        expect(typeof res.body.utxt.completedAt).toBe('number');
        expect(typeof res.body.utxt.lastModified).toBe('number');
        expect(typeof res.body.utxt.createdAt).toBe('number');
      })
      .end(done);
  });

  it('should not update the utxt created by other user', (done) => {
    var hexId = utxts[0]._id.toHexString();
    var text = 'This should be the new text';

    request(app)
      .patch(`/utxts/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when utxt is not completed', (done) => {
    var hexId = utxts[1]._id.toHexString();
    var text = 'This should be the new text!!';

    request(app)
      .patch(`/utxts/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.utxt.text).toBe(text);
        expect(res.body.utxt.completed).toBe(false);
        expect(res.body.utxt.completedAt).not.toBeTruthy();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'and',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'Password123!'
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          // expect(user.tokens[0]).toHaveProperty("access", 'auth');
          // expect(user.tokens[0]).toHaveProperty("token", res.headers['x-auth']);
          expect(user.tokens[0]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).not.toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
