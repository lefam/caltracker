var express = require('express'),
    bcrypt = require('bcrypt'),
    mongoose = require('mongoose'),
    router = express.Router();

module.exports = function(config, models) {

    router.get('/', function(req, res, next) {
        // Only managers and admins can retrieve the full list of users
        if (req.user.role < models.user.roles().ROLE_MANAGER) {
            return res.sendStatus(401);
        }

        models.user.find({}, function(err, users) {
            /* istanbul ignore if */
            if (err) {
                return next(err);
            }
            users.forEach( function(u) {
                u.password = null;
                delete u.password;
            });
            res.json(users);
        })
    });

    router.get('/:id', function(req, res, next) {
        var id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.sendStatus(404);
        }

        var criteria = {
            _id: id
        };

        // This makes sure that a regular user is able to fetch info only from his account but gives ability for
        // managers and administrators to fetch info about any account.
        if (req.user.role < models.user.roles().ROLE_MANAGER && req.user._id != id) {
            res.sendStatus(401);
        }

        models.user.findOne(criteria, function(err, user) {
            /* istanbul ignore if */
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
        // Normal users should not use this endpoint to create users. This is reserved for managers and admins.
        // Normal users should create users through the /auth/signup endpoint
        if (req.user.role === models.user.roles().ROLE_NORMAL) {
            return res.sendStatus(401);
        }

        req.checkBody('username').notEmpty().len(3, 20);
        req.checkBody('password').notEmpty().len(6);
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
            maxCaloriesPerDay: req.maxCaloriesPerDay || 250,
            role: Number(req.body.role) || 0
        };

        // The owner of the API token is not allowed to create users with roles that are greater than his own.
        if (data.role > req.user.role) {
            return res.sendStatus(401);
        }

        models.user.findOne({username: data.username}, function(err, user) {
            /* istanbul ignore if */
            if (err) {
                return next(err);
            }
            if (!user) {
                bcrypt.hash(data.password, 10, function(err, hash) {
                    data.password = hash;
                    var m = models.user(data);
                    m.save(function(err, user) {
                        /* istanbul ignore if */
                        if (err) {
                            return next(err);
                        }
                        res.status(201).json(user);
                    });
                });
            } else {
                res.sendStatus(403);
            }
        });
    });

    router.patch('/:id/max_daily_calories', function(req, res, next) {
        var id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.sendStatus(404);
        }

        req.checkBody('maxCaloriesPerDay').notEmpty().isInt({min: 0});

        if (req.validationErrors()) {
            return res.sendStatus(403);
        }

        var data = {
            maxCaloriesPerDay: req.body.maxCaloriesPerDay
        };

        var criteria = {
            _id: id
        };

        // This makes sure that a regular user is able to update only his account but gives ability for
        // managers and administrators to update any account.
        if (req.user.role < models.user.roles().ROLE_MANAGER && req.user._id.toString() != criteria._id) {
            return res.sendStatus(401);
        }

        models.user.findOne(criteria, function(err, user) {
            /* istanbul ignore if */
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.sendStatus(404);
            }

            // The owner of the API token is not allowed to update users with roles that are greater than his own.
            if (req.user.role > models.user.roles().ROLE_NORMAL && user.role > req.user.role) {
                // The owner of the API token is not allowed to update users with roles that are greater than his own.
                return res.sendStatus(401);
            }

            models.user.update(criteria, {$set: data}, function(err) {
                if (err) {
                    if (err.code === 11000) {
                        return res.sendStatus(403);
                    }
                    /* istanbul ignore next */
                    return next(err);
                }
                res.sendStatus(200);
            });
        });
    });

    router.put('/:id', function(req, res, next) {
        var id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.sendStatus(404);
        }

        if (req.body.password && req.body.password.length < 6) {
            return res.sendStatus(403);
        }

        req.checkBody('username').notEmpty().len(3, 20);
        req.checkBody('firstName').notEmpty();
        req.checkBody('lastName').notEmpty();
        req.checkBody('role').notEmpty().isInt({min: 0, max: 2});

        if (req.validationErrors()) {
            return res.sendStatus(403);
        }

        var data = {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            currentPassword: req.body.currentPassword,
            password: req.body.password,
            role: req.body.role
        };

        var criteria = {
            _id: id
        };

        // This makes sure that a regular user is able to update only his account but gives ability for
        // managers and administrators to update any account.
        if (req.user.role < models.user.roles().ROLE_MANAGER && req.user._id.toString() != criteria._id) {
            return res.sendStatus(401);
        }

        models.user.findOne(criteria).select("+password").exec( function(err, user) {
            /* istanbul ignore if */
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.sendStatus(404);
            }

            // The owner of the API token is not allowed to update users with roles that are greater than his own.
            if (req.user.role > models.user.roles().ROLE_NORMAL && user.role > req.user.role) {
                // The owner of the API token is not allowed to update users with roles that are greater than his own.
                return res.sendStatus(401);
            }

            if (data.password) {
                if (!data.currentPassword && req.user.role >= models.user.roles().ROLE_MANAGER) {
                    bcrypt.hash(data.password, 10, function (err, hash) {
                        data.password = hash;
                        models.user.update(criteria, {$set: data}, function (err) {
                            if (err) {
                                if (err.code === 11000) {
                                    return res.status(403).json({message: 'Username already exists'});
                                }
                                /* istanbul ignore next */
                                return next(err);
                            }
                            res.sendStatus(200);
                        });
                    });
                } else {
                    bcrypt.compare(data.currentPassword, user.password, function(err, isEqual) {
                        if (err) {
                            return next(err);
                        }
                        if (isEqual) {
                            bcrypt.hash(data.password, 10, function (err, hash) {
                                data.password = hash;
                                models.user.update(criteria, {$set: data}, function (err) {
                                    if (err) {
                                        if (err.code === 11000) {
                                            return res.status(403).json({message: 'Username already exists'});
                                        }
                                        /* istanbul ignore next */
                                        return next(err);
                                    }
                                    res.sendStatus(200);
                                });
                            });
                        } else {
                            res.status(403).json({message: "Current password is invalid!"});
                        }
                    });
                }
            } else {
                delete data.password;
                delete data.currentPassword;
                models.user.update(criteria, {$set: data}, function(err) {
                    if (err) {
                        if (err.code === 11000) {
                            return res.status(403).json({message: 'Username already exists'});
                        }
                        /* istanbul ignore next */
                        return next(err);
                    }
                    res.sendStatus(200);
                });
            }
        });
    });

    router.delete('/:id', function(req, res, next) {
        var id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.sendStatus(404);
        }

        var criteria = {
            _id: id
        };
        // This makes sure that a regular user is able to delete only his account but gives ability for
        // managers and administrators to delete any account.
        if (req.user.role === models.user.roles().ROLE_MANAGER && req.user._id.toString() !== criteria._id) {
            return res.sendStatus(401);
        }

        models.user.findOne(criteria, function(err, user) {
            /* istanbul ignore if */
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.sendStatus(404);
            }
            if (req.user.role < user.role) {
                return res.sendStatus(401);
            }
            models.user.remove(criteria, function(err) {
                /* istanbul ignore if */
                if(err) {
                    return next(err);
                }
                // Remove all the meals associated with this user.
                models.meal.remove({user: user._id}, function(err) {
                    if (err) {
                        return next(err);
                    }
                    res.sendStatus(200);
                });
            });
        });
    });

    return router;
};