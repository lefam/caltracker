process.env.NODE_ENV = "test";
var request = require('supertest'),
    models = require("../../server/models"),
    expect = require('chai').expect,
    app = require("../../server/app.js").app;

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

function getToken(username, password, cb) {
    request(app)
        .post("/api/v1/auth/login")
        .send({username: username, password: password})
        .end( function(err, res) {
            if (err) return cb(err);
            cb(null, res.body.token);
        });
}

describe("Users API", function() {
    beforeEach( function(done) {
        models.user
            .remove({})
            .then( function() {
                models.user.create(testUsers);
            })
            .then( function() {
                getToken("leonel", "1234567", function(err, token) {
                    if (err) return done(err);
                    tokenAdmin = token;

                    getToken("ana", "abcdefg", function(err, token) {
                        if (err) return done(err);
                        tokenManager = token;

                        getToken("joao", "abc1234", function(err, token) {
                            tokenNormal = token;
                            done();
                        });
                    });
                });
            });
    });

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
});