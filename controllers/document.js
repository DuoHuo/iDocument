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

exports.addDoc = function(data) {
	var doc = {
	  title: data.title,
	  updateTime: Math.round((new Date()).getTime() / 1000),
	  fileType: data.fileType,
	  belongs: data.belongs,
	  course: data.courseId,
	  type: data.type,
	  link: data.link,
	  downloads: 0,
	  searchIndex: data.title.toLowerCase().split("")
	};

	return Doc.add(doc);
};

exports.editDoc = function(docId, data){
	var doc = {
    title: data.doctitle,
    updateTime: data.docupdateTime,
    fileType: data.docfileType,
    belongs: data.docbelongs,
    course: data.doccourse,
    type: data.doctype,
    link: data.doclink,
    downloads: data.docdownloads,
    searchIndex: data.doctitle.toLowerCase().split("")
	};

	return Doc.update(docId, doc);
};

exports.delDoc = function(id){
	return Doc.remove(id);
}
