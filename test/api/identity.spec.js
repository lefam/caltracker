process.env.NODE_ENV = "test";
var request = require('supertest'),
    mongoose = require('mongoose'),
    expect = require('chai').expect,
    app = require("../../server/app.js").app;

require('./hooks');

describe("Identity API", function() {
    describe("GET /users/:username", function() {
        it("should return 401 when an invalid token is given", function(done) {
            request(app)
                .get("/api/v1/identity/users/leonel")
                .set("X-Access-Token", "invalid")
                .set("Accept", "application/json")
                .expect(401, done);
        });

        it("should return 401 when a normal user token is used", function(done) {
            request(app)
                .get("/api/v1/identity/users/leonel")
                .set("X-Access-Token", tokenNormal)
                .set("Accept", "application/json")
                .expect(401, done);
        });

        it("should return 404 when user does not exist", function(done) {
            request(app)
                .get("/api/v1/identity/users/invalidusername")
                .set("X-Access-Token", tokenAdmin)
                .set("Accept", "application/json")
                .expect(404, done);
        });

        it("should return correct user info when a manager user token is used", function(done) {
            request(app)
                .get("/api/v1/identity/users/leonel")
                .set("X-Access-Token", tokenManager)
                .set("Accept", "application/json")
                .expect(200)
                .end( function(err, res) {
                    if (err) return done(err);
                    expect(res.body.username).to.equal("leonel");
                    done();
                });
        });

        it("should return correct user info when an admin user token is used", function(done) {
            request(app)
                .get("/api/v1/identity/users/ana")
                .set("X-Access-Token", tokenAdmin)
                .set("Accept", "application/json")
                .expect(200)
                .end( function(err, res) {
                    if (err) return done(err);
                    expect(res.body.username).to.equal("ana");
                    done();
                });
        });
    });
});