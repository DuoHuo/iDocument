var service = require('../service');

exports.getColleges = function(req, res) {
	return service.getColleges();
};

exports.getCollegeInfo = function(collegeid) {
	var result = {};
	return service.getCollege(collegeid)
	.then(function(college) {
		result.college = college;
		return service.getCollegeProfessionalCourses(collegeid);
	})
	.then(function(courses) {
		result.courses = courses;
		return service.getCollegeProfessionalDocuments(collegeid);
	})
	.then(function(docs){
		result.docs = docs;
		return result;
	});
};
