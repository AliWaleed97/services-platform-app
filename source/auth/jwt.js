const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const secret = 'ilovescotchscotchyscotchscotch';

module.exports = {
  generate: function(credentials, cb) {
    User.findOne({
      email: credentials.email,
      password: credentials.password
    }, function(err, user) {
      if (!user) {
        return cb(null);
      }

      cb(jwt.sign({
        id: user.id,
        name: user.name,
        type: user.type,
      }, secret));
    });
  },
  verify: function(token, cb) {
    jwt.verify(token, secret, function(err, decoded) {
      cb(decoded);
    });
  },

};
