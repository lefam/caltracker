var mongoose = require('mongoose'),
    router = require('express').Router();

module.exports = function(config, models) {
    router.get('/:id', function(req, res, next) {
        var id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.sendStatus(404);
        }

        var criteria = {
            _id: id
        };


        models.meal.findOne(criteria, function(err, meal) {
            /* istanbul ignore if */
            if (err) {
                return next(err);
            }
            if (meal) {
                // This makes sure that a regular user is able to fetch only his meals but gives ability for
                // managers and administrators to fetch any meal.
                if (req.user.role <= models.user.roles().ROLE_MANAGER && req.user._id.toString() != meal.user.toString()) {
                    return res.sendStatus(401);
                }

                res.json(meal);
            } else {
                res.sendStatus(404);
            }
        });
    });

    router.get('/', function(req, res, next) {
        var limit = Number(req.query.limit) || 60;
        var offset = Number(req.query.offset) || 0;
        var fromDateTime = Number(req.query.fromDateTime) || (Date.now() - 30 * 24 * 60 * 60 * 1000);
        var toDateTime = Number(req.query.toDateTime) || Date.now();
        var fetchAll = req.query.all === "1";

        fromDateTime = new Date(fromDateTime);
        toDateTime = new Date(toDateTime);

        var criteria = {
            dateTime: {
                $gte: fromDateTime,
                $lte: toDateTime
            }
        };

        // Only admins can retrieve the meals of any user
        if (fetchAll) {
            if (req.user.role <= models.user.roles().ROLE_MANAGER) {
                return res.sendStatus(401);
            }
        } else if (req.query.user) {
            if (req.user.role <= models.user.roles().ROLE_MANAGER) {
                return res.sendStatus(401);
            } else {
                criteria.user = req.query.user;
            }
        } else {
            criteria.user = req.user._id;
        }

        models.meal.find(criteria)
            .skip(offset)
            .limit(limit)
            .populate('user')
            .exec( function(err, meals) {
                /* istanbul ignore if */
                if (err) {
                    return next(err);
                }
                return res.json(meals);
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

        // This makes sure that a regular user is able to delete only his meals but gives ability for
        // administrators to delete any meal.
        if (req.user.role <= models.user.roles().ROLE_MANAGER) {
            criteria.user = req.user._id;
        }

        models.meal.findOne(criteria, function(err, meal) {
            /* istanbul ignore if */
            if (err) {
                return next(err);
            }

            if (meal) {
                models.meal.remove(criteria, function(err) {
                    /* istanbul ignore if */
                    if (err) {
                        return next(err);
                    }
                    res.sendStatus(200);
                });
            } else {
                res.sendStatus(404);
            }
        });
    });

    router.post('/', function(req, res, next) {
        req.checkBody('food').notEmpty();
        req.checkBody('calories').notEmpty().isInt();
        req.checkBody('dateTime').notEmpty().isDate();

        if (req.validationErrors()) {
            return res.sendStatus(403);
        }

        var data = {
            food: req.body.food,
            dateTime: req.body.dateTime,
            calories: req.body.calories
        };

        if (req.user.role !== models.user.roles().ROLE_ADMIN) {
            // Non-admin users are disallowed to create meals on behalf of other users.
            if (req.body.user && req.body.user !== req.user._id.toString()) {
                return res.sendStatus(401);
            } else {
                data.user = req.user._id;
            }
        } else {
            // Administrators are allowed to add meals on behalf of other users.
            data.user = req.body.user || req.user._id;
        }

        var meal = new models.meal(data);

        meal.save( function(err, m) {
            /* istanbul ignore if */
            if (err) {
                return next(err);
            }
            res.status(201).json(m);
        });
    });

    router.put('/:id', function(req, res, next) {
        var id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.sendStatus(404);
        }

        req.checkBody('food').notEmpty();
        req.checkBody('calories').notEmpty().isInt();
        req.checkBody('dateTime').notEmpty().isDate();

        if (req.validationErrors()) {
            return res.sendStatus(403);
        }

        var data = {
            food: req.body.food,
            dateTime: req.body.dateTime,
            calories: req.body.calories,
            user: req.body.user || req.user._id
        };

        var criteria = {
            _id: id
        };

        models.meal.findOne(criteria, function(err, meal) {
            /* istanbul ignore if */
            if (err) {
                return next(err);
            }
            if (meal) {
                // This makes sure that regular and manager users are able to update only their meals but gives ability for
                // administrators to update any meal.
                if (req.user.role <= models.user.roles().ROLE_MANAGER && req.user._id.toString() !== meal.user.toString()) {
                    return res.sendStatus(401);
                }

                models.meal.update(criteria, {$set: data}, function(err) {
                    /* istanbul ignore if */
                    if (err) {
                        return next(err);
                    }
                    res.sendStatus(200);
                });
            } else {
                res.sendStatus(404);
            }
        });
    });

    return router;
};