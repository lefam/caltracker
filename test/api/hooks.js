var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    models = require("../../server/models"),
    request = require('supertest'),
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
            this.testMeals = meals;
            return getToken("leonel", "1234567");
        })
        .then( function(data) {
            this.tokenAdmin = data.token;
            this.idAdmin = data.id;
            return getToken("ana", "abcdefg");
        })
        .then( function(data) {
            this.tokenManager = data.token;
            this.idManager = data.id;
            return getToken("joao", "abc1234");
        })
        .then( function(data) {
            this.tokenNormal = data.token;
            this.idNormal = data.id;
            done();
        })
        .catch(done);
});