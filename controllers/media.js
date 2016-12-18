'use strict';

var fs = require('fs');
var MediaService = require('../services/media');
var Util = require('../utils');
var config = require('../config');
var qiniuConfig = config.qiniu;

const imageTypes = ["image/jpeg", "image/png"];
const fileTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];

exports.getAll = function(req, res) {
    var type = req.query.type || 'doc';

    MediaService.getAll(type).then(function(medias) {
        res.send(200, medias);
    }).catch(function(err) {
        res.send(400, err);
    });
};

exports.findDocByName = function(req, res) {
    var q = req.query.q;

    MediaService.search(q)
        .then(function(docs) {
            res.send(200, docs);
        })
        .catch(function(err) {
            res.send(400, err);
        })
};

exports.delete = function(req, res) {
    var id = req.params.mediaId;
    if (!id) {
        res.send(405, 'method is not allowed');
        return;
    }

    MediaService.delete(id).then(function() {
        res.send(204);
    }).catch(function(err) {
        res.send(400, err);
    });
};

exports.upload = function(req, res) {
    var TEMP_PATH = req.file.path;
    var TARGET_PATH = 'public/upload/' + req.file.originalname;
    var URL_PATH = '/upload/' + req.file.originalname;
    var mimetype;

    if (~imageTypes.indexOf(req.file.mimetype)) {
        mimetype = 'image';
    } else if (~fileTypes.indexOf(req.file.mimetype)) {
        mimetype = 'doc';
    } else {
        res.send(400, { msg: '只能上传png,jpg格式的图片或者doc, docx, pdf格式的文档' });
    };

    fs.rename(TEMP_PATH, TARGET_PATH, function(err) {
        if (err) console.log(err);
        Util.uploadAndtopdf(req.file.originalname, TARGET_PATH)
            .then(function(reply) {
                // 上传成功
                var media = {
                    key: req.file.originalname,
                    local_url: config.host + URL_PATH,
                    type: mimetype,
                    qiniu_url: qiniuConfig.hostname + '/' + qiniuConfig.pdf + '/' + reply.hash,
                    hash: reply.hash
                };

                MediaService.create(media).then(function(media) {
                    res.json(media);
                })
            }).catch(function(err) {
                console.log(err);
                res.send(400, { msg: err });
            });
    })
};

exports.batchUpload = function(req, res) {
    var files = req.files;

    function resolveImg(file) {
        var TEMP_PATH = file.path;
        var TARGET_PATH = 'public/upload/' + file.originalname;
        var URL_PATH = '/upload/' + file.originalname;
        var mimetype;

        if (~imageTypes.indexOf(file.mimetype)) {
            mimetype = 'image';
        } else if (~fileTypes.indexOf(file.mimetype)) {
            mimetype = 'doc';
        } else {
            throw new Error('只能上传png,jpg格式的图片或者doc, docx, pdf格式的文档');
        };

        fs.renameSync(TEMP_PATH, TARGET_PATH);
        return Util.uploadFile(file.originalname, TARGET_PATH)
            .then(function(reply) {
                // 上传成功
                var media = {
                    key: file.originalname,
                    local_url: config.host + URL_PATH,
                    type: mimetype,
                    qiniu_url: qiniuConfig.hostname + '/' + reply.key,
                    hash: reply.hash
                };
                return MediaService.create(media);
            })
    }

    var promises = files.map(function(item) {
        return resolveImg(item);
    });

    Promise.all(promises).then(function(results) {
            res.json(results);
        })
        .catch(function(err) {
            res.send(400, err);
        });
};