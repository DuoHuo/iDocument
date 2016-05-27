var College = require('../services/college');
var Course = require('../services/course');
var Doc = require('../services/document');

exports.getColleges = function(req, res) {
	return College.fetch();
};

exports.getCollegeInfo = function(collegeid) {
	var result = {};
	return College.get(collegeid)
	.then(function(college) {
		result.college = college;
		return Course.getCoursesByCollegeId(collegeid);
	})
	.then(function(courses) {
		result.courses = courses;
		return Doc.getDocsByCollegeId(collegeid);
	})
	.then(function(docs){
		result.docs = docs;
		return result;
	});
};
