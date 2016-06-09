var fs = require('fs');
var config = require('./config');

exports.isEmptyObject = function(obj){
	for(key in obj) return false;
	return true;
};

exports.isArray = function(arr) {
	return Object.prototype.toString.call(arr) === '[object Array]';
};

exports.reddirFiles = function(path) {
  return new Promise(function(resolve, reject) {
    fs.readdir(path, function(err, files) {
      if(err) reject(err);
      else resolve(files);
    })
  })
};

exports.uploadFile = function(key, file) {
  var qiniuSDK = require('node-qiniu'); 
  var qinniuConfig = config.qiniu;

  qiniuSDK.config({
    access_key: qinniuConfig.access_key,
    secret_key: qinniuConfig.secret_key
  });

  var Bucket = qiniuSDK.bucket(qinniuConfig.bucket);
  return Bucket.putFile(key, file)
};