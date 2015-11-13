var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MealSchema = new Schema({
    food: String,
    dateTime: Date,
    calories: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model('Meal', MealSchema);