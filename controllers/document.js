var service = require('../service');

exports.getHotDocs = function() {
	return service.getHotDocs();
};

exports.getNewDocs = function() {
	return service.getNewDocs();
};

exports.downloadDoc = function(docId) {
	return service.updateDownloadCount(docId)
	.then(function() {
		return service.getDoc(docId);
	})
	.then(function(doc){
		return service.updateCourseCount(doc.course)
		.then(function(){ return doc; })
	});
};

exports.searchDocs = function(name) {
	return service.searchDocs(name);
}
