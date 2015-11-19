process.env.NODE_ENV = "test";
var request = require('supertest'),
    mongoose = require('mongoose'),
    expect = require('chai').expect,
    app = require("../../server/app.js").app;

require('./hooks');

describe("Authentication API", function() {
    describe("POST /auth/login", function() {
        it("should return a token when correct credentials are given", function(done) {
            request(app)
                .post('/api/v1/auth/login')
                .send({username: 'leonel', password: '1234567'})
                .expect(200)
                .end( function(err, res) {
                    if (err) return done(err);
                    expect(res.body).to.have.property("token");
                    expect(res.body).to.have.property('expiresInMinutes');
                    expect(res.body).to.have.property('user');
                    expect(res.body.user).to.have.property('username');
                    expect(res.body.user.username).to.equal('leonel');
                    done();
                });
        });
        it("should return 401 when the username is invalid", function(done) {
            request(app)
                .post('/api/v1/auth/login')
                .send({username: 'bad-username', password: '12345678'})
                .expect(401, done);
        });
        it("should return 401 when the password is invalid", function(done) {
            request(app)
                .post('/api/v1/auth/login')
                .send({username: 'leonel', password: 'bad-password'})
                .expect(401, done);
        });
    });

    describe("POST /auth/signup", function() {
        it("should return 403 when username is empty", function(done) {
            request(app)
                .post('/api/v1/auth/signup')
                .send({username: '', password: '123456789', firstName: 'Abdul', lastName: 'Abudo'})
                .expect(403, done);
        });

        it("should return 403 when username is less than 3 characters", function(done) {
            request(app)
                .post('/api/v1/auth/signup')
                .send({username: 'ab', password: '123456789', firstName: 'Abdul', lastName: 'Abudo'})
                .expect(403, done);
        });

        it("should return 403 when password is less than 6 characters", function(done) {
            request(app)
                .post('/api/v1/auth/signup')
                .send({username: 'abdul', password: '1234', firstName: 'Abdul', lastName: 'Abudo'})
                .expect(403, done);
        });

        it("should return 403 when user's first name is empty", function(done) {
            request(app)
                .post('/api/v1/auth/signup')
                .send({username: 'abdul', password: '123456789', firstName: '', lastName: 'Abudo'})
                .expect(403, done);
        });

        it("should return 403 when user's last name is empty", function(done) {
            request(app)
                .post('/api/v1/auth/signup')
                .send({username: 'abdul', password: '123456789', firstName: '', lastName: ''})
                .expect(403, done);
        });

        it("should return 403 when user with same name already exists", function(done) {
            request(app)
                .post('/api/v1/auth/signup')
                .send({username: 'leonel', password: '123456789', firstName: 'Abdul', lastName: 'Abudo'})
                .expect(403, done);
        });

        it("should return 201 when a user is created", function(done) {
            request(app)
                .post('/api/v1/auth/signup')
                .send({username: 'abdul', password: '123456789', firstName: 'Abdul', lastName: 'Abudo'})
                .expect(201, done);
        });
    });

    describe("GET /auth/check-token", function() {
        it("should return 200 when given a valid token in query string", function(done) {
            request(app)
                .get('/api/v1/auth/check-token?token=' + tokenAdmin)
                .expect(200, done);
        });

        it("should return 401 when given an invalid token in query string", function(done) {
            request(app)
                .get('/api/v1/auth/check-token?token=invalid')
                .expect(401, done);
        });

        it("should return 401 when the token is empty", function(done) {
            request(app)
                .get('/api/v1/auth/check-token')
                .expect(401, done);
        });
    });
});