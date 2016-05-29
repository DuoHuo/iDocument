

exports.validateId = function(req, res, next){
	var id = req.params.id;
  if (id.length !== 24) {
    return res.send(400, {msg: 'id is less then 24'});
  }

  next();
}

// CSRF Protect
exports.csrf = function(req, res, next) {
  res.locals.token = req.csrfToken();
  next();
}

// Session functions
exports.checkLogin = function(req, res, next) {
  if(!req.session.user) {
    res.status(401);
    return res.redirect('/login');
  }
  next();
}

exports.checkNotLogin = function (req, res, next) {
  if(req.session.user) {
    return res.redirect('/');
  }
  next();
}