process.env.NODE_ENV = "test";
var request = require('supertest'),
    mongoose = require('mongoose'),
    expect = require('chai').expect,
    app = require("../../server/app.js").app;

require('./hooks');

describe("Meals API", function() {
    describe("GET /meals/", function() {
        it("should return 401 when an invalid token is given", function(done) {
            request(app)
                .get("/api/v1/meals")
                .set("X-Access-Token", "invalid")
                .set("Accept", "application/json")
                .expect(401, done);
        });

        it("should return a list of private meals", function(done) {
            request(app)
                .get("/api/v1/meals")
                .set("X-Access-Token", tokenNormal)
                .set("Accept", "application/json")
                .expect(200)
                .end( function(err, res) {
                    expect(res.body.length).to.equal(3);
                    done();
                });
        });

        it("should return 401 when a normal user tries to fetch all meals", function(done) {
            request(app)
                .get("/api/v1/meals?all=1")
                .set("X-Access-Token", tokenNormal)
                .set("Accept", "application/json")
                .expect(401, done)
        });

        it("should return 401 when a normal user tries to fetch meals of a different user", function(done) {
            request(app)
                .get("/api/v1/meals?user=" + idManager)
                .set("X-Access-Token", tokenNormal)
                .set("Accept", "application/json")
                .expect(401, done)
        });

        it("should return 401 when a manager user token tries to fetch meals of a different user", function(done) {
            request(app)
                .get("/api/v1/meals?user=" + idNormal)
                .set("X-Access-Token", tokenManager)
                .set("Accept", "application/json")
                .expect(401, done)
        });

        it("should return 200 when an admin user token tries to fetch meals of a different user", function(done) {
            request(app)
                .get("/api/v1/meals?user=" + idManager)
                .set("X-Access-Token", tokenAdmin)
                .set("Accept", "application/json")
                .expect(200, done)
        });
    });

    describe("GET /meals/:id", function() {
        it("should return 401 when an invalid token is given", function(done) {
            request(app)
                .get("/api/v1/meals")
                .set("X-Access-Token", "invalid")
                .set("Accept", "application/json")
                .expect(401, done);
        });

        it("should return 404 when the meal id is invalid", function(done) {
            request(app)
                .get("/api/v1/meals/invalid")
                .set("X-Access-Token", tokenAdmin)
                .set("Accept", "application/json")
                .expect(404, done);
        });

        it("should return 404 when the meal does not exist", function(done) {
            var invalidId = mongoose.Types.ObjectId();
            request(app)
                .get("/api/v1/meals/" + invalidId)
                .set("X-Access-Token", tokenAdmin)
                .set("Accept", "application/json")
                .expect(404, done);
        });

        it("should return 401 when a normal user token requests a different user", function(done) {
            request(app)
                .get("/api/v1/meals/" + testMeals[0]._id)
                .set("X-Access-Token", tokenNormal)
                .set("Accept", "application/json")
                .expect(401, done);
        });

        it("should return 401 when a manager user token requests a different user", function(done) {
            request(app)
                .get("/api/v1/meals/" + testMeals[0]._id)
                .set("X-Access-Token", tokenManager)
                .set("Accept", "application/json")
                .expect(401, done);
        });

        it("should return the correct meal when requested with normal token", function(done) {
            request(app)
                .get("/api/v1/meals/" + testMeals[6]._id)
                .set("X-Access-Token", tokenNormal)
                .set("Accept", "application/json")
                .expect(200)
                .end( function(err, res) {
                    if (err) return done(err);
                    expect(res.body._id).to.equal(testMeals[6]._id.toString());
                    done();
                });
        });

        it("should return the correct meal when requested with manager token", function(done) {
            request(app)
                .get("/api/v1/meals/" + testMeals[3]._id)
                .set("X-Access-Token", tokenManager)
                .set("Accept", "application/json")
                .expect(200)
                .end( function(err, res) {
                    if (err) return done(err);
                    expect(res.body._id).to.equal(testMeals[3]._id.toString());
                    done();
                });
        });

        it("should return the correct meal when requested with admin token", function(done) {
            request(app)
                .get("/api/v1/meals/" + testMeals[0]._id)
                .set("X-Access-Token", tokenAdmin)
                .set("Accept", "application/json")
                .expect(200)
                .end( function(err, res) {
                    if (err) return done(err);
                    expect(res.body._id).to.equal(testMeals[0]._id.toString());
                    done();
                });
        });
    });

    describe("DELETE /meals/:id", function() {
        it("should return 401 when an invalid token is given", function (done) {
            request(app)
                .delete("/api/v1/meals/" + testMeals[0]._id)
                .set("X-Access-Token", "invalid")
                .set("Accept", "application/json")
                .expect(401, done);
        });

        it("should delete a meal when given a normal user token that is the owner of the meal", function(done) {
            request(app)
                .delete("/api/v1/meals/" + testMeals[6]._id)
                .set("X-Access-Token", tokenNormal)
                .set("Accept", "application/json")
                .expect(200, done)
        });

        it("should delete a meal when given a manager user token that is the owner of the meal", function(done) {
            request(app)
                .delete("/api/v1/meals/" + testMeals[3]._id)
                .set("X-Access-Token", tokenManager)
                .set("Accept", "application/json")
                .expect(200, done)
        });

        it("should return 404 when the meal id is malformed", function(done) {
            request(app)
                .delete("/api/v1/meals/invalid")
                .set("X-Access-Token", tokenAdmin)
                .set("Accept", "application/json")
                .expect(404, done)
        });

        it("should return 404 when the meal does not exist", function(done) {
            var invalidId = mongoose.Types.ObjectId();
            request(app)
                .delete("/api/v1/meals/" + invalidId)
                .set("X-Access-Token", tokenAdmin)
                .set("Accept", "application/json")
                .expect(404, done)
        });

        it("should delete any meal when given an admin user token", function(done) {
            request(app)
                .delete("/api/v1/meals/" + testMeals[6]._id)
                .set("X-Access-Token", tokenAdmin)
                .set("Accept", "application/json")
                .expect(200, done)
        });
    });

    describe("POST meals/", function() {
        it("should return 401 when an invalid token is given", function (done) {
            request(app)
                .post("/api/v1/meals/" + testMeals[0]._id)
                .set("X-Access-Token", "invalid")
                .set("Accept", "application/json")
                .expect(401, done);
        });

        it("should return 403 when food field is empty", function(done) {
            request(app)
                .post('/api/v1/meals')
                .set("X-Access-Token", tokenNormal)
                .send({food: '', calories: 100, dateTime: new Date()})
                .expect(403, done);
        });

        it("should return 403 when calories field is empty", function(done) {
            request(app)
                .post('/api/v1/meals')
                .set("X-Access-Token", tokenNormal)
                .send({food: '', calories: '', dateTime: new Date()})
                .expect(403, done);
        });

        it("should return 403 when dateTime field is empty", function(done) {
            request(app)
                .post('/api/v1/meals')
                .set("X-Access-Token", tokenNormal)
                .send({food: 'eggs', calories: '76', dateTime: ''})
                .expect(403, done);
        });

        it("should return 201 when a meal is successfully created", function(done) {
            request(app)
                .post('/api/v1/meals')
                .set("X-Access-Token", tokenNormal)
                .send({food: 'eggs', calories: '76', dateTime: new Date()})
                .expect(201, done);
        });

        it("should return 401 when a normal user tries to create a meal on behalf of other user", function(done) {
            request(app)
                .post('/api/v1/meals')
                .set("X-Access-Token", tokenNormal)
                .send({user: idManager, food: 'eggs', calories: '76', dateTime: new Date()})
                .expect(401, done);
        });

        it("should return 401 when a manager user tries to create a meal on behalf of other user", function(done) {
            request(app)
                .post('/api/v1/meals')
                .set("X-Access-Token", tokenManager)
                .send({user: idAdmin, food: 'eggs', calories: '76', dateTime: new Date()})
                .expect(401, done);
        });

        it("should return 201 when an admin user creates a meal on behalf of a normal user", function(done) {
            request(app)
                .post('/api/v1/meals')
                .set("X-Access-Token", tokenAdmin)
                .send({user: idNormal, food: 'eggs', calories: '76', dateTime: new Date()})
                .expect(201, done);
        });

        it("should return 201 when an admin user creates a meal on behalf of an admin user", function(done) {
            request(app)
                .post('/api/v1/meals')
                .set("X-Access-Token", tokenAdmin)
                .send({user: idAdmin, food: 'eggs', calories: '76', dateTime: new Date()})
                .expect(201, done);
        });
    });

    describe("PUT /meals/:id", function() {
        it("should return 401 when an invalid token is given", function(done) {
            request(app)
                .put("/api/v1/meals/" + idNormal)
                .set("X-Access-Token", "invalid")
                .set("Accept", "application/json")
                .expect(401, done);
        });

        it("should return 403 when food field is empty", function(done) {
            request(app)
                .put('/api/v1/meals/' + idNormal)
                .set("X-Access-Token", tokenAdmin)
                .send({food: '', calories: '76', dateTime: new Date()})
                .expect(403, done);
        });

        it("should return 403 when calories field is empty", function(done) {
            request(app)
                .put('/api/v1/meals/' + idNormal)
                .set("X-Access-Token", tokenAdmin)
                .send({food: 'eggs', calories: '', dateTime: new Date()})
                .expect(403, done);
        });

        it("should return 403 when dateTime field is empty", function(done) {
            request(app)
                .put('/api/v1/meals/' + idNormal)
                .set("X-Access-Token", tokenAdmin)
                .send({food: 'eggs', calories: '76', dateTime: ''})
                .expect(403, done);
        });

        it("should return 403 when dateTime field is empty", function(done) {
            request(app)
                .put('/api/v1/meals/' + idNormal)
                .set("X-Access-Token", tokenAdmin)
                .send({food: 'eggs', calories: '76', dateTime: ''})
                .expect(403, done);
        });

        it("should return 404 when the meal id is malformed", function(done) {
            request(app)
                .put('/api/v1/meals/invalid')
                .set("X-Access-Token", tokenAdmin)
                .send({food: 'eggs', calories: '76', dateTime: new Date()})
                .expect(404, done);
        });

        it("should return 404 when the meal does not exist", function(done) {
            var invalidId = mongoose.Types.ObjectId();
            request(app)
                .put('/api/v1/meals/' + invalidId)
                .set("X-Access-Token", tokenAdmin)
                .send({food: 'eggs', calories: '76', dateTime: new Date()})
                .expect(404, done);
        });

        it("should return 401 when a normal user tries to update a meal on behalf of other user", function(done) {
            request(app)
                .put('/api/v1/meals/' + testMeals[3]._id)
                .set("X-Access-Token", tokenNormal)
                .send({food: 'eggs', calories: '76', dateTime: new Date()})
                .expect(401, done);
        });

        it("should return 401 when a manager user tries to update a meal on behalf of other user", function(done) {
            request(app)
                .put('/api/v1/meals/' + testMeals[0]._id)
                .set("X-Access-Token", tokenManager)
                .send({food: 'eggs', calories: '76', dateTime: new Date()})
                .expect(401, done);
        });

        it("should return 200 when an admin user updates a meal on behalf of a normal user", function(done) {
            request(app)
                .put('/api/v1/meals/' + testMeals[6]._id)
                .set("X-Access-Token", tokenAdmin)
                .send({food: 'eggs', calories: '76', dateTime: new Date()})
                .expect(200, done);
        });

        it("should return 200 when an admin user updates a meal on behalf of a manager user", function(done) {
            request(app)
                .put('/api/v1/meals/' + testMeals[3]._id)
                .set("X-Access-Token", tokenAdmin)
                .send({food: 'eggs', calories: '76', dateTime: new Date()})
                .expect(200, done);
        });

        it("should return 200 when an admin user updates a meal on behalf of an admin user", function(done) {
            request(app)
                .put('/api/v1/meals/' + testMeals[0]._id)
                .set("X-Access-Token", tokenAdmin)
                .send({food: 'eggs', calories: '76', dateTime: new Date()})
                .expect(200, done);
        });

        it("should return 200 when a normal user updates its meal", function(done) {
            request(app)
                .put('/api/v1/meals/' + testMeals[6]._id)
                .set("X-Access-Token", tokenNormal)
                .send({food: 'eggs', calories: '76', dateTime: new Date()})
                .expect(200, done);
        });

        it("should return 200 when a manager user updates its meal", function(done) {
            request(app)
                .put('/api/v1/meals/' + testMeals[3]._id)
                .set("X-Access-Token", tokenManager)
                .send({food: 'eggs', calories: '76', dateTime: new Date()})
                .expect(200, done);
        });
    });
});