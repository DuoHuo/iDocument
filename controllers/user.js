var User = require('../services/user');

exports.loginWithEmail = function(user){
	return User.findUser(user.email)
	.then(function(_user){
		return new Promise(function(resolve, reject){
			_user.comparePassword(user.password, function (err, isMatch) {
	      if (err) return reject(err);
	      resolve({
	      	isMatch: isMatch,
	      	user: _user
	      });
	    });
		})
	})
};