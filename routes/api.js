var express = require('express');
var router = express.Router();

var Util = require('../utils');
var docController = require('../controllers/document');
var collegeController = require('../controllers/college');
var courseController = require('../controllers/course');
var middles = require('../middles');

var validateId = middles.validateId;

router.get('/hotdocs', function(req, res){
	docController.getHotDocs()
	.then(function(docs){
		res.send(200, docs);
	})
	.catch(function(err){
		res.send(400, err);
	});
});

router.get('/newdocs', function(req, res){
	docController.getHotDocs()
	.then(function(docs){
		res.send(200, docs);
	})
	.catch(function(err){
		res.send(400, err);
	});
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
router.get('/colleges/:id', validateId, function(req, res){
	var collegeid = req.params.id;
	collegeController.getCollegeInfo(collegeid)
	.then(function(result){
		res.send(200, result);
	})
	.catch(function(err) {
		res.send(400, err.msg);
	});
});
router.get('/course/general', function(req, res){
	courseController.getGeneralCourses()
	.then(function(result){
		res.send(200, result);
	})
	.catch(function(err) {
		res.send(400, err);
	});
});
router.get('/courses/:id', validateId, function(req, res){
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

router.get('/search', function(req, res) {
	docController.searchDocs(req.query.q)
	.then(function(docs) {
		res.send(200, docs);
	})
	.catch(function(err) {
	  res.send(400, err);
	});
});


//admin api
router.get('/admin', function(req, res){
	collegeController.fetchAll()
	.then(function(result){
	  res.send(200, result);
	})
	.catch(function(err) {
	  res.send(400, err);
	});
})

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
