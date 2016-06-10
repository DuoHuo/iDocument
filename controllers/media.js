'use strict';

var fs = require('fs');
var MediaService = require('../services/media');
var Util = require('../utils');
var config = require('../config');
var qiniuConfig = config.qiniu;

exports.getAll = function(req, res) {
  MediaService.getAll().then(function(medias) {
    res.send(200, medias);
  }).catch(function(err) {
    res.send(400, err);
  });
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

  fs.rename(TEMP_PATH, TARGET_PATH, function(err) {
    if(err) console.log(err);
    Util.uploadFile(req.file.originalname, TARGET_PATH)
    .then(function(reply) {
        // 上传成功
      var media = {
        key: req.file.originalname,
        local_url: config.host + URL_PATH,
        type: 'doc',
        qiniu_url: qiniuConfig.hostname + '/' + reply.key,
        hash: reply.hash
      };

      MediaService.create(media).then(function(media) {
        res.json({
          name: media.key,
          qiniu_url: media.qiniu_url,
          local_url: media.local_url
        });
      })
    }).catch(function(err) {
      res.send(400, err);
    });
  })
};

exports.batchUpload = function(req, res) {
  var files = req.files;

  function resolveImg(file) {
    var TEMP_PATH = file.path;
    var TARGET_PATH = 'public/upload/' + file.originalname;
    var URL_PATH = '/upload/' + file.originalname;

    fs.renameSync(TEMP_PATH, TARGET_PATH);
    return Util.uploadFile(file.originalname, TARGET_PATH)
    .then(function(reply) {
      // 上传成功
      var media = {
        key: file.originalname,
        local_url: config.host + URL_PATH,
        type: 'image',
        qiniu_url: qiniuConfig.hostname +  '/' + reply.key,
        hash: reply.hash
      };
      return MediaService.create(media)
      .then(function(media) {
        return {
          name: media.key,
          qiniu_url: media.qiniu_url,
          local_url: media.local_url
        };
      })
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
