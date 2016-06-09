
var crypto = require('crypto');
var config = require('../config.js');
var validator = require('validator');
var express = require('express');
var router = express.Router();

var Util = require('../utils');
var docController = require('../controllers/document');
var collegeController = require('../controllers/college');
var courseController = require('../controllers/course');
var userController = require('../controllers/user');
var bannerController = require('../controllers/banner');

var middles = require('../middles');
var validateId = middles.validateId;
var csrf = middles.csrf;

router.get('/', csrf, function(req, res) {
  var docsdata = [[], []];
  docController.searchDocs({sort: 'downloads'})
  .then(function(hotdocs) {
    docsdata[0] = hotdocs;
    return docController.searchDocs({sort: 'updateTime'})
  })
  .then(function(newdocs){
    docsdata[1] = newdocs;
    return bannerController.fetchBanners();
  })
  .then(function(banners){
    res.render('index', {
        siteName: config.siteName,
        docsdata: docsdata,
        banners: banners
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
  courseController.getCourses('general')
  .then(function(courses) {
    var promises = courses.map(function(course) {
     return docController.getDocsByCourseId(course._id);
    });

    Promise.all(promises)
    .then(function(results){
     var docs = [];
     results.forEach(function(item) {
       if(Util.isArray(item)) {
         item.forEach(function(d) {
           docs.push(d)
         });
       }
     });

     res.render('general', {
       siteName: config.siteName,
       courses: courses,
       documents: docs
     });
    })
    .catch(function(err) {
      res.send(400, err);
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

router.get('/course/:id', csrf, validateId, function(req, res) {
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
  var option = {
    queryName: true,
    q: req.body.criteria.toLowerCase().split(""),
    sort: 'downloads'
  };

  docController.searchDocs(option)
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

router.get('/login', middles.checkNotLogin, csrf, function(req, res) {
  res.render('login', {
    siteName: config.siteName
  });
});

router.post('/login', middles.checkNotLogin, function(req, res){
  var user = req.body;
  if(!user.email || !user.password){
    res.send(400, {msg: 'user email && password is need!'});
  }

  userController.loginWithEmail(user)
  .then(function(result){
    if (result.isMatch) {
      req.session.user = result.user;
      res.redirect('/admin');
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
  };

  res.redirect('/');
});

module.exports = router;
