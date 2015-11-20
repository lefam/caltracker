process.env.NODE_ENV = "test";
var request = require('supertest'),
    mongoose = require('mongoose'),
    expect = require('chai').expect,
    jwt = require("jsonwebtoken"),
    app = require("../../server/app.js").app,
    config = require("../../server/app.js").config;

require('./hooks');

describe("Middleware", function() {
    describe("GET /me", function() {
        it("should return 401 when an invalid token is given", function(done) {
            request(app)
                .get("/api/v1/me")
                .set("X-Access-Token", "invalid")
                .set("Accept", "application/json")
                .expect(401, done);
        });

        it("should return 401 when no token is given", function(done) {
            request(app)
                .get("/api/v1/me")
                .set("Accept", "application/json")
                .expect(401, done);
        });

        it("should return 401 when a non-existent user token is given", function(done) {
            var token = jwt.sign({username: 'non-existent'}, config.TOKEN_SIGN_SECRET, {
                expiresIn: 5 * 60
            });
            request(app)
                .get("/api/v1/me")
                .set("X-Access-Token", token)
                .set("Accept", "application/json")
                .expect(401, done);
        });

        it("should return 200 when valid token is given", function(done) {
            request(app)
                .get("/api/v1/me")
                .set("X-Access-Token", tokenNormal)
                .set("Accept", "application/json")
                .expect(200, done);
        });
    });
});