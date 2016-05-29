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

exports.fetchAll = function() {
	var result = {};
	return College.fetch()
	.then(function(colleges){
		result.colleges = colleges;
		return Course.fetch();
	})
	.then(function(courses){
		result.courses = courses;
		return Doc.fetch();
	})
	.then(function(docs){
		result.docs = docs;
		return result;
	});
};

exports.addnew = function(data){
	var newcollege = {
    collegeName: data.collegeName,
    collegepic: data.collegepic,
    updateTime: Math.round((new Date()).getTime() / 1000)
  };

	return College.add(newcollege);
};

exports.delCollege = function(id){
	return College.remove(id);
};
