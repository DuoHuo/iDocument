/*
* app routes
* */

// dependencies
// Module dependencies
var config = require('../config.js');
// var formidable = require('formidable');
var crypto = require('crypto');
// var async = require('async');
// var hat = require('hat');
var validator = require('validator');

var Document = require('../models/document.js');
var Course = require('../models/course.js');
var College = require('../models/college.js');
var User = require('../models/user.js');

module.exports = function(app) {
    app.get('/', csrf, function(req, res) {
        var docsdata = [[], []];
        Document.hotdocs(function(err, hotdocs) {
            if (err) {
                console.log(err);
                return res.send(500);
            }
            docsdata[0] = hotdocs;
            Document.newdocs(function(err, newdocs) {
                if (err) {
                    console.log(err);
                    return res.send(500);
                }
                docsdata[1] = newdocs;

                // render index.ejs
                res.render('index', {
                    siteName: config.siteName,
                    docsdata: docsdata
                });
            });
        });
    });

    app.get('/download/:documentid', csrf, function(req, res) {
        if (req.params.documentid.length !== 24) {
            return res.send(400);
        }
        Document.getdoc(req.params.documentid, function(err, doc) {
            if (err) {
                console.log(err);
                return res.send(500);
            }
            Document.updateDownloadCount(req.params.documentid, function(err) {
                if (err) {
                    console.log(err);
                    return res.send(500);
                }
                Course.updateCourseCount(doc.course, function(err) {
                    if (err) {
                        console.log(err);
                        return res.send(500);
                    }
                    res.redirect(doc.link);
                });
            });
        });
    });

    app.get('/general', csrf, function(req, res) {
        Course.getGeneral(function(err, courses) {
            if (err) {
                console.log(err);
                return res.send(500);
            }
            Document.getGeneral(function(err, documents) {
                if (err) {
                    console.log(err);
                    return res.send(500);
                }
                res.render('general', {
                    siteName: config.siteName,
                    courses: courses,
                    documents: documents
                });
            });
        });
    });

    app.get('/professional', csrf, function(req, res) {
        College.getColleges(function(err, colleges) {
            if (err) {
                console.log(err);
                return res.send(500);
            }
            res.render('professional', {
                siteName: config.siteName,
                colleges: colleges
            });
        });
    });

    app.get('/professional/:collegeid', csrf, function(req, res) {
        if (req.params.collegeid.length !== 24) {
            return res.send(400);
        }
        College.getCollege(req.params.collegeid, function(err, college) {
            Course.getProfessional(req.params.collegeid, function(err, courses) {
                if (err) {
                    console.log(err);
                    return res.send(500);
                }
                Document.getProfessional(req.params.collegeid, function(err, documents) {
                    if (err) {
                        console.log(err);
                        return res.send(500);
                    }
                    res.render('pro-courses', {
                        siteName: config.siteName,
                        college: college,
                        courses: courses,
                        documents: documents
                    });
                });
            });
        });
    });

    app.get('/course/:courseid', csrf, function(req, res) {
        if (req.params.courseid.length !== 24) {
            return res.send(400);
        }
        Course.getCourse(req.params.courseid, function(err, course) {
            if (err) {
                console.log(err);
                return res.send(500);
            }
            Document.getCourse(req.params.courseid, function(err, docs) {
                if (err) {
                    console.log(err);
                    return res.send(500);
                }
                res.render('course', {
                    siteName: config.siteName,
                    course: course,
                    docs: docs
                });
            });
        });
    });

    app.post('/search', csrf, function(req, res) {
        Document.searchdoc(req.body.criteria.split(""), function(err, docs) {
            if (err) {
                console.log(err);
                return res.send(500);
            }
            res.render('search', {
                siteName: config.siteName,
                docs: docs
            });
        });
    });


    // Admin controllers

    app.get('/admin', csrf, checkLogin, function(req, res) {
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

    app.post('/admin/addnewdoc', csrf, checkLogin, function(req, res) {
        var newdoc = {
            title: req.body.title,
            updateTime: Math.round((new Date()).getTime() / 1000),
            fileType: req.body.fileType,
            belongs: req.body.belongs,
            course: req.body.courseId,
            type: req.body.type,
            link: req.body.link,
            downloads: 0,
            searchIndex: req.body.title.split("")
        };

        Document.addnew(newdoc, function(err, doc) {
            if (err) {
                console.log(err);
                return res.send(500);
            }
            res.redirect('/admin');
        });
    });

    app.post('/admin/addnewcourse', csrf, checkLogin, function(req, res) {
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

    app.post('/admin/addnewcollege', csrf, checkLogin, function(req, res) {
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

    app.post('/admin/delete-doc', csrf, checkLogin, function(req, res) {
        Document.remove(req.body.docid, function(err) {
            if (err) {
                console.log(err);
                return res.send(500);
            }
            res.redirect('/admin');
        });
    });

    app.post('/admin/delete-course', csrf, checkLogin, function(req, res) {
        Course.remove(req.body.courseid, function(err) {
            if (err) {
                console.log(err);
                return res.send(500);
            }
            res.redirect('/admin');
        });
    });

    app.post('/admin/delete-college', csrf, checkLogin, function(req, res) {
        College.remove(req.body.collegeid, function(err) {
            if (err) {
                console.log(err);
                return res.send(500);
            }
            res.redirect('/admin');
        });
    });

    app.get('/login', csrf, checkNotLogin, function(req, res) {
        res.render('login', {
            siteName: config.siteName
        });
    });

    app.post('/login', csrf, checkNotLogin, function(req, res) {
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

    app.get('/reg', csrf, checkNotLogin, function(req, res) {
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

    app.post('/reg', csrf, checkNotLogin, function(req, res) {
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

/*
    // word split function
    function splittext(text) {
        console.log(typeof text);
        return text.split("");
    }
*/

    // Session functions
    function checkLogin(req, res, next) {
        if(!req.session.user) {
            res.status(401);
            return res.redirect('/login');
        }
        next();
    }

    function checkNotLogin(req, res, next) {
        if(req.session.user) {
            return res.redirect('/');
        }
        next();
    }

    // CSRF Protect
    function csrf(req, res, next) {
        res.locals.token = req.csrfToken();
        next();
    }

}