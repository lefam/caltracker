var config = require('./config'), 
	express = require('express');

var app = express();

app.get('/', function rootRoute(req, res) {
	res.send('TopTal Leonel Machava Project');
});

app.listen(config.PORT);
console.log('Listening on port ' + config.PORT);