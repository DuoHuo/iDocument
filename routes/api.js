var express = require('express');
var router = express.Router();
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
router.get('/colleges/:id', validateId,function(req, res){
	var collegeid = req.params.id;
	collegeController.getCollegeInfo(collegeid)
	.then(function(result){
		res.send(200, result);
	})
	.catch(function(err) {
		res.send(400, err);
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
	if (courseid.length !== 24) {
	  return res.send(400, {msg: 'id is less then 24'});
	}
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
module.exports = router;
