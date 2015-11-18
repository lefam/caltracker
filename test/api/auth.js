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
        lastName: "Machava"
    },
    {
        username: "ana",
        password: "$2a$10$yH3ucYi6gu8.WXPZH/rxierrDk8xdvD5lHkWOPQwwfEyBHpyNyzKS", // abcdefg
        firstName: "Ana",
        lastName: "Sitoe"
    },
    {
        username: "joao",
        password: "$2a$10$H060EowKW6kGoclpl0GHW.A.nAyHdcUZ/t71YDJ9KDoVGG6imsSsG", // abc1234
        firstName: "João",
        lastName: "Figueiredo"
    }
];

describe("Authentication API", function() {
    describe("POST /auth/login", function() {
        beforeEach( function(done) {
            models.user.remove({})
                .then( function() {
                    models.user.create(testUsers);
                })
                .then(done);
        });

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
        it("should return 401 when invalid credentials are given", function(done) {
            request(app)
                .post('/api/v1/auth/login')
                .send({username: 'leonel', password: 'bad-password'})
                .expect(401, done);
        });
    });
});