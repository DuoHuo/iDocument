var User = require('../model').User;

var admin = {
	email: 'admin@duohuo.org',
	password: 'duohuo'
};

User.findOne({email: admin.email})
.then(function(user) {
	if(!user) {
		new User(admin).save();
	}
});

exports.add = function(user){
  return new User(user).save();
};

exports.findUser = function(email){
  return User.findOne({email: email});
}
