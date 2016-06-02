var express = require('express');
var router = express.Router();

var Util = require('../utils');
var docController = require('../controllers/document');
var collegeController = require('../controllers/college');
var courseController = require('../controllers/course');
var userController = require('../controllers/user');
var bannerController = require('../controllers/banner');
var linkController = require('../controllers/link');
var middles = require('../middles');

var validateId = middles.validateId;
var needLogin = middles.needLogin;
var DEFAULT_DOC_SORT = 'updateTime';

router.get('/search/docs', function(req, res){
	var sort = req.query.sort;
	var q = req.query.q;
	var option = {
		queryName: true
	};

	if(sort === '' || !sort) sort = DEFAULT_DOC_SORT;
	var isExist = ['downloads', 'updateTime'].some(function(s){
		return s === sort;
	});

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

router.get('/logout', needLogin, function(req, res){
  if(req.session.user) {
    delete req.session.user;
  }
  res.send(204);
});

router.get('/docs', needLogin, function(req, res){
	docController.getDocs()
	.then(function(result){
	  res.send(200, result);
	})
	.catch(function(err) {
	  res.send(400, err);
	});
});

router.post('/admin/docs', needLogin, function(req, res) {
	var data = req.body;
	if(Util.isEmptyObject(data)) {
	  res.send(400, {msg: 'request body is empty!'});
	}

	if(!data.title || !data.link || !data.courseId || !data.belongs || !data.type) {
		res.send(400, {
			msg: 'need document title,download link,courseId, belongs, type!'
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


router.put('/admin/docs/:id', needLogin, function(req, res) {
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

router.delete('/admin/docs/:id', needLogin, function(req, res) {
  docController.delDoc(req.params.id)
  .then(function(){
    res.send(204);
  })
  .catch(function(err){
    res.send(400, err);
  });
});

router.get('/admin/courses', needLogin, function(req, res){
	courseController.fetchCourses()
	.then(function(result){
	  res.send(200, result);
	})
	.catch(function(err) {
	  res.send(400, err);
	});
});

router.post('/admin/courses', needLogin, function(req, res){
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

router.delete('/admin/courses/:id', needLogin, function(req, res) {
  docController.delCourse(req.params.id)
  .then(function(){
    res.redirect('/admin');
  })
  .catch(function(err){
    res.send(400, err);
  });
});

router.get('/admin/colleges', needLogin, function(req, res){
	collegeController.getColleges()
	.then(function(result){
	  res.send(200, result);
	})
	.catch(function(err) {
	  res.send(400, err);
	});
});

router.post('/admin/colleges', needLogin, function(req, res) {
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

router.delete('/admin/colleges/:id', needLogin, function(req, res) {
  collegeController.delCollege(req.params.id)
  .then(function(){
    res.send(204);
  })
  .catch(function(err){
    res.send(400, err);
  });
});

router.get('/banners', function(req, res) {
	bannerController.fetchBanners()
	.then(function(banners){
		res.send(200, banners);
	})
	.catch(function(err){
    res.send(400, err);
  });
});

router.post('/admin/banners', needLogin, function(req, res) {
  var data = req.body;
  if(Util.isEmptyObject(data)) {
    res.send(400, {msg: 'request body is empty!'});
  }

  if(!data.bannerName || !data.bannerPic || !data.bannerLink || !data.bannerIndex) {
    res.send(400, {
      msg: 'need banner name && picture && index && link!'
    });
  }

  bannerController.addnew(data)
  .then(function(){
    res.send(204);
  })
  .catch(function(err){
    res.send(400, err);
  })
});

router.get('/admin/banners/original', needLogin, function(req, res){
	var banners = require('../json/banners.json');
	var promises = banners.map(function(banner){
		return bannerController.addnew(banner);
	});

	Promise.all(promises)
	.then(function(){
    res.send(200, {msg: '添加成功！'});
  })
  .catch(function(err){
    res.send(400, err);
  })
});

router.delete('/admin/banners/:id', needLogin, function(req, res) {
  bannerController.delBanner(req.params.id)
  .then(function(){
    res.send(204);
  })
  .catch(function(err){
    res.send(400, err);
  });
});

router.get('/links', function(req, res) {
	linkController.fetchLinks()
	.then(function(links){
		res.send(200, links);
	})
	.catch(function(err){
    res.send(400, err);
  });
});

router.post('/admin/links', needLogin, function(req, res) {
  var data = req.body;
  if(Util.isEmptyObject(data)) {
    res.send(400, {msg: 'request body is empty!'});
  }

  if(!data.title || !data.category || !data.link) {
    res.send(400, {
      msg: 'link banner title && category && link!'
    });
  }

  linkController.addnew(data)
  .then(function(){
    res.send(204);
  })
  .catch(function(err){
    res.send(400, err);
  })
});

router.delete('/admin/links/:id', needLogin, function(req, res) {
 	linkController.delLink(req.params.id)
  .then(function(){
    res.send(204);
  })
  .catch(function(err){
    res.send(400, err);
  });
});

router.get('/admin/links/original', needLogin, function(req, res){
	var links = require('../json/links.json');
	var promises = links.map(function(link){
		return linkController.addnew(link);
	});

	Promise.all(promises)
	.then(function(){
    res.send(200, {msg: '添加成功！'});
  })
  .catch(function(err){
    res.send(400, err);
  })
});

module.exports = router;
