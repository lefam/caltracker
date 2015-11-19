process.env.NODE_ENV = "test";
var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    request = require('supertest'),
    models = require("../../server/models"),
    expect = require('chai').expect,
    app = require("../../server/app.js").app;

// Set mongoose to use bluebird Promises.
mongoose.Promise = Promise;

var testUsers = [
    {
        username: "leonel",
        password: "$2a$10$GV9PrIemaQgE5zdA/OJg7e7sNF0r5HgT07gyn/L.W1o7nE0KcGsPu", // 1234567
        firstName: "Leonel",
        lastName: "Machava",
        role: 2
    },
    {
        username: "ana",
        password: "$2a$10$yH3ucYi6gu8.WXPZH/rxierrDk8xdvD5lHkWOPQwwfEyBHpyNyzKS", // abcdefg
        firstName: "Ana",
        lastName: "Sitoe",
        role: 1
    },
    {
        username: "joao",
        password: "$2a$10$H060EowKW6kGoclpl0GHW.A.nAyHdcUZ/t71YDJ9KDoVGG6imsSsG", // abc1234
        firstName: "João",
        lastName: "Figueiredo",
        role: 0
    }
];

var testMeals = [
    {
        food: "beans",
        calories: 100,
        dateTime: new Date("2015-11-11")
    },
    {
        food: "bread",
        calories: 10,
        dateTime: new Date("2015-11-11")
    },
    {
        food: "rice",
        calories: 200,
        dateTime: new Date("2015-11-11")
    },
    {
        food: "chicken",
        calories: 90,
        dateTime: new Date("2015-11-11")
    },
    {
        food: "steak",
        calories: 300,
        dateTime: new Date("2015-11-11")
    },
    {
        food: "greek salad",
        calories: 30,
        dateTime: new Date("2015-11-11")
    },
    {
        food: "hamburguer",
        calories: 250,
        dateTime: new Date("2015-11-11")
    },
    {
        food: "banana",
        calories: 20,
        dateTime: new Date("2015-11-11")
    },
    {
        food: "apple",
        calories: 15,
        dateTime: new Date("2015-11-11")
    }
];

function getToken(username, password) {
    return new Promise( function(resolve, reject) {
        request(app)
            .post("/api/v1/auth/login")
            .send({username: username, password: password})
            .end( function(err, res) {
                if (err) {
                    reject(err);
                } else {
                    var data = {
                        token: res.body.token,
                        id: res.body.user._id
                    };
                    resolve(data);
                }
            });
    });
}

describe("Meals API", function() {
    beforeEach( function(done) {
        models.user
            .remove({})
            .then( function() {
                return models.meal.remove({});
            })
            .then( function() {
                return models.user.create(testUsers);
            })
            .then( function(users) {
                var j = 0;
                for( var i = 0; i < users.length; i++ ) {
                    testMeals[j++].user = users[i]._id;
                    testMeals[j++].user = users[i]._id;
                    testMeals[j++].user = users[i]._id;
                }
                return models.meal.create(testMeals);
            }).then( function(meals) {
                testMeals = meals;
                return getToken("leonel", "1234567");
            })
            .then( function(data) {
                tokenAdmin = data.token;
                idAdmin = data.id;
                return getToken("ana", "abcdefg");
            })
            .then( function(data) {
                tokenManager = data.token;
                idManager = data.id;
                return getToken("joao", "abc1234");
            })
            .then( function(data) {
                tokenNormal = data.token;
                idNormal = data.id;
                done();
            })
            .catch(done);
    });

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