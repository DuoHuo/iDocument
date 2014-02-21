/*
* Document functions model
* */

/*
* Document object
* {
*   _id: ObjectId(),
*   title: doc.title,
*   updateTime: timestamp,
*   belongs: 'college _id',
*   course: 'course _id',
*   type: 'general',
*   downloads: 90,
*   fileType: 'doc',
*   link: 'http://pan.baidu.com/xxxxx'
* }
* */

var MongoClient = require('mongodb').MongoClient;
var config = require('../config.js');
var ObjectID = require('mongodb').ObjectID;

MongoClient.connect(config.mongodb, { db: { native_parser: true, w : 1 } }, function(err, db) {
    if(err) {
        throw err;
    }

    var collection = db.collection('documents');
    // Get hottest 6 docs
    exports.hotdocs = function(callback) {
        collection.find()
            .limit(6)
            .sort({
                downloads: -1
            })
            .toArray(function(err, docs) {
                if (err) {
                    return callback(err, null);
                }
                callback(null, docs);
            });
    }

    // Get newest 6 docs
    exports.newdocs = function(callback) {
        collection.find()
            .limit(6)
            .sort({
                updateTime: 1
            })
            .toArray(function(err, docs) {
                if (err) {
                    return callback(err, null);
                }
                callback(null, docs);
            });
    }

    // Get one doc
    exports.getdoc = function(docid, callback) {
        collection.findOne({
            _id: new ObjectID(docid)
        }, function(err, doc) {
            if (err) {
                return callback(err, null);
            }
            callback(null, doc);
        });
    }

    // Get docs in an array
    exports.getGeneral = function(callback) {
        collection.find({
            type: 'general'
        }).toArray(function(err, docs) {
                // console.log(docs);
                if (err) {
                    return callback(err, null);
                }
                callback(null, docs);
        });
    }

    exports.getProfessional = function(collegeid, callback) {
        collection.find({
            belongs: collegeid
        })
            .sort({ downloads: -1 })
            .toArray(function(err, docs) {
                if (err) {
                    return callback(err, null);
                }
                callback(null, docs);
            });
    }

    exports.getCourse = function(courseid, callback) {
        collection.find({
            course: courseid
        })
            .sort({ updateTime: -1 })
            .toArray(function(err, docs) {
                if (err) {
                    return callback(err, null);
                }
                callback(null, docs);
            });
    }

    // update doc downloads count
    exports.updateDownloadCount = function(docid, callback) {
        collection.update({
            _id: new ObjectID(docid)
        }, {
            $inc: { downloads: 1 }
        }, function(err) {
            if (err) {
                return callback(err);
            }
            callback();
        });
    }

    exports.searchdoc = function(pattern, callback) {
        collection.find({
            title: new RegExp(pattern, 'i')
        })
            .sort({ downloads: -1 })
            .toArray(function(err, docs) {
                if (err) {
                    return callback(err, null);
                }
                callback(null, docs);
            });
    }

    exports.getAll = function(callback) {
        collection.find()
            .sort({ updateTime: -1 })
            .toArray(function(err, docs) {
                if (err) {
                    return callback(err, null);
                }
                callback(null, docs);
            });
    }

    exports.addnew = function(newdoc, callback) {
        collection.insert(newdoc, {safe: true}, function(err, doc) {
            if (err) {
                return callback(err, null);
            }
            callback(null, doc);
        });
    }

    exports.remove = function(docid, callback) {
        collection.remove({
            _id: new ObjectID(docid)
        }, function(err) {
            if (err) {
                return callback(err);
            }
            callback();
        });
    }


});
