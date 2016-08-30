var College = require('../model').College;

exports.fetch = function(limit, offset) {
	return College.find({}).limit(limit).skip(offset);
};

exports.get = function(id) {
	return College.findById(id);
};

exports.add = function(newcollege) {
	return new College(newcollege).save();
};

exports.remove = function(id) {
	return College.findByIdAndRemove(id);
};

exports.match = function (qs) {
	return College.findOne({collegeName:{$in: qs}})
};

exports.fetchAll = function() {
	return College.find({});
};
