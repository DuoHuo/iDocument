var service = require('../service');

exports.getGeneralCourses = function() {
	var result = {};

	return service.getGeneralCourses()
	.then(function(courses) {
		result.courses = courses;
		return service.getGeneralDocuments();
	})
	.then(function(docs) {
		result.docs = docs;
		return result;
	});
};

exports.getCourseDocuments = function(courseid) {
	var result = {};

	return service.getCourse(courseid)
	.then(function(course) {
		result.course = course;
		return service.getCourseDocuments(courseid);
	})
	.then(function(docs) {
		result.docs = docs;
		return result;
	});
};
