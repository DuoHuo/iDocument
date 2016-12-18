var fs = require('fs');
var config = require('./config');

exports.isEmptyObject = function(obj) {
    for (key in obj) return false;
    return true;
};

exports.isArray = function(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
};

exports.reddirFiles = function(path) {
    return new Promise(function(resolve, reject) {
        fs.readdir(path, function(err, files) {
            if (err) reject(err);
            else resolve(files);
        })
    })
};

// exports.uploadFile = function(key, file) {
//     var qiniuSDK = require('node-qiniu');
//     var qinniuConfig = config.qiniu;
//     qiniuSDK.config({
//         access_key: qinniuConfig.access_key,
//         secret_key: qinniuConfig.secret_key
//     });
//     var Bucket = qiniuSDK.bucket(qinniuConfig.bucket);
//     return Bucket.putFile(key, file)
// };

exports.uploadAndtopdf = function(key, file) {
    return new Promise(function(resolve, reject) {
        var qiniu = require("qiniu");
        var qiniuConfig = config.qiniu;

        qiniu.conf.ACCESS_KEY = qiniuConfig.access_key;
        qiniu.conf.SECRET_KEY = qiniuConfig.secret_key;

        bucket = qiniuConfig.bucket;
        fops = "yifangyun_preview";

        function uptoken(bucket, key) {
            var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
            putPolicy.persistentOps = fops;
            return putPolicy.token();
        }

        token = uptoken(bucket, key);

        filePath = file;

        function uploadFile(uptoken, key, localFile) {
            console.log(uptoken);
            var extra = new qiniu.io.PutExtra();
            qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
                if (!err) {
                    console.log(ret.hash, ret.key, ret.persistentId);
                    resolve(ret);
                } else {
                    console.log(err);
                    reject(err);
                }
            });
        }
        uploadFile(token, key, filePath);
    })



};

exports.formate = function(docs) {
    var promises = docs.map(doc => {
        doc.updateTime = new Date(doc.updateTime).getTime();
        return doc;
    })

    return Promise.all(promises);
}