var express = require('express');

module.exports = function apiRouter(models) {
	var router = express.Router();

	router.use(function(req, res, next) {
		res.set('X-API:', 'Leonel Machava API');
        next();
	});

	return router;
};