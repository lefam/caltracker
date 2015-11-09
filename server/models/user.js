var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: String,
	firstName: String,
	lastName: String,
	email: String
});

module.exports = mongoose.model('User', UserSchema);