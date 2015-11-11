var express = require('express'),
    bcrypt = require('bcrypt'),
    router = express.Router();

module.exports = function(config, models) {

    router.get('/', function(req, res, next) {
        models.user.find({}, function(err, users) {
            if (err) {
                return next(err);
            }
            res.json(users);
        })
    });

    router.get('/:id', function(req, res, next) {
        var id = req.params.id;

        models.user.findOne({_id: id}, function(err, user) {
            if (err) {
                return next(err);
            }
            if (user) {
                res.json(user);
            } else {
                res.sendStatus(404);
            }
        });
    });

    router.post('/', function(req, res, next) {
        //TODO: Sanitize the relevant input values.
        var data = {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
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

    router.put('/', function(req, res, next) {
        //TODO: Sanitize the relevant input values.
        var data = {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        };
        models.user.update({username: username}, {$set: data}, function(err) {
            if (err) {
                return next(err);
            }
            res.json({
                status: 1
            });
        });
    });

    router.delete('/:id', function(req, res, next) {
        var id = req.params.id;
        models.user.remove({_id: id}, function(err) {
            if(err) {
                return next(err);
            }
            res.sendStatus(200);
        });
    });

    return router;
};
