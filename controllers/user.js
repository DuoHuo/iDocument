var User = require('../services/user');

exports.login = function(req, res){
	var user = req.body;
	if(!user.username || !user.password){
		res.send(400, {msg: 'user name && password is need!'});
	}

	User.findUser(user.email)
	.then(function(user){
		user.comparePassword(password, function (err, isMatch) {
      if (err) console.log(err);
      if (isMatch) {
        req.session.user = user;
        res.redirect('/admin');
      } else {
        res.send(400, {msg: 'user password is not corret!'})
      }
    })
	})
};