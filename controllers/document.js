var Doc = require('../services/document');
var Course = require('../services/course');

exports.getDocsByCourseId = function(courseid) {
	return Doc.getDocsByCourseId(courseid);
};

exports.getDocs = function(limit, offset){
	return Doc.fetch(limit, offset);
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

exports.searchDocs = function(option) {
	if(option.queryName){
		return Doc.queryByName(option.q, option.sort);
	} else {
		return Doc.sortDocs(option.sort);
	}
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
    title: data.title,
    updateTime: data.updateTime,
    fileType: data.fileType,
    belongs: data.belongs,
    course: data.course,
    type: data.type,
    link: data.link,
    searchIndex: data.title.toLowerCase().split("")
	};

	return Doc.update(docId, doc);
};


exports.delDoc = function(id){
	return Doc.remove(id);
}
