// load the things we need
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

// define the schema for our user model
const reviewSchema = mongoose.Schema({
	rating: Number,
	reviewer_id: {type: Schema.Types.ObjectId, ref: User },
	content: String,
	sp_id: {type: Schema.Types.ObjectId, ref: User }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Review', reviewSchema);
