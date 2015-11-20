var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    username: {
        type: String,
        index: true,
        unique: true
    },
	firstName: String,
	lastName: String,
	email: String,
	password: {
        type: String,
        select: false
    },

    // 0 - Regular, 1 - Manager, 2 - Administrator
    role: Number,

    maxCaloriesPerDay: Number
});

UserSchema.statics.roles = function() {
    return {
        ROLE_NORMAL: 0,
        ROLE_MANAGER: 1,
        ROLE_ADMIN: 2
    };
};

module.exports = mongoose.model('User', UserSchema);