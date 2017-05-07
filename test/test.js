var assert = require('assert');
var request = require('supertest');
var app = require('../server.js');
var async = require('async');

describe("Login test", () => {
  it('should return home page for login', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('should not be able to login', function(done) {
    var user = {
      username:'',
      password: 'password'
    };
    request(app)
      .post('/login')
      .send(user)
      .expect(500, done);
  });

  it('should not be able to login', function(done) {
    var user = {
      username: 'testname',
      password: ''
    };
    request(app).post('/login').send(user).expect(500, done);
  });

  it('should not be able to login', function(done) {
    var user = {
      username:'',
      password: 'password'
    };
    request(app).post('/login').send(user).expect(500, done);
  });

  it('should not be able to login', function(done) {
    var user = {
      //user name can only be alpha numeric. No special alphabets allowed.
      username: 'jh2@1',
      password: 'password'
    };
    request(app).post('/login').send(user).expect(500, done);
  });


  it('should be able to login', function(done) {
    var user = {
      username: 'testname',
      password: 'testpassword'
    };
    request(app).post('/login').send(user).expect(200, done);
  });
});

describe("Patch Test", function() {
  it('should not be able to return patched json because of invalid json format', function(done) {
    async.waterfall(
      [
        function login(next) {
          const user = {
            username: 'test',
            password: 'test'
          };

          request(app)
            .post('/login')
            .send(user)
            .expect(200)
            .end(function(err, res) {
              if (err) return next(err);
              var result = JSON.parse(res.text);
              next(null, result.token);
            })
        },

        function tryGetingTaskPage(token, next) {
          request(app).get('/tasks').set('token', token).expect(200).end((err, res) => {
            next(null, token);
          })
        },

        function tryPatchingJson(token, next) {
          const data = {
            default: '{"key1":"value1","key2":"value2"}',
            patch: `{
                        "op": "replace",
                        "path": "/key1",
                        "value": "TestValue1"
                    }
                        "op": "add",
                        "path": "/email",
                        "value": "test@test.com"
                    }]`
          };
          request(app)
            .post('/patch')
            .set('token', token)
            .send(data)
            .expect(500)
            .end(function(err, res) {
              var result = JSON.parse(res.text);
              assert.equal(result.message, 'Please enter valid json format');
              done();
            });
        }
      ],
      function finished(err, result) {
        done(err);
      }
    );
  });


  it('should be able to verify token validity in case wrong token is sent', function(done) {
    request(app).post('/patch').set('token', 'some random value').expect(500).end(function(err, res) {
      var result = JSON.parse(res.text);
      assert.equal(result.message, 'User unrecognisable');
      done();
    });
  });


  it('should be able to return patched json', (done) => {
    async.waterfall(
      [
        function login(next) {
          const user = {
            username: 'test',
            password: 'test'
          };

          request(app)
            .post('/login')
            .send(user)
            .expect(200)
            .end((err, res) => {
              if (err) return next(err);
              var result = JSON.parse(res.text);
              next(null, result.token);
            })
        },

        function tryPatchingJson(token, next) {
          const data = {
            default: '{"key1":"value1","key2":"value2"}',
            patch: `[{
                        "op": "replace",
                        "path": "/key1",
                        "value": "TestValue1"
                    },
                    {
                        "op": "add",
                        "path": "/email",
                        "value": "test@test.com"
                    }]`
          };
          request(app)
            .post('/patch')
            .set('token', token)
            .send(data)
            .expect(200)
            .end((err, res) => {
              done();
            });
        }
      ],
      function finished(err, result) {
        done(err);
      }
    );
  });
});

describe("Thumbnail Test", function() {
  it('should be able to verify token validity in case wrong token is sent', function(done) {
    request(app).post('/thumbnail').set('token', 'some random value').expect(500).end(function(err, res) {
      var result = JSON.parse(res.text);
      assert.equal(result.message, 'User unrecognisable');
      done();
    });
  });

  it('should not be able to return thumbnail because of wrong url', function(done) {
    async.waterfall(
      [
        function login(next) {
          const user = {
            username: 'test',
            password: 'test'
          };

          request(app)
            .post('/login')
            .send(user)
            .expect(200)
            .end(function(err, res) {
              if (err) return next(err);
              var result = JSON.parse(res.text);
              next(null, result.token);
            })
        },

        function tryGeneratingThumbnail(token, next) {
          const image = {
            //xyz is not a valid protocol.
            url: 'xyz://www.w3schools.com/css/trolltunga.jpg'
          };
          request(app)
            .post('/thumbnail')
            .set('token', token)
            .send(image)
            .expect(500)
            .end(function(err, res) {
              var result = JSON.parse(res.text);
              assert.equal(result.message, 'Enter valid image url');
              done();
            });
        }
      ],
      function finished(err, result) {
        done(err);
      }
    );
  });

  it('should be able to return thumbnail with status code 200', function(done) {
    this.timeout(25000);
    setTimeout(done, 25000);
    async.waterfall(
      [
        function login(next) {
          const user = {
            username: 'test',
            password: 'test'
          };

          request(app)
            .post('/login')
            .send(user)
            .expect(200)
            .end(function(err, res) {
              if (err) return next(err);
              var result = JSON.parse(res.text);
              next(null, result.token);
            })
        },

        function tryGeneratingThumbnail(token, next) {

          setTimeout(done, 15000);
          const image = {
            url: 'http://www.w3schools.com/css/trolltunga.jpg'
          };
          request(app)
            .post('/thumbnail')
            .set('token', token)
            .send(image)
            .expect(200)
            .end(function(err, res) {});
        }
      ],
      function finished(err, result) {
        done(err);
      }
    );
  });
});