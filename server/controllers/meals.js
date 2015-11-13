var router = require('express').Router();

module.exports = function(config, models) {
    router.get('/:id', function(req, res, next) {
        var id = req.params.id;
        models.meal.findOne({_id: id}, function(err, meal) {
            if (err) {
                return next(err);
            }
            if (meal) {
                res.json(meal);
            } else {
                res.sendStatus(404);
            }
        });
    });

    router.get('/', function(req, res, next) {
        var limit = req.query.limit || 60;
        var offset = req.query.offset || 0;
        var fromDateTime = req.query.fromDateTime || (Date.now() - 30 * 24 * 60 * 60 * 1000);
        var toDateTime = req.query.toDateTime || Date.now();

        models.meal.find({})
            .skip(offset)
            .limit(limit)
            .exec( function(err, meals) {
                if (err) {
                    return next(err);
                }
                return res.json(meals);
            });
    });

    router.delete('/:id', function(req, res, next) {
        var id = req.params.id;
        models.meal.remove({_id: id}, function(err) {
            if (err) {
                return next(err);
            }
            res.sendStatus(200);
        });
    });

    router.post('/', function(req, res, next) {
        var data = {
            food: req.body.food,
            dateTime: req.body.dateTime,
            calories: req.body.calories,
            user: req.user._id
        };
        var meal = new models.meal(data);
        meal.save( function(err, m) {
            if (err) {
                return next(err);
            }
            res.status(201).json(m);
        });
    });

    router.put('/:id', function(req, res, next) {
        var data = {
            food: req.body.food,
            dateTime: req.body.dateTime,
            calories: req.body.calories
        };
        models.meal.update({_id: id, $set: data}, function(err) {
            if (err) {
                return next(err);
            }
            res.sendStatus(200);
        });
    });

    return router;
};