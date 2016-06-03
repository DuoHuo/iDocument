var Course = require('../services/course');
var Doc = require('../services/document');

exports.getCourses = function(type) {
	var result = {};
	if(type === 'general') {
		return Course.getGeneral();
	} else {
		return Course.getProfessional();
	}
};

exports.getCourseDocuments = function(courseid) {
	var result = {};
	return Course.get(courseid)
	.then(function(course) {
		result.course = course;
		return Doc.getDocsByCourseId(courseid);
	})
	.then(function(docs) {
		result.docs = docs;
		return result;
	});
};

exports.addnew = function(data) {
	var course = {
		courseName: data.courseName,
		courseType: data.courseType,
		courseBelongs: data.courseBelongs,
		coursepic: data.coursepic,
		courseDownloads: 0
	};

	return Course.add(course);
};

exports.delCourse = function(id){
	return Course.remove(id);
}

exports.fetchCourses = function(limit, offset){
	return Course.fetch(limit, offset);
};
