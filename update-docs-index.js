var MongoClient = require('mongodb').MongoClient;
var config = require('./config.js');
var ObjectID = require('mongodb').ObjectID;

MongoClient.connect(config.mongodb, { db: { native_parser: true, w : 1 } }, function(err, db) {

    // update old data with new title index

    if(err) {
        throw err;
    }

    var collection = db.collection('documents');

    // get all docs
    collection.find()
        .sort({ updateTime: -1 })
        .toArray(function(err, docs) {
            if (err) throw err;
            docs.forEach(function(doc) {
                collection.update({
                    _id: doc._id
                }, {
                    title: doc.title,
                    updateTime: doc.updateTime,
                    fileType: doc.fileType,
                    belongs: doc.belongs,
                    course: doc.courseId,
                    type: doc.type,
                    link: doc.link,
                    downloads: doc.downloads,
                    searchIndex: splittext(doc.title)
                }, function(err) {
                    if (err) throw err;
                    collection.ensureIndex({
                        searchIndex: 1
                    }, function(err, doc) {
                        if (err) throw err;
                        console.log('update operation success.');
                    });
                });
            });
        });

    function splittext(text) {
        return text.split("");
    }

});