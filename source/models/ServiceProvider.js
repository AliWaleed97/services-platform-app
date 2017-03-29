var mongoose = require('mongoose');

// define the schema for our user model
var ServiceProviderSchema = mongoose.Schema({
  price_category: String,
  location: String,
  description: String,
  fields: [String],
  phone_number: String,
  is_blocked: Boolean,
  is_deleted: Boolean

});

// create the model for users and expose it to our app
module.exports = mongoose.model('ServiceProvider', ServiceProviderSchema);
