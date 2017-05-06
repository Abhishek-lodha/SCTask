var assert = require('assert');
var request = require('supertest');
var app = require('../server.js');
var async = require('async');

describe("Login test", function() {
    it('should not be able to login', function(done) {
        request(app)
            .post('/login')
            .expect(500, done);
    });

    it('should not be able to login', function(done) {
        var user = {
            username: 'testname'
        };
        request(app).post('/login').send(user).expect(500, done);
    });

    it('should not be able to login', function(done) {
        var user = {
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

    it('should not be able to return thumbnail because of wrong url', function (done) {
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
});
