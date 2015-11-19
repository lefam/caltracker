var express = require('express'),
    bcrypt = require('bcrypt'),
    router = express.Router();

module.exports = function(config, models) {
    router.get('/create_admin', function(req, res, next) {
        models.user.findOne({username: 'admin'}, function(err, user) {
            /* istanbul ignore if */
            if (err) {
                return next(err);
            }

            if (user) {
                return res.sendStatus(404);
            } else {
                var adminUser = {
                    username: 'admin',
                    password: 'x9d@1lk',
                    firstName: 'Leonel',
                    lastName: 'Machava',
                    role: 2
                };
                bcrypt.hash(adminUser.password, 10, function(err, hash) {
                    /* istanbul ignore if */
                    if (err) {
                        return next(err);
                    }
                    adminUser.password = hash;
                    models.user.create(adminUser, function(err) {
                        /* istanbul ignore if */
                        if (err) {
                            return next(err);
                        }
                        return res.sendStatus(200);
                    });
                });
            }
        });
    });
    return router;
};