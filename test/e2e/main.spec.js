process.env.NODE_ENV = "test";
var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    config = require("../../server/config"),
    models = require("../../server/models");

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

beforeEach( function(done) {
    mongoose.connection.close();
    mongoose.connect(config.DATABASE_URL);
    models.user
        .remove({})
        .then( function() {
            return models.user.create(testUsers);
        })
        .then(done);
});

describe("CalTracker App", function() {
    it("should show the login form when not authenticated", function() {
        browser.get("http://localhost:4002");
        expect(element(by.name("loginForm")).isPresent()).toBe(true);
    });

    it("should show the signup form", function() {
        browser.get("http://localhost:4002/#/signup");
        expect(element(by.css(".signup-box")).isPresent()).toBe(true);
    });

    it("should give error message when invalid credentials are entered in login form", function() {
        browser.get("http://localhost:4002");
        element(by.model("loginCtrl.username")).sendKeys("leonel");
        element(by.model("loginCtrl.password")).sendKeys("wrongpassword");
        element(by.css("button")).click();

        browser.wait(protractor.ExpectedConditions.alertIsPresent(), 10000);

        var alertDialog = browser.switchTo().alert();
        expect(alertDialog.getText()).toBe("Username or password invalid!");
        alertDialog.accept();
    });

    it("should login successfully when correct credentials are entered", function() {
        browser.get("http://localhost:4002");
        element(by.model("loginCtrl.username")).clear().sendKeys("leonel");
        element(by.model("loginCtrl.password")).clear().sendKeys("1234567");
        element(by.css("button")).click();
        expect(element(by.css(".hello")).getText()).toBe("Hi leonel!");
    });
});