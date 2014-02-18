/*
* College functions model
* */

/*
 * College object
 * {
 *   _id: ObjectId(),
 *   collegeName: 'Computer Science',
 *   courses: ['courses _id']
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
        
    }


});