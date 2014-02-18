/*
 * Course functions model
 * */

/*
 * Course object
 * {
 *   _id: ObjectId(),
 *   courseName: 'Computer Science',
 *   courseType: 'general/professional',
 *   documents: ['documents _id'],
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
        }).toArray(function(err, courses) {
                // console.log(courses);
                if (err) {
                    return callback(err, null);
                }
                callback(null, courses);
        });
    }

});