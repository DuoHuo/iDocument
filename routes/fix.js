//修复数据库数据
var express = require('express');
var router = express.Router();
var Doc = require('../services/document');
var Course = require('../services/course');
var bannerController = require('../controllers/banner');
var linkController = require('../controllers/link');
var courseController = require('../controllers/course');

router.get('/changePic', function(req, res) {
	Course.changePic()
	.then(function() {
		res.send(204);
	})
	.catch(function(err){
		res.send(400, err);
	})
})

router.get('/changeCourseId', function(req, res) {
	Course.changeId()
	.then(function() {
		res.send(204);
	})
	.catch(function(err){
		res.send(400, err);
	})
})

router.get('/changeDocId', function(req, res) {
	Doc.changeId()
	.then(function() {
		res.send(204);
	})
	.catch(function(err){
		res.send(400, err);
	})
})

router.get('/banner', function(req, res){
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

router.get('/friendship', function(req, res){
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

router.get('/coursepic', function(req, res){
	courseController.getCourses()
	.then(function(courses) {
		return courseController.fetchImage(courses);
	})
	.then(function(){
    res.send(204);
  })
  .catch(function(err){
    res.send(400, err);
  })
});

router.get('/batch', function(req, res){
	courseController.batchUpload()
	.then(function(){
    res.send(204);
  })
  .catch(function(err){
    res.send(400, err);
  })
});


module.exports = router;
