var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: String,
	firstName: String,
	lastName: String,
	email: String,
	password: String,

    // 0 - Regular, 1 - Manager, 2 - Administrator
    role: Number
});

UserSchema.statics.roles = function() {
    return {
        ROLE_NORMAL: 0,
        ROLE_MANAGER: 1,
        ROLE_ADMIN: 2
    };
};

module.exports = mongoose.model('User', UserSchema);