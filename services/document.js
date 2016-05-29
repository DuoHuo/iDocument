var Document = require('../model').Document;
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports.getHotDocs = function() {
	return Document.find().sort({ downloads: -1 }).limit(6).select('title downloads updateTime link');
};

exports.getNewDocs = function() {
	return Document.find().sort({ updateTime: -1 }).limit(6).select('title downloads updateTime link');
};

exports.get = function(id) {
	return Document.findById(id);
};

exports.add = function(doc){
	return new Document(doc).save();
};

exports.fetch = function() {
	return Document.find({}).populate('belongs').populate('courses');
};

exports.remove = function(id) {
	return Document.findByIdAndRemove(id);
};

exports.updateDownloadCount = function(id) {
	return Document.findByIdAndUpdate(id, {$inc: { downloads: 1 }});
};

exports.search = function(querytext) {
	return Document.find({searchIndex: {$all: querytext}}).sort({ downloads: -1 });
};

exports.getDocsByCourseId = function(courseId) {
	return Document.find({course: courseId}).select('title link');
};

exports.getDocsByCollegeId = function(collegeId) {
	return Document.find({belongs: collegeId}).select('title link');
};

exports.update = function(docId, doc){
	return Document.findByIdAndUpdate(docId, doc);
};

exports.changeId = function() {
	return Document.find()
	.then(function(docs) {
		var promises = docs.map(function(doc) {
			return Document.findByIdAndUpdate(doc._id,
				{
					$set: {
						belongs: ObjectId(doc.belongs),
						course: ObjectId(doc.course),
					}
				}
			).exec();
		});

		return Promise.all(promises);
	});
}
