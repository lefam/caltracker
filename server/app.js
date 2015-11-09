var config = require('./config'), 
	express = require('express'),
	mongoose = require('mongoose'),
	models = require('./models'),
	apiRouter = require('./middlewares/api');

mongoose.connect(config.DATABASE_URL, function(err) {
	if (err) {
		throw err;
	}
	
	console.log('Connected to database.');
	
	var app = express();
	
	app.use('/api/v1/', apiRouter(app, config, models));
	
	app.get('/', function rootRoute(req, res) {
		res.send('TopTal Leonel Machava Project');
	});
	
	app.listen(config.PORT);
	console.log('Listening on port ' + config.PORT);	
});