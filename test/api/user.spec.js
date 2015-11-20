process.env.NODE_ENV = "test";
var request = require('supertest'),
    mongoose = require('mongoose'),
    expect = require('chai').expect,
    app = require("../../server/app.js").app;

require('./hooks');

describe("Users API", function() {
    describe("GET /users/", function() {
        it("should return 401 when an invalid token is given", function(done) {
            request(app)
                .get("/api/v1/users")
                .set("X-Access-Token", "invalid")
                .set("Accept", "application/json")
                .expect(401, done);
        });

        it("should return a list of users when given an admin token", function(done) {
            request(app)
                .get("/api/v1/users")
                .set("X-Access-Token", tokenAdmin)
                .set("Accept", "application/json")
                .expect(200)
                .end( function(err, res) {
                    expect(res.body.length).to.equal(3);
                    done();
                });
        });

        it("should return a list of users when given a manager token", function(done) {
            request(app)
                .get("/api/v1/users")
                .set("X-Access-Token", tokenAdmin)
                .set("Accept", "application/json")
                .expect(200)
                .end( function(err, res) {
                    expect(res.body.length).to.equal(3);
                    done();
                });
        });

        it("should return 401 when given a normal user token", function(done) {
            request(app)
                .get("/api/v1/users")
                .set("X-Access-Token", tokenNormal)
                .set("Accept", "application/json")
                .expect(401, done);
        });

        it.skip("should skip users when given an offset in query string", function(done) {
        });

        it.skip("should limit users when given a limit in query string", function(done) {
        });
    });

    describe("GET /users/:id", function() {
        it("should return 401 when an invalid token is given", function(done) {
            request(app)
                .get("/api/v1/users/" + idNormal)
                .set("X-Access-Token", "invalid")
                .set("Accept", "application/json")
                .expect(401, done);
        });

        // When a normal user tries to get information of another user the server should respond with 401.
        it("should return 401 when a normal user token requests a different user", function(done) {
            request(app)
                .get("/api/v1/users/" + idManager)
                .set("X-Access-Token", tokenNormal)
                .set("Accept", "application/json")
                .expect(401, done);
        });

        it("should return user info when given a normal user token and the user is the owner of the token", function(done) {
            request(app)
                .get("/api/v1/users/" + idNormal)
                .set("X-Access-Token", tokenNormal)
                .set("Accept", "application/json")
                .expect(200)
                .end( function(err, res) {
                    if (err) return done(err);
                    expect(res.body.username).to.equal('joao');
                    done();
                });
        });

        it("should return 404 when the given user id is malformed", function(done) {
            request(app)
                .get("/api/v1/users/123")
                .set("X-Access-Token", tokenAdmin)
                .set("Accept", "application/json")
                .expect(404, done);
        });

        it("should return 404 when the user does not exist", function(done) {
            var invalidId = mongoose.Types.ObjectId();
            request(app)
                .get("/api/v1/users/" + invalidId)
                .set("X-Access-Token", tokenAdmin)
                .set("Accept", "application/json")
                .expect(404, done);
        });

        it("should return the right user when given an admin token and a valid user id", function(done) {
            request(app)
                .get("/api/v1/users/" + idNormal)
                .set("X-Access-Token", tokenAdmin)
                .set("Accept", "application/json")
                .expect(200)
                .end( function(err, res) {
                    if (err) return done(err);
                    expect(res.body.username).to.equal('joao');
                    done();
                });
        });

        it("should return the right user when given a manager token and a valid user id", function(done) {
            request(app)
                .get("/api/v1/users/" + idNormal)
                .set("X-Access-Token", tokenManager)
                .set("Accept", "application/json")
                .expect(200)
                .end( function(err, res) {
                    if (err) return done(err);
                    expect(res.body.username).to.equal('joao');
                    done();
                });
        });
    });

    describe("POST /users/", function() {
        it("should return 401 when an invalid token is given", function(done) {
            request(app)
                .post("/api/v1/users")
                .set("X-Access-Token", "invalid")
                .set("Accept", "application/json")
                .expect(401, done);
        });

        it("should return 401 when a normal user token tries to create a user", function(done) {
            request(app)
                .post("/api/v1/users")
                .set("X-Access-Token", tokenNormal)
                .send({username: 'abdul', password: '123456789', firstName: 'Abdul', lastName: 'Abudo'})
                .expect(401, done);
        });

        it("should return 401 when a manager user token tries to create a user with admin role", function(done) {
            request(app)
                .post("/api/v1/users")
                .set("X-Access-Token", tokenManager)
                .send({username: 'abdul', password: '123456789', firstName: 'Abdul', lastName: 'Abudo', role: 2})
                .expect(401, done);
        });

        it("should return 403 when username is empty", function(done) {
            request(app)
                .post('/api/v1/users')
                .set("X-Access-Token", tokenAdmin)
                .send({username: '', password: '123456789', firstName: 'Abdul', lastName: 'Abudo'})
                .expect(403, done);
        });

        it("should return 403 when username is less than 3 characters", function(done) {
            request(app)
                .post('/api/v1/users')
                .set("X-Access-Token", tokenAdmin)
                .send({username: 'ab', password: '123456789', firstName: 'Abdul', lastName: 'Abudo'})
                .expect(403, done);
        });

        it("should return 403 when username has more than 20 characters", function(done) {
            request(app)
                .post('/api/v1/users')
                .set("X-Access-Token", tokenAdmin)
                .send({username: 'abcdefghijklmnopqrstu', password: '123456789', firstName: 'Abdul', lastName: 'Abudo'})
                .expect(403, done);
        });

        it("should return 403 when password is less than 6 characters", function(done) {
            request(app)
                .post('/api/v1/users')
                .set("X-Access-Token", tokenAdmin)
                .send({username: 'abdul', password: '1234', firstName: 'Abdul', lastName: 'Abudo'})
                .expect(403, done);
        });

        it("should return 403 when user's first name is empty", function(done) {
            request(app)
                .post('/api/v1/users')
                .set("X-Access-Token", tokenAdmin)
                .send({username: 'abdul', password: '123456789', firstName: '', lastName: 'Abudo'})
                .expect(403, done);
        });

        it("should return 403 when user's last name is empty", function(done) {
            request(app)
                .post('/api/v1/users')
                .set("X-Access-Token", tokenAdmin)
                .send({username: 'abdul', password: '123456789', firstName: '', lastName: ''})
                .expect(403, done);
        });

        it("should return 403 when user with same name already exists", function(done) {
            request(app)
                .post('/api/v1/users')
                .set("X-Access-Token", tokenAdmin)
                .send({username: 'leonel', password: '123456789', firstName: 'Abdul', lastName: 'Abudo'})
                .expect(403, done);
        });

        it("should return 201 when a manager token successfully creates a user", function(done) {
            request(app)
                .post('/api/v1/users')
                .set("X-Access-Token", tokenManager)
                .send({username: 'abdul', password: '123456789', firstName: 'Abdul', lastName: 'Abudo', role: 1})
                .expect(201, done);
        });

        it("should return 201 when an admin token successfully creates a user", function(done) {
            request(app)
                .post('/api/v1/users')
                .set("X-Access-Token", tokenAdmin)
                .send({username: 'abdul', password: '123456789', firstName: 'Abdul', lastName: 'Abudo', role: 2})
                .expect(201, done);
        });
    });

    describe("PUT /users/:id", function() {
        it("should return 401 when an invalid token is given", function(done) {
            request(app)
                .put("/api/v1/users/" + idNormal)
                .set("X-Access-Token", "invalid")
                .set("Accept", "application/json")
                .expect(401, done);
        });

        it("should return 404 when the user id is malformed", function(done) {
            request(app)
                .put('/api/v1/users/invalid')
                .set("X-Access-Token", tokenAdmin)
                .send({username: 'leonel', password: '123456789', firstName: 'Abdul', lastName: 'Abudo', role: 0})
                .expect(404, done);
        });

        it("should return 404 when the user does not exist", function(done) {
            var invalidId = mongoose.Types.ObjectId();
            request(app)
                .put('/api/v1/users/' + invalidId)
                .set("X-Access-Token", tokenAdmin)
                .send({username: 'leonel', password: '123456789', firstName: 'Abdul', lastName: 'Abudo', role: 0})
                .expect(404, done);
        });

        it("should return 403 when username is empty", function(done) {
            request(app)
                .put('/api/v1/users/' + idNormal)
                .set("X-Access-Token", tokenAdmin)
                .send({username: '', password: '123456789', firstName: 'Abdul', lastName: 'Abudo', role: 0})
                .expect(403, done);
        });

        it("should return 403 when username is less than 3 characters", function(done) {
            request(app)
                .put('/api/v1/users/' + idNormal)
                .set("X-Access-Token", tokenAdmin)
                .send({username: 'ab', password: '123456789', firstName: 'Abdul', lastName: 'Abudo', role: 0})
                .expect(403, done);
        });

        it("should return 403 when password is less than 6 characters", function(done) {
            request(app)
                .put('/api/v1/users/' + idNormal)
                .set("X-Access-Token", tokenAdmin)
                .send({username: 'abdul', password: '1234', firstName: 'Abdul', lastName: 'Abudo', role: 0})
                .expect(403, done);
        });

        it("should return 403 when user's first name is empty", function(done) {
            request(app)
                .put('/api/v1/users/' + idNormal)
                .set("X-Access-Token", tokenAdmin)
                .send({username: 'abdul', password: '123456789', firstName: '', lastName: 'Abudo', role: 0})
                .expect(403, done);
        });

        it("should return 403 when user's last name is empty", function(done) {
            request(app)
                .put('/api/v1/users/' + idNormal)
                .set("X-Access-Token", tokenAdmin)
                .send({username: 'abdul', password: '123456789', firstName: '', lastName: '', role: 0})
                .expect(403, done);
        });

        it("should return 403 when user role is invalid", function(done) {
            request(app)
                .put('/api/v1/users/' + idNormal)
                .set("X-Access-Token", tokenAdmin)
                .send({username: 'abdul', password: '123456789', firstName: '', lastName: ''})
                .expect(403, done);
        });

        it("should return 403 when user with same name already exists and is changing password", function(done) {
            request(app)
                .put('/api/v1/users/' + idNormal)
                .set("X-Access-Token", tokenAdmin)
                .send({username: 'leonel', password: '123456789', currentPassword: 'abc1234', firstName: 'Abdul', lastName: 'Abudo', role: 0})
                .expect(403, done);
        });

        it("should return 403 when user with same name already exists and is not changing password", function(done) {
            request(app)
                .put('/api/v1/users/' + idNormal)
                .set("X-Access-Token", tokenAdmin)
                .send({username: 'leonel', firstName: 'Abdul', lastName: 'Abudo', role: 0})
                .expect(403, done);
        });

        it("should return 401 when a normal user tries to update records of a different user", function(done) {
            request(app)
                .put('/api/v1/users/' + idManager)
                .set("X-Access-Token", tokenNormal)
                .send({username: 'mrking', password: '123456789', firstName: 'Abdul', lastName: 'Abudo', role: 0})
                .expect(401, done);
        });

        it("should return 401 when a manager user tries to update records of an admin user", function(done) {
            request(app)
                .put('/api/v1/users/' + idAdmin)
                .set("X-Access-Token", tokenManager)
                .send({username: 'leonel', password: '123456789', firstName: 'Abdul', lastName: 'Abudo', role: 0})
                .expect(401, done);
        });

        it("should return 200 when the user password is successfully updated", function(done) {
            request(app)
                .put('/api/v1/users/' + idNormal)
                .set("X-Access-Token", tokenNormal)
                .send({username: 'joao', password: '999999', currentPassword: 'abc1234', firstName: 'Abdul', lastName: 'Abudo', role: 0})
                .expect(200, done);
        });

        it("should return 200 when the user is successfully updated without changing password", function(done) {
            request(app)
                .put('/api/v1/users/' + idNormal)
                .set("X-Access-Token", tokenNormal)
                .send({username: 'joao', firstName: 'Abdul', lastName: 'Abudo', role: 0})
                .expect(200, done);
        });
    });

    describe("(update maxCaloriesPerDay) PATCH /users/:id/max_daily_calories", function() {
        it("should return 401 when an invalid token is given", function(done) {
            request(app)
                .patch("/api/v1/users/" + idNormal + "/max_daily_calories")
                .set("X-Access-Token", "invalid")
                .set("Accept", "application/json")
                .send({maxCaloriesPerDay: 300})
                .expect(401, done);
        });

        it("should return 404 when the user id is malformed", function(done) {
            request(app)
                .patch('/api/v1/users/invalid/max_daily_calories')
                .set("X-Access-Token", tokenAdmin)
                .send({maxCaloriesPerDay: 300})
                .expect(404, done);
        });

        it("should return 404 when the user does not exist", function(done) {
            var invalidId = mongoose.Types.ObjectId();
            request(app)
                .patch('/api/v1/users/' + invalidId + "/max_daily_calories")
                .set("X-Access-Token", tokenAdmin)
                .send({maxCaloriesPerDay: 300})
                .expect(404, done);
        });

        it("should return 403 when maxCaloriesPerDay is empty", function(done) {
            request(app)
                .patch('/api/v1/users/' + idNormal + "/max_daily_calories")
                .set("X-Access-Token", tokenNormal)
                .expect(403, done);
        });

        it("should return 403 when maxCaloriesPerDay is invalid", function(done) {
            request(app)
                .patch('/api/v1/users/' + idNormal + "/max_daily_calories")
                .set("X-Access-Token", tokenNormal)
                .send({maxCaloriesPerDay: 'invalid'})
                .expect(403, done);
        });

        it("should return 200 when the user is successfully patched", function(done) {
            request(app)
                .patch('/api/v1/users/' + idNormal + "/max_daily_calories")
                .set("X-Access-Token", tokenNormal)
                .send({maxCaloriesPerDay: 300})
                .expect(200, done);
        });
    });

    describe("DELETE /users/:id", function() {
        it("should return 401 when an invalid token is given", function (done) {
            request(app)
                .delete("/api/v1/users/" + idNormal)
                .set("X-Access-Token", "invalid")
                .set("Accept", "application/json")
                .expect(401, done);
        });

        it("should delete a user when given a normal user token and the user is the owner of the token", function(done) {
            request(app)
                .delete("/api/v1/users/" + idNormal)
                .set("X-Access-Token", tokenNormal)
                .set("Accept", "application/json")
                .expect(200, done)
        });

        it("should return 401 when normal user token tries to delete a different user", function(done) {
            request(app)
                .delete("/api/v1/users/" + idManager)
                .set("X-Access-Token", tokenNormal)
                .set("Accept", "application/json")
                .expect(401, done)
        });

        it("should return 401 when manager user token tries to delete an admin user", function(done) {
            request(app)
                .delete("/api/v1/users/" + idAdmin)
                .set("X-Access-Token", tokenManager)
                .set("Accept", "application/json")
                .expect(401, done)
        });

        it("should return 404 when the user id is invalid", function(done) {
            request(app)
                .delete("/api/v1/users/invalid")
                .set("X-Access-Token", tokenAdmin)
                .set("Accept", "application/json")
                .expect(404, done)
        });

        it("should return 404 when the user does not exist", function(done) {
            var invalidId = mongoose.Types.ObjectId();
            request(app)
                .delete("/api/v1/users/" + invalidId)
                .set("X-Access-Token", tokenAdmin)
                .set("Accept", "application/json")
                .expect(404, done)
        });
    });
});