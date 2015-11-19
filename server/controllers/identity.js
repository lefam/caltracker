var express = require('express'),
    router = express.Router();


module.exports = function(config, models) {
    router.get('/users/:username', function(req, res) {
        if (req.user.role < models.user.roles().ROLE_MANAGER) {
            return res.sendStatus(401);
        }

       models.user.findOne({username: req.params.username}, function(err, user) {
           /* istanbul ignore if */
           if (err) {
               return next(err);
           }

            if (user) {
                delete user.password;
                res.json(user);
            } else {
                res.sendStatus(404);
            }
        });
    });

    return router;
};