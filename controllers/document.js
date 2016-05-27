var Doc = require('../services/document');
var Course = require('../services/course');

exports.getHotDocs = function() {
	return Doc.getHotDocs();
};

exports.getNewDocs = function() {
	return Doc.getNewDocs();
};

exports.downloadDoc = function(docId) {
	return Doc.updateDownloadCount(docId)
	.then(function() {
		return Doc.get(docId);
	})
	.then(function(doc){
		return Course.updateCourseCount(doc.course)
		.then(function(){ return doc; })
	});
};

exports.searchDocs = function(name) {
	return Doc.search(name.toLowerCase().split(""));
};
