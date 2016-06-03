var Course = require('../model').Course;
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports.fetch = function(limit, offset) {
	return Course.find({}).limit(limit).skip(offset);
};

exports.getGeneral = function() {
	return Course.find({courseType: 'general'});
};

exports.getProfessional = function() {
	return Course.findById({courseType: 'professional'});
};

exports.get = function(id) {
	return Course.findById(id);
};

exports.add = function(course) {
	return new Course(course).save();
};

exports.remove = function(id) {
	return Course.findByIdAndRemove(id);
};

exports.updateCourseCount = function(id) {
	return Course.findByIdAndUpdate(id, {$inc: { courseDownloads: 1 }});
};

exports.getCoursesByCollegeId = function(collegeId){
	return Course.find({courseBelongs: collegeId});
};

exports.changeId = function() {
	return Course.find()
	.then(function(courses){
		var promises = courses.map(function(course){
			return Course.findByIdAndUpdate(course._id, {
				$set: { courseBelongs: ObjectId(course.courseBelongs)}
			});
		});

		return Promise.all(promises);
	})
};

exports.changePic = function() {
	return Course.find()
	.then(function(courses){
		var promises = courses.map(function(course){
			return Course.findByIdAndUpdate(course._id, {
				$set: { coursepic: course.coursepic.replace(/tietuku/, 'buimg')}
			});
		});

		return Promise.all(promises);
	})
};
