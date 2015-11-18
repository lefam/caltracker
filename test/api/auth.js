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
});