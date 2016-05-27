/*
 * Course functions model
 * */

/*
 * Course object
 * {
 *   _id: ObjectId(),
 *   courseName: 'Computer Science',
 *   courseType: 'general/professional',
 *   courseBelongs: 'college _id',
 *   coursepic: '/path/to/pic'
 *   courseDownloads: 100
 * }
 * */

var MongoClient = require('mongodb').MongoClient;
var config = require('../config.js');
var ObjectID = require('mongodb').ObjectID;

MongoClient.connect(config.mongodb, { db: { native_parser: true, w : 1 } }, function(err, db) {
    if(err) {
      throw err;
    }
    var collection = db.collection('courses');

    exports.updateCourseCount = function(courseid, callback) {
      collection.update({
          _id: new ObjectID(courseid)
      }, {
          $inc: { courseDownloads: 1 }
      }, function(err) {
          if (err) {
              return callback(err);
          }
          callback();
      });
    }

    exports.getGeneral = function(callback) {
        collection.find({
            courseType: 'general'
        })
        .sort({ courseDownloads: -1 })
        .toArray(function(err, courses) {
          // console.log(courses);
          if (err) {
              return callback(err, null);
          }
          callback(null, courses);
        });
    }

    exports.getProfessional = function(collegeid, callback) {
        collection.find({
            courseBelongs: collegeid
        })
        .sort({ courseDownloads: -1 })
        .toArray(function(err, courses) {
          if (err) {
              return callback(err, null);
          }
          callback(null, courses);
        });
    }

    exports.getCourse = function(courseid, callback) {
      collection.findOne({
          _id: new ObjectID(courseid)
      }, function(err, course) {
          if (err) {
              return callback(err, null);
          }
          callback(null, course);
      });
    }

    exports.addnew = function(newcourse, callback) {
      collection.insert(newcourse, {safe: true}, function(err, doc) {
          if (err) {
              return callback(err, null);
          }
          callback(null, doc);
      });
    }

    exports.getAll = function(callback) {
      collection.find()
      .toArray(function(err, courses) {
          if (err) {
              return callback(err, null);
          }
          callback(null, courses);
      });
    }

    exports.remove = function(courseid, callback) {
      collection.remove({
          _id: new ObjectID(courseid)
      }, function(err, doc) {
          if (err) {
              return callback(err, null);
          }
          callback(null, doc);
      });
    }
});