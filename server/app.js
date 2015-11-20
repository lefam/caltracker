var config = require('./config'),
	path = require('path'),
	express = require('express'),
	mongoose = require('mongoose'),
	models = require('./models'),
    bodyParser = require('body-parser'),
    expressValidator = require("express-validator"),
	apiMiddleware = require('./middlewares/api'),
	apiRoutes = require('./controllers');

mongoose.Promise = require('bluebird');
mongoose.connect(config.DATABASE_URL);

console.log('Connected to database.');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(expressValidator());
app.use('/api/v1/', apiMiddleware(config, models));
app.use('/api/v1', apiRoutes(config, models));

/* istanbul ignore next */
app.get('/', function rootRoute(req, res) {
    res.sendFile(path.resolve(__dirname + '/../public/index.html'));
});

app.use(express.static(path.resolve(__dirname + '/../public')));

app.listen(config.PORT);
console.log('Listening on port ' + config.PORT);

exports.app = app;
exports.config = config;