// load the things we need
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

// define the schema for our user model
const ccSchema = mongoose.Schema({
	user_id: {type: Schema.Types.ObjectId, ref: User },
	number: String,
	name: String,
	expiry_date: Date,
	type: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('CreditCard', ccSchema);
