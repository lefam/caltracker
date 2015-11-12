var express = require('express'),
    jwt = require('jsonwebtoken');

module.exports = function apiRouter(config, models) {
	var router = express.Router();

	router.use(function(req, res, next) {
        var nonSecureUrls = ['/', '/auth/login', '/auth/check-token'];
        for( var i = 0; i < nonSecureUrls.length; i++) {
            if (req.path === nonSecureUrls[i]) {
                return next();
            }
        }

        var token = (req.query && req.query.access_token) || (req.body && req.body.access_token) || req.headers['x-access-token'];

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
                            message: 'Invalid Auth Token!'
                        });
                    }
                    return next(err);
                }

                models.user.findOne({username: decoded.username}, function(err, user) {
                    if (err) {
                        return next(err);
                    }
                    if (user) {
                        req.user = user;
                        return next();
                    } else {
                        return res.status(401).json({
                            status: 401,
                            message: 'Invalid Auth token!'
                        });
                    }
                });
            });
        } else {
            return res.status(401).json({
                status: 401,
                message: 'Please give the auth token!'
            });
        }
	});

	return router;
};