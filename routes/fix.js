
//修复数据库数据
var express = require('express');
var router = express.Router();
var Doc = require('../services/document');
var Course = require('../services/course');

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

module.exports = router;
