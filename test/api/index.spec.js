process.env.NODE_ENV = "test";
var request = require('supertest'),
    mongoose = require('mongoose'),
    expect = require('chai').expect,
    app = require("../../server/app.js").app;

require('./hooks');

describe("Index API", function() {
    describe("GET /me", function() {
        it("should return 401 when an invalid token is given", function(done) {
            request(app)
                .get("/api/v1/me")
                .set("X-Access-Token", "invalid")
                .set("Accept", "application/json")
                .expect(401, done);
        });

        it("should return the user info of the owner of the token", function(done) {
            request(app)
                .get("/api/v1/me")
                .set("X-Access-Token", tokenNormal)
                .set("Accept", "application/json")
                .expect(200)
                .end( function(err, res) {
                    if (err) return done(err);
                    expect(res.body.username).to.equal("joao");
                    done();
                });
        });
    });
});