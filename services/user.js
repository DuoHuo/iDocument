var User = require('../model').User;

exports.add = function(user){
  return new User(user).save();
};

exports.findUser = function(email){
  return User.findOne({email: email});
}
