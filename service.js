var Document = require('./models/document.js');
var Course = require('./models/course.js');
var College = require('./models/college.js');

exports.getCourse = function(courseid) {
	return new Promise(function(resolve, reject) {
		Course.getCourse(courseid, function(err, course) {
			if(err) reject(err);
			resolve(course);
		});
	})
};

exports.getCourseDocuments = function(courseid) {
	return new Promise(function(resolve, reject) {
		Document.getCourse(courseid, function(err, docs){
			if(err) reject(err);
			resolve(docs);
		});
	})
};

exports.getGeneralCourses = function() {
	return new Promise(function(resolve, reject) {
		Course.getGeneral(function(err, courses) {
			if(err) reject(err);
			resolve(courses);
		});
	});
};

exports.getColleges = function() {
	return new Promise(function(resolve, reject) {
		College.getColleges(function(err, colleges) {
			if(err) reject(err);
			resolve(colleges);
		});
	});
};

exports.getHotDocs = function() {
	return new Promise(function(resolve, reject) {
		Document.hotdocs(function(err, hotdocs) {
			if(err) reject(err);
			resolve(hotdocs);
		});
	})
};

exports.getNewDocs = function() {
	return new Promise(function(resolve, reject) {
		Document.newdocs(function(err, newdocs) {
			if(err) reject(err);
			resolve(newdocs);
		});
	})
};

exports.getCollege = function(collegeid) {
	return new Promise(function(resolve, reject){
		College.getCollege(collegeid, function(err, college){
			if(err) reject(err);
			resolve(college);
		})
	});
};

exports.getCollegeProfessionalCourses = function(collegeid) {
	return new Promise(function(resolve, reject){
		Course.getProfessional(collegeid, function(err, courses){
			if(err) reject(err);
			resolve(courses);
		});
	});
};

exports.getCollegeProfessionalDocuments = function(collegeid) {
	return new Promise(function(resolve, reject){
		Document.getProfessional(collegeid, function(err, docs){
			if(err) reject(err);
			resolve(docs);
		});
	});
};

exports.getGeneralDocuments = function() {
	return new Promise(function(resolve, reject){
		Document.getGeneral(function(err, docs) {
			if(err) reject(err);
			resolve(docs);
		});
	});
};

exports.getDoc = function(id){
	return new Promise(function(resolve, reject){
		Document.getdoc(id, function(err, doc){
			if(err) reject(err);
			resolve(doc);
		});
	});
};

exports.updateDownloadCount = function(id){
	return new Promise(function(resolve, reject){
		Document.updateDownloadCount(id, function(err){
			if(err) reject(err);
			resolve();
		});
	});
};

exports.updateDownloadCount = function(id){
	return new Promise(function(resolve, reject){
		Document.updateDownloadCount(id, function(err){
			if(err) reject(err);
			resolve();
		});
	});
};

exports.updateCourseCount = function(course){
	return new Promise(function(resolve, reject){
		Course.updateCourseCount(course, function(err){
			if(err) reject(err);
			resolve();
		});
	});
};

exports.searchDocs = function(name){
	return new Promise(function(resolve, reject){
		Document.searchdoc(name.toLowerCase().split(""), function(err, docs) {
			if(err) reject(err);
			resolve(docs);
		});
	});
};