var express = require('express');

module.exports = function apiRouter(app, config, models) {
	var router = express.Router();
		
	router.use('/users', function(req, res) {
		models.user.find(function(err, users) {
			if (err) {
				throw err;
			}
			res.json(users);
		});
	});
	
	router.use(function(req, res) {
		res.json({
			status: 1,
			message: "Hello from Leonel Machava's API"
		});
	});

	return router;
}