
//修复数据库数据
var express = require('express');
var router = express.Router();
var Doc = require('../services/document');
var Course = require('../services/course');
var bannerController = require('../controllers/banner');
var linkController = require('../controllers/link');

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

router.get('/banners', function(req, res){
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

router.get('/links', function(req, res){
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
