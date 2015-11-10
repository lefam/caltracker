var config = require('./config'),
	path = require('path'),
	express = require('express'),
	mongoose = require('mongoose'),
	models = require('./models'),
	apiMiddleware = require('./middlewares/api'),
	apiRoutes = require('./controllers');

mongoose.connect(config.DATABASE_URL, function(err) {
	if (err) {
		throw err;
	}
	
	console.log('Connected to database.');
	
	var app = express();
	
	app.use('/api/v1/', apiMiddleware(models));
	app.use('/api/v1', apiRoutes(models));
	
	app.get('/', function rootRoute(req, res) {
		res.sendFile(path.resolve('../public/index.html'));
	});

    app.use(express.static(path.resolve('../public')));
	
	app.listen(config.PORT);
	console.log('Listening on port ' + config.PORT);	
});