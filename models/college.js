/*
* College functions model
* */

/*
 * College object
 * {
 *   _id: ObjectId(),
 *   collegeName: 'Computer Science',
 *   collegepic: '/path/to/pic'
 * }
 * */

var MongoClient = require('mongodb').MongoClient;
var config = require('../config.js');
var ObjectID = require('mongodb').ObjectID;

MongoClient.connect(config.mongodb, { db: { native_parser: true, w : 1 } }, function(err, db) {
    if(err) {
        throw err;
    }

    var collection = db.collection('colleges');

    exports.getColleges = function(callback) {
      collection.find()
      .sort({ updateTime: 1 })
      .toArray(function(err, colleges) {
          if (err) {
              return callback(err, null);
          }
          callback(null, colleges);
      });
    }

    exports.getCollege = function(collegeid, callback) {
        collection.findOne({
            _id: new ObjectID(collegeid)
        }, function(err, college) {
            if (err) {
                return callback(err, null);
            }
            callback(null, college);
        });
    }

    exports.addnew = function(newcollege, callback) {
        collection.insert(newcollege, {safe: true}, function(err, doc) {
            if (err) {
                return callback(err, null);
            }
            callback(null, doc);
        });
    }

    exports.getAll = function(callback) {
        collection.find()
            .toArray(function(err, colleges) {
                if (err) {
                    return callback(err, null);
                }
                callback(null, colleges);
            });
    }

    exports.remove = function(collegeid, callback) {
        collection.remove({
            _id: new ObjectID(collegeid)
        }, function(err, doc) {
            if (err) {
                return callback(err, null);
            }
            callback(null, doc);
        });
    }
});