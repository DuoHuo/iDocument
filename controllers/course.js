var Course = require('../services/course');
var Doc = require('../services/document');
var Util = require('../utils');

exports.getCourses = function(type) {
	if(type === 'general') {
		return Course.getGeneral();
	} else if (type === 'professional') {
		return Course.getProfessional();
	} else {
		return Course.fetchAll();
	};
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

exports.fetchImage = function(courses) {
	var promises = courses.map(function(course){
		return Course.getAndSaveImage(course)
		.then(function(path) {
			return Course.updateLocalPath(course._id, path);
		});
	});

	return Promise.all(promises)
	.then(function(){
		return courses;
	});
};


exports.batchUpload = function() {
  var fs = require('fs');
  var IMAGE_PATH = __dirname + '/../public/media/';

  function resolveImg(file) {
    return Util.uploadFile(file, IMAGE_PATH + file)
    .then(function(reply) {
      var name = reply.key.match(/(.*)\.(jpg|png|gif|jpeg)/)[1];
      return Course.updateQiniuPath(name, reply.key);
    })
    .then(function(result) {
    	console.log(result);
    })
  }

  return Util.reddirFiles(IMAGE_PATH)
  .then(function(files) {
	  var promises = files.map(function(item) {
	    return resolveImg(item);
	  });

	  return Promise.all(promises);
  })
};
