/*
* app routes
* */

// dependencies
// Module dependencies
var crypto = require('crypto');
var config = require('../config.js');
var validator = require('validator');
var User = require('../models/user');
var express = require('express');
var router = express.Router();

var Util = require('../utils');
var middles = require('../middles');
var docController = require('../controllers/document');
var collegeController = require('../controllers/college');
var courseController = require('../controllers/course');
var userController = require('../controllers/course');

var validateId = middles.validateId;
var csrf = middles.csrf;

router.get('/', csrf, function(req, res) {
  var docsdata = [[], []];

  docController.getHotDocs()
  .then(function(hotdocs) {
    docsdata[0] = hotdocs;
    return docController.getHotDocs()
  })
  .then(function(newdocs){
    docsdata[1] = newdocs;
    res.render('index', {
        siteName: config.siteName,
        docsdata: docsdata
    });
  })
  .catch(function(err) {
      res.send(400, err);
  });
});

router.get('/download/:id', csrf, validateId, function(req, res) {
  docController.downloadDoc(req.params.id)
  .then(function(doc){
    res.redirect(doc.link);
  })
  .catch(function(err) {
      res.send(400, err);
  });
});

router.get('/general', csrf, function(req, res) {
  courseController.getGeneralCourses()
  .then(function(result) {
    res.render('general', {
      siteName: config.siteName,
      courses: result.courses,
      documents: result.docs
    });
  })
  .catch(function(err) {
    res.send(400, err);
  });
});

router.get('/professional', csrf,function(req, res) {
  collegeController.getColleges()
  .then(function(colleges) {
    res.render('professional', {
      siteName: config.siteName,
      colleges: colleges
    });
  })
  .catch(function(err) {
    res.send(400, err);
  });
});

router.get('/professional/:id', csrf,validateId, function(req, res) {
  var collegeid = req.params.id;

  collegeController.getCollegeInfo(collegeid)
  .then(function(result){
    res.render('pro-courses', {
      siteName: config.siteName,
      college: result.college,
      courses: result.courses,
      documents: result.docs
    });
  })
  .catch(function(err) {
    res.send(400, err);
  });
});

router.get('/course/:id', csrf,validateId, function(req, res) {
  var courseid = req.params.id;
  courseController.getCourseDocuments(courseid)
  .then(function(result){
    res.render('course', {
      siteName: config.siteName,
      course: result.course,
      docs: result.docs
    });
  })
  .catch(function(err) {
    res.send(400, err);
  });
});

router.post('/search', csrf,function(req, res) {
  docController.searchDocs(req.body.criteria)
  .then(function(docs) {
    res.render('search', {
        siteName: config.siteName,
        docs: docs
    });
  })
  .catch(function(err) {
    res.send(400, err);
  });
});

// Admin controllers
router.get('/admin', function(req, res) {
  collegeController.fetchAll()
  .then(function(result){
    res.render('admin', {
      siteName: config.siteName,
      docs: result.docs,
      courses: result.courses,
      colleges: result.colleges
    });
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
    res.redirect('/admin');
  })
  .catch(function(err) {
    res.send(400, err);
  });
});

router.post('/admin/docs/:id', function(req, res) {
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

router.delete('/admin/docs/:id', function(req, res) {
  docController.delDoc(req.params.id)
  .then(function(){
    res.redirect('/admin');
  })
  .catch(function(err){
    res.send(400, err);
  });
});


router.post('/admin/courses', function(req, res) {
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

router.delete('/admin/courses/:id', function(req, res) {
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
    res.redirect('/admin');
  })
  .catch(function(err){
    res.send(400, err);
  });
});

router.delete('/admin/colleges/:id', function(req, res) {
  collegeController.delCollege(req.params.id)
  .then(function(){
    res.redirect('/admin');
  })
  .catch(function(err){
    res.send(400, err);
  });
});

// router.get('/login', middles.checkNotLogin, function(req, res) {
//   res.render('login', {
//       siteName: config.siteName
//   });
// });

// router.post('/login', middles.checkNotLogin, userController.login);

module.exports = router;
