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

var middles = require('../middles');
var docController = require('../controllers/document');
var collegeController = require('../controllers/college');
var courseController = require('../controllers/course');

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

router.get('/admin', middles.checkLogin, function(req, res) {
    Document.getAll(function(err, docs) {
        if (err) {
            console.log(err);
            return res.send(500);
        }
        Course.getAll(function(err, courses) {
            if (err) {
                console.log(err);
                return res.send(500);
            }
            College.getAll(function(err, colleges) {
                if (err) {
                    console.log(err);
                    return res.send(500);
                }
                res.render('admin', {
                    siteName: config.siteName,
                    docs: docs,
                    courses: courses,
                    colleges: colleges
                });
            });
        });
    });
});

router.post('/admin/addnewdoc', middles.checkLogin, function(req, res) {
    var newdoc = {
        title: req.body.title,
        updateTime: Math.round((new Date()).getTime() / 1000),
        fileType: req.body.fileType,
        belongs: req.body.belongs,
        course: req.body.courseId,
        type: req.body.type,
        link: req.body.link,
        downloads: 0,
        searchIndex: req.body.title.toLowerCase().split("")
    };

    Document.addnew(newdoc, function(err, doc) {
        if (err) {
            console.log(err);
            return res.send(500);
        }
        res.redirect('/admin');
    });
});

router.post('/admin/addnewcourse', middles.checkLogin, function(req, res) {
    var newcourse = {
        courseName: req.body.courseName,
        courseType: req.body.courseType,
        courseBelongs: req.body.courseBelongs,
        coursepic: req.body.coursepic
    }

    Course.addnew(newcourse, function(err, doc) {
        if (err) {
            console.log(err);
            return res.send(500);
        }
        res.redirect('/admin');
    });
});

router.post('/admin/addnewcollege', middles.checkLogin, function(req, res) {
    var newcollege = {
        collegeName: req.body.collegeName,
        collegepic: req.body.collegepic,
        updateTime: Math.round((new Date()).getTime() / 1000)
    }

    College.addnew(newcollege, function(err, doc) {
        if (err) {
            console.log(err);
            return res.send(500);
        }
        res.redirect('/admin');
    });
});

router.post('/admin/edit-doc', middles.checkLogin, function(req, res) {
    var docdata = {
        _id: req.body.docid,
        title: req.body.doctitle,
        updateTime: req.body.docupdateTime,
        fileType: req.body.docfileType,
        belongs: req.body.docbelongs,
        course: req.body.doccourse,
        type: req.body.doctype,
        link: req.body.doclink,
        downloads: req.body.docdownloads,
        searchIndex: req.body.doctitle.toLowerCase().split("")
    }

    Document.edit(docdata, function(err) {
        if (err) {
            return res.send(500);
        }
        res.redirect('/admin');
    });

});

router.post('/admin/delete-doc', middles.checkLogin, function(req, res) {
    Document.remove(req.body.docid, function(err) {
        if (err) {
            console.log(err);
            return res.send(500);
        }
        res.redirect('/admin');
    });
});

router.post('/admin/delete-course', middles.checkLogin, function(req, res) {
    Course.remove(req.body.courseid, function(err) {
        if (err) {
            console.log(err);
            return res.send(500);
        }
        res.redirect('/admin');
    });
});

router.post('/admin/delete-college', middles.checkLogin, function(req, res) {
    College.remove(req.body.collegeid, function(err) {
        if (err) {
            console.log(err);
            return res.send(500);
        }
        res.redirect('/admin');
    });
});

router.get('/login', middles.checkNotLogin, function(req, res) {
    res.render('login', {
        siteName: config.siteName
    });
});

router.post('/login', middles.checkNotLogin, function(req, res) {
    if (!validator.isEmail(req.body.email) || !req.body.email) {
        res.status(400);
        return res.redirect('/login');
    }
    User.get(req.body.email, function(err, user) {
        if (err) {
            console.log(err);
            return res.send(500);
        }
        var hash = crypto.createHash('sha256'),
            password = hash.update(req.body.password).digest('hex');
        if (user.password !== password) {
            return res.send(401);
        } else {
            req.session.user = user;
            res.redirect('/admin');
        }
    });
});

router.get('/reg', middles.checkNotLogin, function(req, res) {
    User.count(function(err, count) {
        if (err) {
            console.log(err);
            return res.send(500);
        }
        if (count !== 0) {
            return res.send(403);
        } else {
            res.render('reg', {
                siteName: config.siteName
            });
        }
    });
});

router.post('/reg', middles.checkNotLogin, function(req, res) {
    User.count(function(err, count) {
        if (err) {
            console.log(err);
            return res.send(500);
        }
        if (count !== 0) {
            return res.send(403);
        } else {
            if (!validator.isAlphanumeric(req.body.username) ||
                !validator.isLength(req.body.password, 4, 32) ||
                !validator.equals(req.body.password, req.body.repeatPassword) ||
                !validator.isEmail(req.body.email)) {
                res.status(400);
                return res.redirect('/reg');
            }

            var hash = crypto.createHash('sha256'),
                password = hash.update(req.body.password).digest('hex');
            var newuser = {
                username: req.body.username,
                email: req.body.email,
                password: password
            }

            User.addnew(newuser, function(err, user) {
                if (err) {
                    console.log(err);
                    return res.send(500);
                }
                req.session.user = newuser;
                res.redirect('/admin');
            });
        }
    });
});

module.exports = router;
