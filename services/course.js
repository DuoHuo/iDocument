var Course = require('../model').Course;
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var request = require('superagent');
var fs = require('fs');
var config = require('../config');
var qiniuConfig = config.qiniu;

exports.fetch = function(limit, offset) {
	return Course.find({}).limit(limit).skip(offset);
};

exports.fetchAll = function() {
	return Course.find({});
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

exports.updateLocalPath = function(id, path) {
	return Course.findByIdAndUpdate(id, {$set: { 'localPath': path} });
};

exports.updateQiniuPath = function(name, path) {
	return Course.update({ courseName: name }, {$set: { qiniuPath: qiniuConfig.hostname + '/' + path } });
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

exports.getAndSaveImage = function(course) {
	var DEFAULT_SITE = config.host;
	var DEAULT_IMADE = '/img/course.jpg';
	var FLODER_PATH = __dirname + '/../public/media/';

	return new Promise(function(resolve, reject){
		if(course.coursepic === ' ') {
			course.coursepic = DEFAULT_SITE + DEAULT_IMADE;
		}

		if(!/[http/https]:\/\//.test(course.coursepic)) {
			course.coursepic = DEFAULT_SITE + course.coursepic;
		}

		request.get(course.coursepic)
		.pipe(fs.createWriteStream(FLODER_PATH + course.courseName + '.jpg'))
		.on('error', function() {
			reject(new Error('出错了'));
		});

		resolve(DEFAULT_SITE + '/media/' + course.courseName + '.jpg');
	});
};
