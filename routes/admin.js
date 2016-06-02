var express = require('express');
var router = express.Router();
var config = require('../config.js');
var middles = require('../middles');
var validateId = middles.validateId;
var checkLogin = middles.checkLogin;
var csrf = middles.csrf;

var Util = require('../utils');
var docController = require('../controllers/document');
var collegeController = require('../controllers/college');
var courseController = require('../controllers/course');
var userController = require('../controllers/user');
var bannerController = require('../controllers/banner');

router.get('/', csrf, checkLogin,function(req, res) {
  collegeController.getColleges()
  .then(function(colleges){
    res.render('admin/admin', {
      siteName: config.siteName,
      user: req.session.user,
      colleges: colleges
    });
  })
  .catch(function(err) {
    res.send(400, err);
  });
});

router.get('/docs', csrf, checkLogin, function(req, res){
  collegeController.fetchAll()
  .then(function(result){
    res.render('admin/doc', {
      siteName: config.siteName,
      user: req.session.user,
      docs: result.docs,
      courses: result.courses,
      colleges: result.colleges
    });
  })
  .catch(function(err) {
    res.send(400, err);
  });
});

router.get('/courses', csrf, checkLogin, function(req, res){
  var result = {};
  collegeController.getColleges()
  .then(function(colleges){
    result.colleges = colleges;
    return courseController.fetchCourses();
  })
  .then(function(courses){
    res.render('admin/course', {
      user: req.session.user,
      courses: courses,
      colleges: result.colleges
    });
  })
  .catch(function(err) {
    res.send(400, err);
  });
});

router.get('/banners', csrf, checkLogin, function(req, res){
  bannerController.fetchBanners()
  .then(function(banners){
    res.render('admin/banner', {
      user: req.session.user,
      banners: banners
    });
  })
  .catch(function(err){
    res.send(400, err);
  });
});

router.post('/docs', checkLogin, function(req, res) {
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
    res.redirect('/admin');
  })
  .catch(function(err) {
    res.send(400, err);
  });
});

router.post('/docs/:id', checkLogin, function(req, res) {
  var docId = req.params.id;
  var data = req.body;
  if(Util.isEmptyObject(data)) {
    res.send(400, {msg: 'request body is empty!'});
  }

  docController.editDoc(docId, data)
  .then(function(){
    res.redirect('/admin');
  })
  .catch(function(err){
    res.send(400, err);
  });
});

router.post('/delete-doc', checkLogin, function(req, res) {
  docController.delDoc(req.body.docid)
  .then(function(){
    res.redirect('/admin');
  })
  .catch(function(err){
    res.send(400, err);
  });
});

router.post('/courses', checkLogin, function(req, res) {
  var data = req.body;
  if(Util.isEmptyObject(data)) {
    res.send(400, {msg: 'request body is empty!'});
  }

  if(!data.courseName || !data.courseType || !data.courseBelongs ||!data.coursepic) {
    res.send(400, {
      msg: 'need course name && type && belong colllege && picture'
    });
  }

  courseController.addnew(data)
  .then(function(){
    res.redirect('/admin');
  })
  .catch(function(err){
    res.send(400, err);
  })
});

router.post('/delete-course', checkLogin, function(req, res) {
  courseController.delCourse(req.body.courseid)
  .then(function(){
    res.redirect('/admin');
  })
  .catch(function(err){
    res.send(400, err);
  });
});

router.post('/colleges', checkLogin, function(req, res) {
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
    res.redirect('/admin');
  })
  .catch(function(err){
    res.send(400, err);
  });
});

router.post('/delete-college', checkLogin, function(req, res) {
  collegeController.delCollege(req.body.collegeid)
  .then(function(){
    res.redirect('/admin');
  })
  .catch(function(err){
    res.send(400, err);
  });
});


module.exports = router;
