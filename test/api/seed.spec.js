process.env.NODE_ENV = "test";
var request = require('supertest'),
    expect = require('chai').expect,
    app = require("../../server/app.js").app;

require('./hooks');

describe("Seed API", function() {
    describe("GET /seed/create_admin", function() {
        it("should create an admin user if it does not exist", function(done) {
            request(app)
                .get('/api/v1/seed/create_admin')
                .expect(200, done);
        });

        it("should return 404 if an admin user already exists", function(done) {
            request(app)
                .get('/api/v1/seed/create_admin')
                .expect(200)
                .end( function(err) {
                    if (err) return done(err);
                    request(app)
                        .get('/api/v1/seed/create_admin')
                        .expect(404, done)
                });
        });
    });
});