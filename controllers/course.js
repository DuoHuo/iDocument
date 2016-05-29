var Course = require('../services/course');
var Doc = require('../services/document');

function isArray(arr) {
	return Object.prototype.toString.call(arr) === '[object Array]';
}

exports.getGeneralCourses = function() {
	var result = {};

	return Course.getGeneral()
	.then(function(courses) {
		result.courses = courses;
		var promises = courses.map(function(course) {
			return Doc.getDocsByCourseId(course._id);
		});

		return Promise.all(promises).then(function(results){
			var docs = [];
			results.forEach(function(item) {
				if(isArray(item)) {
					item.forEach(function(d) {
						docs.push(d)
					});
				}
			});
			return docs;
		})
	})
	.then(function(docs) {
		result.docs = docs;
		return result;
	});
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