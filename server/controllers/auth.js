var express = require('express'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    router = express.Router();


module.exports = function(config, models) {

    function daysToMinutes(days) {
        return days * 24 * 60;
    }

    function generateToken(username, validDays) {
        return jwt.sign({username: username}, config.TOKEN_SIGN_SECRET, {
            expiresIn: daysToMinutes(validDays) * 60
        });
    }

    router.post('/login', function(req, res, next) {
        var username = req.body.username;
        var password = req.body.password;
        models.user.findOne({username: username}, function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.sendStatus(401);
            }
            bcrypt.compare(password, user.password, function(err, isEqual) {
                if (err) {
                    return next(err);
                }
                if (isEqual) {
                    var token = generateToken(username, 30);
                    delete user.password;
                    res.json({
                        status: 1,
                        token: token,
                        expiresInMinutes: daysToMinutes(30),
                        user: user
                    });
                } else {
                    res.sendStatus(401);
                }
            });
        });
    });

    router.post('/signup', function(req, res, next) {
        req.checkBody('username').notEmpty().len(3, 20);
        req.checkBody('password').notEmpty().len(7);
        req.checkBody('firstName').notEmpty();
        req.checkBody('lastName').notEmpty();

        if (req.validationErrors()) {
            return res.sendStatus(403);
        }

        var data = {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            role: 0
        };
        bcrypt.hash(data.password, 10, function(err, hash) {
            data.password = hash;
            var m = models.user(data);
            m.save(function(err, user) {
                if (err) {
                    return next(err);
                }
                res.status(201).json(user);
            });
        })
    });

    router.get('/check-token', function(req, res, next) {
        var token = req.query.token;
        if (token) {
            jwt.verify(token, config.TOKEN_SIGN_SECRET, function(err, decoded) {
                if (err) {
                    if (err.name == 'TokenExpiredError') {
                        return res.json({
                            status: 401,
                            message: 'Token expired!',
                            expiredAt: err.expiredAt
                        });
                    } else if (err.name == 'JsonWebTokenError') {
                        return res.json({
                            status: 400,
                            message: 'Invalid Token!'
                        });
                    }
                    return next(err);
                }

                return res.json({
                    status: 200,
                    message: 'Token is valid'
                });
            });
        } else {
            return res.status(400).json({
                status: 400,
                message: 'Malformed request. Please read API docs.'
            });
        }

    });

    return router;
};
