/*
* app routes
* */

// dependencies
// Module dependencies
var config = require('../config.js');
var formidable = require('formidable');
var crypto = require('crypto');
var async = require('async');
// var hat = require('hat');
var check = require('validator').check;
var sanitize = require('validator').sanitize;
var BSON = require('mongodb').BSONPure;

var Document = require('../models/document.js');
var Course = require('../models/course.js');
var College = require('../models/college.js');

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

    });


    // Session functions
    function checkLogin(req, res, next) {
        if(!req.session.user) {
            req.flash('error', res.__('LOGIN_NEEDED'));
            return res.redirect('/login');
        }
        next();
    }

    function checkNotLogin(req, res, next) {
        if(req.session.user) {
            req.flash('error', res.__('ALREADY_LOGIN'));
            return res.redirect('/');
        }
        next();
    }

    // CSRF Protect
    function csrf(req, res, next) {
        res.locals.token = req.session._csrf;
        next();
    }

}