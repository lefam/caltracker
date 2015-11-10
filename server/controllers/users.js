var express = require('express'),
    router = express.Router();

module.exports = function(models) {

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

    return router;
};
