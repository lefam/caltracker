var express = require('express'),
    bcrypt = require('bcrypt'),
    router = express.Router();

module.exports = function(config, models) {

    router.get('/', function(req, res, next) {
        // Only managers and admins can retrieve the full list of users
        if (req.user.role < models.roles.ROLE_MANAGER) {
            return res.sendStatus(401);
        }

        models.user.find({}, function(err, users) {
            if (err) {
                return next(err);
            }
            res.json(users);
        })
    });

    router.get('/:id', function(req, res, next) {
        var id = req.params.id;
        var criteria = {
            _id: id
        };

        // This makes sure that a regular user is able to fetch info only from his account but gives ability for
        // managers and administrators to fetch info about any account.
        if (req.user.role < models.roles.ROLE_MANAGER) {
            criteria.user = req.user._id;
        }

        models.user.findOne(criteria, function(err, user) {
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
            password: req.body.password,
            role: Number(req.body.role) || 0
        };

        if (req.user.role > models.user.roles().ROLE_NORMAL) {
            // The owner of the API token is not allowed to create users with roles that are greater than his own.
            if (data.role > req.user.role) {
                res.sendStatus(401);
            }
        }

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
        var criteria = {
            username: username
        };
        // This makes sure that a regular user is able to update only his account but gives ability for
        // managers and administrators to update any account.
        if (req.user.role < models.roles.ROLE_MANAGER) {
            criteria.user = req.user._id;
        }
        models.user.update(criteria, {$set: data}, function(err) {
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
        var criteria = {
            _id: id
        };
        // This makes sure that a regular user is able to delete only his account but gives ability for
        // managers and administrators to delete any account.
        if (req.user.role < models.roles.ROLE_MANAGER) {
            criteria.user = req.user._id;
        }
        models.user.remove(criteria, function(err) {
            if(err) {
                return next(err);
            }
            res.sendStatus(200);
        });
    });

    return router;
};