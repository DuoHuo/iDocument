var express = require('express');
var router = express.Router();

var Util = require('../utils');
var docController = require('../controllers/document');
var collegeController = require('../controllers/college');
var courseController = require('../controllers/course');
var userController = require('../controllers/user');
var middles = require('../middles');

var validateId = middles.validateId;
var DEFAULT_DOC_SORT = 'updateTime';

router.get('/search/docs', function(req, res){
	var sort = req.query.sort;
	var q = req.query.q;
	var option = {
		queryName: true
	};

	var isExist = ['downloads', 'updateTime'].some(function(s){
		return s === sort;
	});
	if(sort === '' || !sort) sort = DEFAULT_DOC_SORT;
	if(isExist) {
		if(!q) {
			option.queryName = false;
		} else {
			option.q = q.toLowerCase().split("");
		}

		option.sort = sort;
		docController.searchDocs(option)
		.then(function(docs){
			return res.send(200, {
				total: docs.length,
				docs: docs
			})
		})
		.catch(function(err){
			res.send(400, err);
		});
	} else {
		res.send(400, {msg: 'sort must be downloads or updateTime'});
	}
});

router.get('/colleges', function(req, res){
	collegeController.getColleges()
	.then(function(colleges){
		res.send(200, colleges);
	})
	.catch(function(err){
		res.send(400, err);
	});
});

router.get('/colleges/:id/courses/docs', validateId, function(req, res){
	collegeController.getCollegeInfo(req.params.id)
	.then(function(result){
		res.send(200, result);
	})
	.catch(function(err) {
		res.send(400, err.msg);
	});
});

router.get('/search/courses', function(req, res){
	var type = req.query.type;
	var isExist = ['general', 'professional'].some(function(t){
		return t === type;
	});
	if(isExist){
		courseController.getCourses(type)
		.then(function(courses){
			res.send(200, {
				total: courses.length,
				courses: courses
			});
		})
		.catch(function(err) {
			res.send(400, err);
		});
	} else {
		res.send(400, {msg: 'type must be general or professional'});
	}
});

router.get('/courses/:id/docs', validateId, function(req, res){
	var courseid = req.params.id;
	courseController.getCourseDocuments(courseid)
	.then(function(result){
		res.send(200, result);
	})
	.catch(function(err) {
		res.send(400, err);
	});
});

router.get('/download/:id', validateId, function(req, res){
	docController.downloadDoc(req.params.id)
	.then(function(doc){
	  res.send(200, doc.link);
	})
	.catch(function(err) {
	    res.send(400, err);
	});
});


//admin api
router.post('/login', function(req, res){
	var user = req.body;
  if(!user.email || !user.password){
    res.send(400, {msg: 'user email && password is need!'});
  }

  userController.loginWithEmail(user)
  .then(function(result){
    if (result.isMatch) {
      req.session.user = result.user;
      res.send(204);
    } else {
      res.send(400, {msg: 'user password is not corret!'})
    }
  })
  .catch(function(err){
    res.send(400, err);
  });
});

router.get('/logout', function(req, res){
  if(req.session.user) {
    delete req.session.user;
  }
  res.send(204);
});

router.get('/docs', function(req, res){
	docController.getDocs()
	.then(function(result){
	  res.send(200, result);
	})
	.catch(function(err) {
	  res.send(400, err);
	});
});

router.post('/admin/docs', function(req, res) {
	var data = req.body;
	if(Util.isEmptyObject(data)) {
	  res.send(400, {msg: 'request body is empty!'});
	}

	if(!data.title || !data.link) {
		res.send(400, {
			msg: 'need document title and download link!'
		});
	}

  docController.addDoc(data)
  .then(function(){
    res.send(204);
  })
  .catch(function(err) {
    res.send(400, err);
  });
});


router.put('/admin/docs/:id', function(req, res) {
  var docId = req.params.id;
  var data = req.body;
  if(Util.isEmptyObject(data)) {
    res.send(400, {msg: 'request body is empty!'});
  }

  docController.editDoc(docId, data)
  .then(function(){
    res.send(204);
  })
  .catch(function(err){
    res.send(400, err);
  });
});

router.delete('/admin/docs/:id', function(req, res) {
  docController.delDoc(req.params.id)
  .then(function(){
    res.send(204);
  })
  .catch(function(err){
    res.send(400, err);
  });
});

router.get('/admin/courses', function(req, res){
	courseController.fetchCourses()
	.then(function(result){
	  res.send(200, result);
	})
	.catch(function(err) {
	  res.send(400, err);
	});
});

router.post('/admin/courses', function(req, res){
	var data = req.body;
	if(Util.isEmptyObject(data)) {
	  res.send(400, {msg: 'request body is empty!'});
	}

	if(!data.courseName || !data.courseType ||!data.coursepic ||!data.courseBelongs) {
	  res.send(400, {
	    msg: 'need course name && type && belong colllege && picture'
	  });
	}

	courseController.addnew(data)
	.then(function(){
	  res.send(204);
	})
	.catch(function(err){
	  res.send(400, err);
	});
});

router.delete('/admin/courses/:id', middles.checkLogin, function(req, res) {
  docController.delCourse(req.params.id)
  .then(function(){
    res.redirect('/admin');
  })
  .catch(function(err){
    res.send(400, err);
  });
});

router.get('/admin/colleges', function(req, res){
	collegeController.getColleges()
	.then(function(result){
	  res.send(200, result);
	})
	.catch(function(err) {
	  res.send(400, err);
	});
});

router.post('/admin/colleges', function(req, res) {
  var data = req.body;
  if(Util.isEmptyObject(data)) {
    res.send(400, {msg: 'request body is empty!'});
  }

  if(!data.collegeName || !data.collegepic) {
    res.send(400, {
      msg: 'need college name && picture!'
    });
  }

  collegeController.addnew(data)
  .then(function(){
    res.send(204);
  })
  .catch(function(err){
    res.send(400, err);
  })
});

router.delete('/admin/colleges/:id', function(req, res) {
  collegeController.delCollege(req.params.id)
  .then(function(){
    res.send(204);
  })
  .catch(function(err){
    res.send(400, err);
  });
});

module.exports = router;
